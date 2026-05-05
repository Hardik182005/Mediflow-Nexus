'use client';

import { useState, Suspense } from 'react';
import { useFormStatus } from 'react-dom';
import { login, signup } from './actions';
import { useSearchParams } from 'next/navigation';
import { Loader2, Building2, Rocket, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type UserRole = 'startup' | 'clinic' | null;

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="w-8 h-8 text-white/20 animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  console.log('[LoginContent] Rendering');
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  // For login, we don't need role selection — role is already in their metadata
  // For signup, role selection is mandatory
  const showRoleSelector = !isLogin && selectedRole === null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black p-4">
      <div className="w-full max-w-md relative">
        {/* Glow effect behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl blur opacity-30"></div>
        
        <div className="relative bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-4 cursor-pointer hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              {isLogin ? 'Welcome back' : showRoleSelector ? 'Choose your role' : 'Create an account'}
            </h1>
            <p className="text-zinc-400 text-sm">
              {isLogin 
                ? 'Enter your credentials to access your workspace' 
                : showRoleSelector 
                  ? 'Select how you\'ll use MediFlow Nexus'
                  : `Signing up as ${selectedRole === 'startup' ? 'a Healthcare Startup' : 'a Hospital / Clinic'}`
              }
            </p>
          </div>

          {/* Role Selector — only during signup, before form */}
          {showRoleSelector ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedRole('startup')}
                className="w-full group flex items-center gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/40 hover:bg-white/[0.06] transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-105 transition-all">
                  <Rocket size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-white">I'm a Healthcare Startup</p>
                  <p className="text-[12px] text-zinc-500 mt-0.5">GTM Engine, Buyer Discovery, Pitch Decks, Sales Pipeline</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('clinic')}
                className="w-full group flex items-center gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/40 hover:bg-white/[0.06] transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-105 transition-all">
                  <Building2 size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-white">I'm a Hospital / Clinic</p>
                  <p className="text-[12px] text-zinc-500 mt-0.5">VOB, Denial Prediction, Revenue Intelligence, Payer Analytics</p>
                </div>
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Back button for signup with role selected */}
              {!isLogin && selectedRole && (
                <button
                  onClick={() => setSelectedRole(null)}
                  className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-white transition-colors mb-4"
                >
                  <ArrowLeft size={14} /> Change role
                </button>
              )}

              <form
                className="space-y-4"
                action={isLogin ? login : signup}
              >
                <input type="hidden" name="next" value={searchParams.get('next') || ''} />
                {!isLogin && selectedRole && (
                  <input type="hidden" name="role" value={selectedRole} />
                )}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                )}

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300" htmlFor="organization">
                      Organization Name
                    </label>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      required={!isLogin}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                      placeholder={selectedRole === 'startup' ? "CareAI Health" : "Apollo Hospitals"}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {message && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400 text-center">{message}</p>
                  </div>
                )}

                <SubmitButton isLogin={isLogin} />
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setSelectedRole(null); }}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus();
  console.log('[SubmitButton] Pending state:', pending);
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
    >
      {pending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {isLogin ? 'Sign In' : 'Create Account'}
    </button>
  );
}
