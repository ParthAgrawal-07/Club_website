import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const target = new Date('2026-05-29T18:00:00').getTime();
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
      {
        tag: 'Kaggle Contest',
        tagClass: 'tag-blue',
        title: 'AI Club Kaggle Contest 2026',
        desc: 'A college-wide Kaggle competition open to every student at DAIICT — not just club members. Tackle a real-world machine learning dataset, climb the leaderboard, and compete for glory. Whether you are a beginner or a seasoned data scientist, this is your arena.',
        meta: ['May 29 – 30, 2026', 'Open to All DAIICT Students'],
      },
      {
        tag: 'Buildathon',
        tagClass: 'tag-yellow',
        title: '7-Day AI Buildathon',
        desc: 'A week-long intensive where teams ideate, design, and ship a working AI-powered product from scratch. Each day has a theme — data, modelling, deployment, UI, and pitch. Best project wins the club spotlight.',
        meta: ['August 2026', 'Team of 2–4'],
      },
    ],
    past: [
      {
        tag: 'Workshop',
        tagClass: 'tag-blue',
        title: 'Quant Strategy Workshop × WorldQuant Brain',
        desc: 'The first time a quantitative finance firm visited DAIICT. Mr. Ishan Shandilya from WorldQuant led a hands-on session on building alphas on the WQBrain platform and introduced the International Quant Championship (IQC) with its $100k prize pool. Attracted 160+ students, free pizza, and WorldQuant goodies.',
        meta: ['April 10, 2025', '160+ attendees'],
      },
      {
        tag: 'Guest Lecture',
        tagClass: 'tag-green',
        title: 'Demystifying AI: From Basics to Building AI Agents',
        desc: 'Ms. Khyati Brahmbhatt (MS-IT 2006 alumna) guided students through the evolution of AI and the shift toward autonomous agents. Covered cutting-edge frameworks like LangChain, LangGraph, CrewAI, and n8n for workflow automation.',
        meta: ['January 29, 2025', 'Guest Speaker Session'],
      },
      {
        tag: 'Competition',
        tagClass: 'tag-pink',
        title: 'i.Prompt — Prompt Engineering at i.Fest\'24',
        desc: 'Co-hosted with IEEE Student Branch DAIICT at i.Fest\'24, this creative prompt engineering tournament challenged participants to craft hyper-accurate image prompts matching physical reality. Tested both precision and imagination in a fast-paced competitive format.',
        meta: ['November 16, 2024', 'In collaboration with IEEE DAIICT'],
      },
      {
        tag: 'Talk',
        tagClass: 'tag-yellow',
        title: 'Transformers Deep-Dive',
        desc: 'An in-depth technical session walking students through attention mechanisms, positional encoding, and the full Transformer architecture — with live code walkthroughs and real-world NLP application examples.',
        meta: ['Feb 10, 2026', '80 attendees'],
      },
      {
        tag: 'Hackathon',
        tagClass: 'tag-blue',
        title: 'AI Triathlon',
        desc: 'A massive multi-stage club championship combining coding challenges, model optimisation, and rapid prototyping rounds. Participants pushed their limits across all three disciplines in a single high-energy event.',
        meta: ['Late 2025', '50+ participants'],
      },
    ],
    workshops: [
      {
        tag: 'Workshop Series',
        tagClass: 'tag-blue',
        title: 'AI Odyssey: From Fundamentals to Mastery',
        desc: 'The flagship lecture series of AI Club DAIICT. Session 1 kicked off the club\'s comprehensive roadmap — from absolute basics to advanced AI applications. Covered the core tool stack: Python, NumPy, Pandas, and Matplotlib with hands-on coding.',
        meta: ['Ongoing Series', 'All skill levels'],
      },
      {
        tag: 'Workshop',
        tagClass: 'tag-green',
        title: 'Hands-on Data Pre-processing',
        desc: 'A practical "learning by doing" workshop focused on real-world data preprocessing using Pandas and Matplotlib. Students tackled messy datasets with interactive challenges covering null handling, normalisation, and exploratory analysis.',
        meta: ['Oct 2024', 'Hands-on coding'],
      },
      {
        tag: 'Workshop',
        tagClass: 'tag-pink',
        title: 'EDA Session',
        desc: 'Deep dive into Exploratory Data Analysis — understanding distributions, spotting outliers, visualising correlations, and extracting insights from raw data before modelling.',
        meta: ['2024–25', 'Beginner friendly'],
      },
      {
        tag: 'Workshop',
        tagClass: 'tag-yellow',
        title: 'Intro to PyTorch',
        desc: 'Hands-on workshop covering tensors, autograd, and building your first neural network from scratch using PyTorch. Perfect for anyone ready to move from theory to real deep learning code.',
        meta: ['Coming Soon', 'Intermediate level'],
      },
    ],
  };

  // Featured event for the countdown banner
  const featured = eventCards.upcoming[0];

  return (
    <section id="events" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
        <p className="section-label">01 — Events</p>
        <h2 className="font-display font-extrabold text-foreground mb-12" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          Events &amp; Workshops
        </h2>

        {/* Highlight banner */}
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
            <h3 className="font-display font-bold text-xl text-foreground mt-2">{featured.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">{featured.desc}</p>
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
                animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }}
                exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="glass-card relative overflow-hidden p-7"
              >
                <span className={`${card.tagClass} font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded`}>{card.tag}</span>
                <h4 className="font-display font-bold text-lg text-foreground mt-4 mb-2">{card.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
                  {card.meta.map((m, j) => (
                    <span key={j} className="flex items-center gap-3">
                      {j > 0 && <span className="w-1 h-1 bg-muted-foreground rounded-full" />}
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
