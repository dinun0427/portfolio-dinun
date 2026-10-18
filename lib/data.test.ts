import { describe, expect, it } from "vitest";
import {
  experience,
  profile,
  projects,
  skillGroups,
  socials,
} from "@/lib/data";

describe("profile", () => {
  it("has the essentials", () => {
    expect(profile.name).not.toBe("");
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(profile.rotatingRoles.length).toBeGreaterThan(0);
  });
});

describe("skillGroups", () => {
  it("has at least one skill in every group", () => {
    for (const group of skillGroups) {
      expect(group.skills.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate skill names inside a group", () => {
    for (const group of skillGroups) {
      const names = group.skills.map((s) => s.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });
});

describe("projects", () => {
  it("each project has content and at least one tag", () => {
    for (const project of projects) {
      expect(project.title).not.toBe("");
      expect(project.description).not.toBe("");
      expect(project.tags.length).toBeGreaterThan(0);
    }
  });

  it("links use https", () => {
    for (const project of projects) {
      for (const url of [project.github, project.live]) {
        if (url) expect(url.startsWith("https://")).toBe(true);
      }
    }
  });
});

describe("socials", () => {
  it("every link is https or mailto", () => {
    for (const social of socials) {
      expect(/^(https:\/\/|mailto:)/.test(social.href)).toBe(true);
    }
  });
});

describe("experience", () => {
  it("each job lists highlights and tech", () => {
    for (const job of experience) {
      expect(job.highlights.length).toBeGreaterThan(0);
      expect(job.tech.length).toBeGreaterThan(0);
    }
  });
});