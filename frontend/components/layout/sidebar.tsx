"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Building2, UserPlus, Shield, FileCheck, AlertTriangle,
  DollarSign, TrendingUp, Landmark, Rocket, Users, Search, Target,
  BarChart3, Store, FileBarChart, Bot, Settings, ChevronDown, ChevronRight,
  Activity, Zap, Menu, X
} from "lucide-react";

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
      { label: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    section: "Clinic Intelligence",
    items: [
      {
        label: "Clinic Ops", href: "/clinic-ops", icon: <Building2 size={18} />,
        children: [
          { label: "Patient Intake", href: "/clinic-ops/patient-intake", icon: <UserPlus size={16} /> },
          { label: "Insurance (VOB)", href: "/clinic-ops/insurance", icon: <Shield size={16} /> },
          { label: "Prior Auth", href: "/clinic-ops/prior-auth", icon: <FileCheck size={16} /> },
          { label: "Denials", href: "/clinic-ops/denials", icon: <AlertTriangle size={16} /> },
          { label: "Revenue", href: "/clinic-ops/revenue", icon: <DollarSign size={16} /> },
          { label: "Growth", href: "/clinic-ops/growth", icon: <TrendingUp size={16} /> },
          { label: "Payer Intel", href: "/clinic-ops/payer", icon: <Landmark size={16} /> },
        ],
      },
    ],
  },
  {
    section: "Startup Engine",
    items: [
      {
        label: "Launch Engine", href: "/launch-engine", icon: <Rocket size={18} />,
        children: [
          { label: "Onboarding", href: "/launch-engine/onboarding", icon: <Zap size={16} /> },
          { label: "Buyer Discovery", href: "/launch-engine/buyer-discovery", icon: <Search size={16} /> },
          { label: "GTM Engine", href: "/launch-engine/gtm", icon: <Target size={16} /> },
          { label: "Sales Pipeline", href: "/launch-engine/sales-pipeline", icon: <BarChart3 size={16} /> },
          { label: "Competitive Intel", href: "/launch-engine/competitive", icon: <Users size={16} /> },
        ],
      },
    ],
  },
  {
    section: "Platform",
    items: [
      { label: "Marketplace", href: "/marketplace", icon: <Store size={18} /> },
      { label: "Reports", href: "/reports", icon: <FileBarChart size={18} /> },
      { label: "AI Copilot", href: "/copilot", icon: <Bot size={18} /> },
      { label: "Settings", href: "/settings", icon: <Settings size={18} /> },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Clinic Ops", "Launch Engine"]);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "sidebar fixed top-0 left-0 h-screen w-64 z-50 flex flex-col overflow-hidden",
          "md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{ transition: "transform 0.3s ease" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl gradient-blue flex items-center justify-center">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">MediFlow Nexus</h1>
            <p className="text-[10px] text-surface-500 font-medium">Healthcare Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {navigation.map((group) => (
            <div key={group.section}>
              <div className="sidebar-section-title">{group.section}</div>
              {group.items.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className={cn(
                          "sidebar-item w-full justify-between",
                          isActive(item.href) && "active"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {item.icon}
                          {item.label}
                        </span>
                        {expandedItems.includes(item.label) ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </button>
                      {expandedItems.includes(item.label) && (
                        <div className="ml-4 mt-1 space-y-0.5 animate-fade-in">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "sidebar-item text-[13px] py-2",
                                isActive(child.href) && "active"
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
                      href={item.href}
                      className={cn(
                        "sidebar-item",
                        isActive(item.href) && "active"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-teal flex items-center justify-center text-white text-xs font-bold">
              AG
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Avinash Gehi</p>
              <p className="text-[11px] text-surface-500 truncate">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
