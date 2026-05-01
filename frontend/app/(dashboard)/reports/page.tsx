"use client";

import { FileBarChart, Download, Filter, FileText, Calendar, ChevronDown, CheckCircle2 } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Intelligence Reports</h1>
          <p className="text-[13px] text-white/40 mt-1">Export, schedule, and analyze custom data views.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Calendar size={14} /> Schedule Report
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FileBarChart size={14} />
            Generate New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-4">
              <Filter size={16} className="text-white/60" />
              <h3 className="text-[14px] font-bold text-white">Filters</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-bold text-[#5e5d6b] uppercase tracking-wider block mb-2">Category</label>
                <div className="space-y-2">
                  {['Revenue Cycle', 'Denial Management', 'Clinic Ops', 'Sales Pipeline'].map((cat, i) => (
                    <label key={i} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${i === 0 ? 'bg-white border-white' : 'border-white/[0.1] group-hover:border-white/40'}`}>
                        {i === 0 && <CheckCircle2 size={12} className="text-black" />}
                      </div>
                      <span className="text-[13px] text-white/40 group-hover:text-white">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5e5d6b] uppercase tracking-wider block mb-2">Date Range</label>
                <button className="w-full flex items-center justify-between input-field hover:border-white/20">
                  <span>Last 30 Days</span>
                  <ChevronDown size={14} className="text-white/20" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report List */}
        <div className="lg:col-span-3">
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-white">Available Reports</h3>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-white/40">Sort by:</span>
                <button className="text-[12px] font-semibold text-white/60 flex items-center gap-1">
                  Newest <ChevronDown size={14} />
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-white/[0.04]">
              {[
                { name: "Monthly Revenue Cycle Analysis", type: "PDF", date: "May 1, 2026", status: "Ready" },
                { name: "Top Denial Reasons (Q2)", type: "CSV", date: "Apr 30, 2026", status: "Ready" },
                { name: "Payer Contract Performance", type: "Excel", date: "Apr 28, 2026", status: "Ready" },
                { name: "Sales Pipeline Velocity", type: "PDF", date: "Apr 25, 2026", status: "Ready" },
                { name: "Patient Intake Bottlenecks", type: "PDF", date: "Apr 20, 2026", status: "Ready" },
              ].map((report, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-white">{report.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[12px] text-white/20">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{report.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="badge badge-success hidden md:inline-flex">{report.status}</span>
                    <button className="btn-secondary px-3 py-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download size={14} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-white/[0.04] bg-white/[0.01] flex justify-center">
              <button className="btn-ghost">Load More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
