import { useState } from 'react';

export default function Projects() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section id="projects" className="fade-in visible">
      <div className="section-label">// 02 — Projects</div>
      <h2>Student Projects</h2>

      <div className="tab-bar">
        {['all', 'nlp', 'hardware', 'rl'].map(tab => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="tab-panel active">
        <div className="card-grid">
          {(activeTab === 'all' || activeTab === 'hardware') && (
            <div className="card">
              <div className="card-tag tag-yellow">Hardware / IoT</div>
              <div className="card-title">AutoMed — Pill Dispenser</div>
              <div className="card-body">An automatic pill dispenser built with Arduino and ESP8266, featuring remote scheduling via a local network server.</div>
              <div className="proj-links"><a href="#" className="proj-link">GitHub</a></div>
            </div>
          )}
          {(activeTab === 'all' || activeTab === 'nlp') && (
            <div className="card">
              <div className="card-tag tag-blue">NLP</div>
              <div className="card-title">CampusBot — LLM Chatbot</div>
              <div className="card-body">A RAG-based chatbot trained on college documents. Deployed as a WhatsApp bot used by 500+ students.</div>
              <div className="proj-links"><a href="#" className="proj-link">GitHub</a></div>
            </div>
          )}
          {(activeTab === 'all' || activeTab === 'hardware') && (
            <div className="card">
              <div className="card-tag tag-green">Robotics</div>
              <div className="card-title">Autonomous Nav-Bot</div>
              <div className="card-body">A ROS-based mobile robot integrating LiDAR and depth cameras for real-time SLAM and obstacle avoidance.</div>
              <div className="proj-links"><a href="#" className="proj-link">GitHub</a></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
