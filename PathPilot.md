# PathPilot — Day-by-Day Build Plan

Stack: Next.js + TypeScript (frontend) · NestJS + TypeScript (backend) · PostgreSQL + Prisma · Redis · Docker

This plan is sequenced so each day produces something you can run and see — not just reading. Roughly 1.5–3 hrs/day. Adjust pace, but don't skip the order: each week's output is what the next week builds on.

---

## Week 1 — Foundations & Data Model 

**Day 1 — Environment + repo skeleton**
Install Node LTS, PostgreSQL, Redis (or run both via Docker). Create a monorepo: `/frontend` (Next.js + TS + Tailwind) and `/backend` (NestJS + TS). Push an empty commit to GitHub. Goal: `npm run dev` works on both sides and shows a default page/route.

**Day 2 — Design the data model on paper first**
Before touching Prisma, sketch the ER diagram by hand for: `User`, `AcademicBackground`, `Skill`, `CareerRole`, `CareerRoleSkill` (join table with a "required level"), `Roadmap`, `RoadmapStep`, `Project`, `UserSkill` (join table: user + skill + self-rated level). Write down every relationship (one-to-many, many-to-many) before coding — this is the single most important day for understanding the project.

**Day 3 — Prisma schema + migration**
Translate Day 2's diagram into `schema.prisma`. Run your first migration against local Postgres. Seed 5 `CareerRole` rows (Frontend Developer, Backend Developer, Data Analyst, Business Analyst, QA Engineer) and ~15 `Skill` rows by hand in a seed script.

**Day 4 — Auth: signup/login**
NestJS module: `AuthModule` with JWT. Password hashing with bcrypt. Endpoints: `POST /auth/signup`, `POST /auth/login`. Test with Postman/Insomnia, not the frontend yet.

**Day 5 — Users & profile endpoints**
`UsersModule`: `GET /users/me`, `PATCH /users/me` to save academic background (previous degree, current degree, semester). Guard the route with your JWT strategy.

**Day 6 — Connect frontend to auth**
Build the Next.js signup/login pages. Store the JWT (httpOnly cookie, not localStorage). Build a protected `/dashboard` route that redirects if not logged in.

**Day 7 — Review + refactor**
No new features. Re-read your own schema and controllers. Write a short README explaining your data model to your future self. This habit is what makes the difference between "I copied code" and "I understand the project."

---

## Week 2 — Career Roles & Skill Data

**Day 8 — Career role explorer API**
`CareerRolesModule`: `GET /roles` (list), `GET /roles/:id` (detail with required skills, responsibilities, related roles). Expand your seed data to 10–12 roles across the categories in your spec (dev, data, business, cloud, security).

**Day 9 — Career role explorer UI**
Build the browsable role list + detail page in Next.js, matching the categories from your spec (Software Development / Data / Business / Cloud / Security). Static styling first, real data second.

**Day 10 — User skills endpoint**
`GET /users/me/skills`, `POST /users/me/skills` to let a user self-rate skills (0–100 or a 1–5 scale). Build a simple slider UI component for this.

**Day 11 — Skill Gap Analyzer (backend logic)**
This is your first real "engine." Given a `userId` and a `roleId`, write a service method that joins `UserSkill` against `CareerRoleSkill`, computes a gap percentage per skill, and returns a sorted, prioritized list (red/orange/green like your spec). Write this as a pure function you can unit test.

**Day 12 — Skill Gap Analyzer (UI)**
Render the bars + priority list from Day 11's API. This is one of your strongest resume features — spend real time making the visualization clean, not generic bootstrap bars.

**Day 13 — Career comparison tool**
`GET /roles/compare?ids=1,2,3` returning a normalized comparison table (coding/SQL/math/communication weights you define per role). Build the comparison UI as a simple table, not a chart, to start.

**Day 14 — Review + refactor**
Check: does adding a 13th role require touching more than your seed file? If yes, your abstractions are too tight to the first 12 — loosen them now, before Week 3 builds more on top.

---

## Week 3 — The Career Path Generator (core feature)

**Day 15 — Design the matching algorithm on paper**
Decide, concretely, how "background + interests + skills → ranked role matches" produces a percentage. Keep v1 simple and explainable: a weighted score per role based on interest-tag overlap and skill overlap. Write the formula down before coding it — you should be able to explain why a match is 87% and not 91%.

