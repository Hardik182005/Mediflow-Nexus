"use client";

import { User, Building, Shield, Bell, Key, CreditCard, ChevronRight } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Settings</h1>
          <p className="text-[13px] text-white/40 mt-1">Manage your account, workspace, and billing.</p>
        </div>
        <button className="btn-primary">Save Changes</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Settings Navigation */}
        <div className="md:col-span-3 space-y-1">
          {[
            { id: "profile", label: "Profile", icon: <User size={16} />, active: true },
            { id: "workspace", label: "Workspace", icon: <Building size={16} /> },
            { id: "security", label: "Security", icon: <Shield size={16} /> },
            { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
            { id: "api-keys", label: "API Keys", icon: <Key size={16} /> },
            { id: "billing", label: "Billing", icon: <CreditCard size={16} /> },
          ].map((nav) => (
            <button
              key={nav.id}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                nav.active 
                  ? "bg-white text-black" 
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {nav.icon}
                {nav.label}
              </div>
              {nav.active && <div className="w-1 h-4 rounded-full bg-black"></div>}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-9 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-[16px] font-bold text-white mb-1">Profile Information</h2>
            <p className="text-[12px] text-white/40 mb-6">Update your personal details and public profile.</p>

            <div className="flex items-start gap-6 mb-8 border-b border-white/[0.04] pb-8">
              <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center text-white text-[24px] font-bold">
                HH
              </div>
              <div className="space-y-2">
                <button className="btn-secondary text-[12px] py-1.5 px-3">Upload new avatar</button>
                <p className="text-[11px] text-white/20">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-white">First Name</label>
                <input type="text" defaultValue="Hardik" className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-white">Last Name</label>
                <input type="text" defaultValue="Hinduja" className="input-field" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[12px] font-bold text-white">Email Address</label>
                <input type="email" defaultValue="hardik@mediflownexus.com" className="input-field" disabled />
                <p className="text-[11px] text-white/20 mt-1">To change your email, please contact support.</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[12px] font-bold text-white">Role / Title</label>
                <input type="text" defaultValue="Enterprise Admin" className="input-field" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-l-2 border-l-white/20">
            <h2 className="text-[16px] font-bold text-white mb-1">Active Plan</h2>
            <p className="text-[12px] text-white/40 mb-4">You are currently on the Enterprise Tier.</p>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white">Enterprise Intelligence</h3>
                  <span className="badge badge-neutral text-[10px]">Active</span>
                </div>
                <p className="text-[12px] text-white/20 mt-1">Unlimited clinics, full Copilot API access.</p>
              </div>
              <button className="mt-4 sm:mt-0 text-[12px] font-semibold text-white/60 hover:text-white transition-colors flex items-center gap-1">
                Manage Billing <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
