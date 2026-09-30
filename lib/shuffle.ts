/** Small deterministic PRNG (mulberry32). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle that returns a new array. */
export function shuffle<T>(items: readonly T[], seed: number): T[] {
  const random = seededRandom(seed);
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Play order for a session: the first song in the list stays first (so the
 * opener is always a good one), everything after it is shuffled.
 */
export function sessionOrder(length: number, seed: number): number[] {
  if (length <= 1) return length === 1 ? [0] : [];
  const rest = Array.from({ length: length - 1 }, (_, i) => i + 1);
  return [0, ...shuffle(rest, seed)];
}
