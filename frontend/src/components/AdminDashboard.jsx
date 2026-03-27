import React, { useState } from 'react';
// If Lucide is causing errors, comment these out temporarily
// import { Calendar, Users, PlusCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('events');

  return (
    <div className="min-h-screen bg-slate-50 p-10 pt-32"> {/* Added pt-32 to clear the Navbar */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
        
        {/* Tab Headers */}
        <div className="flex bg-slate-900 text-white">
          <button 
            onClick={() => setActiveTab('events')}
            className={`flex-1 p-4 font-bold ${activeTab === 'events' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            Manage Events
          </button>
          <button 
            onClick={() => setActiveTab('apps')}
            className={`flex-1 p-4 font-bold ${activeTab === 'apps' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            Applications
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 text-slate-800">
          {activeTab === 'events' ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-blue-700">Add New Event</h2>
              <p className="text-sm text-slate-500">Enter details to update the AI Agent.</p>
              
              <div className="grid gap-4">
                <input placeholder="Event Name" className="p-3 border rounded-lg bg-white" />
                <textarea placeholder="Event Summary" className="p-3 border rounded-lg h-32" />
                <button className="bg-blue-600 text-white p-4 rounded-lg font-bold">
                  Publish to Database
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold">Member Applications</h2>
              <p className="mt-4 text-slate-400 italic">No applications found in MongoDB yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
