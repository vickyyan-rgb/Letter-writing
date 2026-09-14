// Web Audio API ambient soundscape generator for Beloved Love Letter Studio
// Generates rain, fireplace, and vinyl warmth procedurally without external audio assets.

type SoundType = 'rain' | 'fireplace' | 'vinyl' | 'off';

class AmbianceManager {
  private ctx: AudioContext | null = null;
  private currentSound: SoundType = 'off';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.35;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentSound(): SoundType {
    return this.currentSound;
  }

  public playSound(type: SoundType) {
    this.stopAll();
    if (type === 'off') {
      this.currentSound = 'off';
      return;
    }

    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      this.currentSound = type;

      if (type === 'rain') {
        this.startRain();
      } else if (type === 'fireplace') {
        this.startFireplace();
      } else if (type === 'vinyl') {
        this.startVinyl();
      }
    } catch (e) {
      console.warn('Audio ambiance could not start:', e);
      this.currentSound = 'off';
    }
  }

  private startRain() {
    if (!this.ctx || !this.masterGain) return;

    // Buffer noise
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter to simulate rain through glass
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, this.ctx.currentTime);

    // Subtle rain gain
    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, rainGain);
  }

  private startFireplace() {
    if (!this.ctx || !this.masterGain) return;

    // Deep warm rumble
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    // Brown noise for hearth rumble
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const brownNoise = this.ctx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    brownNoise.connect(filter);
    filter.connect(rumbleGain);
    rumbleGain.connect(this.masterGain);
    brownNoise.start();

    // Embers crackle interval
    const crackleInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentSound !== 'fireplace') return;
      if (Math.random() > 0.45) {
        const pop = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        pop.type = 'triangle';
        pop.frequency.setValueAtTime(300 + Math.random() * 800, this.ctx.currentTime);

        popGain.gain.setValueAtTime(0.08 + Math.random() * 0.12, this.ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04 + Math.random() * 0.05);

        pop.connect(popGain);
        popGain.connect(this.masterGain);

        pop.start();
        pop.stop(this.ctx.currentTime + 0.1);
      }
    }, 120);

    this.activeNodes.push(brownNoise, filter, rumbleGain, crackleInterval);
  }

  private startVinyl() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1200, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const vinylGain = this.ctx.createGain();
    vinylGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    whiteNoise.connect(bandpass);
    bandpass.connect(vinylGain);
    vinylGain.connect(this.masterGain);
    whiteNoise.start();

    // Occasional record needle clicks
    const tickInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentSound !== 'vinyl') return;
      if (Math.random() > 0.6) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(1800 + Math.random() * 600, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
      }
    }, 800);

    this.activeNodes.push(whiteNoise, bandpass, vinylGain, tickInterval);
  }

  public playWaxSealStampSound() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // Warm low thump of seal hitting wax
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // Ignored
    }
  }

  public stopAll() {
    this.activeNodes.forEach((node) => {
      if (typeof node === 'number') {
        clearInterval(node);
      } else {
        try {
          if ('stop' in node && typeof (node as any).stop === 'function') {
            (node as any).stop();
          }
          node.disconnect();
        } catch (e) {
          // Ignored
        }
      }
    });
    this.activeNodes = [];
    this.currentSound = 'off';
  }
}

export const ambianceAudio = new AmbianceManager();
