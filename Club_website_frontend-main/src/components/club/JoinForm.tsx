import { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    try {
      const response = await fetch('https://club-website-7aay.vercel.app/api/apply', {
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
      setErrorMessage('Failed to connect to the server.');
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
        <div className="rounded-3xl p-8 md:p-16 text-center"
          style={{ background: 'linear-gradient(135deg, hsl(217 91% 60% / 0.12), hsl(340 82% 55% / 0.06))', border: '1px solid hsl(217 91% 60% / 0.2)' }}
        >
          <p className="section-label">06 — Join Us</p>
          <h2 className="font-display font-extrabold text-foreground mb-4" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Ready to Build the Future?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
            Whether you're a complete beginner or a published researcher, AI Club DAIICT has a place for you.
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { name: 'name', label: 'Full Name', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
              ].map((field, i) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <label className="block text-xs text-muted-foreground mb-2 tracking-wide">{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name as keyof FormData]}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary outline-none transition-all duration-300 focus:shadow-[0_0_20px_hsl(217_91%_60%/0.15)]"
                  />
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <label className="block text-xs text-muted-foreground mb-2 tracking-wide">Branch / Year</label>
                <input name="branch" value={formData.branch} onChange={handleChange} required
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary outline-none transition-all duration-300 focus:shadow-[0_0_20px_hsl(217_91%_60%/0.15)]" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <label className="block text-xs text-muted-foreground mb-2 tracking-wide">Interest Area</label>
                <select name="interest" value={formData.interest} onChange={handleChange} required
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary outline-none transition-all duration-300 focus:shadow-[0_0_20px_hsl(217_91%_60%/0.15)]">
                  <option value="">Select...</option>
                  <option>NLP / LLMs</option>
                  <option>Computer Vision</option>
                  <option>Reinforcement Learning</option>
                  <option>Generative AI</option>
                  <option>MLOps / Deployment</option>
                </select>
              </motion.div>
            </div>
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label className="block text-xs text-muted-foreground mb-2 tracking-wide">Why do you want to join? (optional)</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} rows={3}
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary outline-none transition-all duration-300 resize-vertical focus:shadow-[0_0_20px_hsl(217_91%_60%/0.15)]" />
            </motion.div>
            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full btn-glow text-primary-foreground font-bold py-3.5 rounded-lg transition-all disabled:opacity-60"
              whileHover={{ scale: 1.02, boxShadow: '0 12px 40px hsl(217 91% 60% / 0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'submitting' ? 'Sending...' : 'Submit Application →'}
            </motion.button>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-4 p-4 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm"
              >
                <CheckCircle size={18} /> Your application has been received. We'll be in touch soon!
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
              >
                <AlertTriangle size={18} /> {errorMessage}
              </motion.div>
            )}
          </form>
        </div>
      </motion.div>
    </section>
  );
}
