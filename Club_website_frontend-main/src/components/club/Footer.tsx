import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';
import aiClubLogo from '@/assets/ai-club-logo.jpeg';

const socials = [
  { Icon: Github,   href: 'https://github.com/ParthAgrawal-07/Club_website' },
  { Icon: Twitter,  href: '#' },
  { Icon: Linkedin, href: '#' },
];

export default function Footer() {
  return (
    <motion.footer
      className="relative z-[1] border-t border-border px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo + name */}
      <a href="#" className="flex items-center gap-2.5">
        <img src={aiClubLogo} alt="AI Club DAIICT Logo" className="w-7 h-7 rounded-sm object-contain" />
        <span className="font-display font-extrabold text-lg">
          AI Club <span className="text-primary">DAIICT</span>
        </span>
      </a>

      {/* Social icons */}
      <div className="flex gap-3">
        {socials.map(({ Icon, href }, i) => (
          <motion.a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Icon size={16} />
          </motion.a>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">© 2026 AI Club DAIICT. All rights reserved.</p>
    </motion.footer>
  );
}
