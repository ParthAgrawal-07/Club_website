import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const projects = [
  { id: 1, tag: 'Hardware / IoT', tagClass: 'tag-green', category: 'hardware', title: 'AutoMed — Pill Dispenser', desc: 'An automatic pill dispenser built with Arduino and ESP8266, featuring remote scheduling via a local network server.' },
  { id: 2, tag: 'NLP', tagClass: 'tag-blue', category: 'nlp', title: 'CampusBot — LLM Chatbot', desc: 'A RAG-based chatbot trained on college documents. Deployed as a WhatsApp bot used by 500+ students.' },
  { id: 3, tag: 'Robotics', tagClass: 'tag-pink', category: 'hardware', title: 'Autonomous Nav-Bot', desc: 'A ROS-based mobile robot integrating LiDAR and depth cameras for real-time SLAM and obstacle avoidance.' },
];

const tabs = ['all', 'nlp', 'hardware', 'rl'];

export default function Projects() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = projects.filter(
    (p) => activeTab === 'all' || p.category === activeTab
  );

  return (
    <section id="projects" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">// 02 — Projects</p>
        <h2 className="font-display font-extrabold text-foreground mb-12" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          Student Projects
        </h2>

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
              {tab.toUpperCase()}
              {activeTab === tab && (
                <motion.div
                  layoutId="project-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }}
                exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.25 } }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="glass-card relative overflow-hidden p-7 cursor-pointer"
              >
                <span className={`${p.tagClass} font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded`}>
                  {p.tag}
                </span>
                <h4 className="font-display font-bold text-lg text-foreground mt-4 mb-2">{p.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                <motion.div className="mt-5" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-xs text-primary border border-primary/25 rounded-md px-3 py-1 hover:bg-primary/10 transition-colors"
                  >
                    <ExternalLink size={12} /> GitHub
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground text-sm col-span-full"
            >
              No projects in this category yet — stay tuned!
            </motion.p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
