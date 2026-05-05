import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Globe, Users, Target, Rocket, Mail, Building, MapPin, Zap } from "lucide-react";

export const revalidate = 0; // Disable static caching for dynamic public page

export default async function MarketplaceStartupPage({ params }: { params: { startupId: string } }) {
  const supabase = await createClient();

  const { data: startup, error } = await supabase
    .from("startup_profiles")
    .select("*")
    .eq("id", params.startupId)
    .single();

  if (error || !startup) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-white/20 pb-20">
      {/* Top Nav (Public) */}
      <nav className="border-b border-white/[0.05] bg-[#000000]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Zap size={16} className="text-black fill-black" />
            </div>
            <span className="font-bold tracking-tight text-white">MediFlow Marketplace</span>
          </div>
          <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            For Hospitals
          </button>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 mt-12 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="glass-card p-8 border-white/[0.05]">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {startup.logo_url ? (
                    <img src={startup.logo_url} alt={startup.name} className="w-20 h-20 rounded-2xl object-cover bg-white/[0.03] border border-white/[0.1]" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center text-3xl font-bold uppercase text-white/40">
                      {startup.name[0]}
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{startup.name}</h1>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-neutral uppercase tracking-widest px-3">{startup.category || "Healthcare IT"}</span>
                      {startup.stage && <span className="badge badge-neutral uppercase tracking-widest px-3">{startup.stage}</span>}
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-xl font-medium text-white/90 leading-relaxed mb-6">
                {startup.value_proposition || startup.description}
              </h2>
              
              <p className="text-white/60 leading-relaxed">
                {startup.description}
              </p>
            </div>

            {/* Target & ICP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6 border-white/[0.05]">
                <div className="flex items-center gap-2 mb-4 text-white/40 uppercase text-[11px] font-bold tracking-widest">
                  <Target size={14} /> Ideal Customer Profile
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {startup.icp || "Hospitals and multi-specialty clinics looking to optimize clinical workflows."}
                </p>
              </div>
              <div className="glass-card p-6 border-white/[0.05]">
                <div className="flex items-center gap-2 mb-4 text-white/40 uppercase text-[11px] font-bold tracking-widest">
                  <Rocket size={14} /> Target Market
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {startup.target_market || "US and international healthcare providers."}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / CTA */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-white/[0.05] sticky top-24">
              <h3 className="text-lg font-bold mb-2">Interested in {startup.name}?</h3>
              <p className="text-sm text-white/40 mb-6">Connect directly with their team to see a demo or discuss a pilot program.</p>
              
              {/* Form trigger / Button */}
              <button 
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-[13px] uppercase tracking-widest font-bold"
                onClick={(e) => {
                  const target = e.currentTarget;
                  const originalHtml = target.innerHTML;
                  target.innerHTML = "✅ Request Sent";
                  target.classList.add("bg-emerald-500", "text-black", "border-emerald-500");
                  target.classList.remove("text-white");
                  setTimeout(() => {
                    target.innerHTML = originalHtml;
                    target.classList.remove("bg-emerald-500", "text-black", "border-emerald-500");
                    target.classList.add("text-white");
                  }, 3000);
                }}
              >
                <Mail size={16} /> Book a Meeting
              </button>

              <div className="mt-8 space-y-4 pt-6 border-t border-white/[0.05]">
                {startup.website && (
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <Globe size={16} />
                    <a href={startup.website} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{startup.website.replace(/^https?:\/\//, '')}</a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Building size={16} />
                  <span>{startup.team_size || "10-50"} Employees</span>
                </div>
                {startup.hq_location && (
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <MapPin size={16} />
                    <span>{startup.hq_location}</span>
                  </div>
                )}
                {startup.founded && (
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <Users size={16} />
                    <span>Founded {startup.founded}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
