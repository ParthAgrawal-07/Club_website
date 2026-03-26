import React, { useState, useEffect } from 'react';
import { Calendar, Users, ClipboardList, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'apps'
  const [apps, setApps] = useState([]);
  const [eventForm, setEventForm] = useState({ event_name: '', event_date: '', summary: '' });

  // Fetch applications when the tab changes
  useEffect(() => {
    if (activeTab === 'apps') {
      fetch('http://localhost:8000/api/admin/applications')
        .then(res => res.json())
        .then(data => setApps(data));
    }
  }, [activeTab]);

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
      {/* Sidebar/Tab Navigation */}
      <div className="flex bg-slate-900 text-white">
        <button 
          onClick={() => setActiveTab('events')}
          className={`flex-1 p-4 flex items-center justify-center gap-2 ${activeTab === 'events' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
        >
          <Calendar size={18} /> Manage Events
        </button>
        <button 
          onClick={() => setActiveTab('apps')}
          className={`flex-1 p-4 flex items-center justify-center gap-2 ${activeTab === 'apps' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
        >
          <Users size={18} /> View Applications
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'events' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><ClipboardList /> Post Event Recap</h2>
            {/* ... Reuse the Event Form from the previous step here ... */}
            <p className="text-sm text-slate-500 italic font-medium">This info will update the AI Chatbot instantly.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Recent Applications</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-slate-400 text-sm">
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr key={app._id} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-medium">{app.name}</td>
                      <td className="p-3 text-slate-600">{app.email}</td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Received</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
