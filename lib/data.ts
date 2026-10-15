import type {
  Job,
  NowItem,
  Profile,
  Project,
  SkillGroup,
  SocialLink,
} from "./types";

export const profile: Profile = {
  name: "Dinun Ranasinghe",
  initials: "DR",
  role: "Software Engineer",
  rotatingRoles: ["AI/ML Engineer", "Full-stack Developer"],
  location: "Colombo, Sri Lanka",
  status: "Open to work",
  email: "ranasinghedinun@gmail.com",
  tagline:
    "I turn real-world problems into deployed, intelligent systems and build fast, polished web products.",
  about: [
    "I'm Dinun, an AI/ML engineer. I design, train and deploy machine learning and deep learning models, build end-to-end pipelines and integrate model APIs into the applications that clients and the platform rely on.",
    "Right now I'm sharpening my skills in full-stack web development, and in MLOps, deployment and infrastructure.",
  ],
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Programming",
    blurb: "Eat. Sleep. Code. Repeat.",
    skills: [
      { name: "Python", level: "advanced" },
      { name: "Algorithms & data structures", level: "proficient" },
      { name: "Java", level: "proficient" },
      { name: "Object-oriented programming", level: "proficient" },
      { name: "JavaScript", level: "proficient" },
      { name: "C++", level: "learning" },
    ],
  },
  {
    title: "AI/ML",
    blurb: "Solo levelling...",
    skills: [
      { name: "PyTorch & TensorFlow/Keras", level: "proficient" },
      { name: "NumPy, pandas & scikit-learn", level: "proficient" },
      { name: "Linux & Bash", level: "learning" },
      { name: "MLOps", level: "learning" },
      { name: "LLM APIs", level: "learning" },
    ],
  },
  {
    title: "Front-end",
    blurb: "Versatile front-end developer",
    skills: [
      { name: "Next.js", level: "proficient" },
      { name: "TypeScript", level: "proficient" },
      { name: "React", level: "proficient" },
      { name: "Angular", level: "proficient" },
      { name: "Tailwind CSS", level: "proficient" },
      { name: "SCSS", level: "proficient" },
    ],
  },
  {
    title: "Back-end",
    blurb: "Versatile back-end developer",
    skills: [
      { name: "Next.js", level: "proficient" },
      { name: "Node.js", level: "proficient" },
      { name: "Express.js", level: "proficient" },
      { name: "MongoDB", level: "proficient" },
      { name: "tRPC", level: "proficient" },
      { name: "Prisma", level: "learning" },
      { name: "PostgreSQL", level: "learning" },
      { name: "NextAuth.js", level: "proficient" },
    ],
  },
  {
    title: "Cloud and tooling",
    blurb: "Learning DevOps",
    skills: [
      { name: "Docker", level: "learning" },
      { name: "AWS", level: "learning" },
      { name: "Git", level: "proficient" },
      { name: "Kubernetes", level: "learning" },
      { name: "Jenkins", level: "learning" },
    ],
  },
];

export const projects: Project[] = [
  {
    title: "Portfolio",
    kind: "Web portfolio",
    description: "Just did it for fun, to re-polish and upgrade my skills.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/dinun0427/portfolio-dinun",
  },
  {
    title: "YellowB",
    kind: "Full-stack AI app",
    description:
      "Final year research project. Built an AI mobile application to classify leaf diseases with transfer learning and XAI.",
    tags: ["Deep learning", "Python", "Flask"],
    github: "https://github.com/dinun0427/YellowB",
  },
  {
    title: "Family Clinic",
    kind: "Full-stack app",
    description:
      "Created a full-stack hybrid application with the MEAN stack and Ionic to connect patients and doctors online.",
    tags: ["MEAN stack", "Ionic"],
    github: "https://github.com/dinun0427/FamilyClinic",
  },
];

export const experience: Job[] = [
  {
    role: "AI/ML Engineer",
    company: "GEODD",
    period: "2026 - Present",
    summary:
      "Promoted to AI/ML Engineer, Focused on high-performance, reliable and advanced AI-driven solutions for a global client base.",
    highlights: [
      "Selected, tuned and experimented with ML algorithms and deployed scalable AI solutions.",
    ],
    tech: ["Python", "PyTorch", "TensorFlow/Keras", "LLMs", "GenAI", "AWS", "Docker"],
  },
  {
    role: "ML Engineer",
    company: "GEODD",
    period: "2024 - 2026",
    summary:
      "My first full-time role after university. Selecting algorithms, tuning hyperparameters, running experiments and validating model performance. Gained foundational experience with modern stacks like LLMs and GenAI tools.",
    highlights: ["Built, deployed, tested and operated ML and AI solutions."],
    tech: ["Python", "PyTorch", "TensorFlow/Keras", "LLMs", "GenAI"],
  },
  {
    role: "Trainee Software Engineer",
    company: "Family Clinic Pvt Ltd.",
    period: "2022 - 2023",
    summary:
      "Played a crucial role in implementing the mobile app, using the MEAN stack and the Ionic framework to ensure robust functionality and user-friendly experiences. Developed RESTful APIs for communication between client-side and server-side systems, which enhanced our application's responsiveness and performance.",
    highlights: ["Helped the team and the company build their product."],
    tech: ["MEAN stack", "Ionic"],
  },
];

export const nowItems: NowItem[] = [
  {
    label: "Learning",
    title: "AI and machine learning",
    detail:
      "Project-based practice and gaining experience to become the expert.",
  },
  {
    label: "Building",
    title: "The portfolio",
    detail:
      "Containerizing my skills, orchestrating my projects and deploying my career into production.",
  },
];

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    handle: "github.com/dinun0427",
    href: "https://github.com/dinun0427",
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "linkedin.com/in/dinun-ranasinghe",
    href: "https://www.linkedin.com/in/dinun-ranasinghe/",
    icon: "linkedin",
  },
  {
    label: "Email",
    handle: "ranasinghedinun@gmail.com",
    href: "mailto:ranasinghedinun@gmail.com",
    icon: "mail",
  },
];