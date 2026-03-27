import React, { useState, useEffect } from 'react';
import { Calendar, Users, Database, ArrowLeft, Loader2, Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState([]);

  // Fetch Logic
  useEffect(() => {
    if (activeTab === 'apps') {
      fetch('http://localhost:8000/api/admin/applications')
        .then(res => res.json())
        .then(data => setApps(data))
        .catch(err => console.error("Cluster connection failed:", err));
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-blue-500 uppercase">
              Admin <span className="text-white">Terminal</span>
            </h1>
            <p className="text-slate-400 font-medium">NeuralNode System Operations</p>
          </div>
          <Link to="/" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-full transition-all text-sm">
            <ArrowLeft size={16} /> Return to Home
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Navigation */}
          <div className="flex border-b border-white/10 bg-black/40">
            <button 
              onClick={() => setActiveTab('events')}
              className={`flex-1 p-6 flex items-center justify-center gap-3 font-bold transition-all ${activeTab === 'events' ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <Zap size={20} /> Event Post
            </button>
            <button 
              onClick={() => setActiveTab('apps')}
              className={`flex-1 p-6 flex items-center justify-center gap-3 font-bold transition-all ${activeTab === 'apps' ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <Users size={20} /> Applicants
            </button>
          </div>

          <div className="p-8 md:p-12">
            {activeTab === 'events' ? (
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">Event Title</label>
                    <input type="text" placeholder="AI Workshop..." className="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-blue-500 outline-none" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">Date</label>
                      <input type="date" className="w-full bg-black/50 border border-white/10 p-4 rounded-xl outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">Winner</label>
                      <input type="text" placeholder="Name..." className="w-full bg-black/50 border border-white/10 p-4 rounded-xl outline-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">Detailed Summary</label>
                    <textarea placeholder="The AI recap agent will use this text..." className="w-full bg-black/50 border border-white/10 p-4 rounded-xl h-40 outline-none" />
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all">
                   <Database size={20} /> UPDATE CLUSTER
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Award size={20} className="text-blue-500" /> Current Applicants</h3>
                <div className="grid gap-4">
                  {apps.length > 0 ? apps.map((app, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{app.name}</p>
                        <p className="text-sm text-slate-400">{app.email}</p>
                      </div>
                      <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 uppercase">Pending Review</span>
                    </div>
                  )) : (
                    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                      <p className="text-slate-500 italic">No nodes detected in the application cluster.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
