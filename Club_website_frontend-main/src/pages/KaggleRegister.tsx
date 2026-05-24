import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';

/* ── Particles ── */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 3 + 1, duration: Math.random() * 12 + 8, delay: Math.random() * 6,
}));

type Status = 'idle' | 'signing' | 'form' | 'submitting' | 'success' | 'error';

interface GoogleUser {
  googleId: string; name: string; email: string; picture: string; credential: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function KaggleRegister() {
  const [status, setStatus] = useState<Status>('idle');
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [kaggleId, setKaggleId] = useState('');
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState(false);

  /* ── Step 1: Google Sign-In ── */
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setStatus('signing');
      try {
        // Fetch user info from Google
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const info = await res.json();
        setUser({
          googleId: info.sub,
          name: info.name,
          email: info.email,
          picture: info.picture,
          credential: tokenResponse.access_token,
        });
        setStatus('form');
      } catch {
        setMessage('Failed to get Google profile. Please try again.');
        setStatus('error');
      }
    },
    onError: () => {
      setMessage('Google sign-in was cancelled or failed.');
      setStatus('error');
    },
  });

  /* ── Step 2: Submit registration ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !kaggleId.trim()) return;
    setStatus('submitting');

    try {
      const res = await fetch(`${API_BASE}/api/kaggle-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: user.credential,
          googleId: user.googleId,
          name: user.name,
          email: user.email,
          picture: user.picture,
          kaggleId: kaggleId.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Registration successful!');
      } else {
        setMessage(data.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setMessage('Network error — make sure the backend server is running.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle'); setUser(null); setKaggleId(''); setMessage('');
  };

  return (
    <div className="kr-page">
      {/* Particles */}
      <div className="kr-particles">
        {PARTICLES.map(p => (
          <motion.span key={p.id} className="kr-particle"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -28, 0], opacity: [0.12, 0.5, 0.12] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />
        ))}
      </div>
      <div className="kr-orb kr-orb1" />
      <div className="kr-orb kr-orb2" />

      {/* Card */}
      <motion.div className="kr-card"
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>

        {/* Header */}
        <div className="kr-header">
          <motion.div className="kr-badge"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
            🏅
          </motion.div>
          <motion.h1 className="kr-title"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            Kaggle Contest 2026
          </motion.h1>
          <motion.p className="kr-subtitle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}>
            AI Club DAIICT · Open to All Students · May 29–30, 2026
          </motion.p>
          <motion.div className="kr-divider"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.55 }} />
        </div>

        {/* Body */}
        <AnimatePresence mode="wait">

          {/* ── SUCCESS ── */}
          {status === 'success' && (
            <motion.div key="success" className="kr-success"
              initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.45, type: 'spring' }}>
              {user && <img src={user.picture} alt={user.name} className="kr-avatar-lg" />}
              <motion.div className="kr-success-icon"
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ delay: 0.2, duration: 0.6 }}>🎉</motion.div>
              <h2>You're In!</h2>
              <p>{message}</p>
            </motion.div>
          )}

          {/* ── STEP 1: Sign in with Google ── */}
          {(status === 'idle' || status === 'error') && (
            <motion.div key="google" className="kr-step"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>

              <p className="kr-step-label">Step 1 of 2 — Sign in to continue</p>

              <motion.button className="kr-google-btn"
                onClick={() => handleGoogleLogin()}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}>
                {/* Google SVG */}
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M44.5 20H24v8h11.7C34 33.3 29.5 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/>
                  <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34 6.5 29.3 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
                  <path fill="#FBBC05" d="M24 44c5.2 0 9.9-1.8 13.5-4.7l-6.2-5.2C29.5 35.5 26.9 36 24 36c-5.4 0-10-3.7-11.6-8.7l-6.6 5.1C9.6 39.5 16.3 44 24 44z"/>
                  <path fill="#EA4335" d="M44.5 20H24v8h11.7c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C41.5 35.8 44.5 30.4 44.5 24c0-1.3-.1-2.7-.2-4z"/>
                </svg>
                Continue with Google
              </motion.button>

              {status === 'error' && (
                <motion.div className="kr-error"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  ⚠️ {message}
                </motion.div>
              )}

              <p className="kr-note">🔒 We only read your name & email. One account, one registration.</p>
            </motion.div>
          )}

          {/* ── SIGNING IN ── */}
          {status === 'signing' && (
            <motion.div key="signing" className="kr-step kr-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="kr-spinner" />
              <p className="kr-note" style={{ marginTop: 12 }}>Fetching your Google profile…</p>
            </motion.div>
          )}

          {/* ── STEP 2: Enter Kaggle ID ── */}
          {(status === 'form' || status === 'submitting') && user && (
            <motion.form key="form" className="kr-step" onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>

              <p className="kr-step-label">Step 2 of 2 — Enter your Kaggle ID</p>

              {/* Google user pill */}
              <div className="kr-user-pill">
                <img src={user.picture} alt={user.name} className="kr-avatar" />
                <div>
                  <div className="kr-user-name">{user.name}</div>
                  <div className="kr-user-email">{user.email}</div>
                </div>
                <button type="button" className="kr-change-btn" onClick={reset} title="Sign in with a different account">✕</button>
              </div>

              {/* Kaggle ID field */}
              <div className="kr-field">
                <label htmlFor="kaggleId" className="kr-label">
                  <span>🏆</span> Kaggle Username
                </label>
                <div className={`kr-input-wrap ${focused ? 'focused' : ''}`}>
                  <input
                    id="kaggleId"
                    name="kaggleId"
                    type="text"
                    value={kaggleId}
                    onChange={e => setKaggleId(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Your Kaggle username (e.g. parth2904)"
                    required
                    autoComplete="off"
                    className="kr-input"
                  />
                  {kaggleId && (
                    <motion.span className="kr-check"
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}>✓</motion.span>
                  )}
                </div>
                <p className="kr-hint">
                  Find it at <a href="https://www.kaggle.com" target="_blank" rel="noreferrer" className="kr-link">kaggle.com</a> → your profile URL
                </p>
              </div>

              <motion.button type="submit" className="kr-submit-btn"
                disabled={status === 'submitting' || !kaggleId.trim()}
                whileHover={{ scale: status === 'submitting' ? 1 : 1.03, y: status === 'submitting' ? 0 : -2 }}
                whileTap={{ scale: 0.97 }}>
                {status === 'submitting'
                  ? <span className="kr-spinner" />
                  : <>Register for the Contest <span className="kr-arrow">→</span></>}
              </motion.button>

              <p className="kr-note">🔒 Stored securely in MongoDB. No spam, ever.</p>
            </motion.form>
          )}

        </AnimatePresence>
      </motion.div>

      <style>{`
        .kr-page {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: hsl(222 47% 4%); position: relative; overflow: hidden;
          padding: 40px 20px; font-family: 'Inter', sans-serif;
        }
        .kr-particles { position: absolute; inset: 0; pointer-events: none; }
        .kr-particle { position: absolute; border-radius: 50%; background: hsl(217 91% 65%); }
        .kr-orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.16; pointer-events: none; }
        .kr-orb1 { width: 500px; height: 500px; background: hsl(217 91% 60%); top: -180px; right: -180px; }
        .kr-orb2 { width: 400px; height: 400px; background: hsl(260 80% 65%); bottom: -150px; left: -150px; }

        .kr-card {
          position: relative; z-index: 2; width: 100%; max-width: 480px;
          background: hsl(222 47% 7% / 0.88);
          border: 1px solid hsl(217 91% 60% / 0.18);
          border-radius: 24px; backdrop-filter: blur(24px);
          box-shadow: 0 0 0 1px hsl(217 91% 60% / 0.07), 0 32px 80px hsl(222 47% 2% / 0.7), inset 0 1px 0 hsl(0 0% 100% / 0.05);
          overflow: hidden;
        }

        /* Header */
        .kr-header { padding: 32px 32px 0; text-align: center; }
        .kr-badge {
          display: inline-flex; align-items: center; justify-content: center;
          width: 60px; height: 60px; font-size: 30px;
          background: linear-gradient(135deg, hsl(217 91% 60% / 0.2), hsl(260 80% 65% / 0.15));
          border: 1px solid hsl(217 91% 60% / 0.3); border-radius: 16px; margin-bottom: 14px;
        }
        .kr-title {
          font-size: clamp(20px, 4vw, 26px); font-weight: 800; margin: 0 0 7px;
          background: linear-gradient(135deg, hsl(0 0% 97%), hsl(217 91% 75%));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .kr-subtitle { font-size: 12.5px; color: hsl(215 20% 52%); margin: 0 0 22px; }
        .kr-divider {
          height: 1px; transform-origin: left;
          background: linear-gradient(90deg, transparent, hsl(217 91% 60% / 0.3), transparent);
        }

        /* Step wrapper */
        .kr-step { padding: 24px 32px 32px; display: flex; flex-direction: column; gap: 18px; }
        .kr-center { align-items: center; justify-content: center; min-height: 140px; }
        .kr-step-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: hsl(217 91% 65%); margin: 0; }

        /* Google button */
        .kr-google-btn {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          padding: 13px 20px; border-radius: 13px; border: 1px solid hsl(215 20% 25%);
          background: hsl(222 47% 10%); color: hsl(0 0% 92%);
          font-size: 15px; font-weight: 700; font-family: inherit; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .kr-google-btn:hover { background: hsl(222 47% 13%); border-color: hsl(217 91% 60% / 0.5); }

        /* User pill */
        .kr-user-pill {
          display: flex; align-items: center; gap: 12px; padding: 12px 14px;
          background: hsl(217 91% 60% / 0.08); border: 1px solid hsl(217 91% 60% / 0.2);
          border-radius: 14px;
        }
        .kr-avatar { width: 38px; height: 38px; border-radius: 50%; border: 2px solid hsl(217 91% 60% / 0.4); flex-shrink: 0; }
        .kr-avatar-lg { width: 72px; height: 72px; border-radius: 50%; border: 3px solid hsl(217 91% 60% / 0.5); margin-bottom: 4px; }
        .kr-user-name { font-size: 14px; font-weight: 700; color: hsl(0 0% 95%); }
        .kr-user-email { font-size: 12px; color: hsl(215 20% 55%); }
        .kr-change-btn {
          margin-left: auto; background: none; border: none; color: hsl(215 20% 45%);
          cursor: pointer; font-size: 14px; padding: 4px 6px; border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .kr-change-btn:hover { color: hsl(0 80% 65%); background: hsl(0 80% 55% / 0.1); }

        /* Field */
        .kr-field { display: flex; flex-direction: column; gap: 6px; }
        .kr-label { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: hsl(215 20% 68%); }
        .kr-input-wrap { position: relative; border-radius: 12px; transition: box-shadow 0.22s; }
        .kr-input-wrap.focused { box-shadow: 0 0 0 2px hsl(217 91% 60% / 0.42); }
        .kr-input {
          width: 100%; background: hsl(222 47% 10% / 0.7); border: 1px solid hsl(215 20% 22%);
          border-radius: 12px; padding: 13px 42px 13px 16px; color: hsl(0 0% 96%);
          font-size: 14.5px; font-family: inherit; outline: none; box-sizing: border-box;
          transition: border-color 0.22s;
        }
        .kr-input::placeholder { color: hsl(215 20% 36%); }
        .kr-input:focus { border-color: hsl(217 91% 60% / 0.55); background: hsl(222 47% 12%); }
        .kr-check { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: hsl(142 72% 50%); font-size: 15px; font-weight: 700; }
        .kr-hint { font-size: 11.5px; color: hsl(215 20% 42%); margin: 0; }
        .kr-link { color: hsl(217 91% 65%); text-decoration: none; }
        .kr-link:hover { text-decoration: underline; }

        /* Error */
        .kr-error {
          background: hsl(0 80% 55% / 0.1); border: 1px solid hsl(0 80% 55% / 0.3);
          border-radius: 10px; padding: 11px 14px; font-size: 13px; color: hsl(0 80% 68%); overflow: hidden;
        }

        /* Submit */
        .kr-submit-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 20px; border: none; border-radius: 13px;
          background: linear-gradient(135deg, hsl(217 91% 58%), hsl(230 75% 62%));
          color: #fff; font-size: 15px; font-weight: 700; font-family: inherit; cursor: pointer;
          box-shadow: 0 4px 22px hsl(217 91% 58% / 0.35); transition: box-shadow 0.2s, opacity 0.2s;
        }
        .kr-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .kr-submit-btn:hover:not(:disabled) { box-shadow: 0 7px 30px hsl(217 91% 58% / 0.55); }
        .kr-arrow { transition: transform 0.2s; }
        .kr-submit-btn:hover .kr-arrow { transform: translateX(4px); }

        /* Spinner */
        .kr-spinner {
          display: inline-block; width: 18px; height: 18px;
          border: 2.5px solid hsl(0 0% 100% / 0.25); border-top-color: #fff;
          border-radius: 50%; animation: krspin 0.7s linear infinite;
        }
        @keyframes krspin { to { transform: rotate(360deg); } }

        /* Note */
        .kr-note { text-align: center; font-size: 12px; color: hsl(215 20% 40%); margin: 0; }

        /* Success */
        .kr-success {
          padding: 32px 32px 40px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .kr-success-icon { font-size: 48px; line-height: 1; }
        .kr-success h2 { font-size: 24px; font-weight: 800; color: hsl(0 0% 97%); margin: 0; }
        .kr-success p { font-size: 14px; color: hsl(215 20% 58%); margin: 0; line-height: 1.6; }

        @media (max-width: 500px) {
          .kr-header { padding: 24px 20px 0; }
          .kr-step { padding: 20px 20px 28px; }
          .kr-success { padding: 28px 20px 36px; }
        }
      `}</style>
    </div>
  );
}
