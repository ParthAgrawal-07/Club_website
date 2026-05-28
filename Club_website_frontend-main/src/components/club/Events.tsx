import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Users, ArrowRight, Loader2, CalendarDays, Mic, UsersRound, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '@/lib/utils';

interface EventModel {
  id: number;
  title: string;
  description: string;
  banner: string | null;
  category: string;
  venue: string;
  contact_email: string;
  event_type: 'individual' | 'team';
  min_team_size: number | null;
  max_team_size: number | null;
  event_date: string;
  event_start_date?: string;
  event_end_date?: string;
  start_time: string;
  end_time: string;
  registration_start: string;
  registration_end: string;
  status: 'upcoming' | 'registration_open' | 'registration_closed' | 'completed';
}

interface FormFieldModel {
  id: number;
  label: string;
  field_type: 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'dropdown' | 'radio' | 'checkbox' | 'date' | 'file';
  placeholder: string | null;
  required: boolean;
  options_json: string | null;
  order_no: number;
  file_max_size_kb: number | null;
  file_allowed_types: string | null;
}

interface PastEvent {
  id: number;
  title: string;
  date_label: string;
  category: string;
  description: string;
  speaker: string | null;
  participants: number | null;
  image_url: string | null;
  sort_order: number;
}

export default function Events({ isHomepage = false }: { isHomepage?: boolean }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [dbEvents, setDbEvents] = useState<Array<{ tag: string; tagClass: string; title: string; desc: string; meta: string[] }>>([]);

  // Past Events state
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [loadingPastEvents, setLoadingPastEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
  
  // Dynamic Form schema state
  const [formFields, setFormFields] = useState<FormFieldModel[]>([]);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);

  // Team Registration state
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<Array<{ name: string; email: string }>>([
    { name: '', email: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getApiUrl = (path: string) => {
    return `${import.meta.env.PROD ? '' : 'http://localhost:8000'}${path}`;
  };

  // 1. Fetch Events from backend
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch(getApiUrl('/api/events?limit=50'));
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (e) {
      console.error('Failed to fetch events from backend, falling back to static descriptions.', e);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const authRes = await fetch(getApiUrl('/api/auth/me'), { headers, credentials: 'include' });
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.authenticated && authData.user) {
          setUserProfile(authData.user);
          
          // Fetch registrations
          const regRes = await fetch(getApiUrl('/api/user/registrations'), { headers, credentials: 'include' });
          if (regRes.ok) {
            const regData = await regRes.json();
            if (regData.registrations) {
              setRegisteredEventIds(regData.registrations.map((r: any) => r.event_id));
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch user data', e);
    }
  };

  // Fetch past events from Supabase
  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('past_events')
          .select('*')
          .order('sort_order', { ascending: false });
        if (!error && data) setPastEvents(data);
      } catch (e) {
        console.error('Failed to fetch past events', e);
      } finally {
        setLoadingPastEvents(false);
      }
    };
    fetchEvents();
    fetchUserData();
    fetchPastEvents();
  }, []);

  const featured = events.find(ev => ev.status === 'registration_open') || events[0];

  // Countdown timer for next event based on real database featured event
  useEffect(() => {
    if (!featured) {
      setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
      return;
    }
    const targetStr = `${featured.event_start_date || featured.event_date}T${featured.start_time || '00:00:00'}`;
    const target = new Date(targetStr).getTime();
    
    const updateTimer = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
        return false;
      }
      setTimeLeft({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
      return true;
    };

    const hasTime = updateTimer();
    if (!hasTime) return;

    const interval = setInterval(() => {
      const continuing = updateTimer();
      if (!continuing) clearInterval(interval);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [featured]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(getApiUrl('/api/events'));
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((e: any) => ({
            tag: e.winners ? 'Competition' : 'Event',
            tagClass: e.winners ? 'tag-pink' : 'tag-blue',
            title: e.event_name,
            desc: e.summary + (e.key_highlights ? ` Highlights: ${e.key_highlights}` : '') + (e.winners ? ` Winners: ${e.winners}` : ''),
            meta: [e.event_date, 'Added dynamically'],
          }));
          setDbEvents(mapped);
        }
      } catch (err) {
        console.error('Failed to load dynamic events:', err);
      }
    };
    fetchEvents();
  }, []);

  const tabs = ['upcoming', 'past', 'workshops'];

  const staticEventCards: Record<string, Array<{ tag: string; tagClass: string; title: string; desc: string; meta: string[] }>> = {
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
        tag: 'Competition',
        tagClass: 'tag-blue',
        title: 'AI Triathlon',
        desc: 'A massive multi-stage club championship combining coding challenges, model optimisation, and rapid prototyping rounds. Participants pushed their limits across all three disciplines in a single high-energy event.',
        meta: ['Oct 2025', '50+ participants'],
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
        meta: ['Oct 2025', 'Hands-on coding'],
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

  const eventCards: Record<string, Array<{ tag: string; tagClass: string; title: string; desc: string; meta: string[] }>> = {
    upcoming: staticEventCards.upcoming,
    past: [...dbEvents, ...staticEventCards.past],
    workshops: staticEventCards.workshops,
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
        {featured && (
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
              <p className="text-sm text-muted-foreground mt-2 max-w-md">{featured.description}</p>
              {featured.status === 'registration_open' && (
                registeredEventIds.includes(featured.id) ? (
                  <button disabled className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-primary/20 text-primary border border-primary/20 cursor-not-allowed">
                    Already Registered
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedEvent(featured)}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 hover:scale-105 transition-all duration-300"
                  >
                    Register Now
                  </button>
                )
              )}
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
        )}

        {/* Search Bar for Live Events on Dedicated Page */}
        {!isHomepage && (
          <div className="relative w-full max-w-md mb-8">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <Search size={16} className="text-primary/60" />
            </span>
            <input
              type="text"
              placeholder="Search active events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/80 border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-muted-foreground hover:text-foreground">Clear</button>
            )}
          </div>
        )}

        {/* Tabs - Only displayed on dedicated page */}
        {!isHomepage && (
          <div className="flex gap-1 border-b border-border mb-10 flex-wrap">
            {['upcoming', 'past', 'workshops'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2.5 text-sm font-medium -mb-px transition-colors ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
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
        )}

        {/* Cards list */}
        {loadingEvents ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : displayedUpcomingEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No events found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {displayedUpcomingEvents.map((card, i) => (
                <motion.div
                  key={card.id || card.title}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
                  exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="glass-card relative overflow-hidden p-7 flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded bg-primary/10 text-primary border border-primary/20">{card.category}</span>
                    <h4 className="font-display font-bold text-lg text-foreground mt-4 mb-2">{card.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        {card.event_start_date && card.event_end_date && card.event_start_date !== card.event_end_date
                          ? `${card.event_start_date} to ${card.event_end_date}`
                          : card.event_start_date || card.event_date}
                      </span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span className="flex items-center gap-1.5">{card.venue}</span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span className="flex items-center gap-1.5 capitalize">{card.event_type} Event</span>
                    </div>

                    {card.status === 'registration_open' && (
                      registeredEventIds.includes(card.id) ? (
                        <button disabled className="mt-5 w-full py-2 text-xs font-semibold rounded-lg bg-primary/10 border border-primary/20 text-primary/50 cursor-not-allowed flex items-center justify-center gap-1.5">
                          Already Registered
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedEvent(card)}
                          className="mt-5 w-full py-2 text-xs font-semibold rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-1.5"
                        >
                          Register Now
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* View All Events CTA on Homepage */}
        {isHomepage && (
          <div className="flex justify-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-all shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:scale-105 duration-300"
            >
              View Events Archive &amp; Workshops <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* ── Past Events Section ──────────────────────────────────────── */}
        {!isHomepage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-24"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-px bg-primary/50" />
              <p className="section-label" style={{ marginBottom: 0 }}>Past Events</p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <h3 className="font-display font-extrabold text-foreground" style={{ fontSize: 'clamp(22px, 3vw, 34px)' }}>
                Events Archive
              </h3>
              <div className="relative w-full sm:max-w-xs">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Search size={14} className="text-primary/60" />
                </span>
                <input
                  type="text"
                  placeholder="Search archive..."
                  value={pastSearchQuery}
                  onChange={(e) => setPastSearchQuery(e.target.value)}
                  className="w-full bg-secondary/85 border border-border rounded-xl pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                {pastSearchQuery && (
                  <button onClick={() => setPastSearchQuery('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[10px] text-muted-foreground hover:text-foreground">Clear</button>
                )}
              </div>
            </div>

            {loadingPastEvents ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>
            ) : filteredPastEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">No past events found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPastEvents.map((evt, i) => (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="relative overflow-hidden rounded-2xl flex flex-col"
                    style={{
                      background: 'linear-gradient(145deg, hsl(217 30% 12%), hsl(217 20% 9%))',
                      border: '1px solid hsl(217 30% 20%)',
                      boxShadow: '0 4px 24px hsl(217 91% 60% / 0.05)',
                    }}
                  >
                    {/* Top color strip by category */}
                    <div
                      className="h-1 w-full"
                      style={{
                        background: evt.category.toLowerCase().includes('competition') || evt.category.toLowerCase().includes('hackathon')
                          ? 'linear-gradient(90deg, hsl(340 90% 55%), hsl(20 90% 55%))'
                          : evt.category.toLowerCase().includes('speaker')
                          ? 'linear-gradient(90deg, hsl(260 90% 65%), hsl(217 91% 60%))'
                          : 'linear-gradient(90deg, hsl(160 90% 43%), hsl(217 91% 60%))',
                      }}
                    />

                    <div className="p-6 flex flex-col flex-1">
                      {/* Image placeholder */}
                      {evt.image_url ? (
                        <img src={evt.image_url} alt={evt.title} className="w-full h-36 object-cover rounded-lg mb-4" />
                      ) : (
                        <div
                          className="w-full h-32 rounded-lg mb-4 flex items-center justify-center text-2xl font-bold text-primary/20 select-none"
                          style={{ background: 'hsl(217 30% 15%)' }}
                        >
                          {evt.title.charAt(0)}
                        </div>
                      )}

                      {/* Category badge */}
                      <span className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full w-fit"
                        style={{ background: 'hsl(217 91% 60% / 0.12)', color: 'hsl(217 91% 70%)', border: '1px solid hsl(217 91% 60% / 0.2)' }}
                      >
                        {evt.category}
                      </span>

                      {/* Title */}
                      <h4 className="font-display font-bold text-base text-foreground mt-3 mb-2 leading-snug">
                        {evt.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                        {evt.description}
                      </p>

                      {/* Meta info */}
                      <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarDays size={12} className="text-primary/60" />
                          <span>{evt.date_label}</span>
                        </div>
                        {evt.speaker && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mic size={12} className="text-primary/60" />
                            <span>{evt.speaker}</span>
                          </div>
                        )}
                        {evt.participants && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <UsersRound size={12} className="text-primary/60" />
                            <span>{evt.participants}+ participants</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Registration Modal Overlay */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl overflow-y-auto max-h-[90vh] z-10"
              style={{ background: 'linear-gradient(135deg, hsl(217 91% 60% / 0.05), hsl(217 91% 60% / 0.02))' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X size={16} />
              </button>

              <h3 className="font-display font-extrabold text-foreground text-xl mb-1">Event Registration</h3>
              <p className="text-xs text-muted-foreground mb-4">Registering for: <span className="text-primary font-semibold">{selectedEvent.title}</span></p>

              {submitMessage && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium mb-4 ${
                    submitMessage.type === 'success' ? 'bg-accent/10 border border-accent/20 text-accent' : 'bg-destructive/10 border border-destructive/20 text-destructive'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              {loadingSchema ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="animate-spin text-primary" size={24} />
                  <span className="text-xs text-muted-foreground">Loading registration fields...</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* DYNAMIC FORM FIELDS */}
                  {formFields.map((field) => {
                    const isRequired = field.required;
                    return (
                      <div key={field.id}>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">
                          {field.label} {isRequired && <span className="text-destructive">*</span>}
                        </label>

                        {/* File Upload Field */}
                        {field.field_type === 'file' ? (
                          <div className="relative">
                            <label className="flex items-center justify-center gap-2 w-full bg-secondary border border-border border-dashed rounded-lg px-3 py-3 text-sm text-muted-foreground cursor-pointer hover:border-primary hover:text-foreground transition-colors">
                              <Upload size={16} />
                              <span>{uploadedFiles[field.id] ? uploadedFiles[field.id].name : field.placeholder || 'Choose File'}</span>
                              <input
                                type="file"
                                required={isRequired && !uploadedFiles[field.id]}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileChange(field.id, e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : field.field_type === 'dropdown' ? (
                          <select
                            required={isRequired}
                            value={responses[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors appearance-none"
                          >
                            <option value="" disabled>{field.placeholder || 'Select option...'}</option>
                            {field.options_json && JSON.parse(field.options_json).map((opt: string) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.field_type === 'checkbox' ? (
                          <div className="space-y-2 mt-1">
                            {field.options_json && JSON.parse(field.options_json).map((opt: string) => (
                              <label key={opt} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={(responses[field.id] || []).includes(opt)}
                                  onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)}
                                  className="rounded bg-secondary border border-border outline-none focus:ring-primary text-primary w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : field.field_type === 'radio' ? (
                          <div className="space-y-2 mt-1">
                            {field.options_json && JSON.parse(field.options_json).map((opt: string) => (
                              <label key={opt} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                <input
                                  type="radio"
                                  name={`radio-${field.id}`}
                                  checked={responses[field.id] === opt}
                                  onChange={() => handleInputChange(field.id, opt)}
                                  className="bg-secondary border border-border outline-none focus:ring-primary text-primary w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : field.field_type === 'textarea' ? (
                          <textarea
                            required={isRequired}
                            placeholder={field.placeholder || ''}
                            value={responses[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            rows={3}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors resize-none"
                          />
                        ) : (
                          // Standard input types (text, email, phone, number, date)
                          <input
                            type={field.field_type === 'phone' ? 'tel' : field.field_type}
                            required={isRequired}
                            placeholder={field.placeholder || ''}
                            value={responses[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* TEAM REGISTRATION SECTION */}
                  {selectedEvent.event_type === 'team' && (
                    <div className="mt-6 pt-4 border-t border-border space-y-4">
                      <h4 className="flex items-center gap-2 font-display font-bold text-sm text-foreground">
                        <Users size={16} className="text-primary" />
                        Team Details
                      </h4>
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">
                          Team Name <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="Enter unique team name"
                          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      {/* Team Members List */}
                      <div className="space-y-3">
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase">
                          Additional Team Members ({teamMembers.length + 1} / {selectedEvent.max_team_size || 4})
                        </label>
                        {teamMembers.map((member, idx) => (
                          <div key={idx} className="flex gap-2 items-center bg-secondary/30 p-3 rounded-lg border border-border/50 relative">
                            <div className="grid grid-cols-2 gap-2 w-full pr-6">
                              <input
                                type="text"
                                required
                                value={member.name}
                                onChange={(e) => {
                                  const updated = [...teamMembers];
                                  updated[idx].name = e.target.value;
                                  setTeamMembers(updated);
                                }}
                                placeholder="Member Name"
                                className="bg-secondary border border-border rounded-md px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                              />
                              <input
                                type="email"
                                required
                                value={member.email}
                                onChange={(e) => {
                                  const updated = [...teamMembers];
                                  updated[idx].email = e.target.value;
                                  setTeamMembers(updated);
                                }}
                                placeholder="Member Email"
                                className="bg-secondary border border-border rounded-md px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                              />
                            </div>
                            {teamMembers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTeamMember(idx)}
                                className="absolute right-2 p-1 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                        {teamMembers.length + 1 < (selectedEvent.max_team_size || 4) && (
                          <button
                            type="button"
                            onClick={addTeamMember}
                            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 mt-1"
                          >
                            + Add Team Member
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border/50">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Submitting Registration...
                        </>
                      ) : (
                        <>
                          Register for Event
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
