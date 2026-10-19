# Dinun Ranasinghe | Portfolio

A fast, animated developer portfolio built from scratch with Next.js, TypeScript and Tailwind CSS.

**Live:** https://portfolio-dinun.vercel.app

![Desktop screenshot](docs/screenshots/desktop.png)

## Features

- Sections for About, Skills, Projects, Experience, Now and Contact
- All content in one typed file (`lib/data.ts`), so updating the site means editing data, not markup
- Scroll reveals, spotlight and tilt cards, animated background (Framer Motion and CSS)
- Sticky navigation with active-section highlighting and an accessible mobile menu
- SEO: metadata, Open Graph image and favicon generated with `next/og`, sitemap, robots, JSON-LD
- Accessibility: semantic HTML, skip link, visible focus, reduced-motion support, WCAG AA contrast

## Tech stack

Next.js (App Router), React, TypeScript (strict), Tailwind CSS, Framer Motion, ESLint, Prettier, Vitest and Testing Library, Playwright, GitHub Actions, Vercel.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script                 | What it does                      |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the dev server              |
| `npm run build`        | Production build                  |
| `npm run lint`         | ESLint                            |
| `npm run typecheck`    | TypeScript check                  |
| `npm run format:check` | Prettier check                    |
| `npm test`             | Unit and component tests (Vitest) |
| `npm run test:e2e`     | End-to-end tests (Playwright)     |

## Project structure

```
app/          layout, page, metadata routes (icon, Open Graph image, robots, sitemap)
components/   section components and reusable animation blocks
lib/          typed content (data.ts), types, site URL helper
e2e/          Playwright tests
```

## How it is built and shipped

- Work happens on short-lived feature branches and merges through pull requests with Conventional Commit messages.
- GitHub Actions runs lint, typecheck, format check, unit tests, build and end-to-end tests on every PR.
- `main` is protected: a PR and a passing `checks` job are required.
- Vercel deploys `main` to production and creates a preview for every PR.
- Dependabot opens weekly dependency PRs, which go through the same checks.

## Decisions

- **No database.** The content changes rarely and lives in version control, so a database would add cost and failure modes for no benefit.
- **Server components by default.** Only components that need state, effects or animation are client components.
- **Tests at two levels.** Fast component and data-integrity tests, plus a few end-to-end tests of real user flows against the production build.

## Author

Dinun Ranasinghe, AI/ML engineer, Colombo, Sri Lanka.
[GitHub](https://github.com/dinun0427) | [LinkedIn](https://www.linkedin.com/in/dinun-ranasinghe/)
