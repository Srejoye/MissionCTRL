# 🎯 Mission//Ctrl

> An interactive GTA VI–inspired heist planner where the image editor *is* the gameplay — pick an operation, scout a Vice-coast location, mark up the actual surveillance photo as your escape plan, then watch a phase-by-phase simulation resolve the job based on how well you actually planned it.

🔗 **[Live Demo](https://missionctrl-tau.vercel.app/)** &nbsp;|&nbsp; Built with React · TypeScript · React Router · Tailwind CSS · @unlayer/react-image-editor

---

## 📌 Overview

**Mission//Ctrl** turns "plan a heist" into something you actually draw — and makes the drawing count. After choosing an operation type and a target location, you're handed the real location photo inside an image editor retheed for the job — `Draw` becomes `Escape Route`, `Shapes` becomes `Mark Zone`, `Stickers` becomes `Intel`. This is not a cosmetic skin over a demo editor: whatever you mark up gets pixel-diffed against the untouched original photo to score how detailed your plan actually was, and that score is fed as a real bonus into the mission simulation's payout math — not just displayed back at you. Assemble a crew of specialists, run the job, and get a phase-by-phase outcome — narration, radio chatter, a payout, and a GTA-style wanted-heat rating — that reflects both your plan and your crew. Skip the planning, and the simulation quietly makes the job harder.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Retheed Image Editor** | `@unlayer/react-image-editor` fully reworked for the job — dark theme, `Draw`→`Escape Route`, `Shapes`→`Mark Zone`, `Stickers`→`Intel`, resize/frame tools disabled. Built to mark up a plan, not edit a photo |
| **Blueprint Detail Scoring** | Your finished blueprint is pixel-diffed against the untouched location photo on a downsampled grid, turning a freeform drawing into a quantified 0–100 detail score |
| **Plan-Aware Payout** | That detail score isn't cosmetic — it feeds a real bonus straight into the payout formula. A lazy blueprint pays less than a marked-up one, every run |
| **Six Operation Types** | Heist, Getaway, Extraction, Delivery, Sabotage, Infiltration — each with its own objective text, base payout, and skill-weighting in the simulation |
| **Seven Vice-Coast Locations** | Vice Docks, Marina Row, Coral Row, Everglade Yard, Ocean Drive, Flamingo Casino, Sunset Tower — real location photos, compressed for the web, each with its own difficulty and infiltration flavor text |
| **Six-Member Crew Roster** | Driver, Hacker, Gunman, Insider, Medic, Demolitions — each with stealth / firepower / escape / risk stats that average into a squad profile and unlock phase-specific specialist bonuses |
| **Phase-by-Phase Simulation** | A seeded, deterministic engine rolls the squad's stats plus plan and specialist bonuses against a location-adjusted target for each phase, with narration and radio-chatter log lines generated per run |
| **Four-Tier Verdicts** | Clean, Messy, Burned, or Busted outcomes, plus a 0–5 GTA-style wanted-heat rating driven directly by how many phases failed |
| **Resumable Planning** | The blueprint, crew, and progress persist in `sessionStorage` with quota-error handling — a refresh mid-plan doesn't lose your work |
| **Export & Share** | Download the finished blueprint as a PNG, or share it via the native Web Share API on supported browsers |
| **Step-Gated Routing** | Each step (Planner → Crew → Briefing) is route-guarded on actual mission state, not a step counter — jumping ahead without an operation/location/crew redirects you back |

---

## 🚀 How to Run

No backend, no database — a static Vite app.

```bash
# Clone the repository
git clone https://github.com/Srejoye/MissionCTRL.git
cd MissionCTRL

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🖥️ Usage

### Step 1 — Choose an Operation
Pick one of six operation types on the setup screen — each comes with its own tagline and base payout tier.

### Step 2 — Scout a Location
Select a target location. Its photo becomes the canvas for the planning step.

### Step 3 — Plan the Job
Mark up the location photo in the retheed editor — draw an escape route, mark zones, drop intel labels. **Lock Plan** when you're done, or **Scrap** and start over.

### Step 4 — Build Your Crew
Assemble your squad from six specialists. Their averaged stats — stealth, firepower, escape, risk — determine how the job plays out.

### Step 5 — Run the Mission
Get your briefing: objective, estimated payout, and squad profile. Run it to watch the phase-by-phase simulation resolve, complete with radio chatter, a final verdict, payout, and heat rating.

### Step 6 — Export Your Blueprint
Download or share the finished blueprint once the job's done.

---

## 🗂️ Project Structure

```
MissionCTRL/
├── src/
│   ├── components/
│   │   ├── briefing/       # BriefingSheet, MissionRun, ExportActions, StatBar
│   │   ├── layout/         # PageShell, HudFrame, GrainOverlay, SceneTransition, StepIndicator
│   │   └── planner/        # MissionPlanner (the retheed image editor), PlannerToolbar
│   ├── context/
│   │   └── MissionContext.tsx   # Mission state — persisted to sessionStorage
│   ├── data/
│   │   ├── crew.ts             # Six crew specialists and their stats
│   │   ├── locations.ts        # Seven Vice-coast locations
│   │   ├── operations.ts       # Six operation types
│   │   └── radioChatter.ts     # Radio log lines used during mission simulation
│   ├── lib/
│   │   ├── blueprintDetail.ts   # Pixel-diff scoring of the marked-up blueprint
│   │   ├── missionBriefing.ts   # Objectives, payout math, risk tiers
│   │   ├── missionSimulation.ts # Phase-by-phase simulation engine
│   │   └── squadStats.ts        # Crew stat averaging
│   ├── pages/               # Landing, SelectOperation, Planner, SelectCrew, Briefing
│   ├── routes/
│   │   └── RequireStep.tsx     # Route guard — redirects if a prior step is incomplete
│   └── assets/locations/   # Location photography
└── index.html
```

---

## 🎨 Tech Stack

| Technology | Role |
|---|---|
| **React 19 + TypeScript** | UI and application logic |
| **React Router** | Step-gated routing between planning stages |
| **Tailwind CSS v4** | HUD-style dark theme and layout |
| **@unlayer/react-image-editor** | Retheed image editor for the planning step |
| **Vite** | Dev server and production build |
| **Web Share API** | Native share sheet for exported blueprints |

---

## 📚 Concepts Covered

- **Retheming a Third-Party Editor** — relabeling toolbar strings and disabling irrelevant tools to make a general-purpose image editor feel purpose-built
- **Image Diffing for Gameplay** — comparing a before/after canvas on a downsampled grid to turn a drawing into a quantifiable score
- **Plan-to-Outcome Feedback Loop** — feeding a player-authored artifact (the blueprint) into a simulation's actual math, not just displaying it back
- **Client-Side Session Persistence** — `sessionStorage` with quota-error handling so a refresh mid-plan doesn't wipe progress
- **Step-Gated Navigation** — route guards that redirect based on domain state rather than a fixed step counter
- **Weighted Stat Simulation** — averaging squad stats and rolling them against phase-specific targets for a resolvable, replayable outcome

---

## 🏆 Built For

Built for Unlayer's **[Build with React Image Editor Challenge](https://lnkd.in/eEE_bKHc)** — `#builtwithimageeditor`

---

## ⭐ Support

If you found this project interesting, consider giving it a ⭐ on GitHub.