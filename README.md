# GreenRoots 🌱

**Live app:** https://greenroots-five.vercel.app

## The problem, and who it's for

Most tree-planting failures in Pakistan don't come from neglect — they come from the wrong
species meeting the wrong soil, or a home gardener watering on a schedule that doesn't match
their actual soil type and climate. On the farming side, trees are often avoided altogether
because farmers don't know which species can share a field with their crop without competing
for nutrients, sunlight, or root space.

GreenRoots is a small decision-support tool for two groups:

- **Home planters** — anyone in Pakistan who wants to plant a sapling in a yard, street, or
  courtyard but doesn't know which species will actually survive their soil and climate.
- **Farmers** — anyone who wants to add trees to existing cropland (agroforestry) for shade,
  fodder, timber, or income, without hurting their main crop's yield.

## Features

- **Two guided paths from the homepage**: "I want to plant a tree" and "I'm a farmer."
- **Plant-a-tree flow**: a 5-step wizard — region/city, three plain-language soil questions
  (handful test, drainage test, texture test), and daily watering time budget.
- **Farmer flow**: region and current crop.
- **AI recommendation engine** (see below) that returns, for planters: 2–3 native/naturalized
  species suited to the inferred soil and climate, a first-two-months watering schedule, and
  1–2 care warnings; and for farmers: 2–3 agroforestry-compatible species with spacing and
  placement advice.
- **Results page** styled as a clean, screenshot-friendly card — built so a user can screenshot
  it and share or save it directly.
- **History page** — every submission (inputs + AI result) is saved locally on the user's
  device so they can revisit past recommendations without re-entering anything.
- **Clean, earthy design system** — custom green/soil/sand color palette, serif display type
  paired with a body sans, built from scratch for this app (not a default template theme).
- **Fully responsive**, works down to mobile, visible keyboard focus states, and respects
  `prefers-reduced-motion`.

## The AI feature

**What it does:** both flows send the user's structured answers to Claude, which returns
strict JSON (parsed and rendered directly into the result cards — no free-text guessing on
the frontend).

**Where it lives:** `app/api/recommend/route.ts` calls the Anthropic API server-side, using
the system prompts defined in `lib/prompts.ts`.

**The system prompts** (full text in `lib/prompts.ts`) are intentionally specific rather than
generic:
- They ground the model in Pakistan's actual climate zones (Punjab plains, Sindh/Karachi
  coastal-arid, KP hills, Balochistan arid, Gilgit-Baltistan highlands) and in species that are
  genuinely native or long-naturalized in Pakistan, by name (Shisham, Neem, Sukh Chain, Kikar,
  Amaltas, Jaman, Bakain, Ber, Deodar, Moringa, etc.).
- They explicitly tell the model how to infer soil type from the three plain-language answers
  using basic soil science (e.g. soil that crumbles apart signals sandy/silty soil; pooling
  water signals clay or compacted soil).
- They tell the model to avoid recommending known problem species for the region (e.g.
  Eucalyptus, Conocarpus) as "good" picks, only flagging them as cautions if relevant.
- For farmers, they ground recommendations in real agroforestry compatibility factors: root
  competition depth, light/shade tolerance of the named crop, nitrogen-fixing species, and
  boundary vs. intercropping placement.
- They force a strict JSON output contract so the frontend never has to guess how to parse
  the model's answer.

> This first version of the prompt is a solid starting draft grounded in real species and
> real regional logic — not generic global gardening advice. The next step (mentioned by the
> project owner) is tightening it further against real forestry/agroforestry references.

## Tools, services, and models used

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS, custom design tokens (no UI component library)
- **AI:** Anthropic API (`@anthropic-ai/sdk`), model `claude-sonnet-5` by default (configurable
  via `ANTHROPIC_MODEL` env var — e.g. swap to `claude-haiku-4-5-20251001` for a cheaper/faster
  option)
- **Storage:** browser `localStorage` — no external database. This keeps the app free to run
  and deploy with zero backend infrastructure, at the cost of history being per-device/browser
  rather than synced across devices. (Documented limitation — see "Known limitations" below.)
- **Hosting:** Vercel
- **Built with:** Claude (Anthropic)

## Screenshots

*Add 3+ screenshots here after you deploy — see the "Screenshots to take" checklist in the
Deployment section below. Drop the image files into a `/screenshots` folder in the repo and
reference them like this:*

```markdown

![Homepage](./screenshots/home.png)
![Plant wizard](./screenshots/plant-wizard.png)
![Results page](./screenshots/results.png)

```

## Known limitations

- History is stored per-browser via `localStorage`, not a shared account/database — clearing
  browser data or switching devices loses history. Swapping in a real database (e.g. Vercel
  Postgres or Supabase) is a natural next step if persistent, cross-device history is needed.
- The AI can occasionally return a slightly malformed response; the API route handles this by
  returning a clear error rather than crashing, and the user can just retry.
- Species recommendations are a decision-support draft, not a substitute for local agricultural
  extension advice for high-value commercial planting decisions.

