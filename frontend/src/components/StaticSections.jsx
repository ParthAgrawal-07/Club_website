export function Team() {
  return (
    <section id="team" className="fade-in visible">
      <div className="section-label">// 03 — Team</div>
      <h2>Meet the Team</h2>
      <div className="team-grid">
        <div className="member-card">
          <div className="member-avatar" style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>AR</div>
          <div className="member-name">Arjun Rao</div>
          <div className="member-role">President</div>
        </div>
        {/* Add the rest of your team members from the HTML here */}
      </div>
    </section>
  );
}

export function Resources() {
  return (
    <section id="resources" className="fade-in visible">
      <div className="section-label">// 04 — Resources</div>
      <h2>Learning Resources</h2>
      <div className="resource-row">
        <a href="#" className="resource-card">
          <div className="resource-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>🚀</div>
          <div><div className="resource-title">Machine Learning Foundations</div><div className="resource-sub">From PyTorch to deployment pipelines.</div></div>
        </a>
        <a href="#" className="resource-card">
          <div className="resource-icon" style={{ background: 'rgba(6,214,160,0.15)' }}>⚙️</div>
          <div><div className="resource-title">Embedded Systems Toolkit</div><div className="resource-sub">Guides for MATLAB, Keil, and ESP8266.</div></div>
        </a>
      </div>
    </section>
  );
}

export function Blog() {
  return (
    <section id="blog" className="fade-in visible">
       {/* Paste your Blog HTML here, remembering to change 'class' to 'className' */}
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer-logo">Neural<span>Node</span></div>
      <div className="footer-copy">© 2026 NeuralNode AI Club</div>
    </footer>
  );
}
