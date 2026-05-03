"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, Database, ShieldAlert, ArrowUpRight, Loader2, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Copilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm **MediFlow Copilot**, your healthcare intelligence assistant. I have deep knowledge of revenue cycle management, insurance verification, denial prevention, and GTM strategy.\n\nAsk me anything — from drafting a claim appeal to analyzing payer performance."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "I encountered an issue processing your request. Please try again." }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please check your network and try again." }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    setTimeout(() => handleSend(), 100);
  };

  // Simple markdown-like renderer
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      // Bullet points
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return <p key={i} className="pl-4 text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: `<span class="text-white/20 mr-2">•</span>${line.slice(2)}` }} />;
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-[1200px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Bot size={20} className="text-black" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-white tracking-tight">AI Copilot</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[12px] text-white/40 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52,211,153)]"></span>
                {isLoading ? "Thinking..." : "Connected to Gemini 1.5 Pro"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMessages([{ role: "assistant", content: "Chat cleared. How can I help you?" }])}
            className="btn-ghost flex items-center gap-1 text-[12px]"
          >
            Clear Chat
          </button>
          <button className="btn-ghost flex items-center gap-1 text-[12px]">
            <Database size={14} /> Data Sources
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col relative border-white/[0.08]">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 relative">
          <div className="flex justify-center mb-4">
            <div className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.1] text-[11px] text-white/20 font-medium">
              Today
            </div>
          </div>
          
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex gap-3 max-w-[80%]">
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.1] flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  
                  <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}>
                    {renderContent(msg.content)}
                  </div>
                  
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.1] flex items-center justify-center flex-shrink-0 mt-1 text-white text-[10px] font-bold">
                      <User size={14} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.1] flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="chat-bubble-assistant flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-white/40" />
                  <span className="text-[12px] text-white/40">Analyzing...</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Suggestions — only show when it's the initial state */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 pt-4 justify-start pl-11">
              {[
                { text: "Analyze top denial reasons and suggest fixes", icon: <ShieldAlert size={12} /> },
                { text: "Compare payer performance for Blue Cross vs Aetna", icon: <Sparkles size={12} /> },
                { text: "What GTM strategy works for AI radiology startups?", icon: <ArrowUpRight size={12} /> },
                { text: "Explain VOB verification process step by step", icon: <Database size={12} /> },
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(suggestion.text); }}
                  className="flex items-center gap-2 text-[12px] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] text-white/40 px-3 py-2 rounded-lg transition-all font-medium hover:text-white"
                >
                  {suggestion.icon}
                  {suggestion.text}
                </button>
              ))}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/[0.04] bg-[#0d0d15]/50 z-10 relative">
          <div className="relative">
            <textarea 
              ref={inputRef}
              className="input-field pr-12 min-h-[56px] py-4 resize-none leading-relaxed"
              placeholder="Ask Copilot about RCM, VOB, denials, GTM strategy..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-white hover:bg-white/80 text-black flex items-center justify-center transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="ml-0.5" />}
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <p className="text-[10px] text-[#5e5d6b]">
              Powered by Gemini 1.5 Pro · AI can make mistakes. Consider verifying critical intelligence.
            </p>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-[#5e5d6b] font-mono border border-white/[0.06] px-1.5 py-0.5 rounded bg-white/[0.02]">Enter ↵</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
