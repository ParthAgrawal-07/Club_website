import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {/* 1. The Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'var(--accent)', border: 'none', color: 'white',
          boxShadow: '0 8px 32px var(--glow)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center'
        }}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* 2. The Chat Window */}
      {isOpen && (
        <div style={{
          position: 'absolute', bottom: '80px', right: '0',
          width: '350px', height: '450px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '20px', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          {/* Header */}
          <div style={{ padding: '20px', background: 'rgba(59,130,246,0.1)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={20} color="var(--accent)" />
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>NeuralNode Assistant</span>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', fontSize: '13px', color: 'var(--muted)' }}>
            <div style={{ background: 'var(--surface2)', padding: '10px', borderRadius: '10px', marginBottom: '10px', width: 'fit-content' }}>
              Hello! How can I help you navigate the AI Club today?
            </div>
          </div>

          {/* Input Area */}
          <div style={{ padding: '15px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Ask anything..." 
              style={{ 
                flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', 
                borderRadius: '8px', padding: '8px 12px', color: 'white', outline: 'none' 
              }} 
            />
            <button style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', padding: '8px', color: 'white', cursor: 'pointer' }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
