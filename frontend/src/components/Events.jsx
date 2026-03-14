import { useState, useEffect } from 'react';

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const target = new Date('2026-04-05T09:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
          h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
          m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
          s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="events" className="fade-in visible">
      <div className="section-label">// 01 — Events</div>
      <h2>Events & Workshops</h2>

      <div className="event-highlight">
        <div>
          <div className="card-tag tag-green" style={{ marginBottom: '12px' }}>Next Up</div>
          <div className="card-title" style={{ fontSize: '22px' }}>GenAI Hackathon 2026</div>
          <div className="card-body" style={{ maxWidth: '480px' }}>48-hour hackathon building with the latest generative AI APIs. Prizes, mentors, and free pizza. Open to all branches.</div>
        </div>
        <div>
          <div className="event-countdown">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div className="cdown-block" key={unit}>
                <span className="cdown-val">{value}</span>
                <span className="cdown-label">{unit === 'd' ? 'Days' : unit === 'h' ? 'Hours' : unit === 'm' ? 'Mins' : 'Secs'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tab-bar">
        {['upcoming', 'past', 'workshops'].map(tab => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'past' && (
        <div className="tab-panel active">
          <div className="card-grid">
            <div className="card">
              <div className="card-tag tag-pink">Hackathon</div>
              <div className="card-title">AI Triathlon</div>
              <div className="card-body">A massive multi-stage club event combining coding challenges, model optimization, and rapid prototyping.</div>
              <div className="card-meta"><span>Late 2025</span><span className="dot"></span><span>Over 50 participants</span></div>
            </div>
            <div className="card">
              <div className="card-tag tag-blue">Talk</div>
              <div className="card-title">Transformers Deep-Dive</div>
              <div className="card-body">Prof. Aryan Mehta walked us through attention mechanisms and the Transformer architecture.</div>
              <div className="card-meta"><span>Feb 10, 2026</span><span className="dot"></span><span>80 attendees</span></div>
            </div>
          </div>
        </div>
      )}
      {/* Add similar conditional rendering for 'upcoming' and 'workshops' tabs based on your HTML */}
    </section>
  );
}
