# Human × Agent CoLab
### Different minds. Better together.

A portfolio-ready, interactive experiment in **human–AI cooperation**: three missions where human context and agent evidence must meet before a good decision can emerge.

**Public demo:** deployment in progress. The verified production URL will be added here after deployment.

## The concept

Most AI demos start with a chat box. CoLab starts with **two incomplete perspectives**. You bring personal needs, social context, and on-the-ground observations. A scripted agent brings structured options, constraints, and evidence. Share, inspect, challenge, decide, then reflect.

The product demonstrates a cooperation design, not general artificial intelligence. The agent is explicitly labeled as a **local, deterministic simulation**. Every visitor can complete the experience without an account, API key, or external AI service.

## Mission flow

1. **The perfect detour** — Plan an afternoon. You know the traveler’s energy, atmosphere preference, and budget; the agent holds routes, prices, crowds, and opening hours.
2. **Make room for everyone** — Create a community event. You know access needs and participation preferences; the agent holds venue, budget, and format constraints.
3. **Beyond the headline** — Evaluate a kiosk pilot. You observed uncounted assistance and excluded customers; the agent holds an incomplete dataset and better trial options.
4. **Human × AI Team Report** — Review aggregate behavior signals, decisions, rationales, and reflections. Download a portable Markdown report and try a different approach.

Each round includes human-only context cards, inspectable agent evidence, an assumption challenge, three meaningful decisions, a rationale, confidence, and feedback. Scenarios and facts are fictional.

## Adaptive memory

Between rounds, choose **balanced**, **concise**, **evidence-first**, or **questions-first** assistance. The next agent response changes accordingly. The agent changes its recommendation once all three context cards are shared; before that it acknowledges the partial information and remains provisional.

Reflections and the selected style persist in browser local storage. Free-text reflections are displayed as reminders; they are **not semantically interpreted**. V1 adapts its interaction policy rather than training a model. Reloading preserves decisions and active mission work. Reset clears the local session. Invalid stored data is rejected and scores are recomputed when restoring.

## Scoring, transparently

Scores are authored learning signals, **not validated psychological measurements**. They reflect visible in-app actions, not personality, real-world ability, or proof of comprehension.

| Signal | Formula |
| --- | --- |
| Calibrated trust | 20 per inspected evidence card + 40 for challenging an assumption; subtract 20 for confidence above 80 with fewer than two cards inspected; clamp 0–100 |
| Communication | Up to 75 for sharing three context cards + 25 for a rationale of at least 20 characters |
| Complementarity | 40% context sharing + 30% evidence inspection + 30% scenario fit |
| Task efficiency | 70% scenario fit + 30 when at least two context and evidence cards are used, otherwise +15 |

Scenario fit is authored against each fictional brief. Efficiency is a useful-process proxy, **not a reading-speed test**. Agreement with the agent alone does not earn trust. Opening cards does not establish understanding; rationale quality is not evaluated. Final metrics are arithmetic means across missions.

## Architecture

- **Next.js App Router + TypeScript + React**.
- Semantic HTML, custom responsive CSS, and Lucide icons; no UI framework or backend required.
- `src/lib/missions.ts`: typed scenarios, deterministic response policy, score calculation, and validated persistence.
- `src/components/colab.tsx`: landing page, mission workspace, reflection flow, and downloadable report.
- `src/app/`: metadata, icon, root page, and design system.
- `tests/`: scoring/persistence unit tests and desktop/mobile browser journeys.
- `.github/workflows/ci.yml`: type checking, tests, production build, and browser journey verification.

All scenario data ships to the browser. Information separation is a gameplay mechanic, not a security boundary. No database, credentials, or server-side model is involved. Local storage belongs to this origin and browser; cross-device sync and multi-tab conflict handling are not provided. Google Fonts are optional progressive enhancement with system-font fallbacks; they do not block rendering or builds.

## Local setup

Requires Node.js 22 or newer and npm.

```sh
git clone https://github.com/jvaragentico/human-agent-colab.git
cd human-agent-colab
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). **No environment variables or API keys are required.**

```sh
npm run typecheck
npm test
npm run build
npm start
```

Browser tests against a production build:

```sh
npx playwright install chromium
npm run test:e2e
```

To test an existing deployment, set `PLAYWRIGHT_BASE_URL` to its HTTPS URL before running `npm run test:e2e`. Test sessions write only into their isolated browser storage.

## Deployment on Vercel

Import this GitHub repository into Vercel. Use the **Next.js** preset, repository root, Node.js 22, `npm ci` for installation and `npm run build` for the build. Keep the framework’s default output directory. No environment configuration is needed. The Git integration can deploy `main` to production and create previews for pull requests.

Vercel deployment documentation: [Git-connected projects](https://vercel.com/docs/git/vercel-for-github).

## Accessibility and mobile experience

Responsive layouts collapse to a single-column workspace on small screens. Controls have accessible labels, visible keyboard focus, native radio groups and evidence disclosures. Progress is not conveyed by color alone. The interface supports reduced motion and does not impose timed decisions. A keyboard-accessible reset dialog prevents accidental progress loss. Body text and touch targets are designed for phones as well as desktop browsers.

## Roadmap

- Add optional server-side model adapters with strict scenario boundaries, while retaining the local demo.
- Analyze rationales against a transparent rubric, with explicit limitations and opt-in consent.
- Broaden scenarios and support multiple valid solutions and user-authored priorities.
- Add localization, richer accessibility audits, and report comparison.
- Test whether collaboration signals predict useful behavior with real participants before making research claims.
- Offer opt-in account sync only if it adds value; keep anonymous play available.

## Privacy and limitations

No analytics or tracking SDK is included. Session choices and notes remain in local storage until reset or browser data is cleared. Downloaded reports are created locally; external GitHub links and optional Google Fonts requests use their respective services. Do not enter sensitive information into reflections, especially on a shared device. This is a learning prototype, not advice or a validated assessment.
