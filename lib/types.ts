export type IconName = "github" | "linkedin" | "x" | "mail";

export type SocialLink = {
  label: string;
  handle: string;
  href: string;
  icon: IconName;
};

export type Skill = {
  name: string;
  /** Confidence from 0 to 100, shown as a progress bar. */
  level: number;
};

export type SkillGroup = {
  title: string;
  blurb: string;
  skills: Skill[];
};

export type Project = {
  title: string;
  kind: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
};

export type Job = {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
  tech: string[];
};

export type NowItem = {
  label: string;
  title: string;
  detail: string;
};

export type Profile = {
  name: string;
  initials: string;
  role: string;
  rotatingRoles: string[];
  location: string;
  status: string;
  email: string;
  tagline: string;
  about: string[];
};
