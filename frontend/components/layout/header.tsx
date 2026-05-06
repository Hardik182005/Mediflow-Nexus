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
    <header className="h-[72px] bg-white/80 border-b border-black/[0.05] flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h2 className="text-[16px] font-bold text-black tracking-tight font-serif">{getPageTitle()}</h2>
        
        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.02] border border-black/[0.05]">
          <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
          <span className="text-[11px] font-bold text-black/60 uppercase tracking-wider">System Live</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative w-64">
          <Search size={14} className="absolute left-3 text-black/30" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full bg-black/[0.02] border border-black/[0.05] text-black text-[13px] rounded-lg pl-9 pr-12 py-2 focus:outline-none focus:border-black/20 transition-all placeholder-black/30"
          />
          <div className="absolute right-3 flex items-center gap-1 opacity-20">
            <Command size={12} className="text-black" />
            <span className="text-[10px] text-black font-mono font-bold">K</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-black/5 text-black/60 hover:text-black transition-colors relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-black/5 text-black/60 hover:text-black transition-colors">
            <Settings size={16} />
          </button>
          
          <div className="w-px h-6 bg-black/[0.05] mx-1"></div>
          
          <button className="bg-black text-white text-[12px] font-bold py-1.5 px-4 rounded-md hover:bg-black/90 transition-colors shadow-lg">
            New Workspace
          </button>
        </div>
      </div>
    </header>
  );
}
