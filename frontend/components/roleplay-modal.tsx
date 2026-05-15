"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Send, Loader2, Volume2, Square, User, ShieldCheck, MicOff, Waves } from "lucide-react";

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
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            handleSend(transcript);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isProcessing && !isPlaying) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
    }
  }, [isProcessing, isPlaying]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting audio
  useEffect(() => {
    if (isOpen && messages.length === 1 && !messages[0].audioUrl) {
      generateAndPlayAudio(messages[0].text, 0);
    }
  }, [isOpen]);

  const generateAndPlayAudio = async (text: string, index: number) => {
    try {
      const res = await fetch("/api/voice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: "CwhCGxEEOz3iNgzA3XJQ" }), // Professional buyer voice
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setMessages(prev => prev.map((m, i) => i === index ? { ...m, audioUrl: url } : m));
        
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          // If voice mode is on, start listening after assistant finishes
          if (voiceMode) {
            setTimeout(startListening, 500);
          }
        };
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio error", err);
    }
  };

  const handlePlayAudio = (url: string) => {
    if (isPlaying && audioRef.current?.src === url) {
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

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input.trim();
    if (!textToSend || isProcessing) return;

    if (!overrideInput) setInput("");
    setMessages(prev => [...prev, { role: "user", text: textToSend }]);
    setIsProcessing(true);
    stopListening();

    try {
      const res = await fetch("/api/voice/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startupId, buyerOrg, userPitch: textToSend }),
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
    stopListening();
    onClose();
  };

  const toggleVoiceMode = () => {
    const newMode = !voiceMode;
    setVoiceMode(newMode);
    if (newMode && !isPlaying && !isProcessing) {
      startListening();
    } else {
      stopListening();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={stopAudioAndClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex flex-col overflow-hidden h-[650px]"
      >
        <div className="flex items-center justify-between p-5 border-b border-black bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-sm">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black uppercase tracking-tight">Live Mock Pitch Simulator</h2>
              <p className="text-[10px] text-black/50 font-bold uppercase tracking-widest flex items-center gap-2">
                ElevenLabs Voice Assistant Active 
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={toggleVoiceMode}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  voiceMode ? "bg-black text-white border-black" : "bg-white text-black/40 border-black/10 hover:border-black/30"
                }`}
              >
                {voiceMode ? <Mic size={12} className="animate-pulse" /> : <MicOff size={12} />}
                {voiceMode ? "Voice Mode On" : "Voice Mode Off"}
              </button>
            <button onClick={stopAudioAndClose} className="p-2 rounded-lg hover:bg-black/5 text-black/40 hover:text-black transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafa]">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${m.role === "user" ? "bg-white" : "bg-black text-white"}`}>
                {m.role === "user" ? <User size={14} /> : <ShieldCheck size={14} />}
              </div>
              <div className={`flex flex-col gap-2 max-w-[80%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm border border-black/5 ${m.role === "user" ? "bg-black text-white rounded-tr-sm" : "bg-white text-black rounded-tl-sm"}`}>
                  {m.text}
                </div>
                {m.role === "buyer" && m.audioUrl && (
                  <button 
                    onClick={() => handlePlayAudio(m.audioUrl!)}
                    className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-black/40 hover:text-black transition-colors"
                  >
                    {isPlaying && audioRef.current?.src === m.audioUrl ? <Square size={10} fill="currentColor" /> : <Volume2 size={12} />}
                    {isPlaying && audioRef.current?.src === m.audioUrl ? "Stop Playing" : "Replay Audio"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Loader2 size={14} className="animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-black/10 text-black/40 text-[13px] rounded-tl-sm flex items-center gap-2">
                Processing pitch...
              </div>
            </div>
          )}
          
          {/* Visual Voice Feedback */}
          <AnimatePresence>
            {(isPlaying || isListening) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col items-center justify-center py-4 space-y-3"
              >
                <div className="flex items-center gap-1 h-8">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: [8, Math.random() * 32 + 8, 8],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.5 + Math.random() * 0.5,
                        ease: "easeInOut"
                      }}
                      className={`w-1 rounded-full ${isPlaying ? "bg-black" : "bg-emerald-500"}`}
                    />
                  ))}
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isPlaying ? "text-black" : "text-emerald-500"}`}>
                  {isPlaying ? "Assistant Speaking" : "Listening to your pitch..."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={chatEndRef} />
        </div>

        <div className="p-5 border-t border-black bg-white">
          <div className="flex items-center gap-3 relative">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isListening ? "Listening..." : "Type your pitch..."}
                className={`w-full bg-[#fafafa] border border-black rounded-xl py-3.5 pl-4 pr-12 text-[13px] text-black placeholder-black/30 focus:outline-none focus:ring-1 focus:ring-black transition-all ${isListening ? "border-emerald-500 ring-1 ring-emerald-500" : ""}`}
                disabled={isListening}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isProcessing || isListening}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-black hover:text-black/60 disabled:opacity-20 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
            
            <button 
              onClick={isListening ? stopListening : startListening}
              disabled={isPlaying || isProcessing}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                isListening 
                  ? "bg-emerald-500 border-black text-white shadow-none translate-x-[2px] translate-y-[2px]" 
                  : "bg-black border-black text-white hover:bg-zinc-800 disabled:opacity-20"
              }`}
            >
              {isListening ? <Square size={16} fill="currentColor" /> : <Mic size={20} />}
            </button>
          </div>
          <div className="mt-3 flex justify-between items-center px-1">
            <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider">
              {voiceMode ? "✦ Voice mode active — just speak your pitch" : "✦ Enable Voice Mode for hands-free practice"}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-black/30 font-bold uppercase">Powered by ElevenLabs</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
