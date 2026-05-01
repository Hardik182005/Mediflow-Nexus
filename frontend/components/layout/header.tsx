"use client";

import { Bell, Search, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 border-b border-white/[0.06] bg-surface-950/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        {searchOpen ? (
          <div className="flex items-center gap-2 flex-1 max-w-xl animate-fade-in">
            <Search size={16} className="text-surface-400" />
            <input
              type="text"
              placeholder="Search patients, cases, startups..."
              className="input-field py-1.5 text-sm"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-surface-400 text-sm hover:bg-white/[0.06] transition-colors"
          >
            <Search size={14} />
            <span>Search...</span>
            <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-surface-500 ml-4">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="btn-ghost p-2"
        >
          {darkMode ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <button className="btn-ghost p-2 relative">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <div className="w-px h-6 bg-white/[0.06] mx-2" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-blue flex items-center justify-center text-white text-xs font-bold">
            AG
          </div>
        </div>
      </div>
    </header>
  );
}
