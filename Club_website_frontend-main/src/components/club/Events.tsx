import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const target = new Date('2026-04-05T09:00:00').getTime();
    const interval = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) { clearInterval(interval); return; }
      setTimeLeft({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs = ['upcoming', 'past', 'workshops'];

  const eventCards: Record<string, Array<{ tag: string; tagClass: string; title: string; desc: string; meta: string[] }>> = {
    upcoming: [
      { tag: 'Hackathon', tagClass: 'tag-blue', title: 'GenAI Hackathon 2026', desc: '48-hour hackathon building with the latest generative AI APIs. Open to all branches.', meta: ['April 5, 2026', 'Registration Open'] },
    ],
    past: [
      { tag: 'Hackathon', tagClass: 'tag-green', title: 'AI Triathlon', desc: 'A massive multi-stage club event combining coding challenges, model optimization, and rapid prototyping.', meta: ['Late 2025', 'Over 50 participants'] },
      { tag: 'Talk', tagClass: 'tag-pink', title: 'Transformers Deep-Dive', desc: 'Prof. Aryan Mehta walked us through attention mechanisms and the Transformer architecture.', meta: ['Feb 10, 2026', '80 attendees'] },
    ],
    workshops: [
      { tag: 'Workshop', tagClass: 'tag-yellow', title: 'Intro to PyTorch', desc: 'Hands-on workshop covering tensors, autograd, and building your first neural network from scratch.', meta: ['Coming Soon'] },
    ],
  };

  return (
    <section id="events" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
        <p className="section-label">// 01 — Events</p>
        <h2 className="font-display font-extrabold text-foreground mb-12" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          Events & Workshops
        </h2>

        {/* Highlight */}
        <motion.div
          className="rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, hsl(217 91% 60% / 0.1), hsl(160 90% 43% / 0.05))', border: '1px solid hsl(217 91% 60% / 0.25)' }}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div>
            <span className="text-xs font-mono text-primary tracking-widest uppercase">Next Up</span>
            <h3 className="font-display font-bold text-xl text-foreground mt-2">GenAI Hackathon 2026</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              48-hour hackathon building with the latest generative AI APIs. Prizes, mentors, and free pizza.
            </p>
          </div>
          <div className="flex gap-5">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <motion.span
                  key={value}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="font-mono text-3xl font-bold text-primary block"
                >
                  {value}
                </motion.span>
                <span className="text-[10px] text-muted-foreground tracking-widest uppercase mt-1 block">
                  {unit === 'd' ? 'Days' : unit === 'h' ? 'Hours' : unit === 'm' ? 'Mins' : 'Secs'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-10 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2.5 text-sm font-medium -mb-px transition-colors ${
                activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div
                  layoutId="event-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {eventCards[activeTab]?.map((card, i) => (
              <motion.div
                key={card.title}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }}
                exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="glass-card relative overflow-hidden p-7"
              >
                <span className={`${card.tagClass} font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded`}>{card.tag}</span>
                <h4 className="font-display font-bold text-lg text-foreground mt-4 mb-2">{card.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
                  {card.meta.map((m, j) => (
                    <span key={j} className="flex items-center gap-4">
                      {j > 0 && <span className="w-1 h-1 bg-muted-foreground rounded-full mr-4" />}
                      {m}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
