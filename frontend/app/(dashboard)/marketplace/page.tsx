"use client";

import { Store, Zap, Shield, Search, Star, ArrowUpRight, Filter } from "lucide-react";

export default function Marketplace() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Marketplace</h1>
          <p className="text-[13px] text-white/40 mt-1">Discover integrations, partners, and verified buyers.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Search marketplace..."
              className="w-full bg-white/[0.03] border border-white/[0.06] text-white text-[13px] rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-white/40 transition-all placeholder-white/20"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={14} />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Epic EHR Sync", category: "Integration", rating: 4.9, users: "12k+", icon: <Zap size={20} />, verified: true },
          { name: "Cerner Bridge", category: "Integration", rating: 4.8, users: "8k+", icon: <Zap size={20} />, verified: true },
          { name: "Alpha Health Partners", category: "Buyer Network", rating: 5.0, users: "Exclusive", icon: <Store size={20} />, verified: true },
          { name: "Clearance Auth AI", category: "Extension", rating: 4.7, users: "5k+", icon: <Shield size={20} />, verified: false },
          { name: "Medicaid Intel API", category: "Data Source", rating: 4.9, users: "15k+", icon: <Search size={20} />, verified: true },
          { name: "RevCycle Pro", category: "Service Partner", rating: 4.6, users: "2k+", icon: <Star size={20} />, verified: false },
        ].map((item, i) => (
          <div key={i} className="pipeline-card group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center text-white">
                {item.icon}
              </div>
              {item.verified && (
                <span className="badge badge-info">Verified</span>
              )}
            </div>
            
            <h3 className="text-[16px] font-bold text-white tracking-tight">{item.name}</h3>
            <p className="text-[12px] text-white/40 mt-1">{item.category}</p>
            
            <div className="mt-6 flex items-center justify-between border-t border-white/[0.04] pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[12px] font-medium text-white">
                  <Star size={12} className="text-white fill-white/20" />
                  {item.rating}
                </div>
                <div className="text-[12px] text-white/20">{item.users} users</div>
              </div>
              <button className="text-[12px] font-semibold text-white/60 hover:text-white transition-colors flex items-center gap-1">
                Install <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
