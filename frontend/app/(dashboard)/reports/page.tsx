"use client";

import { useState, useEffect, useMemo } from "react";
import { FileBarChart, Download, Filter, FileText, Calendar, ChevronDown, CheckCircle2, Loader2, X, Mail, Clock, Repeat, BarChart, ShieldCheck, Users, Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

type ReportCategory = "Revenue Cycle" | "Denial Management" | "Clinic Ops" | "Sales Pipeline";
type DateRange = "Last 7 Days" | "Last 30 Days" | "Last 90 Days" | "This Year" | "All Time";

interface Report {
  name: string;
  type: string;
  date: string;
  status: string;
  category: ReportCategory;
}

export default function Reports() {
  const [selectedCategories, setSelectedCategories] = useState<ReportCategory[]>(["Revenue Cycle"]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("All Time");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState("Weekly");
  const [scheduleEmail, setScheduleEmail] = useState("");
  const [scheduleFormat, setScheduleFormat] = useState("PDF");
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [dynamicReports, setDynamicReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        { data: startups },
        { data: gtmRecs },
        { data: insurance },
        { data: pipeline },
        { data: patients }
      ] = await Promise.all([
        supabase.from('startup_profiles').select('id, name, created_at'),
        supabase.from('gtm_recommendations').select('id, startup_id, created_at'),
        supabase.from('insurance_cases').select('id, created_at'),
        supabase.from('sales_pipeline').select('id, created_at'),
        supabase.from('patients').select('id, created_at')
      ]);

      const reports: Report[] = [];

      // 1. GTM Reports from real recommendations
      if (gtmRecs && startups) {
        gtmRecs.forEach((rec: any) => {
          const startup = startups.find(s => s.id === rec.startup_id);
          reports.push({
            name: `GTM Strategy: ${startup?.name || 'Venture'}`,
            type: "PDF",
            date: new Date(rec.created_at).toLocaleDateString(),
            status: "Ready",
            category: "Sales Pipeline"
          });
        });
      }

      // 2. Readiness Audits for all startups
      if (startups) {
        startups.forEach((s: any) => {
          reports.push({
            name: `Onboarding Readiness: ${s.name}`,
            type: "CSV",
            date: new Date(s.created_at).toLocaleDateString(),
            status: "Ready",
            category: "Sales Pipeline"
          });
        });
      }

      // 3. Revenue & Denial Reports
      if (insurance && insurance.length > 0) {
        reports.push({
          name: "Consolidated Revenue Cycle Analysis",
          type: "Excel",
          date: new Date().toLocaleDateString(),
          status: "Ready",
          category: "Revenue Cycle"
        });
        reports.push({
          name: "Payer Performance & Denial Audit",
          type: "PDF",
          date: new Date().toLocaleDateString(),
          status: "Ready",
          category: "Denial Management"
        });
      }

      // 4. Clinical Ops Reports
      if (patients && patients.length > 0) {
        reports.push({
          name: "Patient Throughput & Intake Report",
          type: "PDF",
          date: new Date().toLocaleDateString(),
          status: "Ready",
          category: "Clinic Ops"
        });
      }

      // 5. Sales Pipeline
      if (pipeline && pipeline.length > 0) {
        reports.push({
          name: "Executive Sales Velocity Forecast",
          type: "Excel",
          date: new Date().toLocaleDateString(),
          status: "Ready",
          category: "Sales Pipeline"
        });
      }

      // Fallback/Legacy items if no data exists
      if (reports.length === 0) {
        reports.push(
          { name: "Monthly Revenue Cycle Analysis", type: "PDF", date: "May 1, 2026", status: "Ready", category: "Revenue Cycle" },
          { name: "Top Denial Reasons (Q2)", type: "CSV", date: "Apr 30, 2026", status: "Ready", category: "Denial Management" }
        );
      }

      setDynamicReports(reports);
    } catch (error) {
      console.error("Error fetching reports data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories: ReportCategory[] = ["Revenue Cycle", "Denial Management", "Clinic Ops", "Sales Pipeline"];
  const dateRanges: DateRange[] = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year", "All Time"];

  const toggleCategory = (cat: ReportCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const getDateCutoff = (range: DateRange): Date => {
    const now = new Date();
    switch (range) {
      case "Last 7 Days": return new Date(now.getTime() - 7 * 86400000);
      case "Last 30 Days": return new Date(now.getTime() - 30 * 86400000);
      case "Last 90 Days": return new Date(now.getTime() - 90 * 86400000);
      case "This Year": return new Date(now.getFullYear(), 0, 1);
      case "All Time": return new Date(2000, 0, 1);
    }
  };

  const filteredReports = useMemo(() => {
    return dynamicReports
      .filter((r) => selectedCategories.length === 0 || selectedCategories.includes(r.category))
      .filter((r) => new Date(r.date) >= getDateCutoff(dateRange))
      .sort((a, b) => sortBy === "newest" ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [dynamicReports, selectedCategories, dateRange, sortBy]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await fetchData();
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsGenerating(false);
    showToast("✅ Real-time intelligence synchronized and reports updated.");
  };

  const handleDownload = (report: Report) => {
    const content = JSON.stringify({ report: report.name, generatedAt: new Date().toISOString(), status: report.status }, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`📥 Downloaded: ${report.name}`);
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleEmail.trim()) return;
    setScheduleSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setScheduleSaving(false);
    setShowScheduleModal(false);
    showToast(`📅 ${scheduleFrequency} ${scheduleFormat} report scheduled for ${scheduleEmail}`);
    setScheduleEmail("");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-white text-black text-sm font-medium shadow-lg animate-fade-in">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Intelligence Reports</h1>
          <p className="text-[13px] text-white/40 mt-1">Export, schedule, and analyze custom data views.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowScheduleModal(true)} className="btn-secondary flex items-center gap-2">
            <Calendar size={14} /> Schedule Report
          </button>
          <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary flex items-center gap-2">
            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <FileBarChart size={14} />}
            {isGenerating ? "Generating..." : "Generate New"}
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
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleCategory(cat)}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-white border-white' : 'border-white/[0.1] group-hover:border-white/40'}`}>
                        {selectedCategories.includes(cat) && <CheckCircle2 size={12} className="text-black" />}
                      </div>
                      <span className="text-[13px] text-white/40 group-hover:text-white">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5e5d6b] uppercase tracking-wider block mb-2">Date Range</label>
                <div className="relative">
                  <button
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="w-full flex items-center justify-between input-field hover:border-white/20"
                  >
                    <span>{dateRange}</span>
                    <ChevronDown size={14} className={`text-white/20 transition-transform ${showDateDropdown ? "rotate-180" : ""}`} />
                  </button>
                  {showDateDropdown && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-[#0d0d15] border border-white/[0.1] rounded-xl py-1 z-20 shadow-xl">
                      {dateRanges.map((range) => (
                        <button
                          key={range}
                          onClick={() => { setDateRange(range); setShowDateDropdown(false); }}
                          className={`w-full text-left px-4 py-2 text-xs hover:bg-white/[0.04] transition-colors ${dateRange === range ? "text-white font-medium" : "text-white/40"}`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report List */}
        <div className="lg:col-span-3">
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-white">Available Reports <span className="text-white/20 font-normal">({filteredReports.length})</span></h3>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-white/40">Sort by:</span>
                <button
                  onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
                  className="text-[12px] font-semibold text-white/60 flex items-center gap-1 hover:text-white transition-colors"
                >
                  {sortBy === "newest" ? "Newest" : "Oldest"} <ChevronDown size={14} />
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-white/[0.04]">
              {isLoading ? (
                <div className="p-12 flex flex-col items-center justify-center text-white/20 gap-3">
                  <Loader2 size={24} className="animate-spin" />
                  <p className="text-sm">Fetching intelligence data...</p>
                </div>
              ) : (
                filteredReports.map((report, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40">
                        {report.category === "Revenue Cycle" ? <BarChart size={18} /> : 
                         report.category === "Denial Management" ? <ShieldCheck size={18} /> :
                         report.category === "Clinic Ops" ? <Users size={18} /> : <Briefcase size={18} />}
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
                      <button
                        onClick={() => handleDownload(report)}
                        className="btn-secondary px-3 py-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredReports.length === 0 && (
              <div className="p-12 text-center text-white/20">
                <p className="text-sm">No reports match the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Report Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0d0d15] border border-white/[0.1] rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Schedule Report</h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-white/30 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Delivery Email *</label>
                  <input type="email" value={scheduleEmail} onChange={(e) => setScheduleEmail(e.target.value)} className="input-field" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Frequency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Daily", "Weekly", "Monthly"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setScheduleFrequency(f)}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                          scheduleFrequency === f
                            ? "bg-white text-black"
                            : "bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white"
                        }`}
                      >
                        {f === "Daily" ? <Clock size={12} /> : f === "Weekly" ? <Repeat size={12} /> : <Calendar size={12} />}
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["PDF", "CSV", "Excel"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setScheduleFormat(fmt)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all ${
                          scheduleFormat === fmt
                            ? "bg-white text-black"
                            : "bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="glass-card p-3 text-[11px] text-white/40 flex items-start gap-2">
                <Mail size={14} className="mt-0.5 flex-shrink-0" />
                <span>Reports will be sent to your email at the start of each {scheduleFrequency.toLowerCase()} period.</span>
              </div>
              <button
                onClick={handleScheduleSubmit}
                disabled={!scheduleEmail.trim() || scheduleSaving}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-30"
              >
                {scheduleSaving ? <Loader2 size={14} className="animate-spin" /> : <Calendar size={14} />}
                {scheduleSaving ? "Scheduling..." : "Schedule Report"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
