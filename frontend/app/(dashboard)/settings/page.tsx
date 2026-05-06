"use client";

import { useState, useEffect } from "react";
import { User, Building, Shield, Bell, Key, CreditCard, ChevronRight, Loader2, Check, X, Eye, EyeOff, Copy, MessageSquareText, Mic, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

type SettingsTab = "profile" | "workspace" | "security" | "notifications" | "api-keys" | "billing";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState("");
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

  // Password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // API Key state
  const [apiKey, setApiKey] = useState("mfn_sk_••••••••••••••••");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyRegenSaving, setApiKeyRegenSaving] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({
          data: { first_name: firstName, last_name: lastName, role }
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        showToast(`✅ Avatar "${file.name}" selected. Upload integration coming soon.`);
      }
    };
    input.click();
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || newPassword !== confirmPassword) {
      showToast("❌ Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      showToast("❌ Password must be at least 6 characters.");
      return;
    }
    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        showToast(`❌ ${error.message}`);
      } else {
        showToast("✅ Password updated successfully!");
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      showToast("❌ Failed to update password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    setApiKeyRegenSaving(true);
    // Simulate key generation
    await new Promise((r) => setTimeout(r, 1000));
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const newKey = "mfn_sk_" + Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setApiKey(newKey);
    setShowApiKey(true);
    setApiKeyRegenSaving(false);
    showToast("🔑 New API key generated. Copy it now — it won't be shown again.");
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    showToast("📋 API key copied to clipboard.");
  };

  const navItems = [
    { id: "profile" as SettingsTab, label: "Profile", icon: <User size={16} /> },
    { id: "workspace" as SettingsTab, label: "Workspace", icon: <Building size={16} /> },
    { id: "security" as SettingsTab, label: "Security", icon: <Shield size={16} /> },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: <Bell size={16} /> },
    { id: "api-keys" as SettingsTab, label: "API Keys", icon: <Key size={16} /> },
    { id: "billing" as SettingsTab, label: "Billing", icon: <CreditCard size={16} /> },
    { id: "support" as any, label: "AI Support", icon: <MessageSquareText size={16} /> },
  ];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-fade-in">
      {/* Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-white text-black text-sm font-medium shadow-lg animate-fade-in">
          {notification}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight">Settings</h1>
          <p className="text-[13px] text-white/40 mt-1">Manage your account, workspace, and billing.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary flex items-center gap-2">
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
          {isSaving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Settings Navigation */}
        <div className="md:col-span-3 space-y-1">
          {navItems.map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                activeTab === nav.id
                  ? "bg-white text-black"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {nav.icon}
                {nav.label}
              </div>
              {activeTab === nav.id && <div className="w-1 h-4 rounded-full bg-black"></div>}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-9 space-y-6">
          {activeTab === "profile" && (
            <>
              <div className="glass-card p-6">
                <h2 className="text-[16px] font-bold text-white mb-1">Profile Information</h2>
                <p className="text-[12px] text-white/40 mb-6">Update your personal details and public profile.</p>

                <div className="flex items-start gap-6 mb-8 border-b border-white/[0.04] pb-8">
                  <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center text-white text-[24px] font-bold">
                    {firstName[0]}{lastName[0]}
                  </div>
                  <div className="space-y-2">
                    <button onClick={handleAvatarUpload} className="btn-secondary text-[12px] py-1.5 px-3">Upload new avatar</button>
                    <p className="text-[11px] text-white/20">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-white">First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-white">Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[12px] font-bold text-white">Email Address</label>
                    <input type="email" value={email} className="input-field" disabled />
                    <p className="text-[11px] text-white/20 mt-1">To change your email, please contact support.</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[12px] font-bold text-white">Role / Title</label>
                    <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="input-field" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 border-l-2 border-l-white/20">
                <h2 className="text-[16px] font-bold text-white mb-1">Active Plan</h2>
                <p className="text-[12px] text-white/40 mb-4">You are currently on the Enterprise Tier.</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">Enterprise Intelligence</h3>
                      <span className="badge badge-neutral text-[10px]">Active</span>
                    </div>
                    <p className="text-[12px] text-white/20 mt-1">Unlimited clinics, full Copilot API access.</p>
                  </div>
                  <button
                    onClick={() => window.location.href = "mailto:billing@mediflownexus.com?subject=Billing%20Inquiry"}
                    className="mt-4 sm:mt-0 text-[12px] font-semibold text-white/60 hover:text-white transition-colors flex items-center gap-1"
                  >
                    Manage Billing <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "workspace" && (
            <div className="glass-card p-6">
              <h2 className="text-[16px] font-bold text-white mb-1">Workspace Settings</h2>
              <p className="text-[12px] text-white/40 mb-6">Manage your organization and team access.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-white">Organization Name</label>
                  <input type="text" defaultValue="MediFlow Nexus" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-white">Industry</label>
                  <input type="text" defaultValue="Healthcare Intelligence" className="input-field" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="glass-card p-6">
              <h2 className="text-[16px] font-bold text-white mb-1">Security</h2>
              <p className="text-[12px] text-white/40 mb-6">Manage your password and 2FA settings.</p>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Password</p>
                    <p className="text-xs text-white/40 mt-0.5">Last changed: Never</p>
                  </div>
                  <button onClick={() => setShowPasswordModal(true)} className="btn-secondary text-[12px]">Change Password</button>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-white/40 mt-0.5">Add an extra layer of security</p>
                  </div>
                  <span className="badge badge-neutral text-[10px]">Coming Soon</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="glass-card p-6">
              <h2 className="text-[16px] font-bold text-white mb-1">Notifications</h2>
              <p className="text-[12px] text-white/40 mb-6">Choose what alerts you receive.</p>
              {["Denial alerts", "New buyer matches", "Weekly digest", "System updates"].map((item) => (
                <label key={item} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm text-white/60">{item}</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-white" />
                </label>
              ))}
            </div>
          )}

          {activeTab === "api-keys" && (
            <div className="glass-card p-6">
              <h2 className="text-[16px] font-bold text-white mb-1">API Keys</h2>
              <p className="text-[12px] text-white/40 mb-6">Manage programmatic access to MediFlow APIs.</p>
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-white/40 font-mono">
                      {showApiKey ? apiKey : apiKey.replace(/(?<=mfn_sk_).+/, (m) => "•".repeat(m.length))}
                    </code>
                    {showApiKey && (
                      <button onClick={handleCopyApiKey} className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Copy">
                        <Copy size={12} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowApiKey(!showApiKey)} className="btn-ghost text-[11px] flex items-center gap-1">
                      {showApiKey ? <EyeOff size={12} /> : <Eye size={12} />}
                      {showApiKey ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={handleRegenerateApiKey}
                      disabled={apiKeyRegenSaving}
                      className="btn-secondary text-[11px] flex items-center gap-1"
                    >
                      {apiKeyRegenSaving ? <Loader2 size={12} className="animate-spin" /> : <Key size={12} />}
                      {apiKeyRegenSaving ? "Generating..." : "Regenerate"}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-white/20">Keep your API key secure. Do not share it publicly.</p>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="glass-card p-6">
              <h2 className="text-[16px] font-bold text-white mb-1">Billing</h2>
              <p className="text-[12px] text-white/40 mb-6">View invoices and manage payment methods.</p>
              <p className="text-sm text-white/40 italic">No invoices yet. Your 14-day trial is active.</p>
            </div>
          )}

          {activeTab === ("support" as any) && (
            <div className="glass-card p-6">
              <h2 className="text-[16px] font-bold text-white mb-1">AI Support Agent</h2>
              <p className="text-[12px] text-white/40 mb-6">Powered by Gemini and ElevenLabs Voice Agents.</p>
              <div className="flex flex-col space-y-4">
                <div className="flex-1 p-4 rounded-xl bg-black/[0.2] border border-white/[0.05] min-h-[300px] flex flex-col justify-end">
                  <div className="space-y-4 mb-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <MessageSquareText size={14} />
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 text-blue-100 p-3 rounded-2xl rounded-tl-sm text-sm">
                        Hi! I am the Mediflow Nexus AI Support Assistant. How can I help you today?
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <input type="text" placeholder="Type your message..." className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl py-3 pl-4 pr-24 text-sm text-white focus:outline-none focus:border-white/20" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <Mic size={14} />
                      </button>
                      <button className="p-2 text-black bg-white rounded-lg hover:bg-white/90 transition-all">
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-white/20 text-center">Audio interactions are processed using ElevenLabs TTS.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0d0d15] border border-white/[0.1] rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Change Password</h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-white/30 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" placeholder="Enter current password" />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">New Password</label>
                  <div className="relative">
                    <input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field pr-10" placeholder="Enter new password" />
                    <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                      {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="Confirm new password" />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[10px] text-red-400 mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleChangePassword}
                disabled={!newPassword.trim() || newPassword !== confirmPassword || passwordSaving}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-30"
              >
                {passwordSaving ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                {passwordSaving ? "Updating..." : "Update Password"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
