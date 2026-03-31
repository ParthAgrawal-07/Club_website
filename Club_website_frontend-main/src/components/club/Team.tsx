import { motion } from 'framer-motion';

const members = [
  { initials: 'AR', name: 'Arjun Rao', role: 'President', color: 'from-primary to-accent' },
  { initials: 'SP', name: 'Sneha Patil', role: 'Vice President', color: 'from-accent to-primary' },
  { initials: 'RK', name: 'Rahul Kumar', role: 'Tech Lead', color: 'from-destructive to-primary' },
  { initials: 'PM', name: 'Priya Menon', role: 'Events Head', color: 'from-primary to-destructive' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function Team() {
  return (
    <section id="team" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">// 03 — Team</p>
        <h2 className="font-display font-extrabold text-foreground mb-12" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          Meet the Team
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {members.map((m, i) => (
            <motion.div
              key={m.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="glass-card relative overflow-hidden p-7 text-center group cursor-pointer"
            >
              <motion.div
                className={`w-[72px] h-[72px] rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center font-display text-2xl font-extrabold text-primary-foreground mx-auto mb-4`}
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {m.initials}
              </motion.div>
              <h4 className="font-display font-bold text-sm text-foreground">{m.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
