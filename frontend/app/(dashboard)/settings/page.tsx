"use client";

import { useState, useEffect } from "react";
import { User, Building, Shield, Bell, Key, CreditCard, ChevronRight, Loader2, Check, X, Eye, EyeOff, Copy, MessageSquareText, Mic, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

type SettingsTab = "profile" | "workspace" | "security" | "notifications" | "api-keys" | "billing" | "support";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [apiKey, setApiKey] = useState("mfn_sk_••••••••••••••••");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyRegenSaving, setApiKeyRegenSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFirstName(user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || "");
        setLastName(user.user_metadata?.last_name || user.user_metadata?.name?.split(' ').slice(1).join(' ') || "");
        setRole(user.user_metadata?.role || "Enterprise Admin");
        setEmail(user.email || "");
      }
    };
    fetchUser();
  }, [supabase.auth]);

  const showToast = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(""), 3000); };

  const handleSave = async () => {
    setIsSaving(true); setSaved(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await supabase.auth.updateUser({ data: { first_name: firstName, last_name: lastName, role } });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch { console.error("Save failed"); }
    finally { setIsSaving(false); }
  };

  const handleAvatarUpload = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) showToast(`✅ Avatar "${file.name}" selected.`);
    };
    input.click();
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || newPassword !== confirmPassword) { showToast("❌ Passwords do not match."); return; }
    if (newPassword.length < 6) { showToast("❌ Password must be at least 6 characters."); return; }
    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) showToast(`❌ ${error.message}`);
      else { showToast("✅ Password updated successfully!"); setShowPasswordModal(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
    } catch { showToast("❌ Failed to update password."); }
    finally { setPasswordSaving(false); }
  };

  const handleRegenerateApiKey = async () => {
    setApiKeyRegenSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const newKey = "mfn_sk_" + Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setApiKey(newKey); setShowApiKey(true); setApiKeyRegenSaving(false);
    showToast("🔑 New API key generated. Copy it now.");
  };

  const handleCopyApiKey = () => { navigator.clipboard.writeText(apiKey); showToast("📋 API key copied."); };

  const navItems = [
    { id: "profile" as SettingsTab, label: "Profile", icon: <User size={14} /> },
    { id: "workspace" as SettingsTab, label: "Workspace", icon: <Building size={14} /> },
    { id: "security" as SettingsTab, label: "Security", icon: <Shield size={14} /> },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: <Bell size={14} /> },
    { id: "api-keys" as SettingsTab, label: "API Keys", icon: <Key size={14} /> },
    { id: "billing" as SettingsTab, label: "Billing", icon: <CreditCard size={14} /> },
    { id: "support" as SettingsTab, label: "AI Support", icon: <MessageSquareText size={14} /> },
  ];

  const cardClass = "bg-white border border-black rounded-2xl p-6";

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto animate-fade-in">
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-black text-white text-sm font-medium shadow-lg animate-fade-in">{notification}</div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Settings</h1>
          <p className="text-[13px] text-black mt-0.5">Manage your account, workspace, and billing.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary flex items-center gap-2 text-[13px]">
          {isSaving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : null}
          {isSaving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Settings Nav */}
        <div className="md:col-span-3">
          <div className="bg-white border border-black rounded-2xl p-2 space-y-0.5">
            {navItems.map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  activeTab === nav.id
                    ? "bg-black text-white"
                    : "text-black hover:bg-white hover:text-black"
                }`}
              >
                {nav.icon} {nav.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-9 space-y-5">
          {activeTab === "profile" && (
            <>
              <div className={cardClass}>
                <h2 className="text-[15px] font-bold text-black mb-0.5">Profile Information</h2>
                <p className="text-[12.5px] text-black mb-6">Update your personal details and public profile.</p>

                <div className="flex items-start gap-5 mb-7 pb-7 border-b border-black">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-black flex items-center justify-center text-black text-[20px] font-bold">
                    {firstName[0]}{lastName[0]}
                  </div>
                  <div className="space-y-1.5">
                    <button onClick={handleAvatarUpload} className="btn-secondary text-[12px] py-1.5 px-3">Upload avatar</button>
                    <p className="text-[11px] text-black">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-black">First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-field" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-black">Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[12px] font-semibold text-black">Email Address</label>
                    <input type="email" value={email} className="input-field opacity-60 cursor-not-allowed" disabled />
                    <p className="text-[11px] text-black">To change your email, contact support.</p>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[12px] font-semibold text-black">Role / Title</label>
                    <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="input-field" />
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <h2 className="text-[15px] font-bold text-black mb-0.5">Active Plan</h2>
                <p className="text-[12.5px] text-black mb-4">You are currently on the Enterprise Tier.</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-white border border-black">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-black text-[14px]">Enterprise Intelligence</h3>
                      <span className="badge badge-success">Active</span>
                    </div>
                    <p className="text-[12px] text-black mt-0.5">Unlimited clinics · Full Copilot API access</p>
                  </div>
                  <button onClick={() => window.location.href = "mailto:billing@mediflownexus.com"} className="mt-3 sm:mt-0 text-[12.5px] font-semibold text-black hover:text-black transition-colors flex items-center gap-1">
                    Manage Billing <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "workspace" && (
            <div className={cardClass}>
              <h2 className="text-[15px] font-bold text-black mb-0.5">Workspace Settings</h2>
              <p className="text-[12.5px] text-black mb-6">Manage your organization and team access.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-black">Organization Name</label>
                  <input type="text" defaultValue="MediFlow Nexus" className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-black">Industry</label>
                  <input type="text" defaultValue="Healthcare Intelligence" className="input-field" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className={cardClass}>
              <h2 className="text-[15px] font-bold text-black mb-0.5">Security</h2>
              <p className="text-[12.5px] text-black mb-6">Manage your password and 2FA settings.</p>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white border border-black flex items-center justify-between">
                  <div>
                    <p className="text-[13.5px] font-semibold text-black">Password</p>
                    <p className="text-[12px] text-black mt-0.5">Last changed: Never</p>
                  </div>
                  <button onClick={() => setShowPasswordModal(true)} className="btn-secondary text-[12px] py-1.5 px-3">Change Password</button>
                </div>
                <div className="p-4 rounded-xl bg-white border border-black flex items-center justify-between">
                  <div>
                    <p className="text-[13.5px] font-semibold text-black">Two-Factor Authentication</p>
                    <p className="text-[12px] text-black mt-0.5">Add an extra layer of security</p>
                  </div>
                  <span className="badge badge-neutral">Coming Soon</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className={cardClass}>
              <h2 className="text-[15px] font-bold text-black mb-0.5">Notifications</h2>
              <p className="text-[12.5px] text-black mb-6">Choose what alerts you receive.</p>
              {["Denial alerts", "New buyer matches", "Weekly digest", "System updates"].map((item) => (
                <label key={item} className="flex items-center justify-between py-3.5 border-b border-black last:border-0 cursor-pointer group">
                  <span className="text-[13.5px] text-black group-hover:text-black transition-colors">{item}</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-black rounded" />
                </label>
              ))}
            </div>
          )}

          {activeTab === "api-keys" && (
            <div className={cardClass}>
              <h2 className="text-[15px] font-bold text-black mb-0.5">API Keys</h2>
              <p className="text-[12.5px] text-black mb-6">Manage programmatic access to MediFlow APIs.</p>
              <div className="p-4 rounded-xl bg-white border border-black space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <code className="text-[12px] text-black font-mono">
                      {showApiKey ? apiKey : apiKey.replace(/(?<=mfn_sk_).+/, (m) => "•".repeat(m.length))}
                    </code>
                    {showApiKey && (
                      <button onClick={handleCopyApiKey} className="p-1 rounded hover:bg-black/10 text-black hover:text-black transition-colors"><Copy size={12} /></button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowApiKey(!showApiKey)} className="btn-ghost text-[11.5px] flex items-center gap-1 py-1 px-2">
                      {showApiKey ? <EyeOff size={12} /> : <Eye size={12} />} {showApiKey ? "Hide" : "Show"}
                    </button>
                    <button onClick={handleRegenerateApiKey} disabled={apiKeyRegenSaving} className="btn-secondary text-[11.5px] flex items-center gap-1 py-1 px-2">
                      {apiKeyRegenSaving ? <Loader2 size={12} className="animate-spin" /> : <Key size={12} />} {apiKeyRegenSaving ? "…" : "Regenerate"}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-black">Keep your API key secure. Do not share it publicly.</p>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className={cardClass}>
              <h2 className="text-[15px] font-bold text-black mb-0.5">Billing</h2>
              <p className="text-[12.5px] text-black mb-6">View invoices and manage payment methods.</p>
              <p className="text-[13px] text-black italic">No invoices yet. Your 14-day trial is active.</p>
            </div>
          )}

          {activeTab === "support" && (
            <div className={cardClass}>
              <h2 className="text-[15px] font-bold text-black mb-0.5">AI Support Agent</h2>
              <p className="text-[12.5px] text-black mb-5">Powered by GPT-4o and ElevenLabs Voice Agents.</p>
              <div className="bg-[#fafafa] border border-black rounded-2xl p-5 min-h-[280px] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                      <MessageSquareText size={13} className="text-white" />
                    </div>
                    <div className="bg-white border border-black text-black p-3.5 rounded-2xl rounded-tl-sm text-[13px] leading-relaxed shadow-sm max-w-[80%]">
                      Hi! I'm the Mediflow Nexus AI Support Assistant. How can I help you today?
                    </div>
                  </div>
                </div>
                <div className="relative mt-5">
                  <input type="text" placeholder="Type your message…" className="w-full bg-white border border-black rounded-xl py-3 pl-4 pr-24 text-[13px] text-black focus:outline-none focus:border-black transition-colors placeholder:text-black" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button className="p-2 text-black hover:text-black hover:bg-white rounded-lg transition-all"><Mic size={14} /></button>
                    <button className="p-2 text-white bg-black rounded-lg hover:bg-zinc-800 transition-all"><Send size={14} /></button>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-black text-center mt-3">Audio interactions processed using ElevenLabs TTS.</p>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white border border-black rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-black" style={{ fontFamily: "'Playfair Display', serif" }}>Change Password</h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-black hover:text-black transition-colors"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[12px] font-semibold text-black mb-1.5 block">Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" placeholder="Enter current password" />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-black mb-1.5 block">New Password</label>
                  <div className="relative">
                    <input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field pr-10" placeholder="Enter new password" />
                    <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-black transition-colors">
                      {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-black mb-1.5 block">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="Confirm new password" />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[11px] text-red-500 mt-1.5">Passwords do not match</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleChangePassword}
                disabled={!newPassword.trim() || newPassword !== confirmPassword || passwordSaving}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-30"
              >
                {passwordSaving ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                {passwordSaving ? "Updating…" : "Update Password"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
