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
  Activity, Zap, Menu, X, LogOut, CreditCard, Presentation
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
      { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={15} /> },
    ],
  },
  {
    section: "Clinic Intelligence",
    items: [
      {
        label: "Clinic Ops", href: "/clinic-ops", icon: <Building2 size={15} />,
        children: [
          { label: "Patient Intake", href: "/clinic-ops/patient-intake", icon: <UserPlus size={13} /> },
          { label: "Insurance (VOB)", href: "/clinic-ops/insurance", icon: <Shield size={13} /> },
          { label: "Prior Auth", href: "/clinic-ops/prior-auth", icon: <FileCheck size={13} /> },
          { label: "Denials", href: "/clinic-ops/denials", icon: <AlertTriangle size={13} /> },
          { label: "Revenue", href: "/clinic-ops/revenue", icon: <DollarSign size={13} /> },
          { label: "Growth", href: "/clinic-ops/growth", icon: <TrendingUp size={13} /> },
          { label: "Payer Intel", href: "/clinic-ops/payer", icon: <Landmark size={13} /> },
        ],
      },
    ],
  },
  {
    section: "Startup Engine",
    items: [
      {
        label: "Launch Engine", href: "/launch-engine", icon: <Rocket size={15} />,
        children: [
          { label: "Onboarding", href: "/launch-engine/onboarding", icon: <Zap size={13} /> },
          { label: "Buyer Discovery", href: "/launch-engine/buyer-discovery", icon: <Search size={13} /> },
          { label: "GTM Engine", href: "/launch-engine/gtm", icon: <Target size={13} /> },
          { label: "Sales Pipeline", href: "/launch-engine/sales-pipeline", icon: <TrendingUp size={13} /> },
          { label: "Competitive Intell", href: "/launch-engine/competitive", icon: <BarChart3 size={13} /> },
        ],
      },
    ],
  },
  {
    section: "Platform",
    items: [
      { label: "Marketplace", href: "/marketplace", icon: <Store size={15} /> },
      { label: "Reports", href: "/reports", icon: <FileBarChart size={15} /> },
      { label: "Pricing", href: "/pricing", icon: <CreditCard size={15} /> },
      { label: "AI Copilot", href: "/copilot", icon: <Bot size={15} /> },
      { label: "Settings", href: "/settings", icon: <Settings size={15} /> },
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

  // Auto-expand the correct section based on current route
  useEffect(() => {
    if (pathname.startsWith('/launch-engine')) {
      setExpandedItems((prev) => prev.includes("Launch Engine") ? prev : [...prev, "Launch Engine"]);
    }
    if (pathname.startsWith('/clinic-ops')) {
      setExpandedItems((prev) => prev.includes("Clinic Ops") ? prev : [...prev, "Clinic Ops"]);
    }
  }, [pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
  };

  const isActiveExact = (href: string) => pathname === href;

  const userInitial = user?.user_metadata?.name?.[0] || user?.email?.[0] || 'U';
  const userName = user?.user_metadata?.name || 'MediFlow User';
  const userEmail = user?.email || '';

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] md:hidden p-2 rounded-lg bg-white border border-black/10 shadow-sm"
      >
        {mobileOpen ? <X size={16} className="text-black" /> : <Menu size={16} className="text-black" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "sidebar fixed top-0 left-0 h-screen w-[260px] z-50 flex flex-col overflow-hidden",
          "md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-[64px] border-b border-black/[0.07] flex-shrink-0">
          <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center">
            <Activity size={14} className="text-white" />
          </div>
          <div>
            <h1 className="text-[13.5px] font-bold text-black tracking-tight leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
              MediFlow Nexus
            </h1>
            <p className="text-[9px] text-black/35 font-semibold tracking-[0.12em] uppercase mt-0.5">Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navigation.filter((group) => {
            const isStartup = pathname.startsWith('/launch-engine');
            const isClinic = pathname.startsWith('/clinic-ops') || pathname.startsWith('/dashboard') || pathname.startsWith('/reports') || pathname.startsWith('/marketplace') || pathname.startsWith('/copilot') || pathname.startsWith('/settings') || pathname.startsWith('/pricing');
            if (isStartup && group.section === "Clinic Intelligence") return false;
            if ((isClinic && !isStartup) && group.section === "Startup Engine") return false;
            return true;
          }).map((group) => (
            <div key={group.section}>
              <div className="section-label px-3 mb-1.5">{group.section}</div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isStartup = pathname.startsWith('/launch-engine');
                  if (isStartup && item.label === "Reports") return null;

                  // Dashboard redirects to GTM when in startup context
                  const itemHref = item.label === "Dashboard"
                    ? (isStartup ? "/launch-engine/gtm" : "/dashboard")
                    : item.href;

                  return (
                    <div key={item.label}>
                      {item.children ? (
                        <>
                          <button
                            onClick={() => toggleExpand(item.label)}
                            className={cn(
                              "sidebar-item w-full justify-between",
                              pathname.startsWith(item.href) && "active"
                            )}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="text-black/40">{item.icon}</span>
                              {item.label}
                            </span>
                            {expandedItems.includes(item.label) ? (
                              <ChevronDown size={13} className="text-black/25 flex-shrink-0" />
                            ) : (
                              <ChevronRight size={13} className="text-black/25 flex-shrink-0" />
                            )}
                          </button>
                          {expandedItems.includes(item.label) && (
                            <div className="ml-3 mt-0.5 pl-4 border-l border-black/[0.06] space-y-0.5 py-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  className={cn(
                                    "sidebar-item text-[12.5px]",
                                    isActiveExact(child.href) && "active"
                                  )}
                                  onClick={() => setMobileOpen(false)}
                                >
                                  <span className="text-black/35">{child.icon}</span>
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
                            "sidebar-item",
                            isActive(itemHref) && "active"
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="text-black/40">{item.icon}</span>
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
        <div className="p-3 border-t border-black/[0.07] space-y-1 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-[11px] font-bold uppercase flex-shrink-0">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-black truncate leading-tight">
                {userName}
              </p>
              <p className="text-[11px] text-black/35 truncate leading-tight">{userEmail}</p>
            </div>
          </div>

          <form action={logout}>
            <button type="submit" className="sidebar-item w-full text-[12.5px] text-red-500/70 hover:text-red-600 hover:bg-red-50">
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
