/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — the single source of truth for the website.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Edit this file to update almost everything on the site.
 *
 *  Conventions
 *  • `null` or an empty array means "not provided yet". The UI hides any field,
 *    card or whole section that has no content, so nothing fake is ever shown.
 *  • Fields marked  `// PLACEHOLDER`  are waiting for real information from you.
 *  • Copy marked    `// DRAFT COPY`   was written from your CV. It contains no
 *    invented facts, but rewrite it in your own voice.
 *
 *  Everything factual here comes from the CV in /public/cv.
 */

/* ───────────────────────────── Types ───────────────────────────── */

export type SocialId = 'email' | 'github' | 'linkedin' | 'phone';

export interface SocialLink {
  id: SocialId;
  label: string;
  href: string;
  handle: string;
}

export interface Skill {
  name: string;
  /** Short context shown in the skills explorer. */
  note?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  blurb: string;
  skills: Skill[];
}

export interface Experience {
  organization: string;
  role: string;
  type: string;
  /** e.g. "Jun 2024 – Aug 2024". `null` hides the date. */
  period: string | null; // PLACEHOLDER
  location: string | null; // PLACEHOLDER
  summary: string | null; // PLACEHOLDER
  responsibilities: string[]; // PLACEHOLDER
  contributions: string[];
  technologies: string[]; // PLACEHOLDER
  /** Short badge (e.g. an award) displayed on the timeline card. */
  badge?: string;
}

export interface Education {
  institution: string;
  shortName?: string;
  degree: string;
  period: string;
  location: string;
  status?: string;
  achievements: string[];
  coursework: string[]; // PLACEHOLDER
}

export interface Achievement {
  title: string;
  issuer: string;
  kind: 'award' | 'certification' | 'training' | 'academic';
  status: 'completed' | 'in-progress';
  date: string | null; // PLACEHOLDER
  detail?: string;
  credentialUrl: string | null; // PLACEHOLDER
}

export type PreviewVariant = 'booking' | 'containers' | 'server' | 'inbox';

export interface ArchitectureLayer {
  label: string;
  items: string[];
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  /** One-line hook shown on cards. */
  tagline: string;
  /** Short description shown on cards and as the case-study overview. */
  summary: string;
  stack: string[];
  year: string | null; // PLACEHOLDER
  /** Visual style of the illustrated (non-screenshot) preview. */
  preview: PreviewVariant;
  /** Real screenshot in /public. When set, it is shown instead of the illustration. */
  screenshot: { src: string; alt: string } | null; // PLACEHOLDER
  links: {
    github: string | null; // PLACEHOLDER — repo URL
    live: string | null; // PLACEHOLDER — live demo URL
    post: string | null; // PLACEHOLDER — LinkedIn post URL
  };
  featured?: boolean;
  /** Case-study page content. Any `null` / empty section is hidden. */
  caseStudy: {
    problem: string | null; // PLACEHOLDER
    role: string | null; // PLACEHOLDER
    /** Stack grouped by layer, drawn as an architecture diagram. */
    architecture: {
      caption: string;
      layers: ArchitectureLayer[];
      /** Optional wrapper drawn around the layers (e.g. "Docker Compose"). */
      envelope?: string;
    };
    challenges: string[]; // PLACEHOLDER
    approach: string | null; // PLACEHOLDER
    features: string[];
    outcomes: string | null; // PLACEHOLDER
    lessons: string[]; // PLACEHOLDER
  };
}

export interface ProcessStep {
  id: string;
  title: string;
  command: string;
  description: string;
  outputs: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  organization: string;
  /** Link to the original recommendation (e.g. LinkedIn). */
  source: string | null;
}

/* ───────────────────────────── Site ───────────────────────────── */

export const site = {
  title: 'Daniyal Ahmed Khan — Software & Cloud Engineer',
  description:
    'Portfolio of Daniyal Ahmed Khan, a Software & Cloud Engineer from Karachi building full-stack applications and the containerized cloud infrastructure they run on.',
  locale: 'en',
  ogImage: '/og.png',
  themeColor: '#F2F0EB',
};

/* ──────────────────────────── Person ──────────────────────────── */

