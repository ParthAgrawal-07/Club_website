import { useState, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Send, User, Mail, GraduationCap, Star } from 'lucide-react';
import { getApiUrl } from '@/lib/utils';

interface FormData {
  name: string;
  email: string;
  branch: string;
  interest: string;
  reason: string;
}

export default function JoinForm() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', branch: '', interest: '', reason: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    try {
      const response = await fetch(getApiUrl('/api/apply'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', branch: '', interest: '', reason: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Failed to connect to the server. Please try again.');
    }
  };

  return (
    <section id="join" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      >
        <div
          className="rounded-3xl p-8 md:p-16 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(217 91% 60% / 0.10), hsl(340 82% 55% / 0.05))',
            border: '1px solid hsl(217 91% 60% / 0.2)',
          }}
        >
          {/* Decorative background orbs */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/10 filter blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-accent/10 filter blur-3xl pointer-events-none" />

          <p className="section-label text-center">06 — Join Us</p>
          <h2 className="font-display font-extrabold text-foreground text-center mb-4" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Ready to Build the Future?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-12 text-center leading-relaxed">
            Whether you're a complete beginner or a seasoned builder, AI Club DAIICT has a place for you. Submit your application below!
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto text-left space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium tracking-wide flex items-center gap-1.5">
                  <User size={13} className="text-primary" /> Full Name
                </label>
                <div className={`relative rounded-lg border transition-all duration-300 ${focusedField === 'name' ? 'border-primary shadow-[0_0_15px_hsl(217_91%_60%/0.12)]' : 'border-border bg-surface'}`}>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="Enter your name"
                    className="w-full bg-transparent px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium tracking-wide flex items-center gap-1.5">
                  <Mail size={13} className="text-primary" /> Email Address
                </label>
                <div className={`relative rounded-lg border transition-all duration-300 ${focusedField === 'email' ? 'border-primary shadow-[0_0_15px_hsl(217_91%_60%/0.12)]' : 'border-border bg-surface'}`}>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="yourname@daiict.ac.in"
                    className="w-full bg-transparent px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch / Year */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium tracking-wide flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-primary" /> Branch &amp; Year
                </label>
                <div className={`relative rounded-lg border transition-all duration-300 ${focusedField === 'branch' ? 'border-primary shadow-[0_0_15px_hsl(217_91%_60%/0.12)]' : 'border-border bg-surface'}`}>
                  <input
                    name="branch"
                    type="text"
                    value={formData.branch}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('branch')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="e.g. B.Tech ICT 2nd Year"
                    className="w-full bg-transparent px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              {/* Interest Area */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium tracking-wide flex items-center gap-1.5">
                  <Star size={13} className="text-primary" /> Core Interest Area
                </label>
                <div className={`relative rounded-lg border transition-all duration-300 ${focusedField === 'interest' ? 'border-primary shadow-[0_0_15px_hsl(217_91%_60%/0.12)]' : 'border-border bg-surface'}`}>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('interest')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full bg-transparent px-4 py-3.5 text-sm text-foreground outline-none appearance-none cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" disabled className="text-muted-foreground bg-card">Select your interest...</option>
                    <option className="bg-card text-foreground">NLP &amp; Large Language Models</option>
                    <option className="bg-card text-foreground">Computer Vision &amp; Robotics</option>
                    <option className="bg-card text-foreground">Reinforcement Learning &amp; Agents</option>
                    <option className="bg-card text-foreground">Generative AI &amp; Creative Tech</option>
                    <option className="bg-card text-foreground">MLOps &amp; AI Engineering</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">▼</div>
                </div>
              </div>
            </div>

            {/* Why do you want to join */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium tracking-wide">
                Why do you want to join AI Club? (optional)
              </label>
              <div className={`relative rounded-lg border transition-all duration-300 ${focusedField === 'reason' ? 'border-primary shadow-[0_0_15px_hsl(217_91%_60%/0.12)]' : 'border-border bg-surface'}`}>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('reason')}
                  onBlur={() => setFocusedField(null)}
                  rows={4}
                  placeholder="Share a bit about your motivation, background, or what you hope to build..."
                  className="w-full bg-transparent px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 resize-y"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-primary-hover text-primary-foreground font-bold text-sm tracking-wide shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: status === 'submitting' ? 1 : 1.015 }}
              whileTap={{ scale: 0.985 }}
            >
              {status === 'submitting' ? (
                <>Saving Application...</>
              ) : (
                <>
                  Submit Application <Send size={14} />
                </>
              )}
            </motion.button>

            {/* Notifications */}
            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm"
                >
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Application Received Successfully!</span>
                    Welcome! We will review your details and reach out via email for the next onboarding steps.
                  </div>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm"
                >
                  <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Submission Error</span>
                    {errorMessage}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
