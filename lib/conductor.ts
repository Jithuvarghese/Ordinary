import { getAudioContext, isBellRinging, ringDoubleBell } from "@/lib/bell";

const buffers = new Map<string, Promise<AudioBuffer | null>>();
let busy = false;
let lastClip = -1;

function load(audio: AudioContext, url: string): Promise<AudioBuffer | null> {
  let cached = buffers.get(url);
  if (!cached) {
    cached = fetch(url)
      .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(new Error(String(res.status)))))
      .then((data) => audio.decodeAudioData(data))
      .catch(() => null);
    buffers.set(url, cached);
  }
  return cached;
}

/** Picks a random index that differs from the previous one whenever there is a choice. */
function pickClip(count: number): number {
  let next = Math.floor(Math.random() * count);
  if (count > 1 && next === lastClip) next = (next + 1 + Math.floor(Math.random() * (count - 1))) % count;
  lastClip = next;
  return next;
}

/**
 * Plays the double bell (unless a bell is already ringing) followed by a random conductor clip.
 * Resolves when everything has finished, or straight away if a call is already in progress.
 * Must be invoked from a user gesture. `volume` is 0-100.
 */
export async function callConductor(clips: string[], volume: number): Promise<boolean> {
  if (busy) return false;
  busy = true;

  try {
    const audio = getAudioContext();
    if (!audio) return true;
    const level = volume / 100;

    const bell = isBellRinging() ? Promise.resolve() : ringDoubleBell(level);
    const url = clips.length ? clips[pickClip(clips.length)] : null;
    const [buffer] = await Promise.all([url ? load(audio, url) : null, bell]);
    if (!buffer || level === 0) return true;

    await new Promise<void>((resolve) => {
      const source = audio.createBufferSource();
      const gain = audio.createGain();
      gain.gain.value = level;
      source.buffer = buffer;
      source.connect(gain).connect(audio.destination);
      source.onended = () => resolve();
      source.start();
    });
    return true;
  } finally {
    busy = false;
  }
}
