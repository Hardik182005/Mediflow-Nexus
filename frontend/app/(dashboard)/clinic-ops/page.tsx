"use client";

import { Building2, FileCheck, ShieldAlert, Users, Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

const intakeData = [
  { time: "08:00", patients: 12 },
  { time: "10:00", patients: 24 },
  { time: "12:00", patients: 18 },
  { time: "14:00", patients: 32 },
  { time: "16:00", patients: 15 },
  { time: "18:00", patients: 8 },
];

export default function ClinicOps() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Clinic Operations</h1>
          <p className="text-[13px] text-white/40 mt-1">Manage intake, verifications, and staff performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">Export Data</button>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={14} />
            New Workflow
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Patients Today", value: "142", change: "+12", icon: <Users size={16} />, positive: true },
          { title: "Insurance Verified", value: "94%", change: "+2.1%", icon: <ShieldAlert size={16} />, positive: true },
          { title: "Prior Auths Pending", value: "18", change: "-4", icon: <FileCheck size={16} />, positive: true },
          { title: "Avg Wait Time", value: "14m", change: "+2m", icon: <Building2 size={16} />, positive: false },
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
              <h3 className="text-[14px] font-bold text-white">Patient Intake Flow</h3>
              <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">Today's Volume</p>
            </div>
            <button className="btn-ghost">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="h-[280px] w-full chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intakeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 11 }} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#000000', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ffffff', fontSize: '12px' }}
                />
                <Bar dataKey="patients" radius={[4, 4, 0, 0]} barSize={32} fill="url(#barGradient)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Auth Queue */}
        <div className="glass-card p-0 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-bold text-white">Action Required</h3>
              <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold mt-1">Pending Auths</p>
            </div>
            <span className="badge badge-neutral">4 Urgent</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "S. Miller", status: "Missing Info", urgent: true },
                  { name: "J. Doe", status: "Payer Review", urgent: true },
                  { name: "A. Smith", status: "Appealed", urgent: false },
                  { name: "M. Johnson", status: "Draft", urgent: false },
                  { name: "K. Williams", status: "Draft", urgent: false },
                ].map((item, i) => (
                  <tr key={i}>
                    <td className="font-medium">{item.name}</td>
                    <td>
                      <span className={`badge ${item.urgent ? 'badge-neutral' : 'badge-neutral opacity-40'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button className="text-white/60 hover:text-white font-semibold text-[11px] transition-colors">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
