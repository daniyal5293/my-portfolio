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
  /** Full https:// link to verify the credential. */
  credentialUrl: string | null; // PLACEHOLDER
  /** Certificate / credential ID shown as text (use when you have no link). */
  credentialId?: string;
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
  title: 'Daniyal Ahmed Khan — DevOps Engineer',
  description:
    'Portfolio of Daniyal Ahmed Khan, a DevOps Engineer from Karachi working with Docker, Kubernetes, Terraform and AWS to take software from code to production.',
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
  role: 'DevOps Engineer',
  location: 'Karachi, Pakistan',
  /** Shown as a technical label in the hero. */
  coordinates: '24.86° N, 67.00° E',
  /** Shown as a technical label in the hero footer. */
  stackLine: 'Docker / Kubernetes / Terraform / AWS',
  // DRAFT COPY — wrap words in *asterisks* to render them in the serif accent style.
  headline: 'I engineer the path from *code to production* — infrastructure, orchestration and cloud.',
  // DRAFT COPY — based on the objective in your CV.
  intro:
    'DevOps engineer and Software Engineering student at FAST-NUCES. I work with Docker, Kubernetes, Terraform and AWS to make systems reproducible, scalable and ready for production — not just the demo.',
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
  pullQuote: 'Shipping isn’t the last step of the work. It is the work — reproducible, versioned and automated.',
  paragraphs: [
    'My path started with pre-engineering at TCF College and led to a BS in Software Engineering at FAST-NUCES in Karachi, where I’m in the class of 2027.',
    'Alongside my degree I’ve interned as a Software Engineer at Folio3 — finishing as the 1st position holder — and as a Cloud Computing intern at Multinet. Those two roles shaped how I work: build the product, then own how it ships.',
    'Today I focus on DevOps: Docker and Kubernetes for running services, Terraform for infrastructure as code, and AWS for the cloud underneath. I still build full-stack apps with MERN and Next.js — which makes me better at deploying them.',
  ],
  principles: [
    {
      title: 'Everything as code',
      text: 'Infrastructure, environments and deployments live in versioned files — reviewable, repeatable and easy to rebuild.',
    },
    {
      title: 'Automate the repeatable',
      text: 'If a step has to be done twice, it belongs in a script or a config file — not in someone’s memory.',
    },
    {
      title: 'Ship, then sharpen',
      text: 'Small, reviewable increments tracked in JIRA or ClickUp beat big-bang releases.',
    },
  ],
  direction:
    'Next: completing the AWS Solutions Architect – Associate (SAA-C03) certification and growing as a DevOps engineer.',
};

/* ───────────────────────────── Skills ───────────────────────────── */

/**
 * Skills are grouped by category. Empty groups are hidden automatically.
 * No proficiency percentages: the explorer shows where each skill was used
 * (matched against project `stack` entries).
 */
export const skillGroups: SkillGroup[] = [
  {
    id: 'devops',
    title: 'DevOps',
    blurb: 'Orchestration and infrastructure as code — the core of what I do.',
    skills: [
      { name: 'Docker', note: 'KodeKloud training' },
      { name: 'Docker Compose' },
      { name: 'Kubernetes' },
      { name: 'Terraform' },
    ],
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
    skills: [{ name: 'Node.js' }, { name: 'Express.js' }, { name: 'REST APIs' }],
  },
  {
    id: 'databases',
    title: 'Databases',
    blurb: 'Relational and document stores.',
    skills: [{ name: 'MongoDB' }, { name: 'MySQL' }],
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
    period: 'Jun 2026 – Aug 2026',
    location: 'Karachi, Pakistan',
    summary: 'Built a SaaS application where mentees book 1:1 sessions with mentors.',
    responsibilities: ['Developed and maintained the application using modern web technologies.'],
    contributions: ['Finished the internship programme as the 1st position holder.'],
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Docker', 'AWS'],
    badge: '1st position',
  },
  {
    organization: 'Multinet Pvt. Ltd',
    role: 'Cloud Computing Intern',
    type: 'Internship',
    period: 'Jun 2025 – Aug 2025',
    location: 'Karachi, Pakistan',
    summary: 'Gained hands-on experience with cloud computing technologies and practices.',
    responsibilities: ['Assisted in deploying and managing cloud infrastructure.'],
    contributions: [],
    technologies: ['AWS', 'Docker', 'Terraform'],
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
    achievements: ['CGPA 3.15 / 4.0'],
    coursework: ['Data Structures and Algorithms', 'Database Systems', 'OOP', 'Applied DevOps'], 
  },
  {
    institution: 'TCF College',
    degree: 'Intermediate (Pre-Engineering)',
    period: 'Apr 2021 – Jun 2023',
    location: 'Karachi, Pakistan',
    status: 'Completed',
    achievements: ['Grade A+'],
    coursework: ['Mathematics', 'Physics', 'Chemistry'],
  },
];

