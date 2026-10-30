# Impeccable & Web Interface Guidelines UI/UX Enhancement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate SQL Thám Tử's user interface, onboarding tour, and micro-interactions to meet high-craft standards (`impeccable`) and compliance with Vercel Web Interface Guidelines (`web-design-guidelines`), backed by comprehensive unit tests.

**Architecture:** Refine CSS design tokens and base styles for reduced-motion, dark-mode native compliance, and tabular numerals. Enhance `OnboardingTour` with keyboard navigation, ARIA attributes, and accessible dismiss triggers. Upgrade `Navbar`, `CaseList`, and `CaseBrief` with clear focus-visible states, semantic markup, and tactile micro-interactions.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Vitest, Testing Library.

**Spec:** Direct user request combining `impeccable` design excellence and `web-design-guidelines` accessibility, motion, and interaction standards.

## Global Constraints

- Preserve dark noir detective aesthetic (deep blacks, slates, amber/gold accents).
- Strictly comply with Web Interface Guidelines:
  - Honor `prefers-reduced-motion` across all animations and transitions.
  - Never use `transition: all` — specify explicit animated properties (`transform`, `opacity`, `color`, `background-color`).
  - No `outline-none` without a matching `focus-visible:ring-*` replacement.
  - All icon-only buttons must include descriptive `aria-label`.
  - Decorative icons must have `aria-hidden="true"`.
  - Use `font-variant-numeric: tabular-nums` for counters, stats, and timers.
  - Use curly punctuation and proper ellipses (`…`) instead of straight dots (`...`).
- 100% type-safe with TypeScript (`npm run build` must pass cleanly).
- All unit tests must pass via `npm test` (`vitest run`).

## Review Focus

1. **Reduced Motion Accessibility:** When user has `prefers-reduced-motion: reduce`, animations and transitions must collapse or stop immediately without breaking layout.
2. **Keyboard Traps & Accessibility:** In `OnboardingTour` and interactive dialogs, `Escape` key must dismiss immediately and save `localStorage` state.
3. **Focus Visibility:** Focus rings must appear only on keyboard navigation (`:focus-visible`), never leaving ugly browser rings on mouse clicks.
4. **Layout Thrashing & CPU Usage:** No layout reads inside render loops; zero infinite scroll triggers.
5. **Screen Reader Usability:** Clear ARIA descriptions so screen readers announce steps and actions unambiguously.

---

### Task 1: Setup Testing Infrastructure & Baseline Tests

**Files:**
- Create: `src/test/setup.ts`
- Create: `vitest.config.ts`
- Create: `src/components/__tests__/OnboardingTour.test.tsx`
- Modify: `package.json`

- [x] Configure Vitest and jsdom in `vitest.config.ts`
- [x] Add `"test": "vitest run"` to `package.json`
- [ ] Write failing test for `OnboardingTour` verifying:
  - Renders tour steps properly
  - Supports keyboard navigation (Escape to close, Enter to advance)
  - Sets localStorage on skip or finish
  - ARIA attributes present (`role="dialog"`, `aria-label`)
- [ ] Run `npm test` and observe failure/missing attributes

---

### Task 2: Global CSS & Web Design Tokens (`src/index.css`)

**Files:**
- Modify: `src/index.css`

- [ ] Add `color-scheme: dark;` to `:root` and `html` for native dark scrollbars and inputs
- [ ] Add `@media (prefers-reduced-motion: reduce)` block to disable or shorten transitions
- [ ] Add touch optimization: `touch-action: manipulation; -webkit-tap-highlight-color: transparent;`
- [ ] Add global utility classes for `tabular-nums` and consistent focus-visible rings
- [ ] Replace any unconstrained transitions with compositor-friendly properties

---

### Task 3: Elevate Onboarding Tour (`src/components/OnboardingTour.tsx`)

**Files:**
- Modify: `src/components/OnboardingTour.tsx`
- Test: `src/components/__tests__/OnboardingTour.test.tsx`

- [ ] Add keyboard event listener for `Escape` (closes tour), `ArrowRight` (next), `ArrowLeft` (prev)
- [ ] Add accessible ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-label="Hướng dẫn người dùng mới"`, `aria-live="polite"`)
- [ ] Add `aria-label` to [X] close button and `aria-hidden="true"` to decorative icons
- [ ] Apply `motion-reduce:transition-none` to spotlight and tooltip
- [ ] Ensure focus is kept within dialog or active step
- [ ] Run `npm test` to verify all tests pass

---

### Task 4: Elevate Navigation & Header (`src/components/Navbar.tsx`)

**Files:**
- Modify: `src/components/Navbar.tsx`
- Create: `src/components/__tests__/Navbar.test.tsx`

- [ ] Write tests for `Navbar` (role navigation, aria-labels for action buttons, tabular-nums on XP counter)
- [ ] Add `aria-label` to all icon buttons (Settings, Guide, Tour restart, User profile)
- [ ] Add `focus-visible:ring-2 focus-visible:ring-noir-accent focus-visible:outline-none`
- [ ] Add `tabular-nums` to XP badge and rank display
- [ ] Ensure all hover transitions specify explicit properties (`transition-colors`, `transition-transform`)
- [ ] Run `npm test` to verify Navbar tests pass

---

### Task 5: Elevate Case Cards & Main Feed (`src/components/CaseList.tsx`)

**Files:**
- Modify: `src/components/CaseList.tsx`
- Create: `src/components/__tests__/CaseList.test.tsx`

- [ ] Write tests for `CaseList` (filter controls, search input label, card buttons)
- [ ] Add `aria-label` to search input and filter buttons
- [ ] Add `tabular-nums` to case count badge (`30 / 30 vụ án`) and XP tags
- [ ] Replace straight ellipses with curly ellipses `…`
- [ ] Enhance card focus and hover states with smooth micro-interactions
- [ ] Run `npm test` to verify CaseList tests pass

---

### Task 6: System Verification & Production Build

**Files:**
- Test all: `npm test`
- Build all: `npm run build`

- [ ] Execute `npm test` and ensure 100% test passing rate
- [ ] Execute `npm run build` (`tsc && vite build`) without any errors
- [ ] Test dev server `http://localhost:3000` response
- [ ] Verify git status and commit clean changes
