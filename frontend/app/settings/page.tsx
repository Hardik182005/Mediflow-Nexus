"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Building, CreditCard, Bell, Shield, Palette, Globe } from "lucide-react";

const sections = [
  { title: "Profile", desc: "Manage your account", icon: User, fields: [
    { label: "Full Name", value: "Avinash Gehi", type: "text" },
    { label: "Email", value: "avinashgehi3@gmail.com", type: "email" },
    { label: "Role", value: "Platform Admin", type: "text" },
  ]},
  { title: "Organization", desc: "Clinic or startup settings", icon: Building, fields: [
    { label: "Organization Name", value: "EthAum Venture Partners", type: "text" },
    { label: "Type", value: "Accelerator", type: "text" },
    { label: "Website", value: "ethaum.com", type: "text" },
  ]},
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-surface-400 mt-1">Manage your account, organization & preferences</p>
      </div>

      {sections.map((section, si) => (
        <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }} className="glass-card-static p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <section.icon size={18} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{section.title}</h3>
              <p className="text-xs text-surface-400">{section.desc}</p>
            </div>
          </div>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.label}>
                <label className="text-xs text-surface-400 font-medium block mb-1.5">{field.label}</label>
                <input type={field.type} defaultValue={field.value} className="input-field" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="btn-primary text-xs">Save Changes</button>
          </div>
        </motion.div>
      ))}

      {/* Subscription */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CreditCard size={18} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Subscription</h3>
            <p className="text-xs text-surface-400">Current plan and billing</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Enterprise Plan</p>
              <p className="text-xs text-surface-300">EthAum Accelerator License • Portfolio-wide access</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">$5,000<span className="text-xs text-surface-400">/mo</span></p>
              <p className="text-xs text-emerald-400">Active</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Bell size={18} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <p className="text-xs text-surface-400">Alert preferences</p>
          </div>
        </div>
        <div className="space-y-3">
          {["Denial risk alerts", "PA expiry reminders", "Revenue leakage notifications", "Marketplace match alerts", "Pipeline stage changes"].map((n) => (
            <div key={n} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
              <span className="text-sm text-surface-200">{n}</span>
              <div className="w-10 h-5 rounded-full bg-blue-500 relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
