import React, { useState, useRef, useEffect } from 'react';
import { ragApi } from '../../api/ragApi';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  HelpCircle,
  Minimize2,
  Maximize2,
  AlertCircle,
} from 'lucide-react';

export const FloatingRagAssistant = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I'm your StormBreakers Financial Intelligence Assistant. Ask me anything about financial concepts, investing terms, or how our health scores work!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const educationalPrompts = [
    'What is P/E ratio?',
    'Explain diversification.',
    'What is a SIP?',
    'How does StormBreaker calculate financial health?',
    'What does beta mean in stock risk?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !minimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, minimized]);

  const handleSend = async (customMessage) => {
    const textToSend = (customMessage || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await ragApi.askRag({ message: textToSend });
      if (res?.answer) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'ai',
            text: res.answer,
          },
        ]);
      } else {
        throw new Error('No answer received from RAG service');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: `⚠️ ${err.message || 'Unable to contact AI knowledge base. Please check that Backend 2 is running.'}`,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Glowing Circular Orb Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          aria-label="Open AI Intelligence Assistant"
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 p-3.5 rounded-full bg-gradient-to-tr from-brand-purple via-brand-pink to-brand-cyan text-white shadow-glow-purple hover:scale-105 transition-all duration-300 animate-bounce"
          style={{ animationDuration: '3s' }}
        >
          <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-bold text-xs pr-1">AI Assistant</span>
        </button>
      )}

      {/* Floating Glassmorphism Chat Panel Overlay */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            minimized
              ? 'bottom-6 right-6 w-72 h-14'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[85vh]'
          } rounded-2xl glass-card border border-brand-purple/40 shadow-2xl flex flex-col overflow-hidden bg-background-darker/95 backdrop-blur-2xl`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-brand-purple/20 to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-center text-brand-pink shadow-glow-purple">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  AI Intelligence
                  <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
                </span>
                <span className="text-[10px] text-slate-400">RAG Knowledge Engine</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(!minimized)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                title={minimized ? 'Expand' : 'Minimize'}
              >
                {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onToggle}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body (when not minimized) */}
          {!minimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-6 h-6 rounded-md bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-brand-purple flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-black font-semibold rounded-tr-none shadow-glow-cyan'
                          : msg.isError
                          ? 'bg-brand-coral/10 border border-brand-coral/30 text-brand-coral rounded-tl-none'
                          : 'bg-white/[0.04] border border-white/10 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 rounded-md bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan flex-shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-xs text-brand-purple bg-brand-purple/5 p-2 rounded-xl border border-brand-purple/20 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Retrieving verified financial knowledge...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Sample Educational Questions */}
              <div className="px-3 py-1.5 border-t border-white/5 bg-black/20 flex gap-1.5 overflow-x-auto no-scrollbar">
                {educationalPrompts.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    disabled={loading}
                    onClick={() => handleSend(prompt)}
                    className="whitespace-nowrap text-[10px] px-2 py-1 rounded-md bg-white/[0.03] border border-white/10 text-slate-400 hover:text-brand-purple hover:border-brand-purple/30 transition-all flex-shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 border-t border-white/10 flex gap-2 bg-background-darker/60"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a financial question..."
                  disabled={loading}
                  className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-xl text-white bg-brand-purple hover:bg-brand-purple/90 disabled:opacity-40 transition-all shadow-glow-purple flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
