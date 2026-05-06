"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, Cell
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Activity, Users, DollarSign, Clock, ShieldAlert, FileText, Download, AlertTriangle, Bot, Loader2, Rocket, Target, Hospital, BarChart3, Brain, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ patients: 0, cases: 0, denials: 0, startups: 0, matches: 0 });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const [pRes, cRes, sRes, mRes] = await Promise.all([
        supabase.from('patients').select('id', { count: 'exact', head: true }),
        supabase.from('insurance_cases').select('id', { count: 'exact', head: true }),
        supabase.from('startup_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('marketplace_matches').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        patients: pRes.count || 0,
        cases: cRes.count || 0,
        denials: 0,
        startups: sRes.count || 0,
        matches: mRes.count || 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const revenueChartData = [
    { month: "Jul", revenue: 285000, predicted: 290000 },
    { month: "Aug", revenue: 302000, predicted: 310000 },
    { month: "Sep", revenue: 298000, predicted: 305000 },
    { month: "Oct", revenue: 325000, predicted: 330000 },
    { month: "Nov", revenue: 340000, predicted: 345000 },
    { month: "Dec", revenue: 358000, predicted: 365000 },
    { month: "Jan", revenue: 372000, predicted: 380000 },
    { month: "Feb", revenue: 385000, predicted: 390000 },
    { month: "Mar", revenue: 398000, predicted: 405000 },
    { month: "Apr", revenue: 415000, predicted: 420000 },
  ];

  const denialsByReason = [
    { reason: "Documentation", count: 45, amount: 128000 },
    { reason: "Coding Errors", count: 38, amount: 95000 },
    { reason: "Auth Not Obtained", count: 29, amount: 87000 },
    { reason: "Medically Necessary", count: 22, amount: 72000 },
    { reason: "Timely Filing", count: 15, amount: 42000 },
  ];

  const recentActivities = [
    { id: 1, type: "Verification", patient: "Sarah Mitchell", time: "2 min ago", description: "Insurance verified successfully via clearinghouse.", status: "success" },
    { id: 2, type: "Denial Alert", patient: "James Rodriguez", time: "15 min ago", description: "Claim CO-197 denied. Missing prior authorization.", status: "error" },
    { id: 3, type: "Auth Request", patient: "Emily Chen", time: "1 hour ago", description: "Prior auth submitted to UnitedHealthcare. Pending review.", status: "warning" },
  ];

  const kpiData = [
    { title: "Total Revenue (MTD)", value: "$2.4M", change: "+12.5%", isPositive: true, icon: <DollarSign size={16} /> },
    { title: "Net Collection Rate", value: "94.2%", change: "+1.2%", isPositive: true, icon: <Activity size={16} /> },
    { title: "Active Denials", value: stats.denials.toString() || "0", change: "-5.4%", isPositive: true, icon: <ShieldAlert size={16} /> },
    { title: "Avg. Days in A/R", value: "24", change: "+2", isPositive: false, icon: <Clock size={16} /> },
    { title: "Patient Volume", value: stats.patients > 0 ? stats.patients.toLocaleString() : "0", change: "+8.4%", isPositive: true, icon: <Users size={16} /> },
    { title: "Clean Claim Rate", value: "98.1%", change: "+0.5%", isPositive: true, icon: <FileText size={16} /> },
  ];

  const handleExport = () => {
    setNotification("📥 Report exported successfully.");
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in font-sans">

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-black text-white text-sm font-bold shadow-2xl animate-fade-in">
          {notification}
        </div>
      )}
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-black tracking-tight font-serif">Executive Summary</h1>
          <p className="text-[13px] text-black/40 font-medium">Real-time revenue intelligence and operational metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-black/5 p-1 rounded-lg flex border border-black/5">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-[12px] font-bold rounded-md transition-all ${
                  timeRange === range 
                    ? "bg-black text-white shadow-md" 
                    : "text-black/40 hover:text-black"
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={handleExport} className="bg-white border border-black/10 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/5 transition-all flex items-center gap-2 shadow-sm">
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white border border-black/[0.05] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-black text-white">
                {kpi.icon}
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md ${
                kpi.isPositive ? "text-black bg-black/5" : "text-black/40 bg-black/[0.02]"
              }`}>
                {kpi.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </div>
            </div>
            <h3 className="text-[24px] font-bold text-black tracking-tight">{kpi.value}</h3>
            <p className="text-[12px] text-black/40 font-bold uppercase tracking-wider mt-1">{kpi.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="bg-white border border-black/[0.05] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[16px] font-bold text-black font-serif">Revenue Trajectory</h3>
              <p className="text-[11px] text-black/40 uppercase tracking-widest font-bold mt-1">Projected vs Actual</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                <span className="text-[11px] text-black/60 font-bold">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-black/10"></div>
                <span className="text-[11px] text-black/60 font-bold">Projected</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 11, fontWeight: 700 }} tickFormatter={(val) => `$${val/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '12px', color: '#000000', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="predicted" stroke="rgba(0,0,0,0.1)" strokeWidth={2} strokeDasharray="4 4" fillOpacity={0} />
                <Area type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Denial Distribution Bar Chart */}
        <div className="bg-white border border-black/[0.05] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[16px] font-bold text-black font-serif">Denial Distribution</h3>
              <p className="text-[11px] text-black/40 uppercase tracking-widest font-bold mt-1">By Category</p>
            </div>
            <button className="text-[11px] text-black/60 hover:text-black font-bold uppercase tracking-tight transition-colors">View All</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={denialsByReason} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="reason" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(0,0,0,0.6)', fontSize: 11, fontWeight: 700 }} width={100} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {denialsByReason.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#000000' : index === 1 ? '#404040' : '#737373'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="bg-white border border-black/[0.05] rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-black/[0.05] flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-black">Real-Time Intelligence</h3>
              <p className="text-[11px] text-black/40 font-bold uppercase tracking-widest mt-1">Latest AI Actions</p>
            </div>
            <div className="px-2 py-1 bg-black text-white text-[10px] font-bold rounded uppercase">Live</div>
          </div>
          <div className="divide-y divide-black/[0.05]">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-5 flex gap-4 hover:bg-black/[0.02] transition-colors cursor-pointer">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.status === 'success' ? 'bg-black text-white' : 'bg-black/5 text-black/40'
                }`}>
                  {activity.type === 'Verification' ? <ShieldAlert size={16} /> : <Activity size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[14px] font-bold text-black">{activity.patient}</p>
                    <span className="text-[11px] text-black/30 font-bold">{activity.time}</span>
                  </div>
                  <p className="text-[13px] text-black/60 leading-relaxed">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-black/[0.02] text-center">
            <button className="text-[12px] font-bold text-black hover:underline transition-all">
              View All Intelligence Logs
            </button>
          </div>
        </div>

        {/* Copilot Mini */}
        <div className="bg-white border border-black/[0.05] rounded-3xl p-6 flex flex-col shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-xl">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-black">MediFlow Copilot</h3>
              <p className="text-[11px] text-black/40 font-bold uppercase tracking-widest">AI Assistant Active</p>
            </div>
          </div>

          <div className="flex-1 bg-black/[0.02] border border-black/[0.05] rounded-2xl p-6 flex flex-col justify-end space-y-6">
            <div className="bg-white border border-black/[0.05] p-4 rounded-2xl rounded-bl-none shadow-sm text-[13px] text-black leading-relaxed font-medium">
              I've detected a spike in denials from <strong>Blue Cross</strong> for procedure code <strong>99214</strong>. Would you like me to draft an appeal template?
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button className="text-[11px] bg-black text-white px-4 py-2 rounded-full font-bold shadow-md hover:bg-black/90 transition-all">
                Yes, draft template
              </button>
              <button className="text-[11px] bg-white border border-black/10 text-black px-4 py-2 rounded-full font-bold hover:bg-black/5 transition-all">
                Show affected claims
              </button>
            </div>

            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask Copilot anything..." 
                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-[13px] text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white p-1.5 rounded-lg">
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
