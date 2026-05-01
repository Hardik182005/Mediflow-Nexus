"use client";

import { motion } from "framer-motion";
import { Search, Filter, MapPin, Mail, Phone, Star } from "lucide-react";
import { buyerProfiles } from "@/lib/demo-data";

const statusBadge: Record<string, string> = { discovered: "badge-neutral", contacted: "badge-info", engaged: "badge-warning", qualified: "badge-success", converted: "badge-success" };

export default function BuyerDiscoveryPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Buyer Discovery</h1>
          <p className="text-sm text-surface-400 mt-1">Find ideal clinics, hospitals & decision makers</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Search size={16} /> Discover Buyers</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Buyers", value: "248", color: "#3b82f6" },
          { label: "Engaged", value: "48", color: "#f59e0b" },
          { label: "Qualified", value: "32", color: "#8b5cf6" },
          { label: "Converted", value: "12", color: "#10b981" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-surface-400 mt-1">{s.label}</p>
            <div className="h-1 mt-2 rounded-full bg-white/[0.06]"><div className="h-full rounded-full" style={{ background: s.color, width: "60%" }} /></div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input type="text" placeholder="Search buyers by name, organization, specialty..." className="input-field pl-10" />
        </div>
        <button className="btn-secondary flex items-center gap-2"><Filter size={14} /> Filter</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {buyerProfiles.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-blue flex items-center justify-center text-white text-xs font-bold">
                  {b.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{b.name}</p>
                  <p className="text-xs text-surface-400">{b.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-white">{b.buyerScore}</span>
              </div>
            </div>
            <div className="space-y-2 mb-3">
              <p className="text-xs text-surface-200 flex items-center gap-2"><MapPin size={12} className="text-surface-400" />{b.organization} • {b.city}, {b.state}</p>
              <p className="text-xs text-surface-300">{b.organizationType.replace("_", " ")} • {b.specialty}</p>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {b.interests.map(i => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{i}</span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className={`badge ${statusBadge[b.status]}`}>{b.status}</span>
              <span className="text-xs text-surface-400">{b.budgetRange}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn-primary text-xs flex-1">Contact</button>
              <button className="btn-secondary text-xs">Profile</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
