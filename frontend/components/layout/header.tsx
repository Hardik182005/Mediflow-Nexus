"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Settings, Command } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard Overview";
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard Overview";
    
    // Capitalize and format segments
    const title = segments[segments.length - 1]
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
      
    return title;
  };

  return (
    <header className="h-[72px] bg-black border-b border-white/[0.08] flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="flex items-center gap-4">
        <h2 className="text-[16px] font-bold text-white tracking-tight">{getPageTitle()}</h2>
        
        {/* Status Indicator for premium feel */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.1]">
          <div className="status-dot status-dot-success status-dot-live"></div>
          <span className="text-[11px] font-medium text-white/60">System Operational</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative w-64">
          <Search size={14} className="absolute left-3 text-white/20" />
          <input
            type="text"
            placeholder="Search patient, claim, or NPI..."
            className="w-full bg-white/[0.03] border border-white/[0.06] text-white text-[13px] rounded-lg pl-9 pr-12 py-2 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all placeholder-white/20"
          />
          <div className="absolute right-3 flex items-center gap-1 opacity-30">
            <Command size={12} className="text-white" />
            <span className="text-[10px] text-white font-mono">K</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="btn-ghost relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full border-2 border-black"></span>
          </button>
          <button className="btn-ghost">
            <Settings size={16} />
          </button>
          
          <div className="w-px h-6 bg-white/[0.1] mx-1"></div>
          
          <button className="btn-primary text-[12px] py-1.5 px-4 rounded-md">
            New Workspace
          </button>
        </div>
      </div>
    </header>
  );
}
