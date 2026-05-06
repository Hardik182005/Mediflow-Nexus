"use client";

import { motion } from "framer-motion";
import { Building2, Rocket, ArrowRight, ShieldCheck, Zap, Activity, BarChart3, Users, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "./login/actions";

export default function MarketingLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check auth status
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [supabase]);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black/10 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]">
      
      {/* Decorative Global Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-black opacity-[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-black opacity-[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/80 backdrop-blur-xl border-black/[0.1] py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.1)]">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-black font-serif">MediFlow<span className="text-black/40">Nexus</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-black/60">
            <a href="#features" className="hover:text-black transition-colors">Platform</a>
            <a href="#security" className="hover:text-black transition-colors">Security</a>
            <a href="#enterprise" className="hover:text-black transition-colors">Enterprise</a>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <form action={logout}>
                  <button type="submit" className="text-sm font-medium text-red-600/80 hover:text-red-600 transition-colors">Sign Out</button>
                </form>
              </>
            ) : (
              <Link href="/login" className="text-sm font-medium text-black/60 hover:text-black transition-colors hidden sm:block">Log in</Link>
            )}
            <a href="#workspaces" className="px-5 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-black/90 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.1)]">
              {user ? 'Enter Workspace' : 'Sign Up'}
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.08] text-xs font-medium text-black/60 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-black animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]"></span>
              AI-Powered Intelligence Platform
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif tracking-tight mb-8 leading-[1.1] max-w-4xl text-black">
              Healthcare Research, <br className="hidden md:block"/>
              <span className="text-black/40 italic font-light">
                Reimagined.
              </span>
            </h1>
            
            <p className="text-xl text-black/60 max-w-2xl mx-auto mb-12 leading-relaxed">
              Empowering top-tier medical facilities and startups with obsidian-sharp AI analysis to navigate the world's most complex operations.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href="#workspaces" className="px-8 py-4 rounded-full bg-black text-white font-semibold hover:bg-black/90 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(0,0,0,0.15)]">
                Get Started Free →
              </a>
              <a href="#features" className="px-8 py-4 rounded-full bg-transparent border border-black/[0.1] text-black font-semibold hover:bg-black/[0.04] transition-all flex items-center gap-2">
                View Demo
              </a>
            </div>

            <p className="mt-8 text-xs text-black/40 font-medium">Trusted by 200+ clinics • SOC 2 Certified • Enterprise Ready</p>

            {/* Dashboard Demo Graphic */}
            <div className="mt-20 w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-[#111111] aspect-[16/9] flex items-center justify-center relative border border-black/[0.1]">
              <div className="absolute top-0 w-full h-10 bg-[#1a1a1a] flex items-center px-4 gap-2 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
              </div>
              
              {/* Pseudo UI elements for dashboard */}
              <div className="w-full h-full pt-10 p-6 flex gap-6">
                {/* Sidebar */}
                <div className="hidden md:flex w-64 h-full bg-[#1a1a1a] rounded-lg border border-white/5 p-4 flex-col gap-4">
                  <div className="w-full h-8 bg-white/5 rounded"></div>
                  <div className="w-3/4 h-4 bg-white/5 rounded"></div>
                  <div className="w-1/2 h-4 bg-white/5 rounded"></div>
                </div>
                {/* Main Content */}
                <div className="flex-1 h-full flex flex-col gap-6">
                  {/* Top Widgets */}
                  <div className="flex gap-6 h-1/3">
                    <div className="flex-1 bg-[#1a1a1a] rounded-lg border border-white/5 p-6 flex flex-col justify-end">
                       <svg className="w-full h-full text-white/20" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path d="M0 30 L20 20 L40 25 L60 10 L80 15 L100 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    </div>
                    <div className="hidden sm:flex w-1/3 bg-[#1a1a1a] rounded-lg border border-white/5 p-6 items-center justify-center">
                       <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-white/80"></div>
                    </div>
                  </div>
                  {/* Bottom List */}
                  <div className="flex-1 bg-[#1a1a1a] rounded-lg border border-white/5 p-6 flex flex-col gap-4">
                    <div className="w-full h-12 bg-white/5 rounded-md flex items-center px-4 justify-between">
                       <div className="w-1/4 h-4 bg-white/10 rounded"></div>
                       <div className="w-16 h-6 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="w-full h-12 bg-white/5 rounded-md flex items-center px-4 justify-between">
                       <div className="w-1/3 h-4 bg-white/10 rounded"></div>
                       <div className="w-16 h-6 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </section>

        {/* Feature Highlights section instead of grid cards */}
        <section id="features" className="max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-black/[0.04]">
          <div className="text-center mb-16">
            <h2 className="text-xs tracking-[0.2em] uppercase text-black/40 font-bold mb-8">Core Capabilities</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-6 text-4xl md:text-6xl font-serif text-black/10">
            <div className="hover:text-black transition-colors duration-500 cursor-default">Contract Analysis</div>
            <div className="hover:text-black transition-colors duration-500 cursor-default">Complex Workflows</div>
            <div className="hover:text-black transition-colors duration-500 cursor-default">Document Storage</div>
            <div className="hover:text-black transition-colors duration-500 cursor-default">Risk Detection</div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <a href="#workspaces" className="px-6 py-3 rounded-full border border-black/[0.1] text-black text-sm font-semibold hover:bg-black/[0.03] transition-colors">
              Explore Platform
            </a>
          </div>
        </section>

        {/* Workspace Selector (The 2 Cards CTA) */}
        <section id="workspaces" className="max-w-5xl mx-auto px-6 lg:px-8 py-32 relative border-t border-black/[0.04]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-4 text-black">Select your workspace</h2>
            <p className="text-black/60 text-lg">Enter the environment tailored to your operational needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* Clinic Ops Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
              <Link href="/dashboard" className="block h-full">
                <div className="h-full bg-black/[0.02] backdrop-blur-xl border border-black/[0.1] group-hover:border-black/20 rounded-3xl p-8 md:p-10 transition-all duration-300 relative overflow-hidden">
                  
                  <div className="w-16 h-16 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-8 h-8 text-black" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-black mb-3">Clinic Ops Intelligence</h3>
                  <p className="text-black/60 leading-relaxed mb-8">
                    Enterprise dashboard for healthcare providers. Manage patient intake, automate insurance verifications, and predict claim denials with AI.
                  </p>
                  
                  <div className="flex items-center justify-between text-black font-semibold transition-colors mt-auto pt-8 border-t border-black/[0.1]">
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Startup GTM Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
              <Link href="/launch-engine" className="block h-full">
                <div className="h-full bg-black/[0.02] backdrop-blur-xl border border-black/[0.1] group-hover:border-black/20 rounded-3xl p-8 md:p-10 transition-all duration-300 relative overflow-hidden">
                  
                  <div className="w-16 h-16 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Rocket className="w-8 h-8 text-black" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-black mb-3">Startup GTM Engine</h3>
                  <p className="text-black/60 leading-relaxed mb-8">
                    Commercialization suite for digital health startups. Build ICPs, generate personalized outreach, and calculate ROI for enterprise sales.
                  </p>
                  
                  <div className="flex items-center justify-between text-black font-semibold transition-colors mt-auto pt-8 border-t border-black/[0.1]">
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.1] py-12 text-center text-sm text-black/40 font-mono bg-black/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          MEDIFLOW NEXUS OS // v2.0.0 ENTERPRISE // ALL SYSTEMS OPERATIONAL
        </div>
      </footer>
    </div>
  );
}
