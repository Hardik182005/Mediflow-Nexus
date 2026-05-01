import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    approved: "text-emerald-400",
    pending: "text-amber-400",
    denied: "text-red-400",
    active: "text-emerald-400",
    inactive: "text-gray-400",
    high: "text-red-400",
    medium: "text-amber-400",
    low: "text-emerald-400",
    lead: "text-blue-400",
    meeting: "text-purple-400",
    demo: "text-cyan-400",
    proposal: "text-amber-400",
    closed: "text-emerald-400",
    lost: "text-red-400",
  };
  return colors[status.toLowerCase()] || "text-gray-400";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500/20";
  if (score >= 60) return "bg-amber-500/20";
  if (score >= 40) return "bg-orange-500/20";
  return "bg-red-500/20";
}
