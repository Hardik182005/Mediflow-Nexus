"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Building2, UserPlus, Shield, FileCheck, AlertTriangle,
  DollarSign, TrendingUp, Landmark, Rocket, Users, Search, Target,
  BarChart3, Store, FileBarChart, Bot, Settings, ChevronDown, ChevronRight,
  Activity, Zap, Menu, X, LogOut, CreditCard
} from "lucide-react";

import { logout } from "@/app/login/actions";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navigation: { section: string; items: NavItem[] }[] = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    section: "Clinic Intelligence",
    items: [
      {
        label: "Clinic Ops", href: "/clinic-ops", icon: <Building2 size={16} />,
        children: [
          { label: "Patient Intake", href: "/clinic-ops/patient-intake", icon: <UserPlus size={14} /> },
          { label: "Insurance (VOB)", href: "/clinic-ops/insurance", icon: <Shield size={14} /> },
          { label: "Prior Auth", href: "/clinic-ops/prior-auth", icon: <FileCheck size={14} /> },
          { label: "Denials", href: "/clinic-ops/denials", icon: <AlertTriangle size={14} /> },
          { label: "Revenue", href: "/clinic-ops/revenue", icon: <DollarSign size={14} /> },
          { label: "Growth", href: "/clinic-ops/growth", icon: <TrendingUp size={14} /> },
          { label: "Payer Intel", href: "/clinic-ops/payer", icon: <Landmark size={14} /> },
        ],
      },
    ],
  },
  {
    section: "Startup Engine",
    items: [
      {
        label: "Launch Engine", href: "/launch-engine", icon: <Rocket size={16} />,
        children: [
          { label: "Onboarding", href: "/launch-engine/onboarding", icon: <Zap size={14} /> },
          { label: "Buyer Discovery", href: "/launch-engine/buyer-discovery", icon: <Search size={14} /> },
          { label: "GTM Engine", href: "/launch-engine/gtm", icon: <Target size={14} /> },
          { label: "Sales Pipeline", href: "/launch-engine/sales-pipeline", icon: <BarChart3 size={14} /> },
          { label: "Competitive Intel", href: "/launch-engine/competitive", icon: <Users size={14} /> },
        ],
      },
    ],
  },
  {
    section: "Platform",
    items: [
      { label: "Marketplace", href: "/marketplace", icon: <Store size={16} /> },
      { label: "Reports", href: "/reports", icon: <FileBarChart size={16} /> },
      { label: "Pricing", href: "/pricing", icon: <CreditCard size={16} /> },
      { label: "AI Copilot", href: "/copilot", icon: <Bot size={16} /> },
      { label: "Settings", href: "/settings", icon: <Settings size={16} /> },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Clinic Ops", "Launch Engine"]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] md:hidden btn-ghost p-2"
      >
        {mobileOpen ? <X size={18} className="text-black" /> : <Menu size={18} className="text-black" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "sidebar fixed top-0 left-0 h-screen w-[280px] z-50 flex flex-col overflow-hidden bg-white border-r border-black/5",
          "md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-black/[0.05]">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.1)]">
            <Activity size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-[14px] font-bold text-black tracking-tight font-serif">MediFlow Nexus</h1>
            <p className="text-[10px] text-black/40 font-semibold tracking-widest uppercase mt-0.5">Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navigation.filter((group) => {
            const isStartup = pathname.startsWith('/launch-engine');
            const isClinic = pathname.startsWith('/clinic-ops') || pathname === '/dashboard';
            if (isStartup && group.section === "Clinic Intelligence") return false;
            if (isClinic && group.section === "Startup Engine") return false;
            return true;
          }).map((group) => (
            <div key={group.section} className="mb-4">
              <div className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-2 px-3">{group.section}</div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isStartup = pathname.startsWith('/launch-engine');
                  if (isStartup && item.label === "Reports") return null;

                  const itemHref = item.label === "Dashboard" 
                    ? (isStartup ? "/launch-engine" : "/dashboard")
                    : item.href;

                  return (
                    <div key={item.label}>
                      {item.children ? (
                        <>
                          <button
                            onClick={() => toggleExpand(item.label)}
                            className={cn(
                              "sidebar-item w-full justify-between hover:bg-black/5",
                              isActive(item.href) && "active bg-black/5 text-black"
                            )}
                          >
                            <span className="flex items-center gap-2.5">
                              {item.icon}
                              {item.label}
                            </span>
                            {expandedItems.includes(item.label) ? (
                              <ChevronDown size={14} className="text-black/30" />
                            ) : (
                              <ChevronRight size={14} className="text-black/30" />
                            )}
                          </button>
                          {expandedItems.includes(item.label) && (
                            <div className="ml-4 mt-1 space-y-0.5 pl-3 border-l border-black/[0.06]">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={cn(
                                    "sidebar-item text-[12px] py-1.5 hover:bg-black/5",
                                    isActive(child.href) && "active bg-black/5 text-black"
                                  )}
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {child.icon}
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={itemHref}
                          className={cn(
                            "sidebar-item hover:bg-black/5",
                            isActive(itemHref) && "active bg-black/5 text-black"
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User & Auth */}
        <div className="p-4 border-t border-black/[0.05] flex flex-col gap-2">
          <div className="glass-card p-3 flex items-center gap-3 hover:bg-black/[0.02] transition-all cursor-pointer border-black/[0.05] hover:border-black/10">
            <div className="w-8 h-8 rounded-lg bg-black border border-black/[0.1] flex items-center justify-center text-white text-[11px] font-bold uppercase shadow-[0_0_15px_rgba(0,0,0,0.1)]">
              {user?.user_metadata?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-black truncate tracking-tight">
                {user?.user_metadata?.name || 'MediFlow User'}
              </p>
              <p className="text-[11px] text-black/30 truncate font-medium">{user?.email || 'Enterprise Admin'}</p>
            </div>
          </div>
          
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-black/40 hover:text-black hover:bg-black/5 rounded-lg transition-colors">
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
