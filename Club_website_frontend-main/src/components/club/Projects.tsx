import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { projects } from '../../data/projects';

// Map tags from projects.ts to display styles
const tagStyleMap: Record<string, { tagClass: string; label: string }> = {
  'Machine Learning':    { tagClass: 'tag-blue',  label: 'Machine Learning' },
  'Full Stack':          { tagClass: 'tag-green', label: 'Full Stack' },
  'Data Science':        { tagClass: 'tag-blue',  label: 'Data Science' },
  'Sports Analytics':    { tagClass: 'tag-green', label: 'Sports Analytics' },
  'Computer Vision':     { tagClass: 'tag-pink',  label: 'Computer Vision' },
  'Object Detection':    { tagClass: 'tag-pink',  label: 'Object Detection' },
  'Retail AI':           { tagClass: 'tag-pink',  label: 'Retail AI' },
  'Deep Learning':       { tagClass: 'tag-blue',  label: 'Deep Learning' },
  'Renewable Energy':    { tagClass: 'tag-green', label: 'Renewable Energy' },
  'Regression':          { tagClass: 'tag-blue',  label: 'Regression' },
  'Forecasting':         { tagClass: 'tag-green', label: 'Forecasting' },
  'Energy':              { tagClass: 'tag-green', label: 'Energy' },
  'Python':              { tagClass: 'tag-blue',  label: 'Python' },
  'OpenCV':              { tagClass: 'tag-pink',  label: 'OpenCV' },
  'LangGraph':           { tagClass: 'tag-blue',  label: 'LangGraph' },
  'Multi-Agent':         { tagClass: 'tag-green', label: 'Multi-Agent' },
  'Recommender System':  { tagClass: 'tag-green', label: 'Recommender System' },
  'GAN':                 { tagClass: 'tag-pink',  label: 'GAN' },
  'Reinforcement Learning': { tagClass: 'tag-pink', label: 'Reinforcement Learning' },
  'NLP':                 { tagClass: 'tag-green', label: 'NLP' },
  'Backend':             { tagClass: 'tag-blue',  label: 'Backend' },
  'Systems':             { tagClass: 'tag-blue',  label: 'Systems' },
};

// Pick the first tag that has a style, for the card badge
function getPrimaryTag(tags: string[]) {
  for (const tag of tags) {
    if (tagStyleMap[tag]) return tagStyleMap[tag];
  }
  return { tagClass: 'tag-blue', label: tags[0] };
}

// Derive unique filter tabs from actual project tags
const categoryOrder = ['all', 'ml', 'cv', 'fullstack', 'energy'];

// Map each project to a simple category for tab filtering
function getCategory(tags: string[]): string {
  if (tags.includes('Computer Vision') || tags.includes('Object Detection')) return 'cv';
  if (tags.includes('Full Stack'))                                             return 'fullstack';
  if (tags.includes('Renewable Energy') || tags.includes('Energy') || tags.includes('Forecasting')) return 'energy';
  if (tags.includes('Machine Learning') || tags.includes('Deep Learning'))    return 'ml';
  return 'ml';
}

const tabLabels: Record<string, string> = {
  all:      'ALL',
  ml:       'ML / AI',
  cv:       'COMPUTER VISION',
  fullstack:'FULL STACK',
  energy:   'ENERGY',
};

export default function Projects() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = projects.filter(
    (p) => activeTab === 'all' || getCategory(p.tags) === activeTab
  );

  return (
    <section id="projects" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">02 — Projects</p>
        <h2 className="font-display font-extrabold text-foreground mb-12" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          Student Projects
        </h2>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-10 flex-wrap">
          {categoryOrder.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2.5 text-sm font-medium -mb-px transition-colors ${
                activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tabLabels[tab]}
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
            {filtered.map((p, i) => {
              const { tagClass, label } = getPrimaryTag(p.tags);
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }}
                  exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.25 } }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="glass-card relative overflow-hidden p-7 cursor-pointer"
                >
                  {/* Primary tag badge */}
                  <span className={`${tagClass} font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded`}>
                    {label}
                  </span>

                  {/* Title */}
                  <h4 className="font-display font-bold text-lg text-foreground mt-4 mb-1">{p.title}</h4>

                  {/* Author */}
                  <p className="text-xs text-muted-foreground mb-2">by {p.author}</p>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>

                  {/* All tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-muted-foreground border border-border rounded px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* GitHub link */}
                  <motion.div className="mt-5" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <a
                      href={p.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-xs text-primary border border-primary/25 rounded-md px-3 py-1 hover:bg-primary/10 transition-colors"
                    >
                      <ExternalLink size={12} /> GitHub
                    </a>
                  </motion.div>
                </motion.div>
              );
            })}
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
