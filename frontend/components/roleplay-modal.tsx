"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Send, Loader2, Volume2, Square, User, ShieldCheck } from "lucide-react";

interface RoleplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerOrg: string;
  startupId: string;
}

export default function RoleplayModal({ isOpen, onClose, buyerOrg, startupId }: RoleplayModalProps) {
  const [messages, setMessages] = useState<{ role: "user" | "buyer"; text: string; audioUrl?: string }[]>([
    { role: "buyer", text: `Hi, I'm the procurement director at ${buyerOrg}. I understand you have a solution for us. What's your pitch?` }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting audio
  useEffect(() => {
    if (isOpen && messages.length === 1 && !messages[0].audioUrl) {
      generateAndPlayAudio(messages[0].text, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const generateAndPlayAudio = async (text: string, index: number) => {
    try {
      const res = await fetch("/api/voice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Use an older sounding professional voice for buyer
        body: JSON.stringify({ text, voiceId: "CwhCGxEEOz3iNgzA3XJQ" }), 
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setMessages(prev => prev.map((m, i) => i === index ? { ...m, audioUrl: url } : m));
        
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio error", err);
    }
  };

  const handlePlayAudio = (url: string) => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(url);
    audioRef.current.onended = () => setIsPlaying(false);
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsProcessing(true);

    try {
      // Very simple local echo for the hackathon (in real app, call Gemini API here to simulate buyer)
      // Since we don't have a specific Gemini endpoint for roleplay built yet, let's just make one on the fly
      const res = await fetch("/api/voice/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId, buyerOrg, userPitch: userMsg }),
      });

      let buyerReply = "That sounds interesting, but how does it integrate with our existing EHR systems?";
      if (res.ok) {
        const data = await res.json();
        if (data.reply) buyerReply = data.reply;
      }

      const newIndex = messages.length + 1;
      setMessages(prev => [...prev, { role: "buyer", text: buyerReply }]);
      await generateAndPlayAudio(buyerReply, newIndex);

    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopAudioAndClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={stopAudioAndClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[#0d0d15] border border-white/[0.1] rounded-2xl flex flex-col overflow-hidden h-[600px]"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.05] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <ShieldCheck size={20} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Live Mock Pitch Simulator</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Roleplay vs {buyerOrg}</p>
            </div>
          </div>
          <button onClick={stopAudioAndClose} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-white/10" : "bg-blue-500/20 text-blue-400"}`}>
                {m.role === "user" ? <User size={14} /> : <ShieldCheck size={14} />}
              </div>
              <div className={`flex flex-col gap-2 max-w-[80%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-white/10 text-white rounded-tr-sm" : "bg-blue-500/10 border border-blue-500/20 text-blue-100 rounded-tl-sm"}`}>
                  {m.text}
                </div>
                {m.role === "buyer" && m.audioUrl && (
                  <button 
                    onClick={() => handlePlayAudio(m.audioUrl!)}
                    className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-blue-400/60 hover:text-blue-400 transition-colors"
                  >
                    {isPlaying && audioRef.current?.src === m.audioUrl ? <Square size={12} /> : <Volume2 size={12} />}
                    {isPlaying && audioRef.current?.src === m.audioUrl ? "Stop Audio" : "Replay Audio"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <Loader2 size={14} className="text-blue-400 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-100/50 text-sm rounded-tl-sm">
                Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-white/[0.05] bg-black/20">
          <div className="flex items-center gap-2 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your pitch or response..."
              className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="absolute right-2 p-2 bg-white text-black rounded-lg disabled:opacity-50 hover:bg-white/90 transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
