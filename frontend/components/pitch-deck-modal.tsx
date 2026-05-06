"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Target, AlertTriangle, TrendingUp, Zap, CheckCircle2, DollarSign, Rocket, Mail, Download, Share2, Copy, ExternalLink, Loader2, MessageSquareText, Volume2, Square } from "lucide-react";
import type { PitchDeck } from "@/types/pitch-deck";

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: PitchDeck;
  buyerName: string;
  startupId: string;
}

export default function PitchDeckModal({ isOpen, onClose, deck, buyerName, startupId }: PitchDeckModalProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isEmailView, setIsEmailView] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // ElevenLabs Voice State
  const [audioUrls, setAudioUrls] = useState<Record<number, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [voiceMemoUrl, setVoiceMemoUrl] = useState<string | null>(null);
  const [isGeneratingVoiceMemo, setIsGeneratingVoiceMemo] = useState(false);

  const totalSlides = 8;

  if (!isOpen) return null;

  const handleGenerateVoiceMemo = async () => {
    if (!emailDraft) return;
    setIsGeneratingVoiceMemo(true);
    try {
      const res = await fetch("/api/voice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Use a slightly different voice for the memo (e.g. Rachel for outreach, or same)
        body: JSON.stringify({ text: emailDraft, voiceId: "21m00Tcm4TlvDq8ikWAM" }),
      });
      if (res.ok) {
        const blob = await res.blob();
        setVoiceMemoUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error("Failed to generate voice memo", err);
    } finally {
      setIsGeneratingVoiceMemo(false);
    }
  };

  const getSlideText = (slide: number) => {
    switch (slide) {
      case 1: return `${deck.slide1.headline}. ${deck.slide1.subline}.`;
      case 2: return `${deck.slide2.title}. ${deck.slide2.pain_points.join(". ")}.`;
      case 3: return `${deck.slide3.title}. ${deck.slide3.consequences.join(". ")}. Revenue at risk: ${deck.slide3.revenue_at_risk}.`;
      case 4: return `Our Solution: ${deck.slide4.solution_line}. ${deck.slide4.steps.join(". ")}.`;
      case 5: return `${deck.slide5.title}. ${deck.slide5.proof_points.join(". ")}.`;
      case 6: return `ROI. Current loss: ${deck.slide6.current_loss}. Projected savings: ${deck.slide6.savings}.`;
      case 7: return `${deck.slide7.integration_title}. ${deck.slide7.tech_points.join(". ")}.`;
      case 8: return `${deck.slide8.cta}. Contact us at: ${deck.slide8.contact}.`;
      default: return "";
    }
  };

  const handlePlayAudio = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioUrls[currentSlide]) {
      if (!audioRef.current) audioRef.current = new Audio(audioUrls[currentSlide]);
      else audioRef.current.src = audioUrls[currentSlide];
      
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setIsGeneratingAudio(true);
    try {
      const text = getSlideText(currentSlide);
      const res = await fetch("/api/voice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrls(prev => ({ ...prev, [currentSlide]: url }));
        
        if (!audioRef.current) audioRef.current = new Audio(url);
        else audioRef.current.src = url;
        
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Failed to generate audio", err);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleNextSlide = () => {
    stopAudio();
    setCurrentSlide(prev => Math.min(totalSlides, prev + 1));
  };

  const handlePrevSlide = () => {
    stopAudio();
    setCurrentSlide(prev => Math.max(1, prev - 1));
  };

  const handleCloseModal = () => {
    stopAudio();
    onClose();
  };

  const handleGenerateEmail = async () => {
    stopAudio();
    setIsGeneratingEmail(true);
    setIsEmailView(true);
    try {
      const res = await fetch("/api/gtm/pitch-deck/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deck, buyerName, startupId })
      });
      const data = await res.json();
      setEmailDraft(data.email);
    } catch (err) {
      console.error("Email generation failed", err);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(emailDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextSlide = () => setCurrentSlide((s) => (s < totalSlides ? s + 1 : s));
  const prevSlide = () => setCurrentSlide((s) => (s > 1 ? s - 1 : s));

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deck, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${buyerName.toLowerCase().replace(/\s+/g, "-")}-pitch-deck.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderEmailView = () => (
    <div className="h-full flex flex-col space-y-6 max-w-3xl mx-auto py-4">
      <div className="flex items-center justify-between border-b border-black/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <MessageSquareText size={20} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">AI Outreach Drafter</h2>
            <p className="text-xs text-black/60 uppercase font-bold tracking-widest">Optimized for {buyerName}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEmailView(false)}
          className="text-xs text-black/40 hover:text-black transition-all uppercase font-bold tracking-widest"
        >
          Back to Deck
        </button>
      </div>

      {isGeneratingEmail ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-black/20 animate-spin" />
          <p className="text-sm text-black/40">Synthesizing ROI data into outreach...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex-1 p-6 rounded-2xl bg-black/[0.03] border border-black/[0.1] overflow-y-auto font-mono text-sm leading-relaxed text-black/80 whitespace-pre-wrap shadow-inner">
            {emailDraft || "Email draft will appear here..."}
          </div>
          
          {voiceMemoUrl && (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 size={18} className="text-blue-600" />
                <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">AI Voice Memo Ready</span>
              </div>
              <audio src={voiceMemoUrl} controls className="h-8 max-w-[200px]" />
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={handleGenerateVoiceMemo}
              disabled={isGeneratingVoiceMemo || !emailDraft}
              className="flex-1 bg-black text-white hover:bg-black/80 transition-all rounded-xl py-3 text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingVoiceMemo ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
              {isGeneratingVoiceMemo ? "Synthesizing..." : "Generate Voice Memo"}
            </button>
            <button 
              onClick={handleCopy}
              className="flex-1 bg-white text-black border border-black/20 hover:bg-black/5 transition-all rounded-xl py-3 text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2"
            >
              {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy to Clipboard"}
            </button>
            <button className="flex-1 bg-black text-white hover:bg-black/80 transition-all rounded-xl py-3 text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2">
              <ExternalLink size={16} /> Open in Outlook
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderSlide = () => {
    switch (currentSlide) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center text-center h-full space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-black/[0.03] border border-black/[0.1] flex items-center justify-center mb-4">
              <Target size={40} className="text-black" />
            </div>
            <h1 className="text-4xl font-bold text-black tracking-tight leading-tight max-w-2xl">
              {deck.slide1.headline}
            </h1>
            <p className="text-xl text-black/60 font-medium">
              {deck.slide1.subline}
            </p>
            <div className="pt-10">
              <p className="text-[10px] text-black/40 uppercase tracking-[0.3em] font-bold">Confidential Strategy for {buyerName}</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-amber-500" size={24} />
              <h2 className="text-2xl font-bold text-black">{deck.slide2.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {deck.slide2.pain_points.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-black/[0.02] border border-black/[0.05]">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                    <p className="text-sm text-black/70 leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20">
                <p className="text-5xl font-bold text-amber-500">{deck.slide2.key_stat}</p>
                <p className="text-xs text-amber-500/60 uppercase font-bold tracking-widest mt-2">Critical Impact Stat</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-black">{deck.slide3.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-red-500/[0.05] border border-red-500/20 flex flex-col items-center justify-center text-center">
                <p className="text-4xl font-bold text-red-500">{deck.slide3.revenue_at_risk}</p>
                <p className="text-[10px] text-red-500/60 uppercase font-bold tracking-widest mt-2">Revenue At Risk (Next 12 Months)</p>
              </div>
              <div className="space-y-4">
                {deck.slide3.consequences.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-black/[0.02] border border-black/[0.05]">
                    <X size={16} className="text-red-500/60" />
                    <p className="text-sm text-black/70">{c}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 h-full flex flex-col justify-center max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap size={32} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-black leading-relaxed">
              {deck.slide4.solution_line}
            </h2>
            <div className="grid grid-cols-3 gap-4 pt-8">
              {deck.slide4.steps.map((s, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-black/[0.03] border border-black/[0.1] flex items-center justify-center mx-auto text-sm font-bold text-black">
                    {i + 1}
                  </div>
                  <p className="text-xs text-black/60 leading-relaxed px-4">{s}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-black text-center">{deck.slide5.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deck.slide5.proof_points.map((p, i) => (
                <div key={i} className="p-6 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 flex items-start gap-4">
                  <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-black/70 leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between border-b border-black/10 pb-6">
              <h2 className="text-2xl font-bold text-black">ROI Calculator</h2>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-[10px] font-bold uppercase tracking-widest">
                Targeted for {buyerName}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Current Loss", value: deck.slide6.current_loss, icon: AlertTriangle, color: "text-red-500" },
                { label: "Potential Savings", value: deck.slide6.savings, icon: TrendingUp, color: "text-emerald-500" },
                { label: "Payback Period", value: deck.slide6.payback_period, icon: Zap, color: "text-blue-500" },
                { label: "Year 1 ROI", value: deck.slide6.year1_roi, icon: DollarSign, color: "text-emerald-500" },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-black/[0.02] border border-black/[0.05] space-y-2">
                  <item.icon size={16} className={item.color} />
                  <p className="text-lg font-bold text-black">{item.value}</p>
                  <p className="text-[10px] text-black/40 uppercase font-bold tracking-tight">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-black/[0.03] border border-black/[0.1] mt-4">
              <div className="h-2 w-full bg-black/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[75%]" />
              </div>
              <p className="text-[10px] text-black/40 mt-3 text-center uppercase font-bold tracking-widest">Efficiency Improvement Projection</p>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-8 h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-black">{deck.slide7.integration_title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {deck.slide7.tech_points.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-black/[0.02] border border-black/[0.05]">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Rocket size={14} className="text-blue-500" />
                    </div>
                    <p className="text-sm text-black/70">{p}</p>
                  </div>
                ))}
              </div>
              <div className="aspect-video rounded-2xl bg-black/[0.02] border border-black/[0.05] flex items-center justify-center">
                <p className="text-xs text-black/30 uppercase font-bold tracking-widest">Architecture Diagram Placeholder</p>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="flex flex-col items-center justify-center text-center h-full space-y-8">
            <h2 className="text-3xl font-bold text-black">The Next Step</h2>
            <div className="p-8 rounded-3xl bg-black/[0.03] border border-black/[0.1] max-w-xl w-full">
              <p className="text-xl text-black/80 font-medium mb-6">
                {deck.slide8.cta}
              </p>
              <div className="flex flex-col items-center gap-4 text-black/60">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span className="text-sm">{deck.slide8.contact}</span>
                </div>
              </div>
              <button className="bg-black text-white hover:bg-black/80 transition-all rounded-xl w-full mt-8 py-4 text-sm uppercase font-bold tracking-widest">
                Confirm Pilot Proposal
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white/95 backdrop-blur-xl"
        onClick={handleCloseModal}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl aspect-[16/9] bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden flex flex-col border border-black/5 text-black bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5 bg-white/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[10px] font-bold text-black/60 uppercase tracking-widest">
              Slide {currentSlide} of {totalSlides}
            </div>
            <div className="h-4 w-px bg-black/10" />
            <h3 className="text-sm font-bold text-black/80">{buyerName} Strategy Deck</h3>
          </div>
          <div className="flex items-center gap-2">
            {!isEmailView && (
              <button 
                onClick={handlePlayAudio} 
                disabled={isGeneratingAudio}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-xs font-bold uppercase tracking-widest ${isPlaying ? 'bg-blue-500/10 text-blue-600' : 'hover:bg-black/5 text-black/60 hover:text-black'}`}
              >
                {isGeneratingAudio ? <Loader2 size={16} className="animate-spin" /> : (isPlaying ? <Square size={16} /> : <Volume2 size={16} />)}
                {isGeneratingAudio ? "Generating..." : (isPlaying ? "Stop Pitch" : "Play Pitch")}
              </button>
            )}
            <button onClick={handleDownload} className="p-2 rounded-lg hover:bg-black/5 text-black/40 hover:text-black transition-all">
              <Download size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-black/5 text-black/40 hover:text-black transition-all">
              <Share2 size={18} />
            </button>
            <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-black/5 text-black/40 hover:text-black transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-12 overflow-hidden relative z-0">
          <AnimatePresence mode="wait">
            {isEmailView ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                {renderEmailView()}
              </motion.div>
            ) : (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderSlide()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / Navigation */}
        <div className="p-6 border-t border-black/5 flex items-center justify-between bg-white/50 backdrop-blur-sm z-10">
          <div className="flex gap-2">
            {!isEmailView && Array.from({ length: totalSlides }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1 w-8 rounded-full transition-all duration-500 ${i + 1 === currentSlide ? "bg-black" : "bg-black/10"}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            {!isEmailView ? (
              <>
                <button 
                  onClick={handlePrevSlide}
                  disabled={currentSlide === 1}
                  className="p-3 rounded-xl bg-black/5 border border-black/10 text-black disabled:opacity-20 hover:bg-black/10 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                {currentSlide === totalSlides ? (
                  <button 
                    onClick={handleGenerateEmail}
                    className="bg-black text-white hover:bg-black/80 transition-all py-3 px-8 rounded-xl text-xs flex items-center gap-2 uppercase font-bold tracking-widest"
                  >
                    Generate Outreach Email <Mail size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={handleNextSlide}
                    className="bg-black text-white hover:bg-black/80 transition-all py-3 px-8 rounded-xl text-xs flex items-center gap-2 uppercase font-bold tracking-widest"
                  >
                    Next Slide <ChevronRight size={16} />
                  </button>
                )}
              </>
            ) : (
              <button 
                onClick={() => setIsEmailView(false)}
                className="bg-white text-black border border-black/20 hover:bg-black/5 transition-all rounded-xl py-3 px-8 text-xs uppercase font-bold tracking-widest"
              >
                Return to Slides
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
