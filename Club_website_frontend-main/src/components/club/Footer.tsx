import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';

const socials = [Github, Twitter, Linkedin];

export default function Footer() {
  return (
    <motion.footer
      className="relative z-[1] border-t border-border px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="font-display font-extrabold text-lg">
        Neural<span className="text-primary">Node</span>
      </div>
      <div className="flex gap-3">
        {socials.map((Icon, i) => (
          <motion.a
            key={i}
            href="#"
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
      <p className="text-xs text-muted-foreground">© 2026 NeuralNode. All rights reserved.</p>
    </motion.footer>
  );
}
