export function createSeededRandom(seed: number): () => number {
  return function next(): number {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function intBetween(
  rng: () => number,
  min: number,
  max: number
): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

export function pickMany<T>(
  rng: () => number,
  arr: T[],
  min: number,
  max: number
): T[] {
  const count = min + Math.floor(rng() * (max - min + 1));
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, count);
}
