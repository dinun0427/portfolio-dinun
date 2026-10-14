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
  location: "Colombo, Sri Lanka",
  status: "Open to Work",
  email: "ranasinghedinun@gmail.com",
  tagline:
    "I Turn Real-world Problems into Deployed, Intelligent Systems & Build Fast, Polished Web Products.",
  about: [
    "I'm Dinun, an AI/ML engineer. I Design, Train and Deploy Machine Learning and Deep Learning Models, Build end-to-end Pipelines, and Integrate model APIs into the Applications that Clients and the Platform rely on.",
    "Right now I'm Sharpening my Skills in Full-Stack Web Development & AI skills in MLOps, Deployment, and Infrastructure.",
  ],
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Full-Stack",
    blurb: "Versatile Full-Stack Software Engineer",
    skills: [
      { name: "T3 Stack", level: "advanced" },
      { name: "MEAN Stack", level: "proficient" },
      { name: "MERN Stack", level: "proficient" },
    ],
  },
  {
    title: "AI/ML",
    blurb: "Currently Levelling Up.",
    skills: [
      { name: "Python", level: "proficient" },
      { name: "Algorithms & Data Structures", level: "proficient" },
      { name: "PyTorch & TensorFlow/Keras", level: "proficient" },
      { name: "NumPy, Pandas, & Scikit-learn", level: "proficient" },
      { name: "Linux & Bash", level: "learning" },
      { name: "MLOps", level: "learning" },
      { name: "LLM APIs", level: "learning" },
    ],
  },
];

export const projects: Project[] = [
  {
    title: "Portfolio",
    kind: "Full-Stack App",
    description: "Just did it for fun and to repolish my skills",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/dinun0427/portfolio-dinun",
    live: "",
  },
  {
    title: "YellowB",
    kind: "Full-Stack AI App",
    description: "Final Year Research Project. Built an AI Mobile Application to Classify Leaf Diseases with Transfer Learning & XAI",
    tags: ["Deep Learning Techniques","Python", "Flask"],
    github: "https://github.com/dinun0427/YellowB",
    live: "",
  },
    {
    title: "Family Clinic",
    kind: "Full-Stack App",
    description: "Created a Full-Stack Hybrid Application with MEAN stack and IONIC to connect Patiets and Doctors Online",
    tags: ["MEAN Stack"],
    github: "https://github.com/dinun0427/FamilyClinic",
    live: "",
  },
];

export const experience: Job[] = [
  {
    role: "Trinee Software Engineer",
    company: "Family Clinic Pvt Ltd.",
    period: "2022 - 2023",
    summary: "Played a Crucial role in Implementing the Mobile App, Using MEAN Stack and Ionic Framework to ensure robust functionality and User-friendly experiences. Developed RESTful APIs, for Communication between Client-side and Server-side systems, Which enhanced our application's Responsiveness and Performance.",
    highlights: ["Helped the Team and the Company to Build their Product"],
    tech: ["MEAN Stack", "IONIC Framework"],
  },
    {
    role: "Software Engineer",
    company: "GEODD",
    period: "2024 - 2026",
    summary: "",
    highlights: [""],
    tech: [""],
  },
      {
    role: "AI/ML Engineer",
    company: "GEODD",
    period: "2026 - Present",
    summary: "",
    highlights: [""],
    tech: [""],
  },
];

export const nowItems: NowItem[] = [
  {
    label: "Learning",
    title: "AI & Machine Learning",
    detail: "Project-based Practice and gaining Experience to become the Unstoppable.",
  },
  {
    label: "Building",
    title: "The Portfolio",
    detail: "Re polissing my skills in Full-stack",
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
    label: "Email",
    handle: "ranasinghedinun@gmail.com",
    href: "mailto:ranasinghedinun@gmail.com",
    icon: "mail",
  },
];