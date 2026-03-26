import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, Info } from 'lucide-react';

export default function EventBot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! Missed the last AI Club event? Ask me for a recap!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const askAgent = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/club-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "Couldn't connect to the club server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto border-2 border-blue-100 rounded-3xl shadow-2xl overflow-hidden bg-white">
      {/* Club Themed Header */}
      <div className="bg-blue-700 p-5 text-white flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">AI Club Reporter</h2>
          <p className="text-xs text-blue-100 flex items-center gap-1">
            <Info size={12} /> Catch up on recent events
          </p>
        </div>
      </div>

      {/* Chat History */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
            }`}>
              <ReactMarkdown>{m.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Simple Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
        <input 
          className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="What happened at the Triathlon?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askAgent()}
        />
        <button 
          onClick={askAgent}
          className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-800 transition-transform active:scale-90"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