export const person = {
  name: 'Daniyal Ahmed Khan',
  firstName: 'Daniyal',
  lastName: 'Ahmed Khan',
  initials: 'DK',
  role: 'Software & Cloud Engineer',
  location: 'Karachi, Pakistan',
  /** Shown as a technical label in the hero. */
  coordinates: '24.86° N, 67.00° E',
  // DRAFT COPY — wrap words in *asterisks* to render them in the serif accent style.
  headline: 'I build full-stack products and the *containerized cloud* they run on.',
  // DRAFT COPY — based on the objective in your CV.
  intro:
    'Software Engineering student at FAST-NUCES working across Next.js, TypeScript, Docker and AWS — focused on scalable, containerized systems that are ready for production, not just the demo.',
  availability: {
    // Set `enabled: false` to hide the status pill.
    enabled: true,
    label: 'Open to opportunities',
  },
  email: 'daniyalkhan5293@gmail.com',
  phone: '+92 312 6447639',
  /** Your phone is on your CV but hidden on the public site by default. */
  showPhone: false,
};

export const cv = {
  /** Path inside /public. Replace the file to update your CV. */
  href: '/cv/Daniyal-Ahmed-Khan-CV.pdf',
  downloadName: 'Daniyal-Ahmed-Khan-CV.pdf',
};

export const socials: SocialLink[] = [
  {
    id: 'email',
    label: 'Email',
    href: `mailto:${person.email}`,
    handle: person.email,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/daniyal5293',
    handle: 'in/daniyal5293',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/daniyal5293',
    handle: '@daniyal5293',
  },
  ...(person.showPhone
    ? [
        {
          id: 'phone' as const,
          label: 'Phone',
          href: `tel:${person.phone.replace(/\s+/g, '')}`,
          handle: person.phone,
        },
      ]
    : []),
];

/* ───────────────────────────── About ───────────────────────────── */

// DRAFT COPY — every statement below comes from your CV. Rewrite freely.
export const about = {
  pullQuote: 'Code that works on my machine is a draft. Code that runs in a container, on real infrastructure, is a product.',
  paragraphs: [
    'My path started with pre-engineering at TCF College and led to a BS in Software Engineering at FAST-NUCES in Karachi, where I’m in the class of 2027.',
    'Alongside my degree I’ve interned as a Software Engineer at Folio3 — finishing as the 1st position holder — and as a Cloud Computing intern at Multinet. Those two roles shaped how I work: build the product, then own how it ships.',
    'I enjoy building full-stack applications with MERN, Next.js and Spring Boot, and I care just as much about what sits underneath them — Docker images, Compose files, Kubernetes manifests and AWS infrastructure.',
  ],
  principles: [
    {
      title: 'Containerize early',
      text: 'If it runs in a container from day one, it runs the same in development, CI and production.',
    },
    {
      title: 'Infrastructure is part of the feature',
      text: 'Security groups, servers and deployment are designed with the app — not bolted on at the end.',
    },
    {
      title: 'Ship, then sharpen',
      text: 'Small, reviewable increments tracked in JIRA or ClickUp beat big-bang releases.',
    },
  ],
  direction:
    'Next: completing the AWS Solutions Architect – Associate (SAA-C03) certification and growing into a cloud engineering role.',
};

/* ───────────────────────────── Skills ───────────────────────────── */

/**
 * Skills are grouped by category. Empty groups are hidden automatically.
 * No proficiency percentages: the explorer shows where each skill was used
 * (matched against project `stack` entries).
 */
