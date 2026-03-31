import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! How can I help you navigate the AI Club today?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue('');
    setIsLoading(true);
    try {
      const res = await fetch('https://club-website-7aay.vercel.app/api/club-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      if (!res.ok) throw new Error('fail');
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, I couldn\'t connect to the server right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      {isOpen && (
        <div className="w-[360px] max-h-[500px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
          style={{ boxShadow: '0 25px 60px -15px hsl(217 91% 60% / 0.2)' }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot size={16} className="text-primary" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">NeuralNode Assistant</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[320px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={12} className="text-primary" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground'
                }`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={12} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Loader2 size={12} className="text-primary animate-spin" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full btn-glow flex items-center justify-center text-primary-foreground transition-all"
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </div>
  );
}
