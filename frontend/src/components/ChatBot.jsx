import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, Sparkles } from 'lucide-react';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "👋 Hi! I'm your AI Event Reporter. What would you like to know about the latest event?" }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "❌ Connection error. Is the backend running?" }]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-xl shadow-2xl overflow-hidden bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex items-center gap-2">
        <Sparkles size={18} />
        <h1 className="font-semibold">Event AI Agent</h1>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl text-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none shadow-sm'
            }`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t flex gap-2 bg-white">
        <input 
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask about highlights..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
