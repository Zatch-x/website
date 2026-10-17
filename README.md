# Vicky Nayak — Cinematic Developer Portfolio

A frontend-only portfolio built with Next.js (App Router), React, TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger + Flip), and Lenis. No new dependencies were added.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Before publishing:

```bash
npm run lint
npm run build
npm start          # serve the production build locally
```

## Where to edit content

| What | File |
| --- | --- |
| Email, name, location, social links, navigation | `src/data/site.ts` |
| Projects, case studies, skills, journey (experience/education), journey counters, about tabs, process | `src/data/portfolio.ts` |
| Profile photo | `public/images/profile.jpg` (a square image of at least 800×800 px will look sharper) |
| Case-study screenshots | `public/images/work/<slug>/01.jpg`, then list them in that project's `screenshots` array |

### Placeholders still to fill in

- **Case studies**: `role`, `year`, `links`, `results` and `screenshots` are empty, and they render as clearly marked placeholders. Problem/solution copy marked `draft: true` was written from the existing one-line project summaries and carries a visible "Draft · confirm" tag. Rewrite it in your own words, then remove the flag. Each case study also has a "Still to add" list (`openQuestions`), which you can empty once the details are in.
- **RIVYNE logo**: no logo file is in the project yet. Add the authentic file (e.g. `public/images/logos/rivyne.svg`) and set `orgLogo` on the RivyneOfficial.com entry in `src/data/portfolio.ts`; it then appears on the Journey timeline card.

## Visual theme

All colours live as CSS variables at the top of `src/app/globals.css` (paper, ink, accent). Each page tunes them in the "Page identities" block near the end of that file: home (forest), About (terracotta on ivory), Journey (olive on sage), Contact (deep blue on white), and per-project accents on the case studies.

## Structure

```
src/
  app/
    layout.tsx              fonts (next/font), global chrome, metadata
    page.tsx                home: hero, intro, work, skills, "keep exploring" index
    about/page.tsx          about: spotlight portrait, tabs, marquee, process stepper
    journey/page.tsx        journey: counters, filterable timeline with tilt cards
    contact/page.tsx        contact: channels, form with live email preview
    work/[slug]/page.tsx    statically generated case studies
    not-found.tsx
    globals.css             design tokens + all component styles
  components/
    SmoothScroll.tsx        Lenis driven by the GSAP ticker
    chrome/                 Header (active nav, mobile menu), Footer, Cursor,
                            ScrollProgress (+ back-to-top), PageTransition, Reveals, Toaster
    home/                   Hero, IntroBand, Work, Skills, Explore
    about/                  PortraitSpotlight, AboutTabs, ProcessStepper
    journey/                StatCounters, Timeline
    contact/                ContactChannels, ContactForm
    work/                   CaseStudy, ProjectVisual (illustrative artwork)
    ui/                     PageIntro, VelocityMarquee, NextPage, Magnetic, RollText,
                            TransitionLink, CopyEmailButton, LocalTime
  data/                     site.ts, portfolio.ts
  lib/                      gsap.ts (plugin registration), scroll.ts, clipboard.ts, session.ts
```

## Motion & accessibility notes

- Every non-essential animation is gated behind `prefers-reduced-motion: no-preference` (via `gsap.matchMedia`). With reduced motion: no Lenis, no intro curtain, no cursor, no page wipe, and all content is visible immediately.
- The custom cursor, magnetic buttons, hover previews and pointer parallax run only on devices with `(hover: hover) and (pointer: fine)`. Touch devices keep native behaviour and show project visuals inline.
- The intro curtain runs on CSS alone, so it always clears even if JavaScript fails. It only plays when the home page is the first page loaded.
- The contact form has no backend. It validates the input, then opens the visitor's email app with the message pre-filled (`mailto:`). Nothing is stored or sent anywhere else.
- No environment variables are needed. `.env*` files are git-ignored.

## Deploy

Push to GitHub, import the repo into Vercel, and deploy with the default Next.js settings.
