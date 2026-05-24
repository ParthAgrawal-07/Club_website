import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────
   Particle component for the background
───────────────────────────────────────── */
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 12 + 8,
  delay: Math.random() * 6,
}));

type FormState = { name: string; email: string; kaggleId: string };
type Status = 'idle' | 'loading' | 'success' | 'error';

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ──────────────────────────────────────────────────────────
export default function KaggleRegister() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', kaggleId: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status !== 'idle') { setStatus('idle'); setMessage(''); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/api/kaggle-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Registration successful!');
        setForm({ name: '', email: '', kaggleId: '' });
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error — make sure the backend server is running.');
    }
  };

  const fields: { name: keyof FormState; label: string; type: string; placeholder: string; icon: string }[] = [
    { name: 'name',     label: 'Full Name',  type: 'text',  placeholder: 'e.g. Parth Agrawal', icon: '👤' },
    { name: 'email',    label: 'Email ID',   type: 'email', placeholder: 'e.g. parth@daiict.ac.in', icon: '✉️' },
    { name: 'kaggleId', label: 'Kaggle ID',  type: 'text',  placeholder: 'Your Kaggle username', icon: '🏆' },
  ];

  return (
    <div className="kaggle-page">
      {/* Animated particle background */}
      <div className="kaggle-particles">
        {PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            className="kaggle-particle"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -30, 0], opacity: [0.15, 0.55, 0.15] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Glow orbs */}
      <div className="kaggle-orb kaggle-orb-1" />
      <div className="kaggle-orb kaggle-orb-2" />

      {/* Card */}
      <motion.div
        className="kaggle-card"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="kaggle-header">
          <motion.div
            className="kaggle-badge"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
          >
            🏅
          </motion.div>
          <motion.h1
            className="kaggle-title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Kaggle Contest 2026
          </motion.h1>
          <motion.p
            className="kaggle-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            AI Club DAIICT · Open to all DAIICT students · May 29–30, 2026
          </motion.p>

          <motion.div
            className="kaggle-divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          />
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              className="kaggle-success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
            >
              <motion.div
                className="kaggle-success-icon"
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                🎉
              </motion.div>
              <h2>You're Registered!</h2>
              <p>{message}</p>
              <motion.button
                className="kaggle-btn kaggle-btn-secondary"
                onClick={() => setStatus('idle')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Register Another
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              ref={formRef}
              onSubmit={handleSubmit}
              className="kaggle-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {fields.map((field, i) => (
                <motion.div
                  key={field.name}
                  className="kaggle-field"
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.45 }}
                >
                  <label htmlFor={field.name} className="kaggle-label">
                    <span className="kaggle-label-icon">{field.icon}</span>
                    {field.label}
                  </label>
                  <div className={`kaggle-input-wrap ${focused === field.name ? 'focused' : ''}`}>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={form[field.name]}
                      onChange={handleChange}
                      onFocus={() => setFocused(field.name)}
                      onBlur={() => setFocused(null)}
                      placeholder={field.placeholder}
                      required
                      autoComplete={field.type === 'email' ? 'email' : 'off'}
                      className="kaggle-input"
                    />
                    {form[field.name] && (
                      <motion.span
                        className="kaggle-check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Error message */}
              <AnimatePresence>
                {status === 'error' && (
                  <motion.div
                    className="kaggle-error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    ⚠️ {message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                className="kaggle-btn kaggle-btn-primary"
                disabled={status === 'loading'}
                whileHover={{ scale: status === 'loading' ? 1 : 1.03, y: status === 'loading' ? 0 : -2 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
              >
                {status === 'loading' ? (
                  <span className="kaggle-spinner" />
                ) : (
                  <>Register for the Contest <span className="kaggle-arrow">→</span></>
                )}
              </motion.button>

              <motion.p
                className="kaggle-note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                🔒 Your data is stored securely. No spam, ever.
              </motion.p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        /* ────── PAGE SHELL ────── */
        .kaggle-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: hsl(222 47% 4%);
          position: relative;
          overflow: hidden;
          padding: 40px 20px;
          font-family: 'Inter', 'Outfit', sans-serif;
        }

        /* ────── PARTICLES ────── */
        .kaggle-particles { position: absolute; inset: 0; pointer-events: none; }
        .kaggle-particle {
          position: absolute;
          border-radius: 50%;
          background: hsl(217 91% 65%);
        }

        /* ────── GLOW ORBS ────── */
        .kaggle-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.18;
          pointer-events: none;
        }
        .kaggle-orb-1 {
          width: 520px; height: 520px;
          background: hsl(217 91% 60%);
          top: -180px; right: -180px;
        }
        .kaggle-orb-2 {
          width: 420px; height: 420px;
          background: hsl(260 80% 65%);
          bottom: -160px; left: -160px;
        }

        /* ────── CARD ────── */
        .kaggle-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 500px;
          background: hsl(222 47% 7% / 0.85);
          border: 1px solid hsl(217 91% 60% / 0.18);
          border-radius: 24px;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px hsl(217 91% 60% / 0.08),
            0 32px 80px hsl(222 47% 2% / 0.7),
            inset 0 1px 0 hsl(0 0% 100% / 0.05);
          overflow: hidden;
        }

        /* ────── HEADER ────── */
        .kaggle-header {
          padding: 36px 36px 0;
          text-align: center;
        }
        .kaggle-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px; height: 64px;
          font-size: 32px;
          background: linear-gradient(135deg, hsl(217 91% 60% / 0.2), hsl(260 80% 65% / 0.15));
          border: 1px solid hsl(217 91% 60% / 0.3);
          border-radius: 18px;
          margin-bottom: 16px;
        }
        .kaggle-title {
          font-size: clamp(22px, 4vw, 28px);
          font-weight: 800;
          color: hsl(0 0% 97%);
          margin: 0 0 8px;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, hsl(0 0% 97%), hsl(217 91% 75%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .kaggle-subtitle {
          font-size: 13px;
          color: hsl(215 20% 55%);
          margin: 0 0 24px;
          line-height: 1.5;
        }
        .kaggle-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, hsl(217 91% 60% / 0.3), transparent);
          transform-origin: left;
        }

        /* ────── FORM ────── */
        .kaggle-form {
          padding: 28px 36px 36px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ────── FIELD ────── */
        .kaggle-field { display: flex; flex-direction: column; gap: 7px; }
        .kaggle-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 600;
          color: hsl(215 20% 70%);
          letter-spacing: 0.02em;
        }
        .kaggle-label-icon { font-size: 14px; }

        .kaggle-input-wrap {
          position: relative;
          border-radius: 12px;
          transition: box-shadow 0.25s;
        }
        .kaggle-input-wrap.focused {
          box-shadow: 0 0 0 2px hsl(217 91% 60% / 0.45);
        }
        .kaggle-input {
          width: 100%;
          background: hsl(222 47% 10% / 0.7);
          border: 1px solid hsl(215 20% 22%);
          border-radius: 12px;
          padding: 13px 42px 13px 16px;
          color: hsl(0 0% 97%);
          font-size: 14.5px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.25s, background 0.25s;
          box-sizing: border-box;
        }
        .kaggle-input::placeholder { color: hsl(215 20% 38%); }
        .kaggle-input:focus {
          border-color: hsl(217 91% 60% / 0.6);
          background: hsl(222 47% 12% / 0.8);
        }
        .kaggle-check {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(142 72% 50%);
          font-size: 15px;
          font-weight: 700;
        }

        /* ────── ERROR ────── */
        .kaggle-error {
          background: hsl(0 80% 55% / 0.12);
          border: 1px solid hsl(0 80% 55% / 0.3);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 13px;
          color: hsl(0 80% 70%);
          overflow: hidden;
        }

        /* ────── BUTTONS ────── */
        .kaggle-btn {
          width: 100%;
          padding: 14px 20px;
          border: none;
          border-radius: 13px;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.25s, opacity 0.25s;
        }
        .kaggle-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .kaggle-btn-primary {
          background: linear-gradient(135deg, hsl(217 91% 58%), hsl(230 75% 62%));
          color: #fff;
          box-shadow: 0 4px 24px hsl(217 91% 58% / 0.35);
        }
        .kaggle-btn-primary:hover:not(:disabled) {
          box-shadow: 0 6px 32px hsl(217 91% 58% / 0.55);
        }
        .kaggle-btn-secondary {
          background: hsl(215 20% 18%);
          color: hsl(0 0% 88%);
          border: 1px solid hsl(215 20% 28%);
        }

        .kaggle-arrow { transition: transform 0.2s; }
        .kaggle-btn-primary:hover .kaggle-arrow { transform: translateX(4px); }

        /* ────── SPINNER ────── */
        .kaggle-spinner {
          display: inline-block;
          width: 18px; height: 18px;
          border: 2.5px solid hsl(0 0% 100% / 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ────── NOTE ────── */
        .kaggle-note {
          text-align: center;
          font-size: 12px;
          color: hsl(215 20% 42%);
          margin: 0;
        }

        /* ────── SUCCESS ────── */
        .kaggle-success {
          padding: 40px 36px 44px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .kaggle-success-icon {
          font-size: 52px;
          line-height: 1;
          margin-bottom: 4px;
          display: inline-block;
        }
        .kaggle-success h2 {
          font-size: 24px;
          font-weight: 800;
          color: hsl(0 0% 97%);
          margin: 0;
        }
        .kaggle-success p {
          font-size: 14px;
          color: hsl(215 20% 60%);
          margin: 0 0 12px;
          line-height: 1.6;
        }

        /* ────── RESPONSIVE ────── */
        @media (max-width: 520px) {
          .kaggle-header { padding: 28px 22px 0; }
          .kaggle-form   { padding: 22px 22px 28px; }
          .kaggle-success { padding: 32px 22px 36px; }
        }
      `}</style>
    </div>
  );
}
