import React, { useState } from 'react';
import { PlusCircle, CheckCircle } from 'lucide-react';

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    event_name: '',
    event_date: '',
    summary: '',
    winners: '',
    key_highlights: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/admin/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('✅ Event Published Successfully!');
        setFormData({ event_name: '', event_date: '', summary: '', winners: '', key_highlights: '' });
      }
    } catch (err) {
      setStatus('❌ Error: Could not reach the server.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-lg border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <PlusCircle className="text-blue-600" /> Post New Event
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input 
            className="p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Event Name (e.g. AI Triathlon)"
            value={formData.event_name}
            onChange={(e) => setFormData({...formData, event_name: e.target.value})}
            required
          />
          <input 
            type="date"
            className="p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.event_date}
            onChange={(e) => setFormData({...formData, event_date: e.target.value})}
            required
          />
        </div>
        
        <textarea 
          className="w-full p-3 border rounded-xl bg-slate-50 h-24 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Detailed Summary for AI to read..."
          value={formData.summary}
          onChange={(e) => setFormData({...formData, summary: e.target.value})}
          required
        />
        
        <input 
          className="w-full p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Winners (Team Names)"
          value={formData.winners}
          onChange={(e) => setFormData({...formData, winners: e.target.value})}
        />

        <textarea 
          className="w-full p-3 border rounded-xl bg-slate-50 h-20 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Key Highlights (Bullet points for the chatbot)"
          value={formData.key_highlights}
          onChange={(e) => setFormData({...formData, key_highlights: e.target.value})}
        />

        <button 
          type="submit" 
          className="w-full py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all flex justify-center items-center gap-2"
        >
          {status.includes('✅') ? <CheckCircle size={20} /> : <PlusCircle size={20} />}
          Update AI Agent Knowledge
        </button>
      </form>
      
      {status && <p className="mt-4 text-center font-semibold text-sm">{status}</p>}
    </div>
  );
}