**Day 16 — Onboarding quiz backend**
Model `Interest` tags and a many-to-many with roles (`CareerRoleInterest`, weighted). Endpoint: `POST /career-match` takes background + interests + skills, returns ranked roles with scores and a one-line "why."

**Day 17 — Onboarding quiz UI (steps 1–2)**
Build the multi-step quiz: background (previous/current degree) then interests (checkbox chips), matching the flow in your original spec.

**Day 18 — Onboarding quiz UI (steps 3–4 + results)**
Add the skills step and goal step, then the ranked-results screen (gold/silver/bronze matches with reasoning). Wire it to Day 16's endpoint.

**Day 19 — Roadmap generation (data model)**
Add `Roadmap` and `RoadmapStep` (phase name, duration, skills covered, order). Hand-author 3 full roadmaps (Frontend Dev, Data Analyst, Business Analyst) as seed data — don't auto-generate yet, hand-authored content will be better than a naive algorithm at this stage.

**Day 20 — Roadmap UI**
Build the phased roadmap view (Phase 1–5, matching your spec's fundamentals → development → projects → interview prep → job-ready structure).

**Day 21 — Review + refactor + demo to yourself**
Walk through the full flow end to end as a test user: signup → quiz → matched role → roadmap → skill gap. Note every rough edge. This is your first "vertical slice" — the whole product working thin, even if narrow.

---

## Week 4 — Depth Features

**Day 22 — "Why am I learning this" skill detail pages**
For each `Skill`, store sub-topics and a list of roles that need it (reuse `CareerRoleSkill`). Build the tree-style detail view from your spec.

**Day 23 — Project recommendation engine**
Model `Project` (title, difficulty, linked skills, linked role). Simple rule: recommend the lowest-difficulty unlocked project whose skills overlap the user's current roadmap phase.

**Day 24 — Project recommender UI + weekly planner (data model)**
Add `UserProgress`/`PlannerTask` model: date, task, linked roadmap step, completed boolean.

**Day 25 — Weekly planner UI**
Build the week view with checkboxes and a completion percentage bar, per your spec's "12/15 tasks completed" example.

**Day 26 — Job description analyzer (backend)**
`POST /jd-analyze`: accept pasted text, extract skill keywords (start with a simple keyword list match — no ML needed yet), compare against the target role's required skills, return match % and missing skills in priority order.

**Day 27 — Job description analyzer (UI)**
Textarea input, match percentage, checklist of found/missing skills, matching your spec's format.

**Day 28 — Review + refactor**
Re-check every service you wrote in Weeks 3–4 for duplicated logic (e.g. gap-calculation logic used in both Skill Gap Analyzer and JD Analyzer) — extract shared services now.

---

## Week 5 — AI Mentor, Polish, and Infra

**Day 29 — AI Career Mentor (backend)**
`POST /mentor/ask`: build a prompt that injects the user's stored profile, matched role, and skill gap into the request to an LLM API, so answers are grounded in their actual data — not a generic chatbot.

**Day 30 — AI Career Mentor (UI)**
Simple chat interface, scoped to career questions, showing it's using their profile (e.g. a small "based on your profile" tag on responses).

**Day 31 — Redis caching**
Cache the (expensive) role-comparison and career-match computations in Redis with a short TTL. Measure response time before/after — write the numbers down, this is a genuinely useful resume line.

**Day 32 — Docker Compose**
Write a `docker-compose.yml` running Postgres, Redis, backend, and frontend together. Confirm a fresh clone + `docker compose up` works with no manual steps.

**Day 33 — Tests**
Add unit tests for the skill-gap and career-match services (the two functions with real logic) and one Playwright end-to-end test covering signup → quiz → roadmap.

**Day 34 — GitHub Actions CI**
Pipeline: install, lint, test, build, on every push. Green checkmark is the goal, not coverage percentage.

**Day 35 — Deploy + write it up**
Deploy backend + Postgres + Redis (Railway/Render) and frontend (Vercel). Write the resume-ready project description from your spec, and record a 90-second demo video walking through the vertical slice from Day 21, now fully built out.

---

## How to use this plan

- Don't build Week 3's matching algorithm before Week 1–2's data model is solid — the ranked-match feature depends on clean `CareerRoleSkill`/`CareerRoleInterest` join tables.
- Each "review + refactor" day is not optional filler — it's where the actual understanding happens. Skipping it is the difference between having built this project and having typed it.
- If a day's task feels too big, that's a signal the data model from Week 1 needs revisiting, not that you should skip ahead.
