/**
 * "How I work" as a CI pipeline run.
 *  • When the section scrolls into view the stages "run" once in sequence.
 *  • Any stage can be opened manually (tabs with arrow-key support), which
 *    stops the auto-run.
 *  • Reduced motion: all stages complete immediately, nothing auto-advances.
 */
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Check } from 'lucide-react';
import type { ProcessStep } from '@/data/portfolio';

interface Props {
  steps: ProcessStep[];
}

const STEP_MS = 1700;
const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProcessPipeline({ steps }: Props) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  /** Highest stage index that has "passed". -1 → nothing run yet. */
  const [passed, setPassed] = useState(-1);
  const [autoplay, setAutoplay] = useState(true);
  const [started, setStarted] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  // Start the run when the pipeline enters the viewport.
  useEffect(() => {
    if (reduce) {
      setPassed(steps.length - 1);
      setAutoplay(false);
      return;
    }
    const el = root.current;
    if (!el || !('IntersectionObserver' in window)) {
      setPassed(steps.length - 1);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, steps.length]);

  // Advance stage by stage.
  useEffect(() => {
    if (!started || !autoplay) return;
    if (passed >= steps.length - 1) {
      setAutoplay(false);
      return;
    }
    const id = window.setTimeout(() => {
      const next = passed + 1;
      setPassed(next);
      if (next < steps.length - 1) setActive(next + 1);
    }, passed === -1 ? 600 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [started, autoplay, passed, steps.length]);

  const select = (i: number) => {
    setAutoplay(false);
    setPassed(steps.length - 1);
    setActive(i);
  };

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = steps.length - 1;
    const map: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowDown: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in map)) return;
    event.preventDefault();
    select(map[event.key]);
    tabs.current[map[event.key]]?.focus();
  };

  const status = (i: number): 'passed' | 'running' | 'queued' => {
    if (i <= passed) return 'passed';
    if (autoplay && started && i === passed + 1) return 'running';
    return 'queued';
  };

  const step = steps[active];
  const progress = steps.length > 1 ? Math.max(0, passed) / (steps.length - 1) : 1;
  const done = passed >= steps.length - 1;

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={root} className="pipeline overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-night-line)] bg-[var(--color-night-2)]">
        {/* Run header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-night-line)] px-5 py-4 md:px-7">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </span>
            <span className="label text-[var(--color-mist)]">pipeline / how-i-work.yml</span>
          </div>
          <span
            className={`label inline-flex items-center gap-2 rounded-full px-2.5 py-1 ${
              done ? 'bg-[#0b8a5f]/20 text-[#5ee3ac]' : 'bg-white/5 text-[var(--color-mist)]'
            }`}
            aria-live="polite"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-[#5ee3ac]' : 'animate-pulse bg-[#9aa5ff]'}`}
              aria-hidden="true"
            />
            {done ? `${steps.length}/${steps.length} stages passed` : started ? 'Running…' : 'Queued'}
          </span>
        </div>

        {/* Stage rail */}
        <div className="relative px-5 pt-7 md:px-7">
          <div className="absolute top-[3.05rem] right-12 left-12 hidden h-px bg-white/10 md:block" aria-hidden="true">
            <m.div
              className="h-full origin-left bg-[#9aa5ff]"
              initial={false}
              animate={{ scaleX: progress }}
              transition={reduce ? { duration: 0 } : { duration: 0.8, ease: EASE }}
            />
          </div>
          <div
            role="tablist"
            aria-label="Process stages"
            className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 md:gap-0"
          >
            {steps.map((s, i) => {
              const st = status(i);
              const selected = i === active;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`${baseId}-tab-${s.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={onKey}
                  className={`group flex flex-row items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors md:flex-col md:items-center md:gap-3 md:px-1 md:text-center ${
                    selected ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border transition-colors duration-500 ${
                      st === 'passed'
                        ? 'border-[#9aa5ff] bg-[#2b3dff] text-white'
                        : st === 'running'
                          ? 'border-[#9aa5ff] bg-[var(--color-night-2)] text-[#9aa5ff]'
                          : 'border-white/20 bg-[var(--color-night-2)] text-white/40'
                    }`}
                    aria-hidden="true"
                  >
                    {st === 'passed' ? (
                      <Check size={16} strokeWidth={2.5} />
                    ) : (
                      <span className="font-mono text-[0.7rem]">{String(i + 1).padStart(2, '0')}</span>
                    )}
                    {st === 'running' && !reduce && (
                      <m.span
                        className="absolute inset-[-5px] rounded-[13px] border border-[#9aa5ff]"
                        initial={{ opacity: 0.8, scale: 0.9 }}
                        animate={{ opacity: 0, scale: 1.25 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                  </span>
                  <span
                    className={`text-sm font-medium leading-tight ${selected ? 'text-white' : 'text-white/65 group-hover:text-white'}`}
                  >
                    {s.title}
                    <span className="sr-only">
                      {' '}
                      — {st === 'passed' ? 'complete' : st === 'running' ? 'in progress' : 'not started'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage detail */}
        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${step.id}`}
          className="mt-6 border-t border-[var(--color-night-line)] px-5 py-8 md:px-7 md:py-10"
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={step.id}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
              className="grid gap-8 md:grid-cols-12"
            >
              <div className="md:col-span-7">
                <p className="font-mono text-sm text-[#9aa5ff]">
                  <span className="text-white/40">$ </span>
                  {step.command}
                </p>
                <h3 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-none font-semibold text-white">
                  <span className="mr-3 align-top font-mono text-sm text-white/40">
                    {String(active + 1).padStart(2, '0')}
                  </span>
                  {step.title}
                </h3>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-mist)]">{step.description}</p>
              </div>
              <div className="md:col-span-4 md:col-start-9">
                <p className="label mb-4 text-white/50">Artifacts</p>
                <ul className="space-y-2">
                  {step.outputs.map((o, i) => (
                    <m.li
                      key={o}
                      initial={reduce ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={reduce ? { duration: 0 } : { delay: 0.1 + i * 0.07, duration: 0.4, ease: EASE }}
                      className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-[0.8rem] text-white/85"
                    >
                      {o}
                      <span className="text-[#5ee3ac]" aria-hidden="true">
                        ●
                      </span>
                    </m.li>
                  ))}
                </ul>
              </div>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </LazyMotion>
  );
}
