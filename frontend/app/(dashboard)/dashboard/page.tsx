"use client";

import { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, LineChart, Line, ReferenceLine
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Activity, Users, DollarSign, Clock, ShieldAlert, FileText, Download, AlertTriangle, Bot } from "lucide-react";
import { revenueChartData, denialsByReason } from "@/lib/demo-data";

const recentActivities = [
  { id: 1, type: "Verification", patient: "Sarah Mitchell", time: "2 min ago", description: "Insurance verified successfully via clearinghouse.", status: "success" },
  { id: 2, type: "Denial Alert", patient: "James Rodriguez", time: "15 min ago", description: "Claim CO-197 denied. Missing prior authorization.", status: "error" },
  { id: 3, type: "Auth Request", patient: "Emily Chen", time: "1 hour ago", description: "Prior auth submitted to UnitedHealthcare. Pending review.", status: "warning" },
  { id: 4, type: "Payment", patient: "Michael Thompson", time: "2 hours ago", description: "$350 patient responsibility collected.", status: "success" },
];

const kpiData = [
  { title: "Total Revenue (MTD)", value: "$2.4M", change: "+12.5%", isPositive: true, icon: <DollarSign size={16} />, color: "#ffffff" },
  { title: "Net Collection Rate", value: "94.2%", change: "+1.2%", isPositive: true, icon: <Activity size={16} />, color: "#cccccc" },
  { title: "Active Denials", value: "142", change: "-5.4%", isPositive: true, icon: <ShieldAlert size={16} />, color: "#888888" },
  { title: "Avg. Days in A/R", value: "24", change: "+2", isPositive: false, icon: <Clock size={16} />, color: "#ffffff" },
  { title: "Patient Volume", value: "1,204", change: "+8.4%", isPositive: true, icon: <Users size={16} />, color: "#cccccc" },
  { title: "Clean Claim Rate", value: "98.1%", change: "+0.5%", isPositive: true, icon: <FileText size={16} />, color: "#ffffff" },
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Executive Summary</h1>
          <p className="text-[13px] text-white/40 mt-1">Real-time revenue intelligence and operational metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card flex p-1">
            {["7d", "30d", "90d", "1y"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-md transition-all ${
                  timeRange === range 
                    ? "bg-white text-black shadow-md" 
                    : "text-white/40 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download size={14} />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="glass-card kpi-card">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-white">
                {kpi.icon}
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md ${
                kpi.isPositive ? "text-white bg-white/10" : "text-white/40 bg-white/5"
              }`}>
                {kpi.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </div>
            </div>
            <h3 className="text-[24px] font-bold text-white tracking-tight">{kpi.value}</h3>
            <p className="text-[12px] text-white/40 font-medium mt-1">{kpi.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="glass-card lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[14px] font-bold text-white">Revenue Trajectory</h3>
              <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">Projected vs Actual</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]"></div>
                <span className="text-[11px] text-white/40 font-medium">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <span className="text-[11px] text-white/40 font-medium">Projected</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} tickFormatter={(val) => `$${val/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#000000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '12px' }}
                  itemStyle={{ color: '#ffffff' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="predicted" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorProjected)" />
                <Area type="monotone" dataKey="revenue" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Denial Reasons */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[14px] font-bold text-white">Denial Distribution</h3>
              <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">By Category</p>
            </div>
            <button className="text-[11px] text-white/60 hover:text-white font-semibold transition-colors">View All</button>
          </div>
          <div className="h-[280px] w-full chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={denialsByReason} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" hide />
                <YAxis dataKey="reason" type="category" axisLine={false} tickLine={false} tick={{ fill: '#c7c4d7', fontSize: 11, fontWeight: 500 }} width={120} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#1b1b23', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e4e1ed', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {denialsByReason.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ffffff' : index === 1 ? '#cccccc' : '#888888'} />
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
        <div className="glass-card p-0 overflow-hidden">
          <div className="p-5 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01]">
            <div>
              <h3 className="text-[14px] font-bold text-white">Real-Time Intelligence</h3>
              <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">Latest AI Actions</p>
            </div>
            <span className="badge badge-neutral">Live</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 flex gap-4 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.status === 'success' ? 'bg-white/10 text-white' : 
                  activity.status === 'warning' ? 'bg-white/5 text-white/60' : 
                  'bg-white/5 text-white/40'
                }`}>
                  {activity.type === 'Verification' ? <ShieldAlert size={14} /> : 
                   activity.type === 'Denial Alert' ? <AlertTriangle size={14} /> : 
                   <Activity size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[13px] font-semibold text-white">{activity.patient}</p>
                    <span className="text-[11px] text-white/20 whitespace-nowrap">{activity.time}</span>
                  </div>
                  <p className="text-[12px] text-white/40 leading-relaxed line-clamp-2">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/[0.04] bg-white/[0.01] text-center">
            <button className="text-[12px] font-semibold text-[#c7c4d7] hover:text-[#e4e1ed] transition-colors">
              View All Intelligence Logs
            </button>
          </div>
        </div>

        {/* Copilot Mini */}
        <div className="glass-card p-5 flex flex-col relative overflow-hidden">
          {/* Background Blur Removed */}
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <Bot size={20} className="text-black" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">MediFlow Copilot</h3>
              <p className="text-[11px] text-white/40 font-medium">AI Assistant Ready</p>
            </div>
          </div>

          <div className="flex-1 bg-[#0d0d15] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-end space-y-4 relative z-10">
            <div className="flex justify-start">
              <div className="chat-bubble-assistant">
                I've detected a spike in denials from <strong>Blue Cross</strong> for procedure code <strong>99214</strong>. Would you like me to draft an appeal template based on recent successful overturns?
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <button className="text-[11px] bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] text-[#c7c4d7] px-3 py-1.5 rounded-full transition-colors font-medium">
                Yes, draft template
              </button>
              <button className="text-[11px] bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] text-[#c7c4d7] px-3 py-1.5 rounded-full transition-colors font-medium">
                Show affected claims
              </button>
            </div>

            <div className="relative mt-2">
              <input 
                type="text" 
                placeholder="Ask Copilot to analyze data..." 
                className="input-field pr-10"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-white/80 p-1">
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Network Effect / Flywheel Visual */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[14px] font-bold text-white">Network Effect Score</h3>
            <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">Platform Flywheel Metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52,211,153)] animate-pulse"></div>
            <span className="text-[11px] text-white/40 font-medium">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Startups Onboarded", value: "24", change: "+3 this week", metric: "startup" },
            { label: "Buyer Matches Made", value: "156", change: "+18 this week", metric: "match" },
            { label: "Clinics Active", value: "12", change: "+2 this month", metric: "clinic" },
            { label: "AI Accuracy", value: "94.2%", change: "+1.8% from data", metric: "ai" },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <p className="text-2xl font-extrabold text-white">{item.value}</p>
              <p className="text-[11px] text-white/40 mt-1">{item.label}</p>
              <p className="text-[10px] text-emerald-400/80 mt-1">{item.change}</p>
            </div>
          ))}
        </div>

        {/* Flywheel Loop */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {[
            { step: "More Startups", icon: "🚀" },
            { step: "More Buyer Matches", icon: "🎯" },
            { step: "More Clinics Join", icon: "🏥" },
            { step: "More Data Generated", icon: "📊" },
            { step: "AI Gets Smarter", icon: "🧠" },
            { step: "More Startups", icon: "🔄" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className="text-center">
                <div className="text-lg mb-1">{item.icon}</div>
                <p className="text-[10px] text-white/40 font-medium whitespace-nowrap">{item.step}</p>
              </div>
              {i < 5 && (
                <span className="text-white/10 text-lg font-bold flex-shrink-0">→</span>
              )}
            </div>
          ))}
        </div>

        {/* Flywheel Score Bar */}
        <div className="mt-4 pt-4 border-t border-white/[0.04]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-white/40 font-medium">Network Effect Strength</span>
            <span className="text-[12px] font-bold text-white">72/100</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-white/40 to-white transition-all duration-1000" style={{ width: "72%" }}></div>
          </div>
          <p className="text-[10px] text-white/20 mt-2">Score increases as more startups, clinics, and data flow through the platform.</p>
        </div>
      </div>
    </div>
  );
}
