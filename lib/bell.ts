/** Synthesises a short bus-bell "ting" with the Web Audio API (no audio file needed). */

let ctx: AudioContext | null = null;

export function ringBell() {
  if (typeof window === "undefined") return;
  const AudioCtor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return;

  ctx ??= new AudioCtor();
  if (ctx.state === "suspended") void ctx.resume();

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.35, now + 0.008);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
  master.connect(ctx.destination);

  // Inharmonic partials give it a small metallic bell character.
  [
    [1320, 1],
    [1320 * 2.76, 0.45],
    [1320 * 5.4, 0.2],
  ].forEach(([freq, level]) => {
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = level;
    osc.connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + 1.5);
  });
}
