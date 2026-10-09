/**
 * Web Audio API ambient outdoor soundscape synthesizer and speech synthesis guide
 * Works offline, no external audio assets required.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private oscInterval: number | null = null;
  private isAmbientPlaying = false;
  private currentSoundType: 'forest' | 'stream' | 'wind' | 'off' = 'off';

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Plays a tranquil chime for waypoints or expedition completion
   */
  public playChime(type: 'waypoint' | 'complete' | 'start' | 'tick') {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'start') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(392, now); // G4
        osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.3); // D5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === 'waypoint') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc.start(now);
        osc.stop(now + 0.9);
      } else if (type === 'complete') {
        // Harmonious chord
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          if (!this.ctx) return;
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + idx * 0.1);
          g.gain.setValueAtTime(0.12, now + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
          o.connect(g);
          g.connect(this.ctx.destination);
          o.start(now + idx * 0.1);
          o.stop(now + 2.0);
        });
      } else {
        // Gentle tick
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch {
      // Audio autoplay policy handled silently
    }
  }

  /**
   * Starts ambient nature noise synthesizer (gentle wind or stream murmur)
   */
  public startAmbient(type: 'forest' | 'stream' | 'wind') {
    try {
      this.stopAmbient();
      this.initContext();
      if (!this.ctx) return;

      this.currentSoundType = type;
      this.isAmbientPlaying = true;

      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pinkish filtered noise
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.08;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      if (type === 'wind') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      } else if (type === 'stream') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(750, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.8, this.ctx.currentTime);
      } else {
        // Forest - gentle broadband
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      }

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 1.5);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      whiteNoise.start(0);
      this.noiseNode = whiteNoise;
      this.ambientGain = masterGain;

      // Occasional random gentle chirp if forest
      if (type === 'forest') {
        this.oscInterval = window.setInterval(() => {
          if (!this.isAmbientPlaying || !this.ctx) return;
          if (Math.random() > 0.45) return;
          try {
            const birdNow = this.ctx.currentTime;
            const birdOsc = this.ctx.createOscillator();
            const birdGain = this.ctx.createGain();
            birdOsc.type = 'sine';
            const baseFreq = 2200 + Math.random() * 800;
            birdOsc.frequency.setValueAtTime(baseFreq, birdNow);
            birdOsc.frequency.exponentialRampToValueAtTime(baseFreq + 600, birdNow + 0.08);
            birdGain.gain.setValueAtTime(0.02, birdNow);
            birdGain.gain.exponentialRampToValueAtTime(0.001, birdNow + 0.15);
            birdOsc.connect(birdGain);
            birdGain.connect(this.ctx.destination);
            birdOsc.start(birdNow);
            birdOsc.stop(birdNow + 0.15);
          } catch {
            // ignore
          }
        }, 3500);
      }
    } catch {
      // Audio autoplay restrictions handled
    }
  }

  public stopAmbient() {
    if (this.oscInterval) {
      clearInterval(this.oscInterval);
      this.oscInterval = null;
    }
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
      } catch {
        // ignore
      }
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }
    this.isAmbientPlaying = false;
    this.currentSoundType = 'off';
  }

  public toggleAmbient(type: 'forest' | 'stream' | 'wind') {
    if (this.isAmbientPlaying && this.currentSoundType === type) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient(type);
      return true;
    }
  }

  public getIsPlaying() {
    return this.isAmbientPlaying;
  }

  public getCurrentType() {
    return this.currentSoundType;
  }

  /**
   * Speaks out outdoor instructions via Web Speech Synthesis (The Trail Guide)
   */
  public speakPrompt(text: string, rate: number = 0.95, pitch: number = 1.0) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 0.9;
      // Prefer natural English voices
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback silently if speech synthesis blocked
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }
}

export const audioSynth = new AudioSynthesizer();
