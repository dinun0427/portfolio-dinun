export type IconName = "github" | "linkedin" | "x" | "mail";

export type SocialLink = {
  label: string;
  handle: string;
  href: string;
  icon: IconName;
};

export type SkillLevel = "learning" | "proficient" | "advanced";

export type Skill = {
  name: string;
  level: SkillLevel;
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
  location: string;
  status: string;
  email: string;
  tagline: string;
  about: string[];
};