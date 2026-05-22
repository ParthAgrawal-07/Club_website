import { motion } from 'framer-motion';
import { Rocket, Settings } from 'lucide-react';

const resources = [
  { icon: <Rocket size={20} />, title: 'Machine Learning Foundations', sub: 'From PyTorch to deployment pipelines.', color: 'bg-primary/15 text-primary' },
  { icon: <Settings size={20} />, title: 'Embedded Systems Toolkit', sub: 'Guides for MATLAB, Keil, and ESP8266.', color: 'bg-accent/15 text-accent' },
];

export default function Resources() {
  return (
    <section id="resources" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
        <p className="section-label">04 — Resources</p>
        <h2 className="font-display font-extrabold text-foreground mb-12" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          Learning Resources
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((r, i) => (
            <motion.a
              key={r.title}
              href="#"
              className="glass-card relative overflow-hidden flex items-start gap-4 p-6 no-underline group"
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <motion.div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.color}`}
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {r.icon}
              </motion.div>
              <div>
                <h4 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-300">{r.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{r.sub}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
