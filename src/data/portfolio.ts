/**
 * All portfolio content lives here.
 *
 * Content rules:
 * - `null` / empty arrays render as clearly marked placeholders on the site.
 * - `draft: true` marks copy that was written from the short project summary and
 *   still needs your confirmation. It renders with a visible "Draft" tag.
 */

export type ProjectFilter = "ai" | "creative" | "web";
export type ProjectVisualKind = "video" | "tadkaa" | "deepfake" | "registration";

export interface DraftCopy {
  text: string;
  /** True when this copy is inferred from the summary and needs confirming. */
  draft?: boolean;
}

export interface CaseStudy {
  tagline: string;
  role: string | null;
  year: string | null;
  overview: string;
  problem: DraftCopy | null;
  solution: DraftCopy | null;
  features: { title: string; body: string }[];
  /** Shown under the feature list when features are derived from the summary. */
  featuresNote?: string;
  technologies: { name: string; purpose: string | null }[];
  /** Only real, verifiable outcomes. Leave empty to show a placeholder. */
  results: string[];
  /** Real screenshots, e.g. { src: "/images/work/tadkaa/01.jpg", alt: "…" }. Empty shows placeholder slots. */
  screenshots: { src: string; alt: string; caption?: string }[];
  /** Live / source links. Empty means nothing is rendered. */
  links: { label: string; url: string }[];
  /** Missing details listed in the "still to add" note. */
  openQuestions: string[];
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  category: string;
  filters: ProjectFilter[];
  description: string;
  stack: string[];
  visual: ProjectVisualKind;
  status: string;
  /** Brand colour used for the page transition and accents. */
  accent: string;
  /** Text colour that reads on top of `accent`. */
  accentInk: string;
  caseStudy?: CaseStudy;
}

export const projectFilters: { id: "all" | ProjectFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI" },
  { id: "creative", label: "Creative" },
  { id: "web", label: "Web" },
];

export const projects: Project[] = [
  {
    slug: "ai-short-video-generator",
    number: "01",
    title: "AI Short Video Generator",
    category: "AI · Creative technology",
    filters: ["ai", "creative"],
    description:
      "An exploration of turning text prompts into short-form video experiences through AI-powered assets, voice, and video composition.",
    stack: ["Next.js", "React", "Remotion", "Replicate"],
    visual: "video",
    status: "Project exploration",
    accent: "#8a6430",
    accentInk: "#fbf6ec",
    caseStudy: {
      tagline: "From a single prompt to a short-form video.",
      role: null,
      year: null,
      overview:
        "An exploration of turning text prompts into short-form video experiences through AI-powered assets, voice, and video composition.",
      problem: {
        text: "Making a short video normally means scripting, sourcing visuals, recording a voice-over and editing it all together by hand. This project asks how much of that chain can start from one text prompt.",
        draft: true,
      },
      solution: {
        text: "A prompt-driven flow in which AI models produce the assets and voice, and the scenes are composed into a video in code with Remotion, inside a Next.js and React interface.",
        draft: true,
      },
      features: [
        { title: "Prompt as the starting point", body: "A text prompt is the input that drives the rest of the video." },
        { title: "AI-powered assets and voice", body: "Visuals and narration come from AI models rather than being sourced by hand." },
        { title: "Video composition in code", body: "Scenes are assembled programmatically with Remotion." },
        { title: "Hosted model access", body: "AI models are called through Replicate." },
      ],
      featuresNote: "Derived from the project summary. Confirm each point and add the features you actually built.",
      technologies: [
        { name: "Next.js", purpose: "Application framework" },
        { name: "React", purpose: "Interface" },
        { name: "Remotion", purpose: "Programmatic video composition" },
        { name: "Replicate", purpose: "Hosted AI model inference" },
      ],
      results: [],
      screenshots: [],
      links: [],
      openQuestions: ["Your role and timeline", "Which models generate visuals and voice", "Screenshots or a sample output video", "Live demo or repository link"],
    },
  },
  {
    slug: "tadkaa",
    number: "02",
    title: "TADKAA",
    category: "Creative development",
    filters: ["creative", "web"],
    description:
      "A cinematic web experience focused on strong art direction, scroll-led storytelling, and expressive motion on the web.",
    stack: ["Next.js", "TypeScript", "GSAP", "Lenis"],
    visual: "tadkaa",
    status: "In development",
    accent: "#d9de6a",
    accentInk: "#1f1d1a",
    caseStudy: {
      tagline: "Scroll-led storytelling with a strong point of view.",
      role: null,
      year: null,
      overview:
        "A cinematic web experience focused on strong art direction, scroll-led storytelling, and expressive motion on the web.",
      problem: {
        text: "A lot of websites deliver information but leave no impression. TADKAA treats the act of scrolling as part of the story rather than a way to get past it.",
        draft: true,
      },
      solution: {
        text: "Art direction first, then motion: a Next.js and TypeScript build where GSAP drives scroll-linked storytelling and Lenis keeps the scroll smooth and controlled.",
        draft: true,
      },
      features: [
        { title: "Art direction", body: "A strong visual identity sets the tone before any motion is added." },
        { title: "Scroll-led storytelling", body: "Content unfolds in sequence as the visitor scrolls." },
        { title: "Expressive motion", body: "Animation built with GSAP to carry the narrative." },
        { title: "Smooth scrolling", body: "Lenis gives the scroll a consistent, cinematic feel." },
      ],
      featuresNote: "Derived from the project summary. Replace with the specific scenes and interactions in the build.",
      technologies: [
        { name: "Next.js", purpose: "Framework and routing" },
        { name: "TypeScript", purpose: "Type-safe components" },
        { name: "GSAP", purpose: "Timeline and scroll animation" },
        { name: "Lenis", purpose: "Smooth scrolling" },
      ],
      results: [],
      screenshots: [],
      links: [],
      openQuestions: ["What TADKAA is for (brand, concept or client)", "Your role and timeline", "Screenshots or screen recordings", "Live URL once launched"],
    },
  },
  {
    slug: "deepfake-detection",
    number: "03",
    title: "Deepfake Detection",
    category: "AI · Computer vision",
    filters: ["ai"],
    description: "A project exploring the detection of manipulated media with a Python API and machine-learning workflow.",
    stack: ["Python", "FastAPI", "Machine Learning"],
    visual: "deepfake",
    status: "Project exploration",
    accent: "#2b4a66",
    accentInk: "#f4f7fa",
    caseStudy: {
      tagline: "Can this piece of media be trusted?",
      role: null,
      year: null,
      overview: "A project exploring the detection of manipulated media with a Python API and machine-learning workflow.",
      problem: {
        text: "Manipulated images and video are increasingly hard to tell apart from real footage by eye, which makes trust in media harder to establish.",
        draft: true,
      },
      solution: {
        text: "A machine-learning workflow that assesses whether media has been manipulated, exposed through a Python API built with FastAPI.",
        draft: true,
      },
      features: [
        { title: "Manipulated-media detection", body: "A machine-learning workflow focused on spotting synthetic or altered media." },
        { title: "Python API", body: "Detection is exposed through an API built with FastAPI." },
      ],
      featuresNote: "Derived from the project summary. Add the model approach, input types and output format.",
      technologies: [
        { name: "Python", purpose: "Core language" },
        { name: "FastAPI", purpose: "API layer" },
        { name: "Machine Learning", purpose: null },
      ],
      results: [],
      screenshots: [],
      links: [],
      openQuestions: ["Model architecture and dataset", "Supported inputs (image, video, both)", "Evaluation results, if measured", "Screenshots of the API or interface", "Repository link"],
    },
  },
  {
    slug: "student-registration-system",
    number: "04",
    title: "Student Registration System",
    category: "Web application",
    filters: ["web"],
    description:
      "A student-data workflow project focused on collecting and organizing registration information through a web interface.",
    stack: ["JavaScript", "Node.js", "EJS"],
    visual: "registration",
    status: "Academic project",
    accent: "#ad5440",
    accentInk: "#f6efe2",
  },
];

