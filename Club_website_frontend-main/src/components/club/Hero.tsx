import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';
import aiClubLogo from '@/assets/ai-club-logo.jpeg';

const stats = [
  { value: 25, suffix: '+', label: 'Active Members' },
  { value: 8, suffix: '+', label: 'Projects Shipped' },
  { value: 20, suffix: '+', label: 'Events Held' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: 'easeOut' });
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [count, rounded, value]);

  return <>{display}{suffix}</>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Hero() {
  return (
    <section id="hero" className="relative z-[1] min-h-screen flex flex-col justify-center max-w-[1200px] mx-auto px-6 md:px-12 pt-32 overflow-hidden">
      {/* Background image overlay */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono mb-8"
          style={{ background: 'hsl(340 82% 55% / 0.12)', border: '1px solid hsl(340 82% 55% / 0.35)', color: 'hsl(340 82% 68%)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" style={{ animation: 'pulse-dot 2s infinite' }} />
          Recruitment Closed · Opening Soon
        </motion.div>

        {/* Logo + Club name lockup */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
          <img
            src={aiClubLogo}
            alt="AI Club DAU Logo"
            className="w-16 h-16 rounded-xl object-contain"
          />
          <div>
            <p className="font-mono text-xs text-primary tracking-widest uppercase mb-0.5">DAU · Gandhinagar</p>
            <p className="font-display font-extrabold text-2xl text-foreground tracking-tight">AI Club DAU</p>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-extrabold leading-[0.95] mb-8 text-foreground"
          style={{ fontSize: 'clamp(44px, 8vw, 96px)' }}
        >
          Building the{' '}
          <motion.span
            className="text-primary inline-block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          >
            Future of AI
          </motion.span>{' '}
          <motion.span
            className="bg-clip-text text-transparent inline-block"
            style={{ WebkitTextStroke: '1px hsl(217 91% 60% / 0.4)' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          >
            Together.
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="max-w-xl text-muted-foreground text-base md:text-lg leading-relaxed mb-10"
        >
          AI Club DAU is DAU's premier Artificial Intelligence club — where students research, build, and ship real AI projects.
        </motion.p>

        {/* Buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <motion.a
            href="#join"
            className="px-7 py-3.5 rounded-lg text-sm font-semibold border transition-all inline-flex items-center gap-2"
            style={{ background: 'hsl(340 82% 55% / 0.1)', border: '1px solid hsl(340 82% 55% / 0.35)', color: 'hsl(340 82% 68%)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            🔒 Recruitment Closed
          </motion.a>
          <motion.a
            href="#projects"
            className="px-7 py-3.5 rounded-lg text-sm font-semibold text-foreground border border-border bg-transparent hover:border-primary hover:bg-primary/5 transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            View Projects
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="flex flex-wrap gap-12 md:gap-16 mt-20 pt-10 border-t border-border"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
        }}
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          >
            <div className="font-display text-4xl font-extrabold text-foreground">
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-xs text-muted-foreground mt-1 tracking-wide">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
