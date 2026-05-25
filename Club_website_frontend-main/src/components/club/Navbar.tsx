import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Shield, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import aiClubLogo from '@/assets/ai-club-logo.jpeg';

const navItems = [
  { label: 'Events', href: '/#events' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Team', href: '/#team' },
  { label: 'Resources', href: '/#resources' },
  { label: 'Blog', href: '/#blog' },
];

interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const parts = href.split('#');
    const path = parts[0] || '/';
    const hash = parts[1];

    if (location.pathname !== path) {
      e.preventDefault();
      navigate(href);
    } else if (hash) {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiBaseUrl = `${import.meta.env.PROD ? '' : 'http://localhost:8000'}/api/auth/me`;
        const headers: Record<string, string> = {};
        const token = localStorage.getItem('auth_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(apiBaseUrl, { headers, credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser({
              name: data.user.name,
              email: data.user.email,
              picture: data.user.profile_image || ''
            });
            setIsInitializing(false);
            return;
          }
        }
      } catch (e) {
        console.error('Auth check failed:', e);
      } finally {
        setIsInitializing(false);
      }
      setUser(null);
    };
    checkAuth();
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    try {
      const apiBaseUrl = `${import.meta.env.PROD ? '' : 'http://localhost:8000'}/api/auth/google`;
      const syncRes = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_token: credentialResponse.credential
        }),
        credentials: 'include'
      });
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (syncData.status === 'success') {
          if (syncData.token) {
            localStorage.setItem('auth_token', syncData.token);
          }
          const mappedUser: UserProfile = {
            name: syncData.user.name,
            email: syncData.user.email,
            picture: syncData.user.profile_image || ''
          };
          setUser(mappedUser);
        }
      }
    } catch (syncErr) {
      console.error('Failed to sync login with PostgreSQL database:', syncErr);
    }
  };

  const logout = async () => {
    try {
      const apiBaseUrl = `${import.meta.env.PROD ? '' : 'http://localhost:8000'}/api/auth/logout`;
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(apiBaseUrl, { method: 'POST', headers, credentials: 'include' });
    } catch (e) {
      console.error('Logout sync failed', e);
    }
    localStorage.removeItem('auth_token');
    setUser(null);
    setShowDropdown(false);
  };

  return (
    <>
      <AnimatePresence>
        {isInitializing && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
            <p className="text-xs font-mono tracking-widest text-primary uppercase">Loading...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 backdrop-blur-xl border-b transition-colors duration-300 ${
          scrolled ? 'bg-background/90 border-border' : 'bg-transparent border-transparent'
        }`}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      >
        <a href="#" className="flex items-center gap-2.5">
          <img src={aiClubLogo} alt="AI Club DAU Logo" className="w-8 h-8 rounded-sm object-contain" />
          <span className="font-display font-extrabold text-xl text-foreground tracking-tight">
            AI Club <span className="text-primary">DAU</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item, i) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
            >
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-3/4" />
              </a>
            </motion.li>
          ))}

          {user ? (
            <div className="relative ml-2">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-secondary/80 border border-border hover:bg-secondary transition-all"
              >
                <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-xs font-semibold text-foreground max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border p-1.5 shadow-xl z-50"
                  >
                    <div className="px-3 py-2 border-b border-border mb-1.5">
                      <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>

                    {user.email === 'meet56963@gmail.com' && (
                      <a
                        href="/admin"
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary rounded-lg transition-colors mb-1"
                      >
                        <Shield size={14} className="text-primary" />
                        Admin Dashboard
                      </a>
                    )}

                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.li
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4, type: 'spring', stiffness: 200 }}
              className="ml-2"
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Login Failed')}
                theme="filled_blue"
                size="medium"
                shape="rectangular"
              />
            </motion.li>
          )}
        </ul>

        <motion.button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.9, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden md:hidden"
            >
              <ul className="flex flex-col gap-1 p-6">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => {
                        handleNavClick(e, item.href);
                        setMobileOpen(false);
                      }}
                      className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}

                <hr className="border-border my-2" />

                {user ? (
                  <>
                    {user.email === 'meet56963@gmail.com' && (
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                        className="py-1"
                      >
                        <a
                          href="/admin"
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-secondary border border-border text-foreground hover:bg-secondary/80"
                        >
                          <Shield size={14} className="text-primary" />
                          Admin Dashboard
                        </a>
                      </motion.li>
                    )}

                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.06, duration: 0.3 }}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { logout(); setMobileOpen(false); }}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <LogOut size={16} />
                      </button>
                    </motion.li>
                  </>
                ) : (
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.06, duration: 0.3 }}
                    className="flex justify-center"
                  >
                    <GoogleLogin
                      onSuccess={(res) => { handleGoogleSuccess(res); setMobileOpen(false); }}
                      onError={() => console.log('Login Failed')}
                      theme="filled_blue"
                      size="medium"
                      shape="rectangular"
                    />
                  </motion.li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

    </>
  );
}
