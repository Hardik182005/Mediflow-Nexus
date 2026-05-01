"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, Database, ShieldAlert, ArrowUpRight } from "lucide-react";

export default function Copilot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello. I'm MediFlow Copilot, your healthcare intelligence assistant. I have secure access to your clinic operations, revenue cycle data, and GTM pipeline. How can I assist you today?"
    }
  ]);

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
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"></span>
                Connected to Data Nexus
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost flex items-center gap-1">
            <Database size={14} /> Data Sources
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col relative border-white/[0.08]">
        {/* Background Blur Effect - Removed for strict B&W */}

        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 relative">
          <div className="flex justify-center mb-8">
            <div className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.1] text-[11px] text-white/20 font-medium">
              Today
            </div>
          </div>
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex gap-3 max-w-[80%]">
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.1] flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                
                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}>
                  {msg.content}
                </div>
                
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.1] flex items-center justify-center flex-shrink-0 mt-1 text-white text-[10px] font-bold">
                    HH
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 pt-4 justify-start pl-11">
            {[
              { text: "Analyze recent denials", icon: <ShieldAlert size={12} /> },
              { text: "Draft appeal for CPT 99214", icon: <Sparkles size={12} /> },
              { text: "Forecast next month revenue", icon: <ArrowUpRight size={12} /> },
            ].map((suggestion, i) => (
              <button key={i} className="flex items-center gap-2 text-[12px] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] text-white/40 px-3 py-2 rounded-lg transition-all font-medium hover:text-white">
                {suggestion.icon}
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/[0.04] bg-[#0d0d15]/50 z-10 relative">
          <div className="relative">
            <textarea 
              className="input-field pr-12 min-h-[56px] py-4 resize-none leading-relaxed"
              placeholder="Ask Copilot..."
              rows={1}
            ></textarea>
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-white hover:bg-white/80 text-black flex items-center justify-center transition-colors">
              <Send size={14} className="ml-0.5" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <p className="text-[10px] text-[#5e5d6b]">
              AI can make mistakes. Consider verifying critical intelligence.
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
