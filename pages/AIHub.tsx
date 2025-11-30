
import React, { useState, useRef, useEffect } from 'react';
import { AppRoute } from '../types';
import { Sparkles, Send, Mic, Image } from 'lucide-react';

interface AIHubProps {
  onNavigate: (route: AppRoute) => void;
}

export const AIHub: React.FC<AIHubProps> = ({ onNavigate }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am Paradise AI. How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "I am a demo AI for Paradise Super App. In the future, I will be connected to advanced models like Gemini to assist you with trading, shopping, and more!" 
      }]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center gap-3 shadow-md sticky top-0 z-10 border-b border-gray-700">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 flex items-center justify-center text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">Paradise AI</h1>
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-teal-600 text-white rounded-tr-none' 
                : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 border border-gray-700 flex gap-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="flex items-end gap-2 bg-gray-800 p-2 rounded-2xl border border-gray-700">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Image size={20} />
          </button>
          <textarea 
            className="flex-1 bg-transparent text-white text-sm outline-none resize-none max-h-32 py-2"
            rows={1}
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          {input.trim() ? (
            <button 
              onClick={handleSend}
              className="p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-colors"
            >
              <Send size={18} />
            </button>
          ) : (
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
