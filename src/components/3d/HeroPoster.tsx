/**
 * Static SVG rendition of the orchestration core. Rendered on the server, so
 * it is visible immediately; it stays as the visual when WebGL is unavailable.
 */
interface Props {
  className?: string;
}

const rings = [
  { rx: 215, ry: 74, rotate: -16 },
  { rx: 270, ry: 44, rotate: 22 },
  { rx: 330, ry: 120, rotate: -42 },
];

const pods = [
  { x: 470, y: 205, fill: '#f6f5f1', r: -18 },
  { x: 150, y: 470, fill: '#2b3dff', r: 24 },
  { x: 535, y: 360, fill: '#11141c', r: 12 },
  { x: 230, y: 170, fill: '#f6f5f1', r: 38 },
  { x: 390, y: 470, fill: '#ff5a1f', r: -30 },
  { x: 95, y: 215, fill: '#f6f5f1', r: -8 },
];

export default function HeroPoster({ className }: Props) {
  return (
    <svg
      viewBox="0 0 640 640"
      className={className}
      role="img"
      aria-label="Illustration: a faceted core surrounded by orbiting container blocks"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="hp-kernel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a5163" />
          <stop offset="0.45" stopColor="#11141c" />
          <stop offset="1" stopColor="#2a3040" />
        </linearGradient>
        <linearGradient id="hp-facet" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g transform="translate(320 320)">
        {rings.map((r, i) => (
          <ellipse
            key={i}
            rx={r.rx}
            ry={r.ry}
            transform={`rotate(${r.rotate})`}
            fill="none"
            stroke="#0c0e13"
            strokeOpacity="0.16"
            strokeDasharray={i === 1 ? '4 6' : undefined}
          />
        ))}
        {pods.map((p, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2={p.x - 320}
            y2={p.y - 320}
            stroke="#2b3dff"
            strokeOpacity="0.22"
          />
        ))}
        <circle r="142" fill="none" stroke="#2b3dff" strokeOpacity="0.8" strokeWidth="1.2" />
        <path d="M 120 -78 A 142 142 0 0 1 142 6" fill="none" stroke="#ff5a1f" strokeWidth="3" strokeLinecap="round" />
        {/* Wireframe shell */}
        <polygon
          points="0,-118 102,-59 102,59 0,118 -102,59 -102,-59"
          fill="none"
          stroke="#2b3dff"
          strokeOpacity="0.55"
        />
        <path d="M0,-118 L0,118 M-102,-59 L102,59 M102,-59 L-102,59" stroke="#2b3dff" strokeOpacity="0.25" />
        {/* Faceted kernel */}
        <polygon points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40" fill="url(#hp-kernel)" />
        <polygon points="0,-80 69,-40 0,0 -69,-40" fill="url(#hp-facet)" opacity="0.6" />
        <polygon points="0,0 69,40 0,80" fill="#000" opacity="0.25" />
      </g>

      {pods.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
          <rect
            x="-26"
            y="-17"
            width="52"
            height="34"
            rx="8"
            fill={p.fill}
            stroke="#0c0e13"
            strokeOpacity={p.fill === '#f6f5f1' ? 0.18 : 0}
          />
        </g>
      ))}

      {Array.from({ length: 22 }, (_, i) => {
        const a = i * 2.39996;
        const r = 170 + ((i * 47) % 140);
        return (
          <circle
            key={i}
            cx={320 + Math.cos(a) * r}
            cy={320 + Math.sin(a) * r * 0.8}
            r={i % 3 === 0 ? 3 : 2}
            fill="#2b3dff"
            opacity={0.35 + (i % 4) * 0.12}
          />
        );
      })}
    </svg>
  );
}
