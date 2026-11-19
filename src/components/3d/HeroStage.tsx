/**
 * Hero 3D island.
 *
 * Loading strategy
 *  1. Server-rendered SVG poster shows instantly (no layout shift, good LCP).
 *  2. On the first interaction (or after 5 s), and only if WebGL works, the scene
 *     is fetched with a dynamic import during idle time and cross-fades in.
 *  3. Rendering pauses when the hero is off-screen; with reduced motion the
 *     scene renders still frames only.
 */
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import HeroPoster from './HeroPoster';
import { detectQuality, QUALITY, supportsWebGL, type SceneQuality } from './quality';

const OrchestrationScene = lazy(() => import('./OrchestrationScene'));

type DeployPhase = 'idle' | 'scheduling' | 'running';

const STATUS: Record<DeployPhase, string> = {
  idle: 'Click the core to deploy',
  scheduling: 'Scheduling pods…',
  running: 'All pods running',
};

interface Props {
  /** id of the element that receives pointer events for the scene. */
  eventSourceId?: string;
}

export default function HeroStage({ eventSourceId }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [quality, setQuality] = useState<SceneQuality>(QUALITY.low);
  const [eventSource, setEventSource] = useState<HTMLElement | undefined>();
  const [phase, setPhase] = useState<DeployPhase>('idle');
  const container = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  /* Decide whether (and how) to load the 3D scene */
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const onMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', onMotion);

    setQuality(detectQuality());
    if (eventSourceId) setEventSource(document.getElementById(eventSourceId) ?? undefined);

    /*
     * The three.js bundle is large, so it never competes with first paint:
     * it loads on the visitor's first interaction (pointer, touch, scroll or
     * key) or after a short delay, whichever comes first, and then waits for
     * an idle moment. Data-saver users keep the static poster.
     */
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const triggers = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'scroll', 'keydown'] as const;
    let timer = 0;
    let idle = 0;
    let fired = false;

    const removeTriggers = () => {
      triggers.forEach((t) => window.removeEventListener(t, start));
      window.clearTimeout(timer);
    };
    function start() {
      if (fired) return;
      fired = true;
      removeTriggers();
      const go = () => setEnabled(true);
      if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(go, { timeout: 1200 });
      else idle = window.setTimeout(go, 200); // Safari < 18 has no requestIdleCallback.
    }

    if (!saveData && supportsWebGL()) {
      triggers.forEach((t) => window.addEventListener(t, start, { passive: true, once: true }));
      timer = window.setTimeout(start, 5000);
    }

    return () => {
      motionQuery.removeEventListener('change', onMotion);
      removeTriggers();
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
  }, [eventSourceId]);

  /* Pause rendering when the hero leaves the viewport */
  useEffect(() => {
    const el = container.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const deploy = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    setPhase('scheduling');
    timers.current = [
      window.setTimeout(() => setPhase('running'), 1400),
      window.setTimeout(() => setPhase('idle'), 4200),
    ];
  }, []);

  const showScene = enabled && !failed;
  const interactive = showScene && ready;

  return (
    <div ref={container} className="hero-stage-inner relative h-full w-full">
      {/* Soft glow behind the composition */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(43 61 255 / 0.16), rgb(43 61 255 / 0) 65%)' }}
      />

      <HeroPoster
        className={`absolute inset-0 m-auto h-full max-h-[min(78vh,760px)] w-full transition-opacity duration-1000 ${
          interactive ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {showScene && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${interactive ? 'opacity-100' : 'opacity-0'}`}
        >
          <Suspense fallback={null}>
            <OrchestrationScene
              quality={quality}
              reducedMotion={reducedMotion}
              active={active}
              deploying={phase !== 'idle'}
              eventSource={eventSource}
              onDeploy={deploy}
              onReady={() => setReady(true)}
              onContextLost={() => setFailed(true)}
            />
          </Suspense>
        </div>
      )}

      {/* Accessible control mirroring the click-the-core interaction */}
      {interactive && (
        <div className="absolute top-2 right-[var(--gutter)] z-10 flex items-center gap-3 md:top-auto md:right-4 md:bottom-28">
          <p className="label hidden text-[var(--color-ink-3)] sm:block" aria-live="polite">
            {STATUS[phase]}
          </p>
          <button
            type="button"
            onClick={deploy}
            disabled={phase === 'scheduling'}
            className="deploy-btn label inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-surface)]/80 px-3.5 py-2 text-[var(--color-ink)] backdrop-blur transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-60"
          >
            {phase === 'idle' ? <Play size={12} aria-hidden="true" /> : <RotateCcw size={12} aria-hidden="true" />}
            <span>{phase === 'idle' ? 'Deploy' : phase === 'scheduling' ? 'Deploying' : 'Redeploy'}</span>
            <span className="sr-only"> — animate the service pods into formation</span>
          </button>
        </div>
      )}
    </div>
  );
}
