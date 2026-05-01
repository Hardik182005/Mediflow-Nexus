"use client";

import { Target, Search, BarChart3, Users, Zap, ArrowUpRight, ArrowDownRight, Layers, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

const pipelineData = [
  { month: "Jan", leads: 40, qualified: 24, closed: 12 },
  { month: "Feb", leads: 55, qualified: 35, closed: 18 },
  { month: "Mar", leads: 70, qualified: 45, closed: 25 },
  { month: "Apr", leads: 90, qualified: 60, closed: 35 },
  { month: "May", leads: 110, qualified: 75, closed: 42 },
  { month: "Jun", leads: 130, qualified: 90, closed: 55 },
];

export default function LaunchEngine() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Launch Engine</h1>
          <p className="text-[13px] text-white/40 mt-1">Accelerate GTM and automate buyer discovery.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">View Sequences</button>
          <button className="btn-primary flex items-center gap-2">
            <Zap size={14} />
            Start Campaign
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Active Campaigns", value: "8", change: "+2", icon: <Target size={16} />, positive: true },
          { title: "New Leads Found", value: "1,240", change: "+14.2%", icon: <Search size={16} />, positive: true },
          { title: "Conversion Rate", value: "8.4%", change: "-0.5%", icon: <BarChart3 size={16} />, positive: false },
          { title: "Pipeline Value", value: "$4.2M", change: "+$800k", icon: <DollarSign size={16} />, positive: true },
        ].map((kpi, i) => (
          <div key={i} className="glass-card kpi-card">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-white">
                {kpi.icon}
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md ${
                kpi.positive ? "text-white bg-white/10" : "text-white/40 bg-white/5"
              }`}>
                {kpi.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </div>
            </div>
            <h3 className="text-[24px] font-bold text-white tracking-tight">{kpi.value}</h3>
            <p className="text-[12px] text-white/40 font-medium mt-1">{kpi.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="glass-card lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[14px] font-bold text-white">Pipeline Generation</h3>
              <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">Lead to Close Velocity</p>
            </div>
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]"></div>
                <span className="text-[11px] text-white/40 font-medium">Closed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/40"></div>
                <span className="text-[11px] text-white/40 font-medium">Qualified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <span className="text-[11px] text-white/40 font-medium">Leads</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                   <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#000000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '12px' }}
                  itemStyle={{ color: '#ffffff' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="leads" stackId="1" stroke="rgba(255,255,255,0.2)" strokeWidth={2} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="qualified" stackId="2" stroke="rgba(255,255,255,0.5)" strokeWidth={2} fill="url(#colorQual)" />
                <Area type="monotone" dataKey="closed" stackId="3" stroke="#ffffff" strokeWidth={2} fill="url(#colorClosed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Activity */}
        <div className="glass-card p-0 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-bold text-white">Active Sequences</h3>
              <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">Outbound Status</p>
            </div>
            <button className="btn-ghost p-1"><Layers size={14} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
             {[
               { name: "Enterprise Clinics", type: "Email", status: "Running", progress: 68 },
               { name: "West Coast Payers", type: "LinkedIn", status: "Paused", progress: 45 },
               { name: "Q3 Expansion", type: "Multi", status: "Draft", progress: 0 },
               { name: "Churn Recovery", type: "Email", status: "Running", progress: 89 },
             ].map((seq, i) => (
                <div key={i} className="pipeline-card mb-2 mx-2">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-[13px] font-semibold text-white">{seq.name}</h4>
                      <p className="text-[11px] text-white/40 mt-0.5">{seq.type} Sequence</p>
                    </div>
                   <span className="badge badge-neutral">{seq.status}</span>
                 </div>
                                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-medium text-white/20 uppercase tracking-wider">
                      <span>Progress</span>
                      <span>{seq.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-white" 
                        style={{ width: `${seq.progress}%` }}
                      ></div>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Needed because DollarSign wasn't imported from lucide-react above. Let's fix that.
// I will just add DollarSign to the imports in the next step, or I can use any icon.
