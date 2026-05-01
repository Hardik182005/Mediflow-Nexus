"use client";

import { motion } from "framer-motion";
import { Building2, Rocket, ArrowRight, ShieldCheck, Zap, Activity, BarChart3, Users, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MarketingLanding() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      
      {/* Decorative Global Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-white opacity-[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-white opacity-[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/80 backdrop-blur-xl border-white/[0.1] py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">MediFlow<span className="text-white/40">Nexus</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/40">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <a href="#enterprise" className="hover:text-white transition-colors">Enterprise</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-white/40 hover:text-white transition-colors hidden sm:block">Log in</button>
            <a href="#workspaces" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Enter Workspace
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-medium text-white/60 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]"></span>
              MediFlow Nexus OS 2.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] max-w-4xl">
              The Intelligence Engine for <br className="hidden md:block"/>
              <span className="text-white">
                Modern Healthcare
              </span>
            </h1>
            
            <p className="text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed">
              Unify your clinic operations and accelerate your startup's go-to-market motion with our enterprise-grade revenue intelligence platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href="#workspaces" className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                Launch Platform <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#features" className="px-8 py-4 rounded-full bg-white/[0.03] border border-white/[0.1] text-white font-semibold hover:bg-white/[0.06] transition-all flex items-center gap-2">
                Explore Features
              </a>
            </div>
          </motion.div>
        </section>

        {/* Bento Box Features */}
        <section id="features" className="max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-white/[0.04]">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise Capabilities</h2>
            <p className="text-white/40 max-w-2xl">Built for scale, designed for speed. MediFlow Nexus handles the complexity of healthcare data so you can focus on growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 bg-white/[0.02] border border-white/[0.1] rounded-3xl p-8 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Denials Prediction</h3>
              <p className="text-white/40 max-w-md">Our machine learning models analyze historical claims to predict and prevent denials before they happen, recovering millions in lost revenue.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/[0.02] border border-white/[0.1] rounded-3xl p-8 hover:bg-white/[0.04] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">SOC2 & HIPAA</h3>
              <p className="text-white/40">Bank-grade encryption and full compliance out of the box.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/[0.02] border border-white/[0.1] rounded-3xl p-8 hover:bg-white/[0.04] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Patient Copilot</h3>
              <p className="text-white/40">Automated intake and insurance verification workflows.</p>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-2 bg-white/[0.02] border border-white/[0.1] rounded-3xl p-8 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mb-32 transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Go-To-Market Automation</h3>
              <p className="text-white/40 max-w-md">Instantly generate tailored outreach campaigns, calculate ROI, and sync seamlessly with Salesforce and Hubspot.</p>
            </div>
          </div>
        </section>

        {/* Workspace Selector (The 2 Cards CTA) */}
        <section id="workspaces" className="max-w-5xl mx-auto px-6 lg:px-8 py-32 relative">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Select your workspace</h2>
            <p className="text-white/40 text-lg">Enter the environment tailored to your operational needs.</p>
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
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
              <Link href="/dashboard" className="block h-full">
                <div className="h-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.1] group-hover:border-white rounded-3xl p-8 md:p-10 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">Clinic Ops Intelligence</h3>
                  <p className="text-white/40 leading-relaxed mb-8">
                    Enterprise dashboard for healthcare providers. Manage patient intake, automate insurance verifications, and predict claim denials with AI.
                  </p>
                  
                  <div className="flex items-center justify-between text-white font-semibold transition-colors mt-auto pt-8 border-t border-white/[0.1]">
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
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
              <Link href="/launch-engine" className="block h-full">
                <div className="h-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.1] group-hover:border-white rounded-3xl p-8 md:p-10 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">Startup GTM Engine</h3>
                  <p className="text-white/40 leading-relaxed mb-8">
                    Commercialization suite for digital health startups. Build ICPs, generate personalized outreach, and calculate ROI for enterprise sales.
                  </p>
                  
                  <div className="flex items-center justify-between text-white font-semibold transition-colors mt-auto pt-8 border-t border-white/[0.1]">
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
      <footer className="border-t border-white/[0.1] py-12 text-center text-sm text-white/20 font-mono">
        <div className="max-w-7xl mx-auto px-6">
          MEDIFLOW NEXUS OS // v2.0.0 ENTERPRISE // ALL SYSTEMS OPERATIONAL
        </div>
      </footer>
    </div>
  );
}
