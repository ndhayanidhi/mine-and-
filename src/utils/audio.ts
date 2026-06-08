/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Check local storage for mute preference, safely handling server-side rendering
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('ai_quest_muted');
      this.muted = saved === 'true';
    }
  }

  setMuted(val: boolean) {
    this.muted = val;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ai_quest_muted', String(val));
    }
  }

  isMuted() {
    return this.muted;
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSFX(type: 'attack' | 'hit' | 'win' | 'gameover' | 'coin' | 'jump') {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const ctx = this.ctx;

      switch (type) {
        case 'attack': {
          // Retro laser sweep: 880Hz down to 110Hz in 0.15 seconds
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
          break;
        }
        case 'hit': {
          // White noise explosion for damage impacts
          const bufferSize = ctx.sampleRate * 0.1;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.1);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          
          noise.start();
          noise.stop(ctx.currentTime + 0.1);
          break;
        }
        case 'win': {
          // Major arpeggio success: C4, E4, G4, C5
          const notes = [261.63, 329.63, 392.00, 523.25];
          notes.forEach((freq, idx) => {
            const timeOffset = idx * 0.08;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.08, ctx.currentTime + timeOffset);
            gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + timeOffset);
            osc.stop(ctx.currentTime + timeOffset + 0.25);
          });
          break;
        }
        case 'gameover': {
          // Falling minor scale for hero fainting
          const notes = [311.13, 293.66, 277.18, 220.00];
          notes.forEach((freq, idx) => {
            const timeOffset = idx * 0.12;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.08, ctx.currentTime + timeOffset);
            gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + timeOffset);
            osc.stop(ctx.currentTime + timeOffset + 0.35);
          });
          break;
        }
        case 'coin': {
          // Dynamic dual-tone classic coin: B5 (987.77Hz) then E6 (1318.51Hz)
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.value = 987.77;
          gain1.gain.setValueAtTime(0.06, ctx.currentTime);
          gain1.gain.setValueAtTime(0.06, ctx.currentTime + 0.07);
          gain1.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start();
          osc1.stop(ctx.currentTime + 0.08);

          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.value = 1318.51;
          gain2.gain.setValueAtTime(0.06, ctx.currentTime + 0.075);
          gain2.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(ctx.currentTime + 0.075);
          osc2.stop(ctx.currentTime + 0.3);
          break;
        }
        case 'jump': {
          // Rapid sweep up for jump dashes
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(150, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
          break;
        }
      }
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  }
}

export const audio = new SoundSynthesizer();
