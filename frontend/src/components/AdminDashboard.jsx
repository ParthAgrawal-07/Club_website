import React, { useState, useEffect } from 'react';
import { Calendar, Users, Send, Database, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState([]);

  // Fetch applications when on the Apps tab
  useEffect(() => {
    if (activeTab === 'apps') {
      fetch('http://localhost:8000/api/admin/applications')
        .then(res => res.json())
        .then(data => setApps(data))
        .catch(err => console.error("Error fetching apps:", err));
    }
  }, [activeTab]);

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Add your fetch logic here
    setTimeout(() => setLoading(false), 1500); // Simulation
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              COMMAND CENTER
            </h1>
            <p className="text-slate-400 mt-1">Manage AI Club operations and event intelligence.</p>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft size={16} /> Back to Terminal
          </Link>
        </div>

        {/* Glassmorphism Container */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-black/20">
            <button 
              onClick={() => setActiveTab('events')}
              className={`flex-1 p-5 flex items-center justify-center gap-3 font-bold transition-all ${activeTab === 'events' ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <Calendar size={20} /> Event Intelligence
            </button>
            <button 
              onClick={() => setActiveTab('apps')}
              className={`flex-1 p-5 flex items-center justify-center gap-3 font-bold transition-all ${activeTab === 'apps' ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <Users size={20} /> Node Applicants
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'events' ? (
              <form onSubmit={handleSubmitEvent} className="space-y-6 max-w-2xl mx-auto">
                <div className="space-y-4">
                  <div className="group">
                    <label className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">Event Identity</label>
                    <input type="text" placeholder="e.g. AI Triathlon 2026" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">Timestamp</label>
                      <input type="date" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 transition-all text-white" />
                    </div>
                    <div className="group">
                      <label className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">Top Performer</label>
                      <input type="text" placeholder="Winner Name" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 transition-all text-white" />
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">Executive Summary</label>
                    <textarea placeholder="Describe the key outcomes for the AI Agent..." className="w-full bg-black/40 border border-white/10 p-4 rounded-xl h-40 outline-none focus:border-blue-500 transition-all text-white" required />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Database size={20} /> SYNC TO CLUSTER</>}
                </button>
              </form>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-slate-500 text-xs uppercase tracking-widest">
                      <th className="px-6 py-2 text-left">Node Member</th>
                      <th className="px-6 py-2 text-left">Communication</th>
                      <th className="px-6 py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.length > 0 ? apps.map((app, i) => (
                      <tr key={i} className="bg-white/5 hover:bg-white/10 transition-colors">
                        <td className="px-6 py-4 rounded-l-xl font-bold">{app.name}</td>
                        <td className="px-6 py-4 text-slate-400">{app.email}</td>
                        <td className="px-6 py-4 text-right rounded-r-xl">
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-black border border-blue-500/30">PENDING</span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="text-center py-20 text-slate-500 italic">No nodes detected in the application cluster.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
