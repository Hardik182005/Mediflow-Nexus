"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Settings } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/") return "Overview";
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Overview";
    const title = segments[segments.length - 1]
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return title;
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((seg, i) => ({
      label: seg.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      href: "/" + segments.slice(0, i + 1).join("/"),
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-[64px] bg-white border-b border-black/[0.07] flex items-center justify-between px-6 sticky top-0 z-40 flex-shrink-0">
      <div className="flex items-center gap-3">
        {breadcrumbs.length > 1 && (
          <div className="hidden sm:flex items-center gap-1.5 text-[13px]">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-black/20">/</span>}
                <span className={i === breadcrumbs.length - 1 ? "text-black font-semibold" : "text-black/40 hover:text-black/70 cursor-pointer transition-colors"}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </div>
        )}
        {breadcrumbs.length <= 1 && (
          <h2 className="text-[15px] font-semibold text-black tracking-tight">{getPageTitle()}</h2>
        )}

        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/[0.03] border border-black/[0.05]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10.5px] font-semibold text-black/50 uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center relative w-56">
          <Search size={13} className="absolute left-3 text-black/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-black/[0.02] border border-black/[0.07] text-black text-[13px] rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-black/20 focus:bg-white transition-all placeholder:text-black/28 font-sans"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-black/[0.04] text-black/40 hover:text-black transition-colors relative">
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full border border-white"></span>
          </button>
          <button className="p-2 rounded-lg hover:bg-black/[0.04] text-black/40 hover:text-black transition-colors">
            <Settings size={15} />
          </button>

          <div className="w-px h-5 bg-black/[0.07] mx-1"></div>

          <button className="bg-black text-white text-[12.5px] font-semibold py-1.5 px-4 rounded-lg hover:bg-zinc-800 transition-colors">
            New Workspace
          </button>
        </div>
      </div>
    </header>
  );
}
