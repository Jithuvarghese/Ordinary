/** Synthesises short bus-bell "tings" with the Web Audio API (no audio file needed). */

let ctx: AudioContext | null = null;
let bellUntil = 0;

/** Shared audio context. Only call this from a user gesture so the browser allows it to start. */
export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;

  ctx ??= new AudioCtor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function ting(audio: AudioContext, at: number, level: number) {
  const master = audio.createGain();
  master.gain.setValueAtTime(0.0001, at);
  master.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.35 * level), at + 0.008);
  master.gain.exponentialRampToValueAtTime(0.0001, at + 1.4);
  master.connect(audio.destination);

  // Inharmonic partials give it a small metallic bell character.
  [
    [1320, 1],
    [1320 * 2.76, 0.45],
    [1320 * 5.4, 0.2],
  ].forEach(([freq, partial]) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = partial;
    osc.connect(gain).connect(master);
    osc.start(at);
    osc.stop(at + 1.5);
  });
}

/** Single ting. `level` is 0-1 and scales the loudness. */
export function ringBell(level = 1) {
  const audio = getAudioContext();
  if (!audio) return;
  ting(audio, audio.currentTime, level);
  bellUntil = Math.max(bellUntil, performance.now() + 1400);
}

/** True while a bell ring is still audible. */
export function isBellRinging(): boolean {
  return performance.now() < bellUntil;
}

/** Two quick tings, the classic "go ahead" signal. Resolves after the second ting has started. */
export function ringDoubleBell(level = 1): Promise<void> {
  const audio = getAudioContext();
  if (!audio) return Promise.resolve();
  const gap = 0.26;
  ting(audio, audio.currentTime, level);
  ting(audio, audio.currentTime + gap, level);
  bellUntil = Math.max(bellUntil, performance.now() + (gap + 1.4) * 1000);
  return new Promise((resolve) => window.setTimeout(resolve, (gap + 0.35) * 1000));
}
