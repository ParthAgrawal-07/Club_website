import React, { useState } from 'react';
import { Zap, Users, Database, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('events');

  // Inline style for the background to ensure it's never white
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
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '32px', color: '#3b82f6' }}>COMMAND CENTER</h1>
            <p style={{ color: '#6b7fa8', fontSize: '14px' }}>System Administration & Node Management</p>
          </div>
          <Link to="/" className="btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }}>
            <ArrowLeft size={14} style={{ marginRight: '8px' }} /> Return
          </Link>
        </div>

        {/* Dashboard Box */}
        <div className="admin-glass">
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(99,179,255,0.12)' }}>
            <button 
              onClick={() => setActiveTab('events')}
              style={{ 
                flex: 1, padding: '20px', border: 'none', background: activeTab === 'events' ? 'rgba(59,130,246,0.1)' : 'transparent',
                color: activeTab === 'events' ? '#3b82f6' : '#6b7fa8', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              <Zap size={18} style={{ marginBottom: '-4px', marginRight: '8px' }} /> Update Events
            </button>
            <button 
              onClick={() => setActiveTab('apps')}
              style={{ 
                flex: 1, padding: '20px', border: 'none', background: activeTab === 'apps' ? 'rgba(59,130,246,0.1)' : 'transparent',
                color: activeTab === 'apps' ? '#3b82f6' : '#6b7fa8', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              <Users size={18} style={{ marginBottom: '-4px', marginRight: '8px' }} /> Review Applicants
            </button>
          </div>

          {/* Form Content */}
          <div style={{ padding: '40px' }}>
            {activeTab === 'events' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label>EVENT IDENTITY</label>
                  <input type="text" className="admin-input" placeholder="e.g. Neural Summit 2026" />
                </div>
                
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>TIMESTAMP</label>
                    <input type="date" className="admin-input" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>TOP PERFORMER</label>
                    <input type="text" className="admin-input" placeholder="Winner name..." />
                  </div>
                </div>

                <div className="form-group">
                  <label>EXECUTIVE SUMMARY</label>
                  <textarea className="admin-input" style={{ height: '150px' }} placeholder="Provide a detailed recap for the AI agent..."></textarea>
                </div>

                <button className="admin-btn">
                  <Database size={18} style={{ marginBottom: '-4px', marginRight: '10px' }} /> 
                  SYNC TO MONGODB CLUSTER
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7fa8' }}>
                <Users size={48} style={{ marginBottom: '20px', opacity: 0.2 }} />
                <p>No new node applications detected in the database.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