/* ──────────────────── Achievements & certifications ──────────────────── */

export const achievements: Achievement[] = [
  {
    title: '1st Position Holder',
    issuer: 'Folio3 — Software Engineer Internship',
    kind: 'award',
    status: 'completed',
    date: 'Aug 2026',
    detail: 'Top-ranked intern in the software engineering internship programme.',
    credentialUrl: null,
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
    date: 'May 2026',
    // An ID is not a link — paste the full https:// verification URL here to make it clickable.
    credentialUrl: null,
    credentialId: 'e881ce90-043b-4d25-9c00-0b11f49e1754',
  },
  {
    title: 'Cloud Computing Internship',
    issuer: 'Multinet Pvt. Ltd',
    kind: 'training',
    status: 'completed',
    date: 'Aug 2025',
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
    slug: 'guidify', // URL: /projects/guidify/ — keep slugs lowercase
    title: 'Guidify — Mentor–Mentee Platform',
    category: 'Full-stack platform',
    tagline: 'Paid mentorship sessions, booked online.',
    summary:
      'A mentor–mentee platform where mentees book paid video sessions with mentors. The product is scoped to users in Pakistan.',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'JIRA', 'E2E tests'],
    year: '2026',
    preview: 'booking',
    // Screenshots live in /public — the path starts with "/" and omits "public".
    screenshot: {
      src: '/projects/guidify.webp',
      alt: 'Guidify landing page: the headline “Find the mentor who’s already been there” beside a chat with Ayla, the AI career guide, suggesting a matched mentor.',
    },
    links: { github: 'https://github.com/daniyal5293/Guidify', live: null, post: null },
    featured: true,
    caseStudy: {
      problem:
        'Mentees struggle to find the right mentor. Guidify matches them with suitable mentors through an AI interview and a matching algorithm.',
      role: 'Backend Developer',
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
      challenges: [
        'Ensuring secure payment processing for mentees booking sessions.',
        'Implementing a reliable matching algorithm for mentor–mentee pairing.',
      ],
      approach:
        'Developed a microservices-based architecture to handle different aspects of the platform, ensuring scalability and maintainability.',
      features: [
        'An AI interview captures each mentee’s goals and feeds the mentor-matching algorithm.',
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
    category: 'DevOps',
    tagline: 'A MERN stack, deployed with Docker Compose.',
    summary:
      'A full-stack MERN application deployed as a multi-service stack and orchestrated with Docker Compose.',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Docker', 'Docker Compose'],
    year: '2026',
    preview: 'containers',
    screenshot: null,
    links: {
      github: 'https://github.com/daniyal5293/Containerize_MERN_APP_Docker_compose',
      live: null,
      post: 'https://www.linkedin.com/feed/update/urn:li:activity:7418687400174051328/',
    },
    caseStudy: {
      problem: 'How do you deploy a full-stack MERN application as a reproducible, multi-service stack with Docker Compose?',
      role: 'DevOps / cloud engineer',
      architecture: {
        caption: 'Multi-container deployment defined with Docker Compose.',
        envelope: 'Docker Compose',
        layers: [
          { label: 'Client', items: ['React'] },
          { label: 'API', items: ['Node.js', 'Express.js'] },
          { label: 'Database', items: ['MongoDB'] },
        ],
      },
      challenges: [
        'Ensuring that each service runs in isolation and communicates correctly with the others.',
        'Managing environment variables and configuration for different environments.',
      ],
      approach:
        'Implemented a multi-service deployment using Docker Compose, so each service runs in isolation and the whole stack starts from one configuration.',
      features: [
        'Full-stack MERN application: MongoDB, Express.js, React and Node.js.',
        'Multi-container deployment orchestrated with Docker Compose.',
        'The whole stack is described in one Compose configuration.',
      ],
      outcomes:
        'Successfully deployed the MERN application as a multi-service stack, improving scalability and maintainability.',
      lessons: [
        'Properly configuring environment variables for different environments.',
        'Designing reliable service-to-service networking.',
      ],
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
    year: '2026',
    preview: 'inbox',
    screenshot: null,
    links: {
      github: 'https://github.com/daniyal5293/Email_Assistant_ChromeEXT-FullStackProject',
      live: null,
      post: 'https://www.linkedin.com/feed/update/urn:li:activity:7413625284198924288/',
    },
    caseStudy: {
      problem: 'How do you build a full-stack email management app with a Spring Boot backend and a React.js frontend?',
      role: 'Full-stack developer',
      architecture: {
        caption: 'Three-tier stack, as listed for the project.',
        layers: [
          { label: 'Client', items: ['React'] },
          { label: 'API', items: ['Spring Boot', 'REST APIs'] },
          { label: 'Database', items: ['MySQL'] },
        ],
      },
      challenges: [
        'Managing the complexity of a full-stack application with multiple technologies.',
        'Ensuring seamless integration between the frontend and backend services.',
      ],
      approach:
        'Implemented a three-tier architecture with a Spring Boot backend, React.js frontend and MySQL database for persistence.',
      features: [
        'Email management from a single web interface.',
        'Backend exposed as Spring Boot REST APIs.',
        'React.js frontend consuming the API.',
        'MySQL database for persistence.',
      ],
      outcomes:
        'Successfully built the email assistant as a Chrome extension, demonstrating proficiency in Spring Boot, React.js and MySQL.',
      lessons: [
        'Effective communication and collaboration between frontend and backend teams.',
        'Managing dependencies and versioning in a full-stack application.',
      ],
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
    title: 'Test & package',
    command: 'docker compose up --build',
    description:
      'Validate behaviour with tests, then package every service with Docker so each environment runs the exact same build.',
    outputs: ['E2E checks', 'Docker images', 'Compose config'],
  },
  {
    id: 'deploy',
    title: 'Provision & deploy',
    command: 'terraform apply',
    description:
      'Provision infrastructure as code, release to the cloud with sensible network rules, watch how it behaves for real and feed that back into the next iteration.',
    outputs: ['Infrastructure as code', 'Live release', 'Next iteration'],
  },
];

/* ─────────────────────────── Testimonials ─────────────────────────── */

/**
 * Only add genuine recommendations (e.g. copied from LinkedIn, with permission).
 * The section stays hidden while this array is empty.
 */
export const testimonials: Testimonial[] = [
  {
    // From a LinkedIn comment (emojis removed). Add the comment's URL to `source` to link it.
    quote:
      'You’re someone who’s passionate and gives full devotion to whatever they step into. Really proud of you. Best of luck for future endeavors!',
    name: 'Shah Hunain',
    role: 'Software Engineer I',
    organization: 'Encore',
    source: null,
  },
];

/* ───────────────────────────── Navigation ───────────────────────────── */

export const navItems = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
] as const;
