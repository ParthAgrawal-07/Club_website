import { motion } from 'framer-motion';
import { Lock, Bell } from 'lucide-react';

export default function JoinForm() {
  return (
    <section id="join" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      >
        <div
          className="rounded-3xl p-8 md:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, hsl(217 91% 60% / 0.10), hsl(340 82% 55% / 0.05))',
            border: '1px solid hsl(217 91% 60% / 0.2)',
          }}
        >
          <p className="section-label">06 — Join Us</p>

          {/* Lock icon */}
          <motion.div
            className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full"
            style={{ background: 'hsl(217 91% 60% / 0.1)', border: '1px solid hsl(217 91% 60% / 0.25)' }}
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200 }}
          >
            <Lock size={32} className="text-primary" />
          </motion.div>

          <motion.h2
            className="font-display font-extrabold text-foreground mb-3"
            style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Recruitment is Closed
          </motion.h2>

          <motion.p
            className="text-muted-foreground max-w-lg mx-auto leading-relaxed mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            We're not accepting new members right now, but we open our doors every semester.
            Keep an eye on our social channels — we announce the next recruitment window there first.
          </motion.p>

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase mb-10"
            style={{ background: 'hsl(340 82% 55% / 0.12)', border: '1px solid hsl(340 82% 55% / 0.3)', color: 'hsl(340 82% 65%)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            Applications Closed · Check back next semester
          </motion.div>

          {/* Follow us nudge */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.42 }}
          >
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bell size={14} className="text-primary" />
              Stay updated — follow us on
            </span>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/aiclub.daiict/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ background: 'hsl(217 91% 60% / 0.12)', border: '1px solid hsl(217 91% 60% / 0.3)', color: 'hsl(217 91% 70%)' }}
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/ai-club-daiict/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ background: 'hsl(217 91% 60% / 0.12)', border: '1px solid hsl(217 91% 60% / 0.3)', color: 'hsl(217 91% 70%)' }}
              >
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

