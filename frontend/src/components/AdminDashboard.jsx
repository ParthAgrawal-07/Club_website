import React, { useState, useEffect } from 'react';
import { Zap, Users, Database, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 
  
  // 1. UPDATED: Field names now match your FastAPI Pydantic model exactly
  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    winners: '',
    summary: '',
    key_highlights: '' // Added missing field
  });

  const [apps, setApps] = useState([]);

  // 2. UPDATED: Corrected endpoint to /applications and added basic error handling
  useEffect(() => {
    if (activeTab === 'apps') {
      setLoading(true);
      fetch('https://club-website-7aay.vercel.app/api/admin/applications')
        .then(res => res.json())
        .then(data => {
          setApps(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Cluster access denied:", err);
          setLoading(false);
        });
    }
  }, [activeTab]);

  const handleSync = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('https://club-website-7aay.vercel.app/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        // Reset form with correct keys
        setFormData({ event_name: '', event_date: '', winners: '', summary: '', key_highlights: '' });
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Sync Error:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    backgroundColor: '#050810',
    minHeight: '100vh',
    paddingTop: '120px',
    paddingBottom: '60px',
    color: '#e2eaff'
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '32px', color: '#3b82f6', letterSpacing: '-1px' }}>
              COMMAND <span style={{ color: '#fff' }}>CENTER</span>
            </h1>
            <p style={{ color: '#6b7fa8', fontSize: '14px', marginTop: '4px' }}>NeuralNode System Administration</p>
          </div>
          <Link to="/" className="btn-outline" style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={14} style={{ marginRight: '8px' }} /> RETURN TO TERMINAL
          </Link>
        </div>

        <div className="admin-glass">
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(99,179,255,0.12)', background: 'rgba(0,0,0,0.2)' }}>
            <button 
              onClick={() => setActiveTab('events')}
              style={{ 
                flex: 1, padding: '20px', border: 'none', 
                background: activeTab === 'events' ? 'rgba(59,130,246,0.1)' : 'transparent',
                color: activeTab === 'events' ? '#3b82f6' : '#6b7fa8', 
                fontWeight: '700', cursor: 'pointer', transition: '0.2s',
                borderBottom: activeTab === 'events' ? '2px solid #3b82f6' : '2px solid transparent'
              }}
            >
              <Zap size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> EVENT INTELLIGENCE
            </button>
            <button 
              onClick={() => setActiveTab('apps')}
              style={{ 
                flex: 1, padding: '20px', border: 'none', 
                background: activeTab === 'apps' ? 'rgba(59,130,246,0.1)' : 'transparent',
                color: activeTab === 'apps' ? '#3b82f6' : '#6b7fa8', 
                fontWeight: '700', cursor: 'pointer', transition: '0.2s',
                borderBottom: activeTab === 'apps' ? '2px solid #3b82f6' : '2px solid transparent'
              }}
            >
              <Users size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> NODE APPLICANTS
            </button>
          </div>

          <div style={{ padding: '40px' }}>
            {activeTab === 'events' ? (
              <form onSubmit={handleSync} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div className="form-group">
                  <label style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>EVENT IDENTITY</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. AI Triathlon 2026"
                    value={formData.event_name}
                    onChange={(e) => setFormData({...formData, event_name: e.target.value})}
                    required 
                  />
                </div>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>TIMESTAMP</label>
                    <input 
                      type="date" 
                      className="admin-input" 
                      value={formData.event_date}
                      onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>TOP PERFORMERS</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="e.g. Team Alpha, Node Ninja"
                      value={formData.winners}
                      onChange={(e) => setFormData({...formData, winners: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* 3. NEW: Added Key Highlights input to satisfy backend requirements */}
                <div className="form-group">
                  <label style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>KEY HIGHLIGHTS</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="e.g. 50+ participants, Neural Network workshop"
                    value={formData.key_highlights}
                    onChange={(e) => setFormData({...formData, key_highlights: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ color: '#3b82f6', fontSize: '11px', fontWeight: '800', marginBottom: '8px', display: 'block' }}>EXECUTIVE SUMMARY</label>
                  <textarea 
                    className="admin-input" 
                    style={{ minHeight: '120px' }} 
                    placeholder="Detailed recap for the AI agent..."
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="admin-btn" 
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Database size={18} />}
                  {loading ? "SYNCING..." : "SYNC TO MONGODB CLUSTER"}
                </button>

                {status === 'success' && (
                  <div style={{ color: '#06d6a0', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }}>
                    <CheckCircle size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    DATABASE UPDATED SUCCESSFULLY
                  </div>
                )}

                {status === 'error' && (
                  <div style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }}>
                    <AlertCircle size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    SYNC FAILED: CHECK CONSOLE OR MODEL FIELDS
                  </div>
                )}
              </form>
            ) : (
              <div style={{ minHeight: '300px' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', paddingTop: '100px' }}><Loader2 className="animate-spin" size={32} color="#3b82f6" /></div>
                ) : apps.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {apps.map((app, index) => (
                      <div key={index} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontWeight: '700', margin: 0 }}>{app.name || 'Unknown Node'}</p>
                          <p style={{ fontSize: '12px', color: '#6b7fa8', margin: 0 }}>{app.email || 'No email provided'}</p>
                        </div>
                        <span style={{ fontSize: '10px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(59,130,246,0.2)' }}>PENDING</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7fa8' }}>
                    <Users size={48} style={{ marginBottom: '20px', opacity: 0.1 }} />
                    <p style={{ fontSize: '14px', fontStyle: 'italic' }}>No new node applications detected in the cluster.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