export const caseStudyProjects = projects.filter((p): p is Project & { caseStudy: CaseStudy } => Boolean(p.caseStudy));

export function getProject(slug: string) {
  return caseStudyProjects.find((p) => p.slug === slug);
}

export const skillGroups = [
  { id: "frontend", label: "Frontend", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"] },
  { id: "motion", label: "Motion & Design", items: ["GSAP", "ScrollTrigger", "Lenis", "Responsive UI", "Motion design"] },
  { id: "backend", label: "Backend & Data", items: ["Node.js", "Express.js", "PostgreSQL", "Firebase", "Drizzle ORM"] },
  { id: "ai", label: "AI & Tools", items: ["Replicate", "Remotion", "FastAPI", "Git", "GitHub"] },
] as const;

export type SkillGroupId = (typeof skillGroups)[number]["id"];

export interface JourneyEntry {
  id: string;
  kind: "education" | "experience";
  period: string;
  /** Degree or role. `null` shows a marked placeholder. */
  title: string | null;
  org: string;
  /** Optional link to the organisation's website. */
  orgUrl?: string;
  /** Optional organisation logo in /public, e.g. "/images/logos/rivyne.svg". Only rendered when set. */
  orgLogo?: string;
  details: string[];
  current?: boolean;
}

export const journey: JourneyEntry[] = [
  {
    id: "rivyne",
    kind: "experience",
    period: "2 years",
    title: "Full Stack Developer",
    // Add the authentic RIVYNE logo file to /public and set its path here, e.g. "/images/logos/rivyne.svg".
    orgLogo: undefined,
    org: "RivyneOfficial.com",
    orgUrl: "https://www.rivyneofficial.com/",
    details: ["Two years of experience with RivyneOfficial.com."],
  },
  {
    id: "mca",
    kind: "education",
    period: "In progress",
    title: "MCA · Cybersecurity & Networking",
    org: "Galgotias University",
    details: ["Master of Computer Applications, specialising in Cybersecurity and Networking."],
    current: true,
  },
  {
    id: "bca",
    kind: "education",
    period: "2025",
    title: "BCA",
    org: "St. Joseph University, Nagaland",
    details: ["Bachelor of Computer Applications, completed in 2025."],
  },
];

/** Factual figures for the Journey page counters — derived from the entries above. */
export const journeyStats = [
  { value: 2, suffix: "", label: "Years of experience" },
  { value: journey.filter((e) => e.kind === "education" && !e.current).length, suffix: "", label: "Degree completed" },
  { value: journey.filter((e) => e.current).length, suffix: "", label: "Degree in progress" },
];

export const aboutTabs = [
  { id: "now", label: "Now", body: "Pursuing an MCA in Cybersecurity and Networking at Galgotias University." },
  { id: "exploring", label: "Exploring", body: "Frontend engineering, AI-powered tools, and the details that make a website feel considered." },
  { id: "approach", label: "Approach", body: "I’m still learning, building, and refining my process — and that’s the part I enjoy most." },
] as const;

export const processSteps = [
  { n: "01", title: "Understand", body: "Start with the purpose, the people, and the problem worth solving." },
  { n: "02", title: "Shape", body: "Find the structure, visual language, and interaction that fit the idea." },
  { n: "03", title: "Build", body: "Turn the plan into responsive, maintainable interfaces." },
  { n: "04", title: "Refine", body: "Test, notice the details, and improve what needs to be better." },
];
