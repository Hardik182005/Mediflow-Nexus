"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Mic, Sparkles, Lightbulb, FileText, BarChart3 } from "lucide-react";

const suggestions = [
  { title: "Revenue Summary", desc: "Show me this month's revenue analysis", icon: BarChart3 },
  { title: "Denial Risk Report", desc: "Which patients have the highest denial risk?", icon: FileText },
  { title: "Growth Opportunities", desc: "What services should we expand?", icon: Lightbulb },
  { title: "Marketplace Insights", desc: "Which startups match our clinic best?", icon: Sparkles },
];

const initialMessages = [
  { id: "1", role: "assistant" as const, content: "Hello! I'm MediFlow AI Copilot. I can help you analyze revenue patterns, predict denials, find marketplace matches, and optimize your clinic operations. How can I assist you today?" },
];

export default function CopilotPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: "user" as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const responses: Record<string, string> = {
        revenue: "📊 **Revenue Analysis - April 2025**\n\nTotal Revenue: **$415,000** (+4.3% MoM)\nRevenue at Risk: **$47,200** (-12.3%)\nRevenue Leakage: **$32,100** (-18.5%)\n\nTop performing CPT: **99215** ($97,470 total)\nHighest margin: **99215** at 66.7%\n\nRecommendation: Focus on reducing unbilled CPT codes ($12,400 leakage) and undercoded visits ($8,200 leakage).",
        denial: "⚠️ **High Denial Risk Patients:**\n\n1. **Michael Thompson** - Risk: 95%\n   - Coverage expired (Cigna)\n   - Needs updated insurance verification\n\n2. **James Rodriguez** - Risk: 82%\n   - PA not obtained for knee arthroscopy\n   - Missing MRI report\n\nAction: Submit PA for Rodriguez immediately and contact Thompson for updated insurance.",
        default: "I've analyzed your request. Based on the current data:\n\n• Clinic performance is trending upward with 4.3% revenue growth\n• 3 patients need immediate attention for insurance verification\n• 2 new marketplace matches discovered with 90%+ fit scores\n\nWould you like me to dive deeper into any of these areas?",
      };

      const key = input.toLowerCase().includes("revenue") ? "revenue" : input.toLowerCase().includes("denial") ? "denial" : "default";
      const aiMsg = { id: (Date.now() + 1).toString(), role: "assistant" as const, content: responses[key] };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Copilot</h1>
          <p className="text-xs text-surface-400">Powered by MediFlow Intelligence Engine</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}>
              <p className="text-sm whitespace-pre-line">{msg.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {suggestions.map((s) => (
            <button key={s.title} onClick={() => { setInput(s.desc); }} className="pipeline-card text-left flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <s.icon size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{s.title}</p>
                <p className="text-xs text-surface-400">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask MediFlow AI anything..."
            className="input-field pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button className="btn-ghost p-1.5"><Mic size={16} /></button>
            <button onClick={handleSend} className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center">
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
