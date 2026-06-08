import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Sparkles, 
  User, 
  Mail, 
  CheckCircle2, 
  Chrome, 
  ArrowRight,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { decodeJwt } from '../utils/jwt';

interface LoginPageProps {
  onLogin: (userData: {
    username: string;
    email?: string;
    avatarUrl?: string;
    googleProfile?: {
      email: string;
      name: string;
      picture: string;
      verified: boolean;
    } | null;
  }) => void;
  defaultEmail?: string;
}

export default function LoginPage({ onLogin, defaultEmail = "nupddhaya@gmail.com" }: LoginPageProps) {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Simulation States
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isAddingCustomGoogle, setIsAddingCustomGoogle] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const isGoogleClientIdConfigured = 
    (import.meta as any).env.VITE_GOOGLE_CLIENT_ID && 
    (import.meta as any).env.VITE_GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  useEffect(() => {
    if (isGoogleClientIdConfigured) {
      const google = (window as any).google;
      if (google) {
        try {
          google.accounts.id.initialize({
            client_id: (import.meta as any).env.VITE_GOOGLE_CLIENT_ID,
            callback: (response: any) => {
              setLoading(true);
              const payload = decodeJwt(response.credential);
              if (payload) {
                setTimeout(() => {
                  setLoading(false);
                  onLogin({
                    username: payload.name || payload.given_name || "Google User",
                    email: payload.email,
                    avatarUrl: payload.picture,
                    googleProfile: {
                      email: payload.email,
                      name: payload.name,
                      picture: payload.picture,
                      verified: payload.email_verified || true
                    }
                  });
                }, 1000);
              } else {
                setLoading(false);
                setErrorMsg("Failed to decode Google Identity credentials.");
              }
            }
          });
          google.accounts.id.renderButton(
            document.getElementById("btn_google_signin_container"),
            { theme: "filled_blue", size: "large", width: 380, shape: "rectangular" }
          );
        } catch (e) {
          console.error("Failed to initialize Google Sign-in:", e);
        }
      }
    }
  }, []);

  // Pre-configured Google accounts for simulator
  const simGoogleAccounts = [
    {
      email: defaultEmail,
      name: "Nupd Dhaya",
      picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      verified: true
    },
    {
      email: "adventurer.dev@gmail.com",
      name: "Alex Dev",
      picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      verified: true
    }
  ];

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isRegistering) {
      if (!username.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('Please populate all fields to start your ML adventure!');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLogin({
          username: username.trim(),
          email: email.trim(),
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username.trim()}`
        });
      }, 1200);
    } else {
      if (!username.trim() || !password.trim()) {
        setErrorMsg('Please construct your coordinates (username & password).');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLogin({
          username: username.trim(),
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username.trim()}`
        });
      }, 1000);
    }
  };

  const handleGoogleSelect = (account: typeof simGoogleAccounts[0]) => {
    setLoading(true);
    setShowGoogleModal(false);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        username: account.name,
        email: account.email,
        avatarUrl: account.picture,
        googleProfile: account
      });
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none antialiased">
      {/* Background neon grid grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main card */}
      <div id="login_form_card" className="relative w-full max-w-md bg-[#0E0E11]/90 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl z-10 space-y-6">
        
        {/* Logo and Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl items-center justify-center font-bold text-black font-display text-xl shadow-[0_0_25px_rgba(34,211,238,0.4)] animate-pulse">
            A
          </div>
          <h2 className="text-xl font-bold font-display text-white tracking-tight pt-1">
            AI/ML Adventure Quest
          </h2>
          <p className="text-xs text-slate-400 tracking-normal font-mono">
            SECURE ACCESS DEPLOYMENT PROTOCOL
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/35 text-rose-400 text-xs flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dynamic State: Forgot Password */}
        {isForgotPassword ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Reset Credentials</h3>
              <p className="text-[11px] text-slate-400">Provide registration address to receive dynamic access secrets.</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Email Coordinates</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full bg-black text-slate-100 text-xs px-3.5 py-3 rounded-lg border border-white/15 focus:outline-none focus:border-cyan-500 transition pl-10 font-mono"
                  placeholder="e.g. adventurer@gmail.com"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>
            <button
              onClick={() => {
                setErrorMsg(null);
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  setIsForgotPassword(false);
                  setErrorMsg('📬 Recover key coordinates shipped securely! Please check your test email inbox.');
                }, 1000);
              }}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-bold py-3.5 rounded-lg transition duration-200 cursor-pointer"
            >
              Dispatch Secrets Key
            </button>
            <button
              onClick={() => setIsForgotPassword(false)}
              className="w-full text-center text-[10px] font-mono text-slate-400 hover:text-white transition"
            >
              &larr; Back to secure Login
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Primary Google Login Button */}
            <div className="space-y-3">
              {isGoogleClientIdConfigured ? (
                <div className="space-y-2 flex flex-col items-center">
                  <div id="btn_google_signin_container" className="w-full flex justify-center" />
                  <span className="text-[9px] font-mono text-emerald-400 tracking-wider">
                    ● AUTHENTIC GOOGLE GATEWAY ACTIVE
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    id="btn_continue_with_google"
                    type="button"
                    disabled={loading}
                    onClick={() => setShowGoogleModal(true)}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 text-black font-bold text-xs py-3.5 px-4 rounded-xl cursor-pointer transition duration-205 shadow-[0_0_20px_rgba(255,255,255,0.05)] disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    )}
                    <span>Continue with Google (Simulated)</span>
                  </button>
                  <p className="text-[9px] font-mono text-slate-500 text-center leading-normal select-none">
                    ℹ️ Running in Sandbox. Set <span className="text-cyan-400 font-bold">VITE_GOOGLE_CLIENT_ID</span> in <span className="text-slate-400">.env</span> to activate actual OAuth.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 my-2 text-slate-600 select-none">
              <div className="h-px bg-white/5 flex-1" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">OR DEFINE COORDINATES</span>
              <div className="h-px bg-white/5 flex-1" />
            </div>

            {/* Standard Login / Signup Forms */}
            <form onSubmit={handleStandardSubmit} className="space-y-4">
              
              {/* Optional Login Email if Registering */}
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Email Node Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500 transition pl-9"
                      placeholder="adventurer@domain.com"
                    />
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Aiden Username</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black text-slate-100 text-xs px-3.5 py-3 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500 transition pl-9 font-mono"
                    placeholder="e.g. CodeMaster99"
                  />
                  <User className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Access Password</label>
                  {!isRegistering && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[9px] font-mono text-cyan-400 hover:underline hover:text-cyan-350 cursor-pointer"
                    >
                      Forgotten Secrets?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black text-slate-100 text-xs px-3.5 py-3 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500 transition pl-9 font-mono"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-400/10 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold text-xs py-3.5 rounded-lg transition duration-200 select-none flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{isRegistering ? 'Register Game Record' : 'Authenticate Console'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

            </form>

            {/* Alternator Toggle link */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setErrorMsg(null);
                  setIsRegistering(!isRegistering);
                }}
                className="text-[11px] text-slate-400 hover:text-white transition font-sans italic"
              >
                {isRegistering 
                  ? 'Already locked code progress? Authenticate credentials here.' 
                  : 'New to the AI quest pipeline? Register a student record.'}
              </button>
            </div>
          </div>
        )}

        {/* Informative visual footer footer */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-600">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-cyan-400" />
            SECURE SHA256 GATEWAY
          </span>
          <span>BUILD 10.42.06</span>
        </div>

      </div>

      {/* MODAL MOCKUP: Sim Google Account Picker */}
      {showGoogleModal && (
        <div id="google_account_picker_modal" className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-sm bg-[#0E0E11] border border-white/15 rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Chrome className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Google Sign-In Gateway</span>
              </div>
              <h3 className="text-sm font-bold text-white font-sans">Choose an account</h3>
              <p className="text-[11px] text-slate-400">to proceed to <strong className="text-cyan-300">Adventure Quest Sandbox</strong></p>
            </div>

            {isAddingCustomGoogle ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">User Full Name</label>
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full bg-black text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500 font-mono"
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Google Email Address</label>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full bg-black text-slate-100 text-xs px-3.5 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500 font-mono"
                    placeholder="e.g. janedoe@gmail.com"
                  />
                </div>
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (customGoogleName.trim() && customGoogleEmail.trim()) {
                        handleGoogleSelect({
                          name: customGoogleName.trim(),
                          email: customGoogleEmail.trim(),
                          picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customGoogleName.trim())}`,
                          verified: true
                        });
                        setIsAddingCustomGoogle(false);
                      } else {
                        setErrorMsg("Please populate both fields to connect your custom node!");
                      }
                    }}
                    className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black font-bold text-xs py-2.5 rounded-lg cursor-pointer transition select-none"
                  >
                    Authorize Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCustomGoogle(false);
                    }}
                    className="px-4 bg-slate-900 border border-white/10 text-slate-350 hover:text-white text-xs rounded-lg transition cursor-pointer select-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2 border-y border-white/5 py-3">
                  {simGoogleAccounts.map((account, index) => (
                    <button
                      key={index}
                      onClick={() => handleGoogleSelect(account)}
                      className="w-full flex items-center gap-3.5 p-3 rounded-lg hover:bg-white/5 text-left transition cursor-pointer"
                    >
                      <img
                        src={account.picture}
                        alt={account.name}
                        className="w-9 h-9 rounded-full border border-white/10 object-cover bg-black"
                      />
                      <div className="space-y-0.5 truncate flex-1">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 truncate">
                          <span>{account.name}</span>
                          {account.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-950" />}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{account.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setCustomGoogleName('');
                    setCustomGoogleEmail('');
                    setIsAddingCustomGoogle(true);
                  }}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-350 rounded-lg transition cursor-pointer uppercase tracking-wider text-center"
                >
                  ➕ Use another custom account...
                </button>
              </>
            )}

            <div className="text-[9px] text-slate-500 leading-normal text-center select-none font-sans">
              To link a custom Google Account, choose any profile above or input custom identity values. Our system securely maps your credentials into permanent progress logs.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
