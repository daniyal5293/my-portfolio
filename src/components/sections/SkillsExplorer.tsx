/**
 * Skills constellation.
 *  • Keyboard-accessible tablist of categories (arrow keys, Home/End).
 *  • Desktop: an SVG "constellation" where each category is a cluster of
 *    nodes; hovering a node or picking a tab lights up its cluster.
 *  • Every skill lists the projects it was actually used in — no percentages.
 */
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';

export interface ExplorerSkill {
  name: string;
  note?: string;
  usedIn: { title: string; href: string }[];
}

export interface ExplorerGroup {
  id: string;
  title: string;
  blurb: string;
  skills: ExplorerSkill[];
}

interface Props {
  groups: ExplorerGroup[];
}

const VIEW_W = 960;
const VIEW_H = 600;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Deterministic cluster layout: cluster centres sit on a wide ellipse; each
 * cluster's skills fan out around it. Node labels are anchored away from the
 * centre so they never collide with the cluster's own name pill.
 */
function useLayout(groups: ExplorerGroup[]) {
  return useMemo(() => {
    const cx = VIEW_W / 2;
    const cy = VIEW_H / 2 + 8;
    return groups.map((group, gi) => {
      const a = (gi / groups.length) * Math.PI * 2 - Math.PI / 2;
      const center = { x: cx + Math.cos(a) * 290, y: cy + Math.sin(a) * 195 };
      const n = group.skills.length;
      const radius = 60 + n * 4;
      // Spread nodes on the side of the cluster facing away from the middle of the canvas.
      const outward = Math.atan2(center.y - cy, center.x - cx);
      const spread = Math.min(Math.PI * 1.6, 0.9 * n);
      const nodes = group.skills.map((skill, si) => {
        const na = n === 1 ? outward : outward - spread / 2 + (spread * si) / (n - 1);
        const cos = Math.cos(na);
        const sin = Math.sin(na);
        const x = center.x + cos * radius * 0.85;
        const y = center.y + sin * radius * 0.72;
        const side: 'start' | 'end' | 'middle' = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
        return {
          skill,
          x,
          y,
          labelX: x + (side === 'start' ? 12 : side === 'end' ? -12 : 0),
          labelY: side === 'middle' ? y + (sin > 0 ? 24 : -14) : y + 4.5,
          anchor: side,
        };
      });
      return { group, center, nodes, pillW: group.title.length * 7.6 + 22 };
    });
  }, [groups]);
}

