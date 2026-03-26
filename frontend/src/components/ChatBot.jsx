import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';

// Added 'contextType' prop to the component
export default function ChatBot({ contextType = "general" }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "👋 Hi! I'm your AI Club Assistant. How can I help you catch up on our latest events?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Now sending the contextType to the backend main.py
        body: JSON.stringify({ 
            message: input,
            context_type: contextType 
        }),
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "⚠️ Server is offline. Please check your FastAPI backend." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto border rounded-2xl shadow-lg overflow-hidden bg-white font-sans">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Bot size={22} />
            <span className="font-bold tracking-tight">AI Event Agent</span>
        </div>
        <Sparkles size={18} className="opacity-75" />
      </div>

      <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-2xl text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
            }`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                    <span className="text-xs text-slate-500 italic">Thinking...</span>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 border-t bg-white flex gap-2">
        <input 
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Ask about the AI Triathlon..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
            onClick={handleSend} 
            disabled={isLoading}
            className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
