import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';

const posts = [
  {
    id: 1,
    tag: 'Tutorial',
    tagClass: 'tag-blue',
    title: 'Building a RAG Pipeline from Scratch with LangChain',
    excerpt: 'A step-by-step guide to creating a Retrieval-Augmented Generation system using LangChain, ChromaDB, and OpenAI — deployed on our college server.',
    author: 'Arjun Rao',
    date: 'Mar 22, 2026',
    readTime: '8 min read',
  },
  {
    id: 2,
    tag: 'Research',
    tagClass: 'tag-green',
    title: 'How We Trained a Vision Model on 200 Campus Images',
    excerpt: 'Our team fine-tuned a YOLO model to detect and classify campus landmarks. Here\'s what we learned about small-dataset training and augmentation.',
    author: 'Sneha Patil',
    date: 'Mar 14, 2026',
    readTime: '6 min read',
  },
  {
    id: 3,
    tag: 'Opinion',
    tagClass: 'tag-pink',
    title: 'Why Every CS Student Should Learn MLOps',
    excerpt: 'Building models is only half the job. Deploying, monitoring, and versioning them is where real-world skills are built — and where most students fall short.',
    author: 'Rahul Kumar',
    date: 'Feb 28, 2026',
    readTime: '5 min read',
  },
  {
    id: 4,
    tag: 'Project Log',
    tagClass: 'tag-yellow',
    title: 'Autonomous Nav-Bot: 3 Months of Failures & Breakthroughs',
    excerpt: 'A candid devlog of our robotics project — from burnt motor drivers to successfully navigating the department corridor with SLAM.',
    author: 'Priya Menon',
    date: 'Feb 15, 2026',
    readTime: '10 min read',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function Blog() {
  return (
    <section id="blog" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">// 05 — Blog</p>
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <h2
            className="font-display font-extrabold text-foreground"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            Latest from the Club
          </h2>
          <motion.a
            href="#"
            className="text-sm text-primary font-medium inline-flex items-center gap-1 transition-all"
            whileHover={{ gap: '8px' }}
          >
            View all posts <ArrowUpRight size={14} />
          </motion.a>
        </div>

        {/* Featured post */}
        <motion.div
          className="glass-card relative overflow-hidden p-8 md:p-10 mb-6 group cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ y: -6, transition: { duration: 0.25 } }}
        >
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <span className={`${posts[0].tagClass} font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded`}>
                {posts[0].tag}
              </span>
              <h3 className="font-display font-bold text-xl md:text-2xl text-foreground mt-4 mb-3 group-hover:text-primary transition-colors duration-300">
                {posts[0].title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 mt-5 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{posts[0].author}</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span>{posts[0].date}</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} /> {posts[0].readTime}
                </span>
              </div>
            </div>
            <motion.div
              className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-border text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors flex-shrink-0 mt-2"
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight size={20} />
            </motion.div>
          </div>
        </motion.div>

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.slice(1).map((post, i) => (
            <motion.div
              key={post.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="glass-card relative overflow-hidden p-7 group cursor-pointer flex flex-col"
            >
              <span className={`${post.tagClass} font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded self-start`}>
                {post.tag}
              </span>
              <h4 className="font-display font-bold text-base text-foreground mt-4 mb-2 group-hover:text-primary transition-colors duration-300 leading-snug">
                {post.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{post.author}</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span className="inline-flex items-center gap-1">
                  <Clock size={10} /> {post.readTime}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
