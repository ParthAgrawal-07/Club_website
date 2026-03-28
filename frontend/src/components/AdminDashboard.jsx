import React, { useState } from 'react';
import { Zap, Users, Database, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(false);
  
  // 1. Create state for the form fields
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    winner: '',
    summary: ''
  });

  const handleSync = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("🚀 Cluster Updated Successfully!");
        setFormData({ title: '', date: '', winner: '', summary: '' }); // Clear form
      } else {
        alert("❌ Sync Failed. Check Backend logs.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Connection Error: Is your FastAPI server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... outer layout code ...
    {activeTab === 'events' ? (
      <form onSubmit={handleSync} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="form-group">
          <label>EVENT IDENTITY</label>
          <input 
            type="text" 
            className="admin-input" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="e.g. Neural Summit 2026" 
            required
          />
        </div>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>TIMESTAMP</label>
            <input 
              type="date" 
              className="admin-input" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>TOP PERFORMER</label>
            <input 
              type="text" 
              className="admin-input" 
              value={formData.winner}
              onChange={(e) => setFormData({...formData, winner: e.target.value})}
              placeholder="Winner name..." 
            />
          </div>
        </div>

        <div className="form-group">
          <label>EXECUTIVE SUMMARY</label>
          <textarea 
            className="admin-input" 
            style={{ height: '150px' }} 
            value={formData.summary}
            onChange={(e) => setFormData({...formData, summary: e.target.value})}
            placeholder="Provide a detailed recap..."
            required
          ></textarea>
        </div>

        <button type="submit" className="admin-btn" disabled={loading}>
          <Database size={18} style={{ marginBottom: '-4px', marginRight: '10px' }} /> 
          {loading ? "UPLOADING..." : "SYNC TO MONGODB CLUSTER"}
        </button>
      </form>
    ) : (
      // ... applicants list ...
    )}
  );
}