export default function SkillsExplorer({ groups }: Props) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const layout = useLayout(groups);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const current = groups[active];

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = groups.length - 1;
    const keys: Record<string, number> = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowRight: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = keys[event.key];
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const transition = reduce ? { duration: 0 } : { duration: 0.6, ease: EASE };

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Category tabs */}
        <div
          role="tablist"
          aria-label="Skill categories"
          aria-orientation="vertical"
          className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-[var(--color-line)] lg:px-0 lg:pb-0"
        >
          {groups.map((group, i) => {
            const selected = i === active;
            return (
              <button
                key={group.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${group.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onTabKey}
                className={`group relative flex shrink-0 items-center gap-4 rounded-full border px-4 py-2.5 text-left transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-[var(--color-line)] lg:px-0 lg:py-5 ${
                  selected
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white lg:bg-transparent lg:text-[var(--color-ink)]'
                    : 'border-[var(--color-line-strong)] text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
                }`}
              >
                <span className="label hidden w-8 text-[var(--color-ink-3)] lg:block">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-base font-semibold tracking-tight lg:flex-1 lg:text-2xl">
                  {group.title}
                </span>
                <span
                  className={`label hidden lg:inline ${selected ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink-3)]'}`}
                >
                  {group.skills.length} {group.skills.length === 1 ? 'skill' : 'skills'}
                </span>
                {selected && (
                  <m.span
                    layoutId={`${baseId}-bar`}
                    className="absolute bottom-[-1px] left-0 hidden h-[2px] w-full bg-[var(--color-accent)] lg:block"
                    transition={transition}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8">
          {/* Constellation (decorative mirror of the tabs; pointer users can hover nodes) */}
          <div className="constellation relative hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] md:block">
            <span className="label absolute top-4 left-5 text-[var(--color-ink-3)]">Fig. 04 — Skill constellation</span>
            <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="block h-auto w-full" aria-hidden="true">
              <defs>
                <pattern id={`${baseId}-dots`} width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="rgb(12 14 19 / 0.1)" />
                </pattern>
              </defs>
              <rect width={VIEW_W} height={VIEW_H} fill={`url(#${baseId}-dots)`} />

              {/* Inter-cluster links */}
              {layout.map((cluster, i) => {
                const next = layout[(i + 1) % layout.length];
                return (
                  <line
                    key={`link-${cluster.group.id}`}
                    x1={cluster.center.x}
                    y1={cluster.center.y}
                    x2={next.center.x}
                    y2={next.center.y}
                    stroke="rgb(12 14 19 / 0.12)"
                    strokeDasharray="3 6"
                  />
                );
              })}

              {layout.map((cluster, gi) => {
                const on = gi === active;
                return (
                  <g
                    key={cluster.group.id}
                    onMouseEnter={() => setActive(gi)}
                    onClick={() => setActive(gi)}
                    style={{ cursor: 'pointer' }}
                  >
                    {cluster.nodes.map((node) => (
                      <m.line
                        key={`edge-${node.skill.name}`}
                        x1={cluster.center.x}
                        y1={cluster.center.y}
                        x2={node.x}
                        y2={node.y}
                        stroke={on ? '#2b3dff' : 'rgb(12 14 19 / 0.18)'}
                        initial={false}
                        animate={{ opacity: on ? 0.75 : 0.5 }}
                        transition={transition}
                      />
                    ))}
                    {on && !reduce && (
                      <m.rect
                        x={cluster.center.x - cluster.pillW / 2}
                        y={cluster.center.y - 13}
                        width={cluster.pillW}
                        height={26}
                        rx={13}
                        fill="none"
                        stroke="#2b3dff"
                        style={{ transformOrigin: `${cluster.center.x}px ${cluster.center.y}px` }}
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 1.35, opacity: 0 }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    <rect
                      x={cluster.center.x - cluster.pillW / 2}
                      y={cluster.center.y - 13}
                      width={cluster.pillW}
                      height={26}
                      rx={13}
                      fill={on ? '#2b3dff' : '#fbfaf7'}
                      stroke={on ? '#2b3dff' : 'rgb(12 14 19 / 0.25)'}
                      style={{ transition: 'fill .4s, stroke .4s' }}
                    />
                    <text
                      x={cluster.center.x}
                      y={cluster.center.y + 4}
                      textAnchor="middle"
                      fontSize="11"
                      letterSpacing="1.2"
                      fill={on ? '#ffffff' : 'rgb(12 14 19 / 0.7)'}
                      style={{ fontFamily: 'var(--font-mono)', transition: 'fill .4s' }}
                    >
                      {cluster.group.title.toUpperCase()}
                    </text>
                    {cluster.nodes.map((node, ni) => (
                      <g key={node.skill.name}>
                        <m.rect
                          x={node.x - 5}
                          y={node.y - 5}
                          width={10}
                          height={10}
                          rx={3}
                          initial={false}
                          animate={{ scale: on ? 1.25 : 1, opacity: on ? 1 : 0.55 }}
                          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                          fill={on ? (ni === 0 ? '#ff5a1f' : '#2b3dff') : '#fbfaf7'}
                          stroke={on ? 'none' : 'rgb(12 14 19 / 0.45)'}
                          transition={{ ...transition, delay: reduce ? 0 : ni * 0.03 }}
                        />
                        <m.text
                          x={node.labelX}
                          y={node.labelY}
                          textAnchor={node.anchor}
                          fontSize="13"
                          fontWeight={on ? 600 : 450}
                          initial={false}
                          animate={{ opacity: on ? 1 : 0.4 }}
                          transition={transition}
                          fill="#0c0e13"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          {node.skill.name}
                        </m.text>
                      </g>
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active category detail */}
          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${current.id}`}
            className="mt-6"
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={current.id}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE }}
              >
                <p className="text-[var(--color-ink-2)]">{current.blurb}</p>
                <ul className="mt-5 grid gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-line)] sm:grid-cols-2">
                  {current.skills.map((skill) => (
                    <li key={skill.name} className="flex flex-col gap-1.5 bg-[var(--color-surface)] px-5 py-4 sm:[&:last-child:nth-child(odd)]:col-span-2">
                      <span className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
                        <span className="h-2 w-2 rounded-[3px] bg-[var(--color-accent)]" aria-hidden="true" />
                        {skill.name}
                      </span>
                      {(skill.usedIn.length > 0 || skill.note) && (
                        <span className="text-sm leading-snug text-[var(--color-ink-3)]">
                          {skill.usedIn.length > 0 && (
                            <>
                              Used in{' '}
                              {skill.usedIn.map((p, i) => (
                                <span key={p.href}>
                                  {i > 0 && (i === skill.usedIn.length - 1 ? ' & ' : ', ')}
                                  <a href={p.href} className="link-underline text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
                                    {p.title}
                                  </a>
                                </span>
                              ))}
                            </>
                          )}
                          {skill.usedIn.length > 0 && skill.note && ' · '}
                          {skill.note}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
