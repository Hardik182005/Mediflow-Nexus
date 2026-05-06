'use client';

import { useState, Suspense } from 'react';
import { useFormStatus } from 'react-dom';
import { login, signup } from './actions';
import { useSearchParams } from 'next/navigation';
import { Loader2, Building2, Rocket, ArrowLeft, Activity } from 'lucide-react';
import Link from 'next/link';

type UserRole = 'startup' | 'clinic' | null;

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 text-black/20 animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const showRoleSelector = !isLogin && selectedRole === null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-white to-white p-4 font-sans">
      <div className="w-full max-w-md relative">
        {/* Subtle decorative glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-100 rounded-2xl blur opacity-30"></div>
        
        <div className="relative bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.1)] mb-4 cursor-pointer hover:bg-black/90 transition-colors">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-serif font-bold tracking-tight text-black mb-2">
              {isLogin ? 'Welcome back' : showRoleSelector ? 'Choose your role' : 'Create an account'}
            </h1>
            <p className="text-zinc-600 text-sm font-medium">
              {isLogin 
                ? 'Enter your credentials to access your workspace' 
                : showRoleSelector 
                  ? 'Select how you\'ll use MediFlow Nexus'
                  : `Signing up as ${selectedRole === 'startup' ? 'a Healthcare Startup' : 'a Hospital / Clinic'}`
              }
            </p>
          </div>

          {showRoleSelector ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedRole('startup')}
                className="w-full group flex items-center gap-4 p-5 rounded-xl bg-black/[0.02] border border-black/10 hover:border-black transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 border border-black/10 flex items-center justify-center group-hover:bg-black/10 group-hover:scale-105 transition-all">
                  <Rocket size={22} className="text-black" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-black">I'm a Healthcare Startup</p>
                  <p className="text-[12px] text-zinc-500 mt-0.5">GTM Engine, Buyer Discovery, Pitch Decks, Sales Pipeline</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('clinic')}
                className="w-full group flex items-center gap-4 p-5 rounded-xl bg-black/[0.02] border border-black/10 hover:border-black transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 border border-black/10 flex items-center justify-center group-hover:bg-black/10 group-hover:scale-105 transition-all">
                  <Building2 size={22} className="text-black" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-black">I'm a Hospital / Clinic</p>
                  <p className="text-[12px] text-zinc-500 mt-0.5">VOB, Denial Prediction, Revenue Intelligence, Payer Analytics</p>
                </div>
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-sm text-zinc-600 font-medium hover:text-black transition-colors"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          ) : (
            <>
              {!isLogin && selectedRole && (
                <button
                  onClick={() => setSelectedRole(null)}
                  className="flex items-center gap-1.5 text-[12px] text-zinc-500 font-bold hover:text-black transition-colors mb-4"
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
                    <label className="text-sm font-semibold text-zinc-700" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                )}

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700" htmlFor="organization">
                      Organization Name
                    </label>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      required={!isLogin}
                      className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all"
                      placeholder={selectedRole === 'startup' ? "CareAI Health" : "Apollo Hospitals"}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {message && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-sm text-red-600 text-center font-medium">{message}</p>
                  </div>
                )}

                <SubmitButton isLogin={isLogin} />
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setSelectedRole(null); }}
                  className="text-sm text-zinc-600 font-medium hover:text-black transition-colors"
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
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-xl"
    >
      {pending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {isLogin ? 'Sign In' : 'Create Account'}
    </button>
  );
}
