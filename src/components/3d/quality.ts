/**
 * Rendering budgets for the hero scene. Mobile / low-power devices get fewer
 * objects and a lower pixel-ratio ceiling.
 */
export interface SceneQuality {
  tier: 'high' | 'low';
  pods: number;
  packets: number;
  dust: number;
  dpr: [number, number];
  antialias: boolean;
}

export const QUALITY: Record<SceneQuality['tier'], SceneQuality> = {
  high: { tier: 'high', pods: 8, packets: 140, dust: 220, dpr: [1, 1.75], antialias: true },
  low: { tier: 'low', pods: 6, packets: 48, dust: 80, dpr: [1, 1.25], antialias: true },
};

export function detectQuality(): SceneQuality {
  if (typeof window === 'undefined') return QUALITY.low;
  const small = window.matchMedia('(max-width: 767px)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  // `deviceMemory` is Chromium-only.
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return small || coarse || cores <= 4 || memory <= 4 ? QUALITY.low : QUALITY.high;
}

/** Cheap WebGL capability probe — avoids downloading three.js when unsupported. */
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    const ok = !!gl;
    (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext();
    return ok;
  } catch {
    return false;
  }
}
