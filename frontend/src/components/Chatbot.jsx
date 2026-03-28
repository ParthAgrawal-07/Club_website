import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. State for the input field and conversation history
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you navigate the AI Club today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom of chat
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. The function that talks to your FastAPI Backend
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Make sure this URL matches your Vercel backend exactly
      const response = await fetch('https://club-website-7aay.vercel.app/api/club-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // IMPORTANT: The key MUST be 'message' to match your Python BaseModel
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Backend connection failed");

      const data = await response.json();
      
      // Add Gemini's reply to the UI
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, my neural link to the server is currently disrupted. Check your connection or the Vercel logs!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Allow sending with the Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {/* The Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'var(--accent, #3b82f6)', border: 'none', color: 'white',
          boxShadow: '0 8px 32px var(--glow, rgba(59,130,246,0.5))', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* The Chat Window */}
      {isOpen && (
        <div style={{
          position: 'absolute', bottom: '80px', right: '0',
          width: '350px', height: '450px',
          background: 'var(--surface, #1e293b)', border: '1px solid var(--border, #334155)',
          borderRadius: '20px', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          color: 'white'
        }}>
          {/* Header */}
          <div style={{ padding: '20px', background: 'rgba(59,130,246,0.1)', borderBottom: '1px solid var(--border, #334155)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={20} color="var(--accent, #3b82f6)" />
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>NeuralNode Assistant</span>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? 'var(--accent, #3b82f6)' : 'var(--surface2, #334155)', 
                color: 'white',
                padding: '10px 14px', 
                borderRadius: msg.sender === 'user' ? '14px 14px 0px 14px' : '14px 14px 14px 0px',
                maxWidth: '85%',
                lineHeight: '1.4'
              }}>
                {msg.text}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--surface2, #334155)', padding: '10px 14px', borderRadius: '14px 14px 14px 0px' }}>
                <Loader2 size={16} className="animate-spin" color="#3b82f6" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '15px', borderTop: '1px solid var(--border, #334155)', display: 'flex', gap: '10px', background: 'var(--surface, #1e293b)' }}>
            <input 
              type="text" 
              placeholder="Ask about AI Club events..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              style={{ 
                flex: 1, background: 'var(--bg2, #0f172a)', border: '1px solid var(--border, #334155)', 
                borderRadius: '8px', padding: '8px 12px', color: 'white', outline: 'none' 
              }} 
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              style={{ 
                background: inputValue.trim() ? 'var(--accent, #3b82f6)' : '#475569', 
                border: 'none', borderRadius: '8px', padding: '8px', color: 'white', 
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                transition: '0.2s'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
