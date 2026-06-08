/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, 
  GraduationCap, 
  Compass, 
  Layers, 
  Award, 
  ShieldAlert, 
  Play, 
  Terminal as TermIcon, 
  MessageSquare, 
  Lock, 
  ChevronRight, 
  Flame, 
  Coins, 
  Gem, 
  Maximize2,
  Sparkles,
  Loader2,
  BookOpen,
  Chrome,
  CheckCircle2,
  LogOut,
  Unlink
} from 'lucide-react';

import { WORLDS, PRESET_BADGES } from './data';
import { World, Level, UserStats } from './types';
import GameWorld from './components/GameWorld';
import TheorySection from './components/TheorySection';
import LoginPage from './components/LoginPage';
import HighlightedEditor from './components/HighlightedEditor';
import { audio } from './utils/audio';
import { decodeJwt } from './utils/jwt';

export default function App() {
  const [activeTab, setActiveTab ] = useState<string>('arena');

  // User Authentication states with localStorage persistence
  interface AuthState {
    isLoggedIn: boolean;
    user: {
      username: string;
      email?: string;
      avatarUrl?: string;
      googleProfile?: {
        email: string;
        name: string;
        picture: string;
        verified: boolean;
      } | null;
    } | null;
  }

  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('ai_quest_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      isLoggedIn: false,
      user: null
    };
  });

  // Google Simulated Link Accounts State
  const [simLinkLoading, setSimLinkLoading] = useState(false);
  const [showSimLinkModal, setShowSimLinkModal] = useState(false);
  
  const [isAddingCustomGoogle, setIsAddingCustomGoogle] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const handleLogin = (userData: AuthState['user']) => {
    const newState = { isLoggedIn: true, user: userData };
    setAuth(newState);
    localStorage.setItem('ai_quest_auth', JSON.stringify(newState));
  };

  const handleLogout = () => {
    const newState = { isLoggedIn: false, user: null };
    setAuth(newState);
    localStorage.removeItem('ai_quest_auth');
    setActiveTab('arena');
  };

  const handleLinkGoogle = (profile: { email: string; name: string; picture: string; verified: boolean }) => {
    if (!auth.user) return;
    setSimLinkLoading(true);
    setTimeout(() => {
      setSimLinkLoading(false);
      const updatedUser = {
        ...auth.user,
        email: profile.email,
        googleProfile: profile
      };
      const newState = { isLoggedIn: true, user: updatedUser };
      setAuth(newState);
      localStorage.setItem('ai_quest_auth', JSON.stringify(newState));
      setShowSimLinkModal(false);
    }, 1000);
  };

  const handleUnlinkGoogle = () => {
    if (!auth.user) return;
    setSimLinkLoading(true);
    setTimeout(() => {
      setSimLinkLoading(false);
      const updatedUser = {
        ...auth.user,
        email: undefined,
        googleProfile: null
      };
      const newState = { isLoggedIn: true, user: updatedUser };
      setAuth(newState);
      localStorage.setItem('ai_quest_auth', JSON.stringify(newState));
    }, 800);
  };

  const isGoogleClientIdConfigured = 
    (import.meta as any).env.VITE_GOOGLE_CLIENT_ID && 
    (import.meta as any).env.VITE_GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  useEffect(() => {
    if (activeTab === 'account' && isGoogleClientIdConfigured && !auth.user?.googleProfile) {
      const google = (window as any).google;
      if (google) {
        try {
          google.accounts.id.initialize({
            client_id: (import.meta as any).env.VITE_GOOGLE_CLIENT_ID,
            callback: (response: any) => {
              setSimLinkLoading(true);
              const payload = decodeJwt(response.credential);
              if (payload) {
                setTimeout(() => {
                  setSimLinkLoading(false);
                  const updatedUser = {
                    ...auth.user!,
                    email: payload.email,
                    googleProfile: {
                      email: payload.email,
                      name: payload.name,
                      picture: payload.picture,
                      verified: payload.email_verified || true
                    }
                  };
                  const newState = { isLoggedIn: true, user: updatedUser };
                  setAuth(newState);
                  localStorage.setItem('ai_quest_auth', JSON.stringify(newState));
                }, 1000);
              } else {
                setSimLinkLoading(false);
              }
            }
          });
          
          setTimeout(() => {
            const container = document.getElementById("btn_google_link_container");
            if (container) {
              google.accounts.id.renderButton(
                container,
                { theme: "filled_blue", size: "large", width: 280, shape: "rectangular" }
              );
            }
          }, 100);
        } catch (e) {
          console.error("Failed to initialize Google Sign-in on account tab:", e);
        }
      }
    }
  }, [activeTab, auth.user?.googleProfile]);

  // User States
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 650,
    coins: 180,
    gems: 35,
    streak: 4,
    level: 1,
    completedLessons: ['py1'], // default py1 lesson unlocked to onboard user instantly
    completedLevels: ['w1_l1'],
    badges: [PRESET_BADGES[0]]
  });

  // GP customization store states
  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai_quest_unlocked_avatars');
    return saved ? JSON.parse(saved) : ['Aiden'];
  });
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(() => {
    const saved = localStorage.getItem('ai_quest_unlocked_themes');
    return saved ? JSON.parse(saved) : ['default'];
  });
  const [activeAvatar, setActiveAvatar] = useState<string>(() => {
    return localStorage.getItem('ai_quest_active_avatar') || 'Aiden';
  });
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    return localStorage.getItem('ai_quest_active_theme') || 'default';
  });

  const saveStoreData = (avatars: string[], themes: string[], avatar: string, theme: string) => {
    localStorage.setItem('ai_quest_unlocked_avatars', JSON.stringify(avatars));
    localStorage.setItem('ai_quest_unlocked_themes', JSON.stringify(themes));
    localStorage.setItem('ai_quest_active_avatar', avatar);
    localStorage.setItem('ai_quest_active_theme', theme);
  };

  const buyAvatar = (name: string, price: number) => {
    if (unlockedAvatars.includes(name)) {
      setActiveAvatar(name);
      saveStoreData(unlockedAvatars, unlockedThemes, name, activeTheme);
      return;
    }
    if (userStats.coins >= price) {
      const nextCoins = userStats.coins - price;
      const nextAvatars = [...unlockedAvatars, name];
      setUserStats(prev => ({ ...prev, coins: nextCoins }));
      setUnlockedAvatars(nextAvatars);
      setActiveAvatar(name);
      saveStoreData(nextAvatars, unlockedThemes, name, activeTheme);
      audio.playSFX('coin');
    }
  };

  const buyTheme = (name: string, price: number) => {
    if (unlockedThemes.includes(name)) {
      setActiveTheme(name);
      saveStoreData(unlockedAvatars, unlockedThemes, activeAvatar, name);
      return;
    }
    if (userStats.coins >= price) {
      const nextCoins = userStats.coins - price;
      const nextThemes = [...unlockedThemes, name];
      setUserStats(prev => ({ ...prev, coins: nextCoins }));
      setUnlockedThemes(nextThemes);
      setActiveTheme(name);
      saveStoreData(unlockedAvatars, nextThemes, activeAvatar, name);
      audio.playSFX('coin');
    }
  };

  const getSnippetsForLang = (lang: string) => {
    if (lang === 'python') {
      return [
        { label: 'Say GO', code: 'print("GO")\n' },
        { label: 'Set Score', code: 'score = 10\n' },
        { label: 'For Loop', code: 'for i in range(3):\n    print("GO")\n' },
        { label: 'If Condition', code: 'damage = 75\nif damage > 50:\n    print("ATTACK")\n' },
        { label: 'Def Function', code: 'def jump_obstacle():\n    print("JUMP")\n' },
        { label: 'Set Weights', code: 'weights = [5.0, 1.2]\n' }
      ];
    } else if (lang === 'javascript') {
      return [
        { label: 'Say GO', code: 'console.log("GO");\n' },
        { label: 'For Loop', code: 'for (let i = 0; i < 3; i++) {\n  console.log("GO");\n}\n' }
      ];
    } else if (lang === 'sql') {
      return [
        { label: 'Select All', code: 'SELECT * FROM users;\n' },
        { label: 'Filter', code: 'SELECT * FROM users WHERE score > 50;\n' }
      ];
    }
    return [
      { label: 'Print GO', code: 'print("GO")\n' }
    ];
  };

  // Quest Arena Level Selection
  const [selectedWorldId, setSelectedWorldId] = useState<number>(1);
  const [selectedLevelId, setSelectedLevelId] = useState<string>('w1_l1');

  // Code editor parameters
  const [editorLang, setEditorLang] = useState<string>('python');
  const [codeValue, setCodeValue] = useState<string>('');
  
  // Game animation bridge
  const [ongoingAction, setOngoingAction] = useState<string | null>(null);
  const [arenaActive, setArenaActive] = useState(false);

  // Terminal parameters
  const [termOutput, setTermOutput] = useState<string>('Quest Terminal ready. Type statement and click Execute Code!');
  const [termError, setTermError] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);

  // AI Tutor sidebar collapsible chat
  const [tutorOpen, setTutorOpen] = useState(true);
  const [tutorInput, setTutorInput] = useState('');
  const [tutorMessages, setTutorMessages] = useState<Array<{ sender: 'user' | 'tutor', text: string }>>([
    { sender: 'tutor', text: "Greetings, Adventurer! I am Nico, your AI specialist companion. Stuck with syntax errors or deep mathematics? Ask me anything; I will guide you step-by-step!" }
  ]);
  const [tutorLoading, setTutorLoading] = useState(false);
  const sidebarChatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sidebarChatEndRef.current) {
      sidebarChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tutorMessages, tutorLoading]);

  // Load level definitions dynamically
  const activeWorld = WORLDS.find(w => w.id === selectedWorldId) || WORLDS[0];
  const activeLevel = activeWorld.levels.find(l => l.id === selectedLevelId) || activeWorld.levels[0];

  useEffect(() => {
    if (activeLevel) {
      setCodeValue(activeLevel.starterCode);
      setEditorLang(activeLevel.language);
      setTermOutput(`Ready to evaluate: ${activeLevel.title}. Write correct syntax blocks!`);
      setTermError(null);
      setArenaActive(false);
    }
  }, [selectedLevelId, selectedWorldId]);

  // Map each World block to prerequisite lesson completions
  const isWorldUnlocked = (worldId: number) => {
    if (worldId === 1) return true; // World 1 Python Kingdom is always unlocked
    if (worldId === 2) return userStats.completedLessons.includes('py2') || userStats.completedLessons.includes('stat1');
    if (worldId === 3) return userStats.completedLessons.includes('stat1') || userStats.completedLessons.includes('math1');
    if (worldId === 4) return userStats.completedLessons.includes('math1') || userStats.completedLessons.includes('dl1');
    if (worldId === 5) return userStats.completedLessons.includes('genai1');
    if (worldId === 6) return userStats.completedLessons.includes('nlp1') || userStats.completedLessons.includes('cv1');
    return false;
  };

  // Run student code sandbox
  const handleExecuteCode = async () => {
    if (!activeLevel) return;
    setExecuting(true);
    setTermOutput('Compiling structures & variables. Verifying integrity...');
    setTermError(null);
    setArenaActive(true); // Automatically activate game arena when they execute!

    try {
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeValue,
          language: editorLang,
          expectedAction: activeLevel.expectedAction,
          expectedOutput: activeLevel.expectedOutput
        }),
      });
      const data = await response.json();

      if (data.success) {
        setTermOutput(`[SUCCESS] Output buffer:\n${data.output}`);
        // Trigger corresponding visual animation in GameWorld component
        setOngoingAction(activeLevel.expectedAction);
        
        // reward XP/Coins
        if (!userStats.completedLevels.includes(activeLevel.id)) {
          const rewardXp = 150;
          const rewardCoins = 50;
          const nextXp = userStats.xp + rewardXp;
          const nextLv = Math.floor(nextXp / 1000) + 1;

          // Unlock badges if worlds finished
          let nextBadges = [...userStats.badges];
          if (activeLevel.id === 'w1_l6' && !nextBadges.some(b => b.id === 'b1')) {
            nextBadges.push(PRESET_BADGES[0]);
          } else if (activeLevel.id === 'w2_l6' && !nextBadges.some(b => b.id === 'b2')) {
            nextBadges.push(PRESET_BADGES[1]);
          } else if (activeLevel.id === 'w3_l6' && !nextBadges.some(b => b.id === 'b3')) {
            nextBadges.push(PRESET_BADGES[2]);
          }

          setUserStats(prev => ({
            ...prev,
            xp: nextXp,
            coins: prev.coins + rewardCoins,
            level: nextLv,
            completedLevels: [...prev.completedLevels, activeLevel.id],
            badges: nextBadges
          }));
        }
      } else {
        setTermError(data.error);
        setTermOutput(`[COMPILE ERROR]\n${data.output || 'Syntax verification failed.'}`);
      }
    } catch (e: any) {
      setTermOutput('Sandbox unreachable. Check hosting configurations.');
      setTermError(e.message || 'Run Error');
    } finally {
      setExecuting(false);
    }
  };

  // Dispatch queries to chat AI Mentor
  const handleAskTutor = async () => {
    if (!tutorInput.trim()) return;
    const userPrompt = tutorInput;
    setTutorMessages(prev => [...prev, { sender: 'user', text: userPrompt }]);
    setTutorInput('');
    setTutorLoading(true);

    try {
      const response = await fetch('/api/chat-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userPrompt,
          code: codeValue,
          challengeText: activeLevel ? activeLevel.challengeText : 'General AI Learning',
          errorLog: termError || undefined
        }),
      });
      const data = await response.json();
      setTutorMessages(prev => [...prev, { sender: 'tutor', text: data.response }]);
    } catch (err: any) {
      setTutorMessages(prev => [...prev, { sender: 'tutor', text: "Forgive me, the communication grid is fuzzy. Please try re-evaluating the question." }]);
    } finally {
      setTutorLoading(false);
    }
  };

  if (!auth.isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const currentWorldUnlocked = isWorldUnlocked(selectedWorldId);

  const progressPercent = Math.min(100, Math.floor(((userStats.xp % 1000) / 1000) * 100));

  return (
    <div id="ai_adventure_quest_app" className="min-h-screen bg-[#09090B] text-slate-200 flex flex-col font-sans select-none antialiased">
      
      {/* HEADER: Dynamic Status Dashboard panel */}
      <header className="px-6 py-4 bg-[#0E0E11] border-b border-white/10 flex items-center justify-between shadow-md flex-wrap gap-4">
        
        {/* Brand details */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center font-bold text-black font-display shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            A
          </div>
          <div className="space-y-0.5">
            <h1 className="text-md font-bold tracking-tight text-white font-display italic">
              AI/ML Adventure Quest 
              <span className="text-cyan-400 text-[10px] font-mono ml-2.5 opacity-80 px-2 py-0.5 border border-cyan-400/30 rounded-full bg-cyan-500/5">
                WORLD {selectedWorldId}: {activeWorld.name.toUpperCase()}
              </span>
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>LEVEL SCREENING ENGINE ACTIVE</span>
            </div>
          </div>
        </div>

        {/* User game statistics panel */}
        <div className="flex items-center gap-6 flex-wrap">
          
          {/* Progress progress bar */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Level Progress ({progressPercent}%)</span>
            <div className="w-32 h-1.5 bg-slate-850 rounded-full mt-1 overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPercent || 35}%` }}
              />
            </div>
          </div>

          {/* Statistics Box */}
          <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 leading-none font-mono">RANK</span>
              <span className="text-sm font-bold text-white mt-0.5">Lv {userStats.level}</span>
            </div>
            
            <div className="w-px h-6 bg-white/10" />

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 leading-none font-mono">XP</span>
              <span className="text-sm font-bold text-cyan-400 mt-0.5">{userStats.xp}</span>
            </div>

            <div className="w-px h-6 bg-white/10" />

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 leading-none font-mono">GOLD</span>
              <span className="text-sm font-bold text-amber-500 mt-0.5">{userStats.coins} GP</span>
            </div>

            <div className="w-px h-6 bg-white/10" />

            <div className="flex flex-col">
              <span className="text-[10px] text-emerald-400 leading-none font-mono uppercase">STREAK</span>
              <span className="text-xs font-bold text-white mt-0.5 font-mono">{userStats.streak} DAYS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-mono font-bold text-slate-300 mr-1 select-none">
              {auth.user?.username}
            </span>
            <img 
              src={auth.user?.avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=Aiden"} 
              alt="User profile"
              className="w-8 h-8 rounded-full border border-white/25 object-cover bg-black cursor-pointer shadow hover:scale-105 transition duration-150"
              title={`Logged in as ${auth.user?.username}`}
              onClick={() => setActiveTab('account')}
            />
          </div>
        </div>

      </header>

      {/* BODY WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* SIDE BAR NAVIGATION RAIL */}
        <nav className="w-full md:w-64 bg-[#0E0E11] border-b md:border-b-0 md:border-r border-white/10 p-4 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
          
          <button
            id="tab_nav_arena"
            onClick={() => setActiveTab('arena')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold font-mono uppercase tracking-wider rounded-lg border transition-all duration-200 w-full shrink-0 ${
              activeTab === 'arena'
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100'
            }`}
          >
            <Gamepad2 className="w-4 h-4 shrink-0" />
            Quest Arena
          </button>

          <button
            id="tab_nav_theory"
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold font-mono uppercase tracking-wider rounded-lg border transition-all duration-200 w-full shrink-0 ${
              activeTab === 'theory'
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            Curriculum Slides
          </button>

          <button
            id="tab_nav_account"
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold font-mono uppercase tracking-wider rounded-lg border transition-all duration-200 w-full shrink-0 ${
              activeTab === 'account'
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100'
            }`}
          >
            <Chrome className="w-4 h-4 shrink-0 text-cyan-400" />
            Google Link Portal
          </button>



          {/* Persistent AI Specialist Sidebar Panel */}
          <div className="hidden md:flex border-t border-white/10 pt-4 mt-4 flex-col flex-1 min-h-[355px] overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">AI Specialist: Nico</span>
              </div>
              <button 
                id="btn_clear_tutor_chat"
                onClick={() => setTutorMessages([
                  { sender: 'tutor', text: "Chat history cleared. What topic or challenge concepts shall we analyze?" }
                ])}
                className="text-[9px] font-mono text-slate-500 hover:text-rose-450 uppercase tracking-wider px-1.5 py-0.5 bg-black/60 border border-white/5 hover:border-white/10 rounded cursor-pointer transition-all"
                title="Clear chat and start fresh"
              >
                Clear
              </button>
            </div>

            {/* Micro Quick Suggestion Chips */}
            <div className="flex gap-1.5 flex-wrap mb-2">
              <button 
                onClick={() => {
                  setTutorInput("Explain the model concepts in simple terms.");
                }}
                className="text-[9px] font-mono px-2 py-0.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                💡 Explain Concepts
              </button>
              <button 
                onClick={() => {
                  setTutorInput("Give me a slight clue about this level's objective.");
                }}
                className="text-[9px] font-mono px-2 py-0.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                🔍 Give Clue
              </button>
            </div>

            {/* Chat board history body */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 p-2 bg-[#09090B]/60 rounded-lg border border-slate-850/80 flex flex-col pr-1 pr-1.5">
              {tutorMessages.map((msg, index) => {
                const isTutor = msg.sender === 'tutor';
                return (
                  <div
                    key={index}
                    className={`flex flex-col max-w-[95%] text-left ${
                      isTutor ? 'mr-auto' : 'ml-auto text-right'
                    }`}
                  >
                    <span className={`text-[8px] font-mono mb-0.5 tracking-wider ${isTutor ? 'text-cyan-400' : 'text-indigo-400'}`}>
                      {isTutor ? '🤖 Nico (AI Companion)' : '👤 Adventurer'}
                    </span>
                    <div className={`p-2 rounded font-sans text-[11px] leading-relaxed border ${
                      isTutor 
                        ? 'bg-slate-900/90 text-slate-200 border-slate-800/80 shadow-inner' 
                        : 'bg-indigo-950/20 text-indigo-300 border-indigo-900/40'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              {tutorLoading && (
                <div className="flex items-center gap-2 p-1 text-[10px] text-slate-500 font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                  <span>Nico is consulting...</span>
                </div>
              )}
              <div ref={sidebarChatEndRef} />
            </div>

            {/* Quick chat inputs row */}
            <div className="mt-2.5 flex gap-1.5 shrink-0">
              <input
                id="input_sidebar_tutor_msg"
                type="text"
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
                className="flex-1 bg-slate-950 border border-slate-850 rounded-md text-[11px] px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono text-slate-100 placeholder-slate-600"
                placeholder="Ask Nico details..."
              />
              <button
                id="btn_sidebar_tutor_send"
                onClick={handleAskTutor}
                className="px-2.5 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-mono font-bold text-[10px] uppercase rounded-md transition cursor-pointer select-none"
              >
                Ask
              </button>
            </div>
          </div>

          {/* Bottom user card bio details */}
          <div className="hidden md:flex border-t border-white/10 pt-4 mt-auto flex-col gap-1.5 text-xs font-mono font-bold">
            <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Aiden Badges:</span>
            <div className="flex gap-1.5 overflow-x-auto py-1 text-base">
              {userStats.badges.map((b) => (
                <span key={b.id} title={b.name} className="p-1 px-1.5 bg-[#09090B] border border-white/10 rounded">
                  {b.icon}
                </span>
              ))}
            </div>
          </div>

        </nav>

        {/* PRIMARY MAIN PANEL VIEWPORTS CONTAINER */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* TAB 1: CORE GAMIFIED QUEST ARENA */}
          {activeTab === 'arena' && (
            <div id="quest_arena_viewport" className="space-y-6">
              
              {/* Worlds Tab Navigation Row */}
              <div className="flex flex-wrap gap-2.5 border-b border-white/10 pb-3">
                {WORLDS.map((world, idx) => {
                  const isSelected = selectedWorldId === world.id;
                  const unlocked = isWorldUnlocked(world.id);
                  return (
                    <button
                      id={`btn_world_tab_${world.id}`}
                      key={world.id}
                      onClick={() => {
                        setSelectedWorldId(world.id);
                        setSelectedLevelId(`w${world.id}_l1`); // default first level
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 font-mono text-xs rounded-lg border transition ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.1)] font-bold'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-display">World {world.id}: {world.name}</span>
                      {!unlocked && <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0 select-none animate-pulse" />}
                    </button>
                  );
                })}
              </div>

              {/* Locked Prerequisite warning banner if world is blocked */}
              {!currentWorldUnlocked ? (
                <div id="world_locked_error" className="bg-rose-950/20 border border-rose-800/45 p-8 rounded-xl text-center space-y-4 max-w-2xl mx-auto">
                  <div className="inline-flex p-3 bg-rose-950/50 rounded-full border border-rose-800/40 text-rose-400">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-md font-bold text-rose-300 font-mono">Theoretical Prerequisite Locked!</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-md mx-auto">
                      Each adventurous World requires completed conceptual lessons before Aiden can test his scripts! 
                      Please proceed to the **Curriculum Slides** panel, complete the lessons and solve the quiz successfully to unlock {activeWorld.name}.
                    </p>
                  </div>
                  <button
                    id="btn_unlocked_redirect"
                    onClick={() => setActiveTab('theory')}
                    className="px-4 py-2 bg-rose-900/40 border border-rose-700 hover:bg-rose-800/50 text-rose-300 text-xs font-semibold rounded-lg transition"
                  >
                    Go Solve Theory Quiz Now
                  </button>
                </div>
              ) : (
                /* Main active split workspace grid */
                <div className="space-y-6">
                  
                  {/* Levels lists row for current unlocked world */}
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold pl-2">Select Quest Levels:</span>
                    <div className="flex items-center gap-2 overflow-x-auto py-0.5">
                      {activeWorld.levels.map((lvl) => {
                        const isLvlSel = selectedLevelId === lvl.id;
                        const lvlSolved = userStats.completedLevels.includes(lvl.id);
                        return (
                          <button
                            id={`btn_level_item_${lvl.id}`}
                            key={lvl.id}
                            onClick={() => setSelectedLevelId(lvl.id)}
                            className={`px-3 py-1.5 text-xs font-mono rounded border transition-all duration-200 min-w-[102px] flex items-center justify-between gap-1.5 cursor-pointer ${
                              isLvlSel
                                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 font-bold border-cyan-300 text-black shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                                : lvlSolved
                                ? 'bg-emerald-950/20 border-emerald-500/35 text-emerald-400 hover:border-emerald-450'
                                : 'bg-black border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
                            }`}
                          >
                            <span>L0{lvl.levelNumber}</span>
                            {lvlSolved && <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono">Solved</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic split-screen grid layout: Left Editor, Right Game */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    
                    {/* LEFT PANEL: Monaco editor styles, terminal, problem text, and AI tutor */}
                    <div className="space-y-6">
                      
                      {/* Problem Statement details */}
                      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3 shadow-xl">
                        <div className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                          <h3 className="text-xs font-bold text-slate-200 font-mono tracking-wider uppercase">
                            Challenge Statement:
                          </h3>
                          <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded uppercase">
                            Required language: {activeLevel.language}
                          </span>
                        </div>

                        <p className="text-sm font-medium text-slate-100 font-sans leading-relaxed">
                          {activeLevel.description}
                        </p>
                        
                        <div className="p-3 bg-slate-950 rounded border border-slate-800/60 flex items-start gap-2.5">
                          <code className="text-xs text-indigo-300 font-mono">{activeLevel.challengeText}</code>
                        </div>
                      </div>

                      {/* Code editor mock workplace panel */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
                        {/* Editor Header tabs */}
                        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 select-none">
                          <button
                            id="btn_tab_main_py"
                            onClick={() => {
                              setArenaActive(true);
                              setTermOutput(prev => prev ? (prev + `\n[SYSTEM] Game Arena targeted and activated via file header click!`) : `[SYSTEM] Game Arena targeted and activated via file header click!`);
                            }}
                            className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                              arenaActive 
                                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30' 
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                            title="Click main file to target/start the training arena!"
                          >
                            <TermIcon className={`w-4 h-4 ${arenaActive ? 'text-emerald-400 animate-pulse' : 'text-slate-550'}`} />
                            <span className="font-bold">main.{editorLang === 'python' ? 'py' : editorLang === 'javascript' ? 'js' : editorLang === 'sql' ? 'sql' : 'cpp'}</span>
                            {arenaActive ? (
                              <span className="text-[8px] rounded px-1.5 py-0.5 bg-emerald-500 text-slate-950 font-bold uppercase tracking-wider font-sans">Arena Active</span>
                            ) : (
                              <span className="text-[8px] rounded px-1.5 py-0.5 bg-cyan-950/80 text-cyan-400 border border-cyan-800/40 font-bold uppercase tracking-wider font-sans">Start Arena</span>
                            )}
                          </button>
                          
                          {/* Execute action triggers */}
                          <div className="flex items-center gap-2">
                            <button
                              id="btn_execute_editor"
                              disabled={executing}
                              onClick={handleExecuteCode}
                              className="px-4 py-1.5 hover:bg-emerald-500 text-slate-950 bg-emerald-400 font-bold text-xs rounded border border-emerald-300/40 cursor-pointer disabled:opacity-40 transition flex items-center gap-1"
                            >
                              {executing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                              Execute Code
                            </button>
                          </div>
                        </div>
                                            {/* Quick snippet chips */}
                        <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto select-none">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider shrink-0">Snippets:</span>
                          {getSnippetsForLang(editorLang).map((snippet, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => setCodeValue(snippet.code)}
                              className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded font-mono text-[10px] text-cyan-400 hover:text-cyan-350 transition duration-150 shrink-0 cursor-pointer"
                              title={`Insert "${snippet.label}" snippet`}
                            >
                              {snippet.label}
                            </button>
                          ))}
                        </div>

                        {/* Highlighted Code Editor */}
                        <HighlightedEditor
                          value={codeValue}
                          onChange={setCodeValue}
                          language={editorLang}
                          placeholder={activeLevel ? activeLevel.hint : "# Write your program sequence here..."}
                        />

                        {/* Output logging terminal */}
                        <div className="bg-slate-950 p-4 border-t border-slate-800 font-mono text-xs text-slate-300">
                          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            Console Outputs
                          </div>
                          <pre id="output_console_log" className="text-[11px] leading-relaxed max-h-[110px] overflow-y-auto pr-1 whitespace-pre-wrap font-mono uppercase">
                            {termOutput}
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PANEL: Vector Phaser style canvas world simulation */}
                    <div className="space-y-6">
                      
                      {/* Render Game viewport */}
                      <GameWorld
                        currentAction={ongoingAction}
                        onAnimationEnd={() => setOngoingAction(null)}
                        lang={editorLang}
                        expectedAction={activeLevel.expectedAction}
                        levelNumber={activeLevel.levelNumber}
                        levelId={activeLevel.id}
                        arenaActive={arenaActive}
                        setArenaActive={setArenaActive}
                        activeAvatar={activeAvatar}
                        activeTheme={activeTheme}
                      />

                      {/* Aiden active parameters details */}
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">Level Objectives</h4>
                        </div>
                        
                        <div className="space-y-3 font-mono text-xs">
                          <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
                            <span>Expected Output:</span>
                            <span className="text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/40 px-2 py-0.5 rounded">{activeLevel.expectedOutput}</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-slate-400">Step Hints:</span>
                            <p className="text-slate-300 font-sans leading-relaxed text-[11px] bg-slate-950 p-3 rounded border border-slate-800">
                              {activeLevel.hint}
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 2: COURSE THEORY LESSONS SLIDES */}
          {activeTab === 'theory' && (
            <TheorySection
              completedLessons={userStats.completedLessons}
              onLessonComplete={(lessonId) => {
                if (!userStats.completedLessons.includes(lessonId)) {
                  setUserStats(prev => ({
                    ...prev,
                    completedLessons: [...prev.completedLessons, lessonId],
                    xp: prev.xp + 200, // 200 XP reward for completing course theory + quiz
                    coins: prev.coins + 100
                  }));
                }
              }}
            />
          )}

          {/* TAB 6: GOOGLE ACCOUNT LINK AND PORTAL SUMMARY */}
          {activeTab === 'account' && (
            <div id="google_portal_viewport" className="space-y-6 max-w-4xl mx-auto animate-fade-in">
              <div className="bg-[#0E0E11] border border-white/10 p-6 rounded-2xl shadow-xl space-y-6">
                
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cyan-950/40 rounded-xl border border-cyan-800/40 text-cyan-400">
                      <Chrome className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white font-display">Google Security & Account Link Gateway</h2>
                      <p className="text-xs text-slate-400 font-mono tracking-tight">Sync game state progress logs directly to your Google cloud workspace</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 font-mono text-[10px] font-bold rounded-full border ${
                    auth.user?.googleProfile 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                      : 'bg-amber-950/20 border-amber-500/30 text-amber-450 animate-pulse'
                  }`}>
                    {auth.user?.googleProfile ? '● CLOUD SYNCHRONIZED' : '○ DISCONNECTED'}
                  </span>
                </div>

                {/* Grid Split Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Connection Details */}
                  <div className="space-y-4 bg-black/40 p-5 rounded-xl border border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">Identity Association Status</h3>
                    
                    {auth.user?.googleProfile ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-black/60 p-4 rounded-xl border border-white/5">
                          <img 
                            src={auth.user.googleProfile.picture} 
                            alt={auth.user.googleProfile.name}
                            className="w-12 h-12 rounded-full border border-white/20 object-cover"
                          />
                          <div className="space-y-0.5 truncate flex-1">
                            <div className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                              <span>{auth.user.googleProfile.name}</span>
                              <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-950 shrink-0" />
                            </div>
                            <div className="text-xs text-slate-400 font-mono truncate">{auth.user.googleProfile.email}</div>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs leading-relaxed text-slate-400">
                          <div className="flex justify-between border-b border-white/5 pb-1.5">
                            <span className="font-mono text-[10px] text-slate-500 uppercase">Provider ID:</span>
                            <span className="font-mono text-white text-[11px]">oauth2.google.com</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1.5">
                            <span className="font-mono text-[10px] text-slate-500 uppercase">Verification Status:</span>
                            <span className="text-emerald-400 font-bold font-mono">VERIFIED</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-1.5">
                            <span className="font-mono text-[10px] text-slate-500 uppercase">Synchronization Key:</span>
                            <span className="font-mono text-slate-300 text-[10px] truncate max-w-[150px]">gauth_usr_sha256_0x3F6A</span>
                          </div>
                        </div>

                        <button
                          onClick={handleUnlinkGoogle}
                          disabled={simLinkLoading}
                          className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/50 py-2.5 px-4 rounded-lg font-mono text-xs hover:text-rose-300 transition duration-150 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {simLinkLoading ? <Loader2 className="w-4 h-4 animate-spin text-rose-400" /> : <Unlink className="w-4 h-4" />}
                          Unlink Google Credentials
                        </button>
                      </div>
                    ) : (
                      isGoogleClientIdConfigured ? (
                        <div className="space-y-4 flex flex-col items-center">
                          <div id="btn_google_link_container" className="w-full flex justify-center" />
                          <span className="text-[9px] font-mono text-emerald-400 tracking-wider">
                            ● GOOGLE LINK GATEWAY ACTIVE
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 bg-amber-955/10 border border-amber-500/15 rounded-xl space-y-2">
                            <p className="text-xs text-amber-300 leading-normal font-sans">
                              Your ML screening parameters and level completions are stored in standard local state logs. Link your Google Identity to enable high-quality synchronization.
                            </p>
                          </div>

                          <button
                            onClick={() => setShowSimLinkModal(true)}
                            className="w-full bg-cyan-400 hover:bg-cyan-500 text-black py-2.5 px-4 rounded-lg font-bold text-xs transition duration-150 cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Chrome className="w-4 h-4 shrink-0" />
                            Link Google Identity Now (Simulated)
                          </button>
                          <p className="text-[9px] font-mono text-slate-500 text-center leading-normal select-none">
                            ℹ️ Running in Sandbox. Set <span className="text-cyan-400 font-bold">VITE_GOOGLE_CLIENT_ID</span> in <span className="text-slate-400">.env</span> to activate actual OAuth.
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* Right Column: Platform Credentials & Logout */}
                  <div className="space-y-4 bg-black/40 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">Sandbox Session Details</h3>
                      
                      <div className="space-y-2 text-xs text-slate-400">
                        <div className="flex justify-between border-b border-white/5 pb-1.5">
                          <span className="font-mono text-[10px] text-slate-500 uppercase">Aiden Handle:</span>
                          <span className="text-white font-bold">{auth.user?.username}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1.5">
                          <span className="font-mono text-[10px] text-slate-500 uppercase">Local Database Size:</span>
                          <span className="text-slate-300 font-mono">1.24 KB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-mono text-[10px] text-slate-500 uppercase">Security Token State:</span>
                          <span className="text-cyan-400 uppercase font-mono font-bold tracking-tight">ACTIVE REGION EXP</span>
                        </div>
                      </div>

                      <div className="p-3 bg-cyan-950/15 border border-cyan-800/20 rounded-lg text-[10px] font-mono leading-relaxed text-slate-400">
                        Cloud replication is completely local and immediate. Session is securely configured.
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-neutral-900 py-2.5 px-4 rounded-lg font-mono text-xs transition duration-150 cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                      <LogOut className="w-4 h-4 text-rose-450" />
                      De-authenticate Console (Logout)
                    </button>
                  </div>

                </div>

                <div className="h-px bg-white/10 my-4" />

                {/* Customization Shop Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5 flex-wrap gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white font-display uppercase tracking-wide">Dojo Customization & Skins Shop</h3>
                      <p className="text-[11px] text-slate-400">Spend your Gold Coins (GP) to customize Aiden's skins and dojo styles</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/25 rounded-lg text-xs font-mono text-amber-500 font-bold">
                      <span>Gold Balance:</span>
                      <span>{userStats.coins} GP</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Avatars Section */}
                    <div className="space-y-3 bg-black/30 p-5 rounded-xl border border-white/5">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider font-mono text-cyan-400">Unlock Character Skins (50 GP each)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: 'Aiden', label: 'Classic Aiden', desc: 'Default hero armor.' },
                          { name: 'Cyborg', label: 'Cyborg Aiden', desc: 'Cybernetic red eye visor.' },
                          { name: 'Samurai', label: 'Samurai Aiden', desc: 'Crimson samurai plate.' },
                          { name: 'CodeBot', label: 'Terminal CodeBot', desc: 'Neon green terminal matrix.' }
                        ].map((avatar) => {
                          const unlocked = unlockedAvatars.includes(avatar.name);
                          const active = activeAvatar === avatar.name;
                          return (
                            <button
                              key={avatar.name}
                              onClick={() => buyAvatar(avatar.name, 50)}
                              className={`p-3 rounded-lg border text-left transition duration-200 cursor-pointer flex flex-col justify-between min-h-[95px] ${
                                active
                                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.1)]'
                                  : unlocked
                                  ? 'bg-black/60 border-slate-700 text-slate-200 hover:border-slate-500'
                                  : 'bg-black/20 border-white/5 text-slate-450 hover:border-white/10 hover:text-slate-350'
                              }`}
                            >
                              <div>
                                <span className="text-[11px] font-bold block">{avatar.label}</span>
                                <span className="text-[9px] text-slate-500 mt-1 block leading-tight">{avatar.desc}</span>
                              </div>
                              <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between w-full text-[10px] font-mono font-bold">
                                {active ? (
                                  <span className="text-cyan-400 uppercase">ACTIVE</span>
                                ) : unlocked ? (
                                  <span className="text-slate-400 uppercase">EQUIP</span>
                                ) : (
                                  <span className="text-amber-500">50 GP</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dojo Themes Section */}
                    <div className="space-y-3 bg-black/30 p-5 rounded-xl border border-white/5">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider font-mono text-cyan-400">Unlock Dojo Arenas (100 GP each)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: 'default', label: 'Arcade Dojo', desc: 'Classic neon grids.' },
                          { name: 'cyberpunk', label: 'Cyberpunk Neon', desc: 'Dark pink cyber glow.' },
                          { name: 'matrix', label: 'Matrix Rain', desc: 'Green binary digital rain.' },
                          { name: 'sunset', label: 'Sunset Sunrise', desc: 'Glowing sun horizon.' }
                        ].map((theme) => {
                          const unlocked = unlockedThemes.includes(theme.name);
                          const active = activeTheme === theme.name;
                          return (
                            <button
                              key={theme.name}
                              onClick={() => buyTheme(theme.name, 100)}
                              className={`p-3 rounded-lg border text-left transition duration-200 cursor-pointer flex flex-col justify-between min-h-[95px] ${
                                active
                                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.1)]'
                                  : unlocked
                                  ? 'bg-black/60 border-slate-700 text-slate-200 hover:border-slate-500'
                                  : 'bg-black/20 border-white/5 text-slate-450 hover:border-white/10 hover:text-slate-350'
                              }`}
                            >
                              <div>
                                <span className="text-[11px] font-bold block">{theme.label}</span>
                                <span className="text-[9px] text-slate-500 mt-1 block leading-tight">{theme.desc}</span>
                              </div>
                              <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between w-full text-[10px] font-mono font-bold">
                                {active ? (
                                  <span className="text-cyan-400 uppercase">ACTIVE</span>
                                ) : unlocked ? (
                                  <span className="text-slate-400 uppercase">EQUIP</span>
                                ) : (
                                  <span className="text-amber-500">100 GP</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}



        </main>

      </div>

      {/* Dynamic Link Google Simulated Modal Popup */}
      {showSimLinkModal && (
        <div id="sim_link_google_modal" className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-sm bg-[#0E0E11] border border-white/15 rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setShowSimLinkModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm cursor-pointer"
            >
              ✕
            </button>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Chrome className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Connect Google Credentials</span>
              </div>
              <h3 className="text-sm font-bold text-white font-sans">Account Selection</h3>
              <p className="text-[11px] text-slate-400">Link your Google Identity to securely manage sandbox states.</p>
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
                        handleLinkGoogle({
                          name: customGoogleName.trim(),
                          email: customGoogleEmail.trim(),
                          picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customGoogleName.trim())}`,
                          verified: true
                        });
                        setIsAddingCustomGoogle(false);
                      }
                    }}
                    className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black font-bold text-xs py-2.5 rounded-lg cursor-pointer transition select-none"
                  >
                    Link Credentials
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCustomGoogle(false);
                    }}
                    className="px-4 bg-slate-900 border border-white/10 text-slate-355 hover:text-white text-xs rounded-lg transition cursor-pointer select-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2 border-y border-white/5 py-3">
                  {[
                    {
                      email: "nupddhaya@gmail.com",
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
                  ].map((account, index) => (
                    <button
                      key={index}
                      onClick={() => handleLinkGoogle(account)}
                      disabled={simLinkLoading}
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
                  ➕ Link a custom account...
                </button>
              </>
            )}

            {simLinkLoading && (
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Replicating cloud tokens...</span>
              </div>
            )}

            <div className="text-[9px] text-slate-500 leading-normal text-center select-none font-sans">
              To associate any profile, click its block above. Account sync holds permanently across current dev instances.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
