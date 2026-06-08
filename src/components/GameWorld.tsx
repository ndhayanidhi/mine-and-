import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Shield, 
  Swords, 
  Terminal as TermIcon, 
  Zap, 
  Flame, 
  Crosshair, 
  Compass, 
  Heart,
  Cpu,
  ShieldAlert,
  Volume2,
  VolumeX
} from 'lucide-react';
import { audio } from '../utils/audio';

interface GameWorldProps {
  currentAction: string | null;
  onAnimationEnd: () => void;
  lang: string;
  expectedAction: string;
  levelNumber: number;
  levelId: string;
  arenaActive?: boolean;
  setArenaActive?: (val: boolean) => void;
  activeAvatar?: string;
  activeTheme?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  vy: number;
  alpha: number;
}

export default function GameWorld({ 
  currentAction, 
  onAnimationEnd, 
  lang, 
  expectedAction, 
  levelNumber, 
  levelId,
  arenaActive = false,
  setArenaActive,
  activeAvatar = 'Aiden',
  activeTheme = 'default'
}: GameWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Mute state
  const [isMuted, setIsMuted] = useState(() => audio.isMuted());

  // Health and Fight Core States mirrored for JSX reaction
  const [playerHp, setPlayerHpState] = useState(100);
  const [score, setScoreState] = useState(0);
  const [actionMessage, setActionMessage] = useState('CODE GATEWAY ACTIVE. INPUT COMMAND TO STRIKE GLITCH OVERLORD!');
  const [isHealedMessage, setIsHealedMessage] = useState(false);
  const [gameOver, setGameOverState] = useState(false);

  // Animation parameters as pure refs to bypass React's render pipeline
  const playerHpRef = useRef(100);
  const enemyHpRef = useRef(100);
  const comboCountRef = useRef(0);
  const scoreRef = useRef(0);
  const announcerTextRef = useRef('ROUND 1');
  const announcerTimerRef = useRef(100);
  const screenShakeRef = useRef(0);
  const showKoOverlayRef = useRef(false);
  const gameOverRef = useRef(false);

  const playerStateRef = useRef<'idle' | 'dash' | 'attack' | 'slash' | 'jump_kick' | 'block' | 'hit' | 'win'>('idle');
  const enemyStateRef = useRef<'idle' | 'attack' | 'hit' | 'block' | 'faint'>('idle');

  const setGameOver = (val: boolean) => {
    gameOverRef.current = val;
    setGameOverState(val);
  };

  // Redefine setter proxies to keep existing update statement syntaxes perfectly compatible
  const setPlayerHp = (val: number | ((prev: number) => number)) => {
    if (typeof val === 'function') {
      setPlayerHpState(prev => {
        const next = Math.max(0, val(prev));
        playerHpRef.current = next;
        if (next <= 0) {
          setGameOver(true);
          audio.playSFX('gameover');
        }
        return next;
      });
    } else {
      const next = Math.max(0, val);
      playerHpRef.current = next;
      setPlayerHpState(next);
      if (next <= 0) {
        setGameOver(true);
        audio.playSFX('gameover');
      }
    }
  };

  const setScore = (val: number | ((prev: number) => number)) => {
    if (typeof val === 'function') {
      setScoreState(prev => {
        const next = val(prev);
        scoreRef.current = next;
        return next;
      });
    } else {
      scoreRef.current = val;
      setScoreState(val);
    }
  };

  const setEnemyHp = (val: number | ((prev: number) => number)) => {
    if (typeof val === 'function') {
      enemyHpRef.current = val(enemyHpRef.current);
    } else {
      enemyHpRef.current = val;
    }
  };

  const setComboCount = (val: number | ((prev: number) => number)) => {
    if (typeof val === 'function') {
      comboCountRef.current = val(comboCountRef.current);
    } else {
      comboCountRef.current = val;
    }
  };

  const setAnnouncerText = (val: string | ((prev: string) => string)) => {
    if (typeof val === 'function') {
      announcerTextRef.current = val(announcerTextRef.current);
    } else {
      announcerTextRef.current = val;
    }
  };

  const setAnnouncerTimer = (val: number | ((prev: number) => number)) => {
    if (typeof val === 'function') {
      announcerTimerRef.current = val(announcerTimerRef.current);
    } else {
      announcerTimerRef.current = val;
    }
  };

  const setScreenShake = (val: number | ((prev: number) => number)) => {
    if (typeof val === 'function') {
      screenShakeRef.current = val(screenShakeRef.current);
    } else {
      screenShakeRef.current = val;
    }
  };

  const setShowKoOverlay = (val: boolean | ((prev: boolean) => boolean)) => {
    if (typeof val === 'function') {
      showKoOverlayRef.current = val(showKoOverlayRef.current);
    } else {
      showKoOverlayRef.current = val;
    }
  };

  const setPlayerState = (val: 'idle' | 'dash' | 'attack' | 'slash' | 'jump_kick' | 'block' | 'hit' | 'win' | ((prev: 'idle' | 'dash' | 'attack' | 'slash' | 'jump_kick' | 'block' | 'hit' | 'win') => 'idle' | 'dash' | 'attack' | 'slash' | 'jump_kick' | 'block' | 'hit' | 'win')) => {
    if (typeof val === 'function') {
      playerStateRef.current = val(playerStateRef.current);
    } else {
      playerStateRef.current = val;
    }
  };

  const setEnemyState = (val: 'idle' | 'attack' | 'hit' | 'block' | 'faint' | ((prev: 'idle' | 'attack' | 'hit' | 'block' | 'faint') => 'idle' | 'attack' | 'hit' | 'block' | 'faint')) => {
    if (typeof val === 'function') {
      enemyStateRef.current = val(enemyStateRef.current);
    } else {
      enemyStateRef.current = val;
    }
  };

  // Refs for animation coordination
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const pPosRef = useRef({ x: 80, y: 190 });
  const ePosRef = useRef({ x: 280, y: 190 });
  const tickCountRef = useRef(0);

  // Set default HP values for different levels based on action scenarios
  useEffect(() => {
    const isScenario2 = expectedAction === 'collect' || expectedAction === 'jump';
    const isScenario3 = expectedAction === 'boss_fight' || expectedAction === 'walk_loop';

    if (isScenario2) {
      // Scenario 2: Start with low player HP so we can show "HEALTH up" or evasive jumping
      setPlayerHp(25);
      setEnemyHp(80);
      setAnnouncerText('HEALTH RECOVERY STATUS');
      setAnnouncerTimer(120);
      setActionMessage('LEVEL 2: REPLICATOR HEALING PACK ACTIVE. Declare variables to replenish full life!');
    } else if (isScenario3) {
      // Scenario 3: Boss fight or loop sequences combo
      setPlayerHp(100);
      setEnemyHp(100);
      setAnnouncerText('BOSS FIGHT - HIT K.O.!');
      setAnnouncerTimer(120);
      setActionMessage('LEVEL 3: ULTIMATE MATCH! Strike with loop sequences for final K.O. knockout!');
    } else {
      // Scenario 1: Active standard fight (move or attack)
      setPlayerHp(100);
      setEnemyHp(120);
      setAnnouncerText('READY... FIGHT!');
      setAnnouncerTimer(80);
      setActionMessage('LEVEL 1: ACTIVE FIGHT! Opponent attacks back! Execute correct statements to strike.');
    }

    if (!arenaActive) {
      setActionMessage('STANDBY: Write code in main.py & execute or click main.py tab to initiate battle!');
    }

    setShowKoOverlay(false);
    setGameOver(false);
  }, [levelId, expectedAction, levelNumber, arenaActive]);

  // Adjust coordinates on resize responsive layout
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = 320;
        
        pPosRef.current = { x: canvas.width * 0.22, y: 190 };
        ePosRef.current = { x: canvas.width * 0.74, y: 190 };
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Action helpers
  const spawnParticles = (x: number, y: number, color: string, count = 15) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1, // slightly rising
        color,
        size: 1.5 + Math.random() * 3,
        alpha: 1.0,
        decay: 0.015 + Math.random() * 0.02
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];
  };

  const spawnFloatingText = (x: number, y: number, text: string, color = '#22d3ee') => {
    floatingTextsRef.current.push({
      x,
      y,
      text,
      color,
      vy: -1.5 - Math.random() * 1.5,
      alpha: 1.0
    });
  };

  // Standard and Boss Fight scenarios: Opponent also attacks periodic AI scheduler loop
  useEffect(() => {
    const isScenario1 = expectedAction === 'move' || expectedAction === 'attack';
    const isScenario3 = expectedAction === 'boss_fight' || expectedAction === 'walk_loop';
    if (!isScenario1 && !isScenario3) return;
    if (!arenaActive) return;

    const opAttackInterval = setInterval(() => {
      if (enemyHpRef.current <= 0 || playerHpRef.current <= 0 || gameOverRef.current) return;
      
      // Select Opponent Attack Move
      setEnemyState('attack');
      audio.playSFX('attack');
      if (isScenario3) {
        setActionMessage('Glitch Overlord fires [MEGA GIGA VOLT BEAM]!');
      } else {
        setActionMessage('Glitch Bug counters with [CPU EXHAUST MISSILE]!');
      }
      setScreenShake(6);

      // Fire red projectile from enemy to player
      let projX = ePosRef.current.x - 20;
      const projY = ePosRef.current.y + 10;
      const targetX = pPosRef.current.x + 15;

      const projTimer = setInterval(() => {
        if (gameOverRef.current) {
          clearInterval(projTimer);
          return;
        }
        projX -= 18;
        spawnParticles(projX, projY, '#ef4444', 3);
        
        if (projX <= targetX) {
          clearInterval(projTimer);
          
          setPlayerState('hit');
          setScreenShake(12);
          audio.playSFX('hit');
          
          const dmg = isScenario3 ? 25 : 20;
          setPlayerHp(prev => Math.max(0, prev - dmg));
          spawnParticles(targetX, projY, '#ef4444', 30);
          spawnFloatingText(targetX, pPosRef.current.y - 45, `HIT! -${dmg} HP`, '#ef4444');
          
          if (playerHpRef.current <= 0) {
            setActionMessage('Aiden has fainted! Compilation compromised.');
          } else {
            if (isScenario3) {
              setActionMessage(`Glitch Overlord dealt ${dmg} damage! Run your loop scripts to K.O. the boss!`);
            } else {
              setActionMessage(`Glitch Bug dealt ${dmg} damage! Write print("GO") parameters to attack!`);
            }
          }

          setTimeout(() => {
            if (!gameOverRef.current) {
              setPlayerState('idle');
              setEnemyState('idle');
            }
          }, 600);
        }
      }, 30);

    }, isScenario3 ? 6000 : 7500); // Boss attacks more frequently

    return () => clearInterval(opAttackInterval);
  }, [levelId, expectedAction, arenaActive]);

  const handleResetLevel = () => {
    const isScenario2 = expectedAction === 'collect' || expectedAction === 'jump';
    setGameOver(false);
    if (setArenaActive) {
      setArenaActive(false);
    }
    if (isScenario2) {
      setPlayerHp(25);
    } else {
      setPlayerHp(100);
    }
    setEnemyHp(100);
    setComboCount(0);
    setScore(0);
    setPlayerState('idle');
    setEnemyState('idle');
    setShowKoOverlay(false);
    setAnnouncerText('REMATCH STATE');
    setAnnouncerTimer(70);
    setActionMessage('Arena reset! Match values restored successfully.');
  };

  // Manual heal option for satisfaction
  const triggerManualHeal = () => {
    setPlayerState('block');
    setPlayerHp(100);
    audio.playSFX('win');
    spawnParticles(pPosRef.current.x, pPosRef.current.y + 10, '#10b981', 35);
    spawnFloatingText(pPosRef.current.x, pPosRef.current.y - 45, 'REPLICATED HEAL +100%!', '#10b981');
    setActionMessage('Emergency Bio-Medpack absorbed. Aiden HP fully restored!');
    setTimeout(() => setPlayerState('idle'), 650);
  };

  // Map Code execution onto actual Fighting game moves
  useEffect(() => {
    if (!currentAction) return;

    if (currentAction === 'move') {
      setActionMessage('Syntaxes matched! Aiden executes [PLASMA DASH STRIKE]!');
      setPlayerState('dash');
      setComboCount(prev => prev + 1);
      audio.playSFX('attack');
      
      // Level 1 specific combo
      setTimeout(() => {
        setPlayerState('slash');
        setEnemyState('hit');
        setScreenShake(14);
        audio.playSFX('hit');
        setEnemyHp(prev => Math.max(0, prev - 45));
        setScore(prev => prev + 100);
        
        const targetX = ePosRef.current.x - 30;
        spawnParticles(targetX, ePosRef.current.y + 10, '#22d3ee', 30);
        spawnFloatingText(targetX, ePosRef.current.y - 45, 'CRITICAL! -45 HP', '#22d3ee');
        spawnFloatingText(pPosRef.current.x, pPosRef.current.y - 70, 'PLASMA SHIFT', '#eab308');

        // Opponent flies back or takes counter reaction
        setTimeout(() => {
          setPlayerState('idle');
          setEnemyState('idle');
          onAnimationEnd();
        }, 600);

      }, 400);
    } 

    else if (currentAction === 'collect') {
      setActionMessage('Variable declared true! Absorb Nano-Potion [HEALTH RECOVERY]!');
      setPlayerState('block');
      setComboCount(prev => prev + 1);
      
      setTimeout(() => {
        setScreenShake(8);
        setPlayerHp(100); // Fully Up to 100 on level 2
        audio.playSFX('win');
        setScore(prev => prev + 150);
        
        // Massive upward matrix green particle spray
        for (let i = 0; i < 40; i++) {
          setTimeout(() => {
            spawnParticles(
              pPosRef.current.x + (Math.random() - 0.5) * 20, 
              pPosRef.current.y + 20 - i * 4, 
              '#10b981', 
              2
            );
          }, i * 10);
        }

        spawnFloatingText(pPosRef.current.x, pPosRef.current.y - 50, 'HEALTH RECOVERY +100%!', '#10b981');
        setActionMessage('Level 2 objective cleared! Aidan recovered full health with Python variable declaration.');
        
        setTimeout(() => {
          setPlayerState('idle');
          onAnimationEnd();
        }, 600);
      }, 300);
    }

    else if (currentAction === 'walk_loop') {
      setActionMessage('Pacing Loops compiled! Launching [ULTIMATE RECURSIVE K.O. COMBO]!');
      setPlayerState('dash');
      setComboCount(prev => prev + 5);
      audio.playSFX('attack');

      let hits = 0;
      const interval = setInterval(() => {
        hits++;
        setPlayerState(hits % 2 === 0 ? 'slash' : 'attack');
        setEnemyState('hit');
        setScreenShake(10);
        audio.playSFX('hit');
        setEnemyHp(prev => Math.max(0, prev - 25));
        setScore(prev => prev + 80);
        
        const impactX = ePosRef.current.x - 20;
        spawnParticles(impactX, ePosRef.current.y + Math.random() * 20 - 10, '#ec4899', 15);
        spawnFloatingText(impactX, ePosRef.current.y - 30, `COMBO HIT #${hits}!`, '#f43f5e');

        if (hits >= 4) {
          clearInterval(interval);
          
          // Triggers giant LEVEL 3 Knockout sequence
          setEnemyState('faint');
          setPlayerState('win');
          audio.playSFX('win');
          setEnemyHp(0);
          setScreenShake(30);
          setShowKoOverlay(true);
          setAnnouncerText('K.O.!');
          setAnnouncerTimer(180);
          
          spawnParticles(ePosRef.current.x, ePosRef.current.y, '#ef4444', 60);
          spawnParticles(ePosRef.current.x, ePosRef.current.y - 20, '#fbbf24', 40);
          
          spawnFloatingText(ePosRef.current.x, ePosRef.current.y - 70, 'GLITCH DESTROYED! K.O.', '#fbbf24');
          setActionMessage('LEVEL 3 SUCCESS! Massive loop execution triggered the ultimate K.O. Knockout!');

          setTimeout(() => {
            onAnimationEnd();
          }, 1500);
        }
      }, 250);
    }

    else if (currentAction === 'attack') {
      setActionMessage('Condition check True! Charging Cannon [HADOUKEN BURST]!');
      setPlayerState('attack');
      setComboCount(prev => prev + 1);
      audio.playSFX('attack');

      let projX = pPosRef.current.x + 20;
      const projY = pPosRef.current.y + 10;
      const targetX = ePosRef.current.x - 20;

      const projInterval = setInterval(() => {
        projX += 16;
        spawnParticles(projX, projY, '#a855f7', 4);
        
        if (projX >= targetX) {
          clearInterval(projInterval);
          setEnemyState('hit');
          setScreenShake(15);
          audio.playSFX('hit');
          
          let lethal = 30;
          if (levelNumber === 3) {
            lethal = 100; // instant knockout on Level 3
          }

          setEnemyHp(prev => Math.max(0, prev - lethal));
          setScore(prev => prev + 200);
          
          spawnParticles(targetX, projY, '#a855f7', 35);
          spawnFloatingText(targetX, ePosRef.current.y - 45, `DISRUPTER STRIKE -${lethal} HP`, '#a855f7');

          if (levelNumber === 3 || enemyHpRef.current <= lethal) {
            setEnemyState('faint');
            setPlayerState('win');
            audio.playSFX('win');
            setShowKoOverlay(true);
            setAnnouncerText('K.O.!');
            setAnnouncerTimer(200);
          }

          setTimeout(() => {
            setPlayerState('idle');
            setEnemyState('idle');
            onAnimationEnd();
          }, 700);
        }
      }, 25);
    }

    else if (currentAction === 'jump') {
      setActionMessage('Adaptive Jumping active! launching [AERIAL SKYKICK]!');
      setPlayerState('jump_kick');
      setComboCount(prev => prev + 1);
      audio.playSFX('jump');

      setTimeout(() => {
        setEnemyState('hit');
        setScreenShake(12);
        audio.playSFX('hit');
        
        const forceHp = levelNumber === 3 ? 100 : 35;
        setEnemyHp(prev => Math.max(0, prev - forceHp));
        setScore(prev => prev + 200);

        const targetX = ePosRef.current.x - 20;
        spawnParticles(targetX, ePosRef.current.y, '#f59e0b', 30);
        spawnFloatingText(targetX, ePosRef.current.y - 45, `SKYBURST -${forceHp} HP`, '#f59e0b');

        if (levelNumber === 3) {
          setEnemyState('faint');
          setPlayerState('win');
          audio.playSFX('win');
          setShowKoOverlay(true);
          setAnnouncerText('K.O.!');
          setAnnouncerTimer(200);
        }

        setTimeout(() => {
          setPlayerState('idle');
          setEnemyState('idle');
          onAnimationEnd();
        }, 600);
      }, 400);
    }

    else if (currentAction === 'boss_fight') {
      setActionMessage('Recursive Algorithm active! UNLEASHING FINAL K.O. EXECUTION!');
      setPlayerState('slash');
      audio.playSFX('attack');
      
      let finalHits = 0;
      const finalInterval = setInterval(() => {
        finalHits++;
        setScreenShake(finalHits * 5);
        setEnemyState('hit');
        audio.playSFX('hit');
        setEnemyHp(prev => Math.max(0, prev - 30));
        setScore(prev => prev + 200);
        
        spawnParticles(ePosRef.current.x, ePosRef.current.y - 10, '#ec4899', 15);
        spawnFloatingText(ePosRef.current.x, ePosRef.current.y - 20 - finalHits*12, 'K.O. STRIKE', '#fbbf24');

        if (finalHits >= 4) {
          clearInterval(finalInterval);
          setEnemyState('faint');
          setPlayerState('win');
          audio.playSFX('win');
          setEnemyHp(0);
          setScreenShake(35);
          setShowKoOverlay(true);
          setAnnouncerText('K.O.!');
          setAnnouncerTimer(180);
          
          spawnParticles(ePosRef.current.x, ePosRef.current.y, '#f43f5e', 60);
          spawnFloatingText(ePosRef.current.x, ePosRef.current.y - 60, 'CORE DECIMATED!', '#dc2626');
          
          setTimeout(() => {
            onAnimationEnd();
          }, 1500);
        }
      }, 250);
    }
  }, [currentAction, levelNumber]);

  // Canvas High-Rate Fighting Render Loop
  useEffect(() => {
    let internalTick = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Robust polyfill/fallback for roundRect support in older Web engines
    if (ctx && typeof ctx.roundRect !== 'function') {
      ctx.roundRect = function (x: number, y: number, w: number, h: number, r: any) {
        let radii: number[] = [0, 0, 0, 0];
        if (typeof r === 'number') {
          radii = [r, r, r, r];
        } else if (Array.isArray(r)) {
          if (r.length === 1) radii = [r[0], r[0], r[0], r[0]];
          else if (r.length === 2) radii = [r[0], r[1], r[0], r[1]];
          else if (r.length === 3) radii = [r[0], r[1], r[2], r[1]];
          else if (r.length >= 4) radii = [r[0], r[1], r[2], r[3]];
        }
        this.beginPath();
        this.moveTo(x + radii[0], y);
        this.lineTo(x + w - radii[1], y);
        this.arcTo(x + w, y, x + w, y + radii[1], radii[1]);
        this.lineTo(x + w, y + h - radii[3]);
        this.arcTo(x + w, y + h, x + w - radii[3], y + h, radii[3]);
        this.lineTo(x + radii[2], y + h);
        this.arcTo(x, y + h, x, y + h - radii[2], radii[2]);
        this.lineTo(x, y + radii[0]);
        this.arcTo(x, y, x + radii[0], y, radii[0]);
        this.closePath();
        return this;
      };
    }

    const isScenario1 = expectedAction === 'move' || expectedAction === 'attack';
    const isScenario2 = expectedAction === 'collect' || expectedAction === 'jump';
    const isScenario3 = expectedAction === 'boss_fight' || expectedAction === 'walk_loop';

    const render = () => {
      internalTick++;
      tickCountRef.current = internalTick;
      
      const w = canvas.width;
      const h = canvas.height;

      // Apply screen shake
      ctx.save();
      if (screenShakeRef.current > 0.1) {
        const dx = (Math.random() - 0.5) * screenShakeRef.current;
        const dy = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(dx, dy);
      }

      // 1. Draw Street Fighter Style Sci-Fi Dojo Background
      let bgGradStart = '#0F0E17';
      let bgGradEnd = '#050508';
      let gridColor = 'rgba(14, 165, 233, 0.08)';
      let floorPerspectiveColor = 'rgba(34, 211, 238, 0.1)';
      let horizonLineColor = isScenario2 ? '#10b981' : '#0284c7';
      let boundsCircleColor = isScenario2 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(34, 211, 238, 0.2)';

      if (activeTheme === 'cyberpunk') {
        bgGradStart = '#1e0b36';
        bgGradEnd = '#090214';
        gridColor = 'rgba(236, 72, 153, 0.15)'; // Neon Pink
        floorPerspectiveColor = 'rgba(236, 72, 153, 0.12)';
        horizonLineColor = '#ec4899';
        boundsCircleColor = 'rgba(236, 72, 153, 0.25)';
      } else if (activeTheme === 'matrix') {
        bgGradStart = '#021805';
        bgGradEnd = '#000500';
        gridColor = 'rgba(34, 197, 94, 0.18)'; // Matrix Green
        floorPerspectiveColor = 'rgba(34, 197, 94, 0.15)';
        horizonLineColor = '#22c55e';
        boundsCircleColor = 'rgba(34, 197, 94, 0.3)';
      } else if (activeTheme === 'sunset') {
        bgGradStart = '#2a081c';
        bgGradEnd = '#0a0207';
        gridColor = 'rgba(249, 115, 22, 0.15)'; // Sunset Orange
        floorPerspectiveColor = 'rgba(249, 115, 22, 0.12)';
        horizonLineColor = '#f97316';
        boundsCircleColor = 'rgba(249, 115, 22, 0.25)';
      }

      const radialGrad = ctx.createRadialGradient(w/2, h/2, 20, w/2, h/2, w);
      radialGrad.addColorStop(0, bgGradStart); 
      radialGrad.addColorStop(1, bgGradEnd); 
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, w, h);

      // SUNSET THEME SUN: Draw a gorgeous glowing sunset sun at the horizon line
      if (activeTheme === 'sunset') {
        ctx.save();
        const sunGrad = ctx.createRadialGradient(w/2, 230, 2, w/2, 230, 45);
        sunGrad.addColorStop(0, '#fbbf24'); // Gold
        sunGrad.addColorStop(0.5, '#f97316'); // Orange
        sunGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(w/2, 230, 45, 0, Math.PI, true); // half circle above horizon
        ctx.fill();
        ctx.restore();
      }

      // MATRIX THEME DIGITAL RAIN: Draw dynamic matrix digital rain lines falling down
      if (activeTheme === 'matrix') {
        ctx.save();
        ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.font = 'bold 9px monospace';
        for (let col = 0; col < 12; col++) {
          const colX = (w / 12) * col + 10;
          const speedMultiplier = (col % 3) + 1;
          const charY = ((internalTick * speedMultiplier * 1.5) % (h - 120)) + 30;
          const randChar = String.fromCharCode(33 + Math.floor(Math.random() * 93));
          ctx.fillText(randChar, colX, charY);
        }
        ctx.restore();
      }

      // Holographic floor grid lines
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 230);
        ctx.lineTo(i - 120 + (i/w)*240, h);
        ctx.stroke();
      }
      
      // Horizontal perspective floor lines
      for (let y = 230; y < h; y += 18) {
        ctx.strokeStyle = floorPerspectiveColor;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Neon separation horizon line
      ctx.strokeStyle = horizonLineColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 230);
      ctx.lineTo(w, 230);
      ctx.stroke();

      // Neon bounds circle
      ctx.strokeStyle = boundsCircleColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(w/2, 260, w*0.4, 25, 0, 0, Math.PI * 2);
      ctx.stroke();

      // LEVEL 2 SPECIAL: Draw on-stage green energy healing artifact 
      if (isScenario2) {
        const itemY = 160 + Math.sin(internalTick * 0.06) * 6;
        const itemX = w / 2;
        
        // Glow bubble
        ctx.save();
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.beginPath();
        ctx.arc(itemX, itemY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(itemX, itemY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Label above healer
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BIOS HEAL PACK', itemX, itemY - 22);
      }

      // 2. Draw Fighter HUD: Lifebars & Names at the Top half
      const barW = w * 0.35;
      const barH = 14;
      const barY = 32;

      // Player Life Bar (Left)
      const plX = 24;
      ctx.fillStyle = '#1e1b4b'; 
      ctx.fillRect(plX, barY, barW, barH);
      ctx.fillStyle = playerHpRef.current > 35 ? '#10b981' : '#ef4444'; // Red if critical
      ctx.fillRect(plX + (barW - (barW * (playerHpRef.current / 100))), barY, barW * (playerHpRef.current / 100), barH); 
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(plX, barY, barW, barH);

      // Player description labels
      ctx.textAlign = 'left';
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('AIDEN [HERO]', plX, barY - 8);
      ctx.fillStyle = playerHpRef.current > 35 ? '#22d3ee' : '#f43f5e';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`HP: ${playerHpRef.current}/100`, plX + (barW - 65), barY - 8);

      // Enemy Life Bar (Right)
      const enX = w - barW - 24;
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(enX, barY, barW, barH);
      ctx.fillStyle = '#ef4444'; 
      ctx.fillRect(enX, barY, barW * (enemyHpRef.current / 100), barH);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(enX, barY, barW, barH);

      // Enemy descriptions labels
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(levelNumber === 3 ? 'SUPER GOLIATH [BOSS]' : 'GLITCH BUG [ENEMY]', enX, barY - 8);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`HP: ${enemyHpRef.current}/100`, enX + barW, barY - 8);

      // Draw VS Symbol in Center circle
      const midX = w / 2;
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'italic bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('VS', midX, barY + 12);

      // Combo banner counts
      if (comboCountRef.current > 0) {
        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold italic 20px monospace';
        ctx.fillText(`${comboCountRef.current} HIT COMBO!`, midX, barY + 45);
      }

      // 3. Render Particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);

      // 4. Render Floating text indicators
      floatingTextsRef.current.forEach((t) => {
        t.y += t.vy;
        t.alpha -= 0.025;
        ctx.fillStyle = t.color;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.globalAlpha = Math.max(0, t.alpha);
        ctx.fillText(t.text, t.x, t.y);
      });
      ctx.globalAlpha = 1.0;
      floatingTextsRef.current = floatingTextsRef.current.filter(t => t.alpha > 0);

      // 5. Draw THE FIGHTER 1: AIDEN (Player on Left bounds)
      let curPX = pPosRef.current.x;
      let curPY = pPosRef.current.y;

      if (playerStateRef.current === 'dash' || playerStateRef.current === 'slash') {
        curPX = ePosRef.current.x - 70; 
      }
      if (playerStateRef.current === 'jump_kick') {
        curPX = ePosRef.current.x - 60;
        curPY = pPosRef.current.y - 45; 
      }

      ctx.save();
      ctx.translate(curPX, curPY);

      if (gameOverRef.current) {
        ctx.translate(0, 24);
        ctx.rotate(-Math.PI / 2);
      }

      // Ground aura helper
      const auraGlow = ctx.createRadialGradient(0, 20, 2, 0, 20, 25);
      auraGlow.addColorStop(0, isScenario2 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(34, 211, 238, 0.4)');
      auraGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = auraGlow;
      ctx.fillRect(-20, 10, 40, 20);

      const stanceBounce = Math.sin(internalTick * 0.15) * 2;
      ctx.fillStyle = '#0f172a'; 
      ctx.fillRect(-9, 28, 6, 8);
      ctx.fillRect(3, 28, 6, 8);

      // Custom skin properties selection
      let armorColor = '#ffffff';
      let outlineColor = isScenario2 ? '#10b981' : '#0ea5e9';
      let visorColor = isScenario2 ? '#10b981' : '#22d3ee';
      let swordColor = '#fbbf24';
      let swordGlowColor = '#eab308';

      if (activeAvatar === 'Cyborg') {
        armorColor = '#3f3f46';
        outlineColor = '#ef4444';
        visorColor = '#ef4444';
        swordColor = '#a855f7';
        swordGlowColor = '#c084fc';
      } else if (activeAvatar === 'Samurai') {
        armorColor = '#991b1b';
        outlineColor = '#b91c1c';
        visorColor = '#fbbf24';
        swordColor = '#ffffff';
        swordGlowColor = '#cbd5e1';
      } else if (activeAvatar === 'CodeBot') {
        armorColor = '#22c55e';
        outlineColor = '#15803d';
        visorColor = '#ffffff';
        swordColor = '#22c55e';
        swordGlowColor = '#4ade80';
      }

      // Body armor color depends on state or HP
      ctx.fillStyle = playerStateRef.current === 'hit' ? '#ef4444' : armorColor;
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 2.5;
      
      ctx.beginPath();
      ctx.roundRect(-10, -10 + stanceBounce, 20, 38, [4]);
      ctx.fill();
      ctx.stroke();

      // Core visor glow inside
      ctx.fillStyle = playerStateRef.current === 'block' ? '#10b981' : visorColor;
      ctx.fillRect(-3, 4 + stanceBounce, 6, 12);

      // Helmet visor
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, -25 + stanceBounce, 16, 15);
      ctx.fillStyle = visorColor;
      ctx.fillRect(-5, -20 + stanceBounce, 11, 6);

      // Sword glowing state
      if (playerStateRef.current === 'slash' || playerStateRef.current === 'attack' || playerStateRef.current === 'jump_kick') {
        ctx.strokeStyle = swordColor;
        ctx.lineWidth = 4;
        ctx.shadowColor = swordGlowColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(10, 15);
        ctx.lineTo(40 + Math.sin(internalTick) * 8, -15);
        ctx.stroke();
        ctx.shadowBlur = 0; 
      } else {
        ctx.strokeStyle = swordColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-20, -18);
        ctx.stroke();
      }

      if (playerStateRef.current === 'block') {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 5, 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // 6. Draw THE FIGHTER 2: GLITCH OVERLORD (Enemy on Right bounds)
      let curEX = ePosRef.current.x;
      let curEY = ePosRef.current.y;

      // Enemy moves closer if attacking (Fight style!)
      if (enemyStateRef.current === 'attack' && isScenario1 && tickCountRef.current % 100 > 60) {
        curEX = pPosRef.current.x + 80;
      }

      ctx.save();
      ctx.translate(curEX, curEY);

      const threatGlow = ctx.createRadialGradient(0, 18, 2, 0, 18, 30);
      threatGlow.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
      threatGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = threatGlow;
      ctx.fillRect(-25, 10, 50, 20);

      if (enemyStateRef.current === 'faint') {
        ctx.translate(0, 18);
        ctx.rotate(Math.PI / 2);
      }

      const glitchOffset = enemyStateRef.current === 'hit' ? (Math.random() - 0.5) * 12 : 0;
      
      // Giant antagonist matrix robots
      ctx.fillStyle = enemyStateRef.current === 'hit' ? 'rgba(239, 68, 68, 0.9)' : '#1e1c25';
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = isScenario3 ? 4 : 2.5; // Thicker border for boss
      
      const boxW = isScenario3 ? 48 : 40;
      const boxH = isScenario3 ? 58 : 50;

      ctx.beginPath();
      ctx.roundRect(-boxW/2 + glitchOffset, -22, boxW, boxH, [6]);
      ctx.fill();
      ctx.stroke();

      // Enemy laser eyeball
      ctx.fillStyle = (internalTick % 16 < 8 && enemyStateRef.current !== 'faint') ? '#ffffff' : '#ef4444';
      ctx.beginPath();
      ctx.arc(0 + glitchOffset, -10, isScenario3 ? 12 : 8, 0, Math.PI * 2);
      ctx.fill();

      // Giant crown horn detail for boss
      if (isScenario3 && enemyStateRef.current !== 'faint') {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(-15 + glitchOffset, -22);
        ctx.lineTo(0 + glitchOffset, -38);
        ctx.lineTo(15 + glitchOffset, -22);
        ctx.fill();
      }

      // Antagonist Shoulder weapons
      if (enemyStateRef.current !== 'faint') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-26 + glitchOffset, -28, 8, 12);
        ctx.fillRect(18 + glitchOffset, -28, 8, 12);
      }

      ctx.restore();

      // 7. Render Announcer text overhead overlay
      if (announcerTextRef.current && announcerTimerRef.current > 0) {
        announcerTimerRef.current--;
        ctx.fillStyle = 'rgba(0,0,0,0.45)'; 
        ctx.fillRect(0, h/2 - 25, w, 50);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'italic bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(announcerTextRef.current, w/2, h/2 + 7);
        ctx.fillText(announcerTextRef.current, w/2, h/2 + 7);
      }

      // GIANT LEVEL 3 FLASHING K.O. KNOCKOUT FRAME
      if (showKoOverlayRef.current) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.fillRect(0, 0, w, h);
        
        ctx.save();
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 20;
        ctx.font = 'italic bold 52px IMPACT, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#dc2626';
        ctx.textAlign = 'center';
        ctx.lineWidth = 8;
        ctx.strokeText('K.O.', w/2, h/2 + 20);
        ctx.fillText('K.O.', w/2, h/2 + 20);
        
        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('GLITCH OVERLORD CRASHED SUCCESSFULLY!', w/2, h/2 + 48);
        ctx.restore();
      }

      // GIANT FLASHING GAME OVER OVERLAY FRAME
      if (gameOverRef.current) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.fillRect(0, 0, w, h);
        
        ctx.save();
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 25;
        ctx.font = 'italic bold 44px IMPACT, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#991b1b';
        ctx.textAlign = 'center';
        ctx.lineWidth = 7;
        ctx.strokeText('GAME OVER', w/2, h/2 + 10);
        ctx.fillText('GAME OVER', w/2, h/2 + 10);
        
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('AIDEN CORE FAINTED! SCANLINES OFFLINE.', w/2, h/2 + 42);
        ctx.restore();
      }

      // ARENA STANDBY OVERLAY (when arena is not active yet)
      if (!arenaActive) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 12;
        
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
        ctx.lineWidth = 1.5;
        // draw dashed borders
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(15, 15, w - 30, h - 30);
        ctx.setLineDash([]); // Reset line dash

        ctx.font = 'bold 15px monospace';
        ctx.fillStyle = '#22d3ee';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ CODE COMPILER STANDBY PANEL ⚡', w / 2, h / 2 - 25);

        ctx.font = '11px font-sans';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('The combat arena is waiting in offline standby mode.', w / 2, h / 2 + 5);
        ctx.fillText('Write your structures in main.py, then execute to begin!', w / 2, h / 2 + 22);

        // Draw a neat button simulator outline
        ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
        ctx.fillRect(w / 2 - 110, h / 2 + 40, 220, 26);
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(w / 2 - 110, h / 2 + 40, 220, 26);

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#22d3ee';
        ctx.fillText('👉 CLICK main.py TAB TO INITIATE GRID', w / 2, h / 2 + 56);

        ctx.restore();
      }

      ctx.restore(); 

      // Shake decaying
      screenShakeRef.current = Math.max(0, screenShakeRef.current * 0.9);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [levelId, expectedAction, levelNumber, arenaActive]);

  return (
    <div id="game_world_container" ref={containerRef} className="relative w-full bg-[#0E0E11] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
      
      {gameOver && (
        <div id="game_over_screen_blocker" className="absolute inset-0 bg-black/85 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4 z-30 select-none">
          <div className="flex items-center justify-center p-3 px-3.5 bg-rose-950/50 rounded-full border border-rose-800 text-rose-400 animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold tracking-widest text-red-500 font-display italic">GAME OVER</h1>
            <p className="text-xs text-slate-400 font-mono px-4">Aiden's health core drained to 0%. Match failed!</p>
          </div>
          <button
            id="btn_game_over_restart"
            onClick={handleResetLevel}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-lg border border-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-150 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Match
          </button>
        </div>
      )}
      
      {/* Title Fighting arcade layout header */}
      <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-[#09090B]/90 backdrop-blur border border-white/10 rounded-full select-none z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] font-mono text-slate-250 font-bold tracking-widest flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-red-500 shrink-0" />
          CODING FIGHT ARENA : LEVEL {levelNumber}
        </span>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        {(expectedAction === 'collect' || expectedAction === 'jump') && playerHp < 100 && (
          <button 
            id="btn_manual_heal_medpack"
            onClick={triggerManualHeal}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded hover:brightness-125 transition duration-200 cursor-pointer"
          >
            <Heart className="w-3 h-3 text-emerald-400 fill-emerald-500" />
            HEAL (variable)
          </button>
        )}
        <button
          id="btn_toggle_mute"
          onClick={() => {
            const next = !isMuted;
            setIsMuted(next);
            audio.setMuted(next);
          }}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-slate-300 bg-[#09090B]/90 border border-white/10 hover:border-white/20 rounded transition duration-200 cursor-pointer"
          title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
        >
          {isMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-cyan-400" />}
          <span>{isMuted ? 'Muted' : 'Audio'}</span>
        </button>
        <button
          id="btn_reset_env"
          onClick={handleResetLevel}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-slate-300 bg-[#09090B]/90 border border-white/10 hover:border-white/20 rounded transition duration-200 cursor-pointer"
          title="Reset match positions"
        >
          <RotateCcw className="w-3 h-3" />
          Reset HP
        </button>
      </div>

      <canvas 
        id="game_viewport_canvas" 
        ref={canvasRef} 
        className={`block w-full h-[320px] ${!arenaActive ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''}`} 
        onClick={() => {
          if (!arenaActive && setArenaActive) {
            setArenaActive(true);
          }
        }}
      />

      {/* Controller Combo status line */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#08080A] border-t border-white/10 font-mono text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2 max-w-[70%]">
          <TermIcon className="w-4 h-4 text-cyan-400 shrink-0 animate-bounce" />
          <span className="truncate text-slate-200 font-semibold">{actionMessage}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded bg-cyan-950/10">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-slate-100 font-bold">{score} XP</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded bg-orange-950/10">
            <Flame className="w-3.5 h-3.5 animate-pulse text-amber-500" />
            <span className="text-slate-200 font-bold">
              {expectedAction === 'collect' || expectedAction === 'jump' ? 'REPAIR STAGE' : (expectedAction === 'boss_fight' || expectedAction === 'walk_loop' ? 'K.O. STAGE' : 'FIGHT STAGE')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
