"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, Database, ShieldAlert, ArrowUpRight, Loader2, User, X, Table, Globe, FileText } from "lucide-react";

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
  const [showDataSources, setShowDataSources] = useState(false);
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
      setMessages([...newMessages, {
        role: "assistant",
        content: data.reply || "I encountered an issue processing your request. Please try again."
      }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please check your network and try again." }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-black">$1</strong>');
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return <p key={i} className="pl-4 text-[13.5px] leading-relaxed text-black" dangerouslySetInnerHTML={{ __html: `<span class="text-black mr-2">•</span>${line.slice(2)}` }} />;
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-[13.5px] leading-relaxed text-black" dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  const dataSources = [
    { name: "Insurance Cases", table: "insurance_cases", icon: <ShieldAlert size={14} />, description: "Patient insurance verifications and PA cases" },
    { name: "Startup Profiles", table: "startup_profiles", icon: <Globe size={14} />, description: "Onboarded healthtech startups" },
    { name: "Sales Pipeline", table: "sales_pipeline", icon: <Table size={14} />, description: "Deal tracking and buyer pipeline" },
    { name: "Marketplace Matches", table: "marketplace_matches", icon: <Sparkles size={14} />, description: "AI-matched buyer–startup connections" },
    { name: "GTM Recommendations", table: "gtm_recommendations", icon: <FileText size={14} />, description: "AI-generated go-to-market strategies" },
    { name: "Gemini 2.0 Flash API", table: "External API", icon: <Bot size={14} />, description: "LLM-powered analysis and generation" },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-[1100px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-md">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-black tracking-tight">AI Copilot</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11.5px] text-black font-medium">
                {isLoading ? "Thinking…" : "Connected · Gemini 2.0 Flash"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMessages([{ role: "assistant", content: "Chat cleared. How can I help you?" }])}
            className="btn-ghost text-[12.5px]"
          >
            Clear
          </button>
          <button
            onClick={() => setShowDataSources(true)}
            className="btn-secondary flex items-center gap-1.5 text-[12.5px] py-1.5 px-3"
          >
            <Database size={13} /> Data Sources
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white border border-black rounded-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex justify-center mb-2">
            <div className="px-3 py-1 rounded-full bg-white border border-black text-[11px] text-black font-medium">
              Today
            </div>
          </div>

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex gap-3 max-w-[82%]">
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div className={
                    msg.role === 'user'
                      ? "bg-black text-white px-4 py-3 rounded-2xl rounded-br-sm text-[13.5px] leading-relaxed font-medium"
                      : "bg-[#fafafa] border border-black px-4 py-3 rounded-2xl rounded-bl-sm space-y-1"
                  }>
                    {msg.role === 'user'
                      ? <p className="text-[13.5px] leading-relaxed">{msg.content}</p>
                      : renderContent(msg.content)
                    }
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-white border border-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User size={14} className="text-black" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-[#fafafa] border border-black px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin text-black" />
                  <span className="text-[13px] text-black">Analyzing…</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 pt-2 pl-11">
              {[
                { text: "Analyze top denial reasons and suggest fixes", icon: <ShieldAlert size={11} /> },
                { text: "Compare payer performance for Blue Cross vs Aetna", icon: <Sparkles size={11} /> },
                { text: "What GTM strategy works for AI radiology startups?", icon: <ArrowUpRight size={11} /> },
                { text: "Explain VOB verification process step by step", icon: <Database size={11} /> },
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s.text)}
                  className="flex items-center gap-1.5 text-[12px] bg-white border border-black hover:border-black hover:bg-white text-black hover:text-black px-3 py-2 rounded-lg transition-all font-medium"
                >
                  {s.icon} {s.text}
                </button>
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-black bg-white">
          <div className="relative">
            <textarea
              ref={inputRef}
              className="w-full bg-[#fafafa] border border-black rounded-xl px-4 py-3 pr-12 text-[13.5px] text-black placeholder:text-black focus:outline-none focus:border-black focus:bg-white transition-all resize-none min-h-[52px] leading-relaxed"
              placeholder="Ask Copilot about RCM, VOB, denials, GTM strategy…"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-black hover:bg-zinc-800 text-white flex items-center justify-center transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <p className="text-[11px] text-black">
              Powered by Gemini 1.5 Pro · AI may make mistakes. Verify critical information.
            </p>
            <span className="text-[10.5px] text-black font-mono border border-black px-1.5 py-0.5 rounded bg-white">Enter ↵</span>
          </div>
        </div>
      </div>

      {/* Data Sources Modal */}
      <AnimatePresence>
        {showDataSources && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDataSources(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white border border-black rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[16px] font-bold text-black">Connected Data Sources</h3>
                  <p className="text-[12px] text-black mt-0.5">Copilot queries these sources for intelligent answers.</p>
                </div>
                <button onClick={() => setShowDataSources(false)} className="text-black hover:text-black transition-colors"><X size={18} /></button>
              </div>
              <div className="space-y-2">
                {dataSources.map((ds) => (
                  <div key={ds.table} className="flex items-center gap-4 p-3 rounded-xl bg-white border border-black hover:bg-white transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-white border border-black flex items-center justify-center text-black">
                      {ds.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-black">{ds.name}</p>
                      <p className="text-[11px] text-black">{ds.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-[10.5px] text-black font-medium">Active</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-white border border-black text-[11px] text-black flex items-start gap-2">
                <Database size={12} className="mt-0.5 flex-shrink-0" />
                <span>All data is accessed in real-time from your Supabase database. No data is stored by the AI model.</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
