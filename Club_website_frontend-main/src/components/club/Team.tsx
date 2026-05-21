import { members } from "../../data/members";
import { motion } from 'framer-motion';
import { useState } from 'react';

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

// GitHub SVG icon
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.263.82-.582 0-.288-.012-1.243-.017-2.252-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.083-.73.083-.73 1.204.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.42-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.124-.304-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.872.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.624-5.48 5.921.43.372.814 1.103.814 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.699.825.58C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// LinkedIn SVG icon
const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.984 1.984 0 1 1 0-3.967 1.984 1.984 0 0 1 0 3.967zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/** Renders a member's avatar — photo if available, initials otherwise */
function MemberAvatar({ name, photo }: { name: string; photo: string }) {
  const [imgError, setImgError] = useState(false);
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (photo && !imgError) {
    return (
      <motion.div
        className="w-[84px] h-[84px] rounded-full mx-auto mb-4 overflow-hidden ring-2 ring-primary/30 ring-offset-2 ring-offset-card"
        whileHover={{ scale: 1.1, rotate: 2 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover object-top"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-[84px] h-[84px] rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display text-2xl font-extrabold text-primary-foreground mx-auto mb-4"
      whileHover={{ scale: 1.15, rotate: 5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {initials}
    </motion.div>
  );
}

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {members.map((m, i) => (
            <motion.div
              key={m.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="glass-card relative overflow-hidden p-6 text-center group cursor-pointer flex flex-col items-center"
            >
              {/* Top gradient bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Avatar — photo or initials */}
              <MemberAvatar name={m.name} photo={m.photo} />

              {/* Name */}
              <h4 className="font-display font-bold text-sm text-foreground leading-tight">{m.name}</h4>

              {/* Social links */}
              <div className="flex items-center justify-center gap-3 mt-2">
                {m.github && (
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="GitHub"
                  >
                    <GitHubIcon />
                  </a>
                )}
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon />
                  </a>
                )}
              </div>

              {/* Description */}
              {m.description && (
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed line-clamp-3">
                  {m.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
