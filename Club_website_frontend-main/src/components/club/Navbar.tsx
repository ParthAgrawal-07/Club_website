import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import aiClubLogo from '@/assets/ai-club-logo.jpeg';

const navItems = [
  { label: 'Events', href: '#events' },
  { label: 'Projects', href: '#projects' },
  { label: 'Team', href: '#team' },
  { label: 'Resources', href: '#resources' },
  { label: 'Blog', href: '#blog' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 backdrop-blur-xl border-b transition-colors duration-300 ${
        scrolled ? 'bg-background/90 border-border' : 'bg-transparent border-transparent'
      }`}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
    >
      {/* Logo + Name */}
      <a href="#" className="flex items-center gap-2.5">
        <img src={aiClubLogo} alt="AI Club DAIICT Logo" className="w-8 h-8 rounded-sm object-contain" />
        <span className="font-display font-extrabold text-xl text-foreground tracking-tight">
          AI Club <span className="text-primary">DAIICT</span>
        </span>
      </a>

      {/* Desktop */}
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
              className="relative block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              {item.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-3/4" />
            </a>
          </motion.li>
        ))}
        <motion.li
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.4, type: 'spring', stiffness: 200 }}
        >
          <a
            href="#join"
            className="ml-2 px-4 py-2 text-sm font-semibold rounded-lg btn-glow text-primary-foreground transition-all"
          >
            Join Us
          </a>
        </motion.li>
      </ul>

      {/* Mobile toggle */}
      <motion.button
        className="md:hidden text-foreground"
        onClick={() => setMobileOpen(!mobileOpen)}
        whileTap={{ scale: 0.9, rotate: 90 }}
        transition={{ duration: 0.2 }}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile menu */}
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
                    className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.06, duration: 0.3 }}
              >
                <a
                  href="#join"
                  className="inline-block mt-2 px-4 py-2 text-sm font-semibold rounded-lg btn-glow text-primary-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Join Us
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