export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    title: 'Languages',
    blurb: 'The languages behind the projects below.',
    skills: [{ name: 'TypeScript' }, { name: 'JavaScript' }, { name: 'Python' }],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    blurb: 'Interfaces built as component-driven React apps.',
    skills: [{ name: 'React' }, { name: 'Next.js' }],
  },
  {
    id: 'backend',
    title: 'Backend',
    blurb: 'APIs and services, from Node to Spring.',
    skills: [{ name: 'Node.js' }, { name: 'Express.js' }, { name: 'Spring Boot' }, { name: 'REST APIs' }],
  },
  {
    id: 'databases',
    title: 'Databases',
    blurb: 'Relational and document stores.',
    skills: [{ name: 'MongoDB' }, { name: 'MySQL' }],
  },
  {
    id: 'cloud',
    title: 'Cloud',
    blurb: 'AWS infrastructure and Linux servers.',
    skills: [
      { name: 'AWS', note: 'Solutions Architect – Associate in progress' },
      { name: 'AWS EC2' },
      { name: 'Security Groups' },
      { name: 'Ubuntu Server' },
      { name: 'Linux' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps',
    blurb: 'Packaging and orchestrating services.',
    skills: [
      { name: 'Docker', note: 'KodeKloud training' },
      { name: 'Docker Compose' },
      { name: 'Kubernetes' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & practice',
    blurb: 'How the work gets planned, versioned and verified.',
    skills: [{ name: 'Git' }, { name: 'GitHub' }, { name: 'JIRA' }, { name: 'ClickUp' }, { name: 'E2E tests' }],
  },
  {
    // Add AI / ML skills here when you have project evidence — hidden while empty.
    id: 'ai',
    title: 'AI & ML',
    blurb: 'Machine learning and AI tooling.',
    skills: [],
  },
];

/* ─────────────────────────── Experience ─────────────────────────── */

export const experience: Experience[] = [
  {
    organization: 'Folio3',
    role: 'Software Engineer Intern',
    type: 'Internship',
    period: null, // PLACEHOLDER — e.g. "Jun 2025 – Aug 2025"
    location: null, // PLACEHOLDER
    summary: null, // PLACEHOLDER — one sentence on what the team built
    responsibilities: [], // PLACEHOLDER — 2–4 bullet points
    contributions: ['Finished the internship programme as the 1st position holder.'],
    technologies: [], // PLACEHOLDER
    badge: '1st position',
  },
  {
    organization: 'Multinet Pvt. Ltd',
    role: 'Cloud Computing Intern',
    type: 'Internship',
    period: null, // PLACEHOLDER
    location: null, // PLACEHOLDER
    summary: null, // PLACEHOLDER
    responsibilities: [], // PLACEHOLDER
    contributions: [],
    technologies: [], // PLACEHOLDER
  },
];

/* ─────────────────────────── Education ─────────────────────────── */

export const education: Education[] = [
  {
    institution: 'National University of Computer and Emerging Sciences',
    shortName: 'FAST-NUCES',
    degree: 'BS Software Engineering',
    period: 'Aug 2023 – Jun 2027',
    location: 'Karachi, Pakistan',
    status: 'In progress',
    achievements: ['CGPA 3.11 / 4.0'],
    coursework: [], // PLACEHOLDER — e.g. "Software Design & Architecture"
  },
  {
    institution: 'TCF College',
    degree: 'Intermediate (Pre-Engineering)',
    period: 'Apr 2021 – Jun 2023',
    location: 'Karachi, Pakistan',
    status: 'Completed',
    achievements: ['Grade A+'],
    coursework: [],
  },
];

/* ──────────────────── Achievements & certifications ──────────────────── */

export const achievements: Achievement[] = [
  {
    title: '1st Position Holder',
    issuer: 'Folio3 — Software Engineer Internship',
    kind: 'award',
    status: 'completed',
    date: null, // PLACEHOLDER
    detail: 'Top-ranked intern in the software engineering internship programme.',
    credentialUrl: null, // PLACEHOLDER — certificate link, if any
  },
  {
    title: 'AWS Solutions Architect – Associate (SAA-C03)',
    issuer: 'Amazon Web Services',
    kind: 'certification',
    status: 'in-progress',
    date: null,
    detail: 'Currently preparing for the associate-level architecture exam.',
    credentialUrl: null, // PLACEHOLDER — Credly link once earned
  },
  {
    title: 'Docker Training',
    issuer: 'KodeKloud',
    kind: 'training',
    status: 'completed',
    date: null, // PLACEHOLDER
    credentialUrl: null, // PLACEHOLDER
  },
  {
    title: 'Cloud Computing Internship',
    issuer: 'Multinet Pvt. Ltd',
    kind: 'training',
    status: 'completed',
    date: null,
    credentialUrl: null,
  },
  {
    title: 'Grade A+',
    issuer: 'TCF College — Intermediate (Pre-Engineering)',
    kind: 'academic',
    status: 'completed',
    date: 'Jun 2023',
    credentialUrl: null,
  },
];

/* ───────────────────────────── Projects ───────────────────────────── */

export const projects: Project[] = [
  {
    slug: 'prolign',
    title: 'Prolign',
    category: 'Full-stack platform',
    tagline: 'Paid mentorship sessions, booked online.',
    summary:
      'A mentor–mentee platform where mentees book paid video sessions with mentors. The product is scoped to users in Pakistan.',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'JIRA', 'E2E tests'],
    year: null, // PLACEHOLDER
    preview: 'booking',
    screenshot: null, // PLACEHOLDER — e.g. { src: '/projects/prolign.webp', alt: '…' }
    links: { github: null, live: null, post: null }, // PLACEHOLDER
    featured: true,
    caseStudy: {
      problem: null, // PLACEHOLDER — what problem did Prolign solve, and for whom?
      role: null, // PLACEHOLDER — your role and team size
      architecture: {
        caption: 'Stack by layer, as listed for the project.',
        layers: [
          { label: 'Interface', items: ['React'] },
          { label: 'API', items: ['Node.js', 'Express.js'] },
          { label: 'Services', items: ['Python'] },
          { label: 'Data', items: ['MongoDB'] },
          { label: 'Platform', items: ['Docker', 'AWS'] },
          { label: 'Delivery', items: ['JIRA', 'E2E tests'] },
        ],
      },
      challenges: [], // PLACEHOLDER
      approach: null, // PLACEHOLDER
      features: [
        'Mentees book one-to-one video sessions with mentors.',
        'Sessions are paid — mentees pay the mentor as part of booking.',
        'Scoped to the Pakistani market.',
        'Containerized with Docker and run on AWS.',
        'Work planned in JIRA and verified with end-to-end tests.',
      ],
      outcomes: null, // PLACEHOLDER
      lessons: [], // PLACEHOLDER
    },
  },
  {
    slug: 'containerized-mern',
    title: 'Containerized MERN App',
    category: 'Containers & DevOps',
    tagline: 'A full MERN stack, orchestrated as containers.',
    summary:
      'A full-stack MERN application packaged as a multi-container deployment and orchestrated with Docker Compose.',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Docker', 'Docker Compose'],
    year: null, // PLACEHOLDER
    preview: 'containers',
    screenshot: null,
    links: { github: null, live: null, post: null }, // PLACEHOLDER
    caseStudy: {
      problem: null, // PLACEHOLDER
      role: null, // PLACEHOLDER
      architecture: {
        caption: 'Multi-container deployment defined with Docker Compose.',
        envelope: 'Docker Compose',
        layers: [
          { label: 'Client', items: ['React'] },
          { label: 'API', items: ['Node.js', 'Express.js'] },
          { label: 'Database', items: ['MongoDB'] },
        ],
      },
      challenges: [], // PLACEHOLDER
      approach: null, // PLACEHOLDER
      features: [
        'Full-stack MERN application: MongoDB, Express.js, React and Node.js.',
        'Multi-container deployment orchestrated with Docker Compose.',
        'The whole stack is described in one Compose configuration.',
      ],
      outcomes: null, // PLACEHOLDER
      lessons: [], // PLACEHOLDER
    },
  },
  {
    slug: 'portfolio-on-ec2',
    title: 'Portfolio on AWS EC2',
    category: 'Cloud deployment',
    tagline: 'A 3D portfolio, self-hosted on EC2.',
    summary:
      'A 3D interactive portfolio deployed on an AWS EC2 instance running Ubuntu Server, with custom security group configuration.',
    stack: ['AWS EC2', 'Ubuntu Server', 'Security Groups', 'Linux'],
    year: null, // PLACEHOLDER
    preview: 'server',
    screenshot: null,
    links: { github: null, live: null, post: null }, // PLACEHOLDER
    caseStudy: {
      problem: null, // PLACEHOLDER
      role: null, // PLACEHOLDER
      architecture: {
        caption: 'Hosting stack, from the network edge to the app.',
        envelope: 'AWS',
        layers: [
          { label: 'Network', items: ['Security Groups'] },
          { label: 'Compute', items: ['AWS EC2'] },
          { label: 'OS', items: ['Ubuntu Server'] },
          { label: 'App', items: ['3D portfolio'] },
        ],
      },
      challenges: [], // PLACEHOLDER
      approach: null, // PLACEHOLDER
      features: [
        'Interactive 3D portfolio served from an AWS EC2 instance.',
        'Ubuntu Server set up and configured on the instance.',
        'Custom security group rules controlling access to the server.',
      ],
      outcomes: null, // PLACEHOLDER
      lessons: [], // PLACEHOLDER
    },
  },
  {
    slug: 'email-assistant',
    title: 'Email Assistant',
    category: 'Full-stack app',
    tagline: 'Email management on a Spring Boot API.',
    summary:
      'A full-stack email management app with Spring Boot REST APIs, a React.js frontend and MySQL for persistence.',
    stack: ['Spring Boot', 'React', 'MySQL', 'REST APIs'],
    year: null, // PLACEHOLDER
    preview: 'inbox',
    screenshot: null,
    links: { github: null, live: null, post: null }, // PLACEHOLDER
    caseStudy: {
      problem: null, // PLACEHOLDER
      role: null, // PLACEHOLDER
      architecture: {
        caption: 'Three-tier stack, as listed for the project.',
        layers: [
          { label: 'Client', items: ['React'] },
          { label: 'API', items: ['Spring Boot', 'REST APIs'] },
          { label: 'Database', items: ['MySQL'] },
        ],
      },
      challenges: [], // PLACEHOLDER
      approach: null, // PLACEHOLDER
      features: [
        'Email management from a single web interface.',
        'Backend exposed as Spring Boot REST APIs.',
        'React.js frontend consuming the API.',
        'MySQL database for persistence.',
      ],
      outcomes: null, // PLACEHOLDER
      lessons: [], // PLACEHOLDER
    },
  },
];

/* ───────────────────────────── Process ───────────────────────────── */

// DRAFT COPY — describes a way of working, not past results. Edit to taste.
export const processSteps: ProcessStep[] = [
  {
    id: 'understand',
    title: 'Understand',
    command: 'discover --problem',
    description:
      'Pin down who it’s for, what “done” looks like and the real constraints — time, budget and scale — before writing code.',
    outputs: ['Problem statement', 'Success criteria', 'Constraints'],
  },
  {
    id: 'plan',
    title: 'Research & plan',
    command: 'plan --track jira',
    description:
      'Compare options, break the work into small tracked tasks and decide what not to build yet.',
    outputs: ['Task breakdown', 'Tech choices', 'Milestones'],
  },
  {
    id: 'architect',
    title: 'Architect',
    command: 'design --api --data',
    description:
      'Shape the data model, the API boundaries and where each service will run — so the infrastructure is designed alongside the app.',
    outputs: ['Data model', 'API contract', 'Deployment plan'],
  },
  {
    id: 'build',
    title: 'Build & iterate',
    command: 'git commit -m "small steps"',
    description:
      'Ship in small, reviewable increments with Git. Get something working end-to-end early, then iterate.',
    outputs: ['Working increments', 'Reviewed changes'],
  },
  {
    id: 'test',
    title: 'Test & containerize',
    command: 'docker compose up --build',
    description:
      'Validate behaviour with tests, then package each service in a container so it runs the same everywhere.',
    outputs: ['E2E checks', 'Docker images', 'Compose config'],
  },
  {
    id: 'deploy',
    title: 'Deploy & improve',
    command: 'deploy --target cloud',
    description:
      'Release to cloud infrastructure with sensible network rules, watch how it behaves for real, and feed that back into the next iteration.',
    outputs: ['Live release', 'Security rules', 'Next iteration'],
  },
];

/* ─────────────────────────── Testimonials ─────────────────────────── */

/**
 * Only add genuine recommendations (e.g. copied from LinkedIn, with permission).
 * The section stays hidden while this array is empty.
 */
export const testimonials: Testimonial[] = [];

/* ───────────────────────────── Navigation ───────────────────────────── */

export const navItems = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
] as const;
