# Skills

**This is the BASE repository for shared agent skills.**

This directory contains the source of truth for AI agent skills that are synced to consumer repositories via git subtree.

## Installed Skills

### Frontend Skills

#### `frontend/code-standards`

**Source:** [alexandrebenkendorf/agents-playbooks](https://github.com/alexandrebenkendorf/agents-playbooks)  
**Local:** [SKILL.md](frontend/code-standards/SKILL.md) | [README.md](frontend/code-standards/README.md)

Comprehensive coding standards covering:

- General coding standards
- TypeScript best practices and naming conventions
- Clean code principles and SOLID principles
- Clean architecture and DDD naming
- Data structures and helper function patterns
- Performance optimization (arrays, control flow, DOM, caching)

#### `frontend/react-best-practices`

**Source:** [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (vendored, MIT)  
**Local:** [SKILL.md](frontend/react-best-practices/SKILL.md) | [README.md](frontend/react-best-practices/README.md) | [Quick Ref](frontend/react-best-practices/quick-ref/performance-top10.md)

React-specific best practices including:

- Re-rendering optimization (memo, transitions, derived state, dependencies)
- Async patterns (parallel execution, suspense, API routes)
- Bundle optimization (dynamic imports, conditional imports, barrel imports)
- Server-side patterns (caching, serialization, parallel fetching)
- Client-side patterns (event listeners, SWR, localStorage)
- Rendering optimization (hydration, content visibility, SVG)
- Advanced patterns (useLatest, event handler refs, init once)

#### `frontend/module-federation`

**Source:** [module-federation.io/ai/skill](https://module-federation.io/ai/skill) (vendored)  
**Local:** [SKILL.md](frontend/module-federation/SKILL.md) | [README.md](frontend/module-federation/README.md)

All-in-one Module Federation 2.0 skill that routes to focused sub-skills:

- Documentation lookup via `llms.txt` (fetches only relevant pages)
- Project MF context collection (bundler, role, config, artifacts)
- Integration into Rsbuild / Modern.js / Rspack / Webpack / Vite / Next.js projects
- Build config checks (plugin choice, async entry, exposes keys and paths)
- Shared dependency diagnostics (externals conflicts, transformImport, multi-version)
- Type diagnostics (`@mf-types`, DTS generation, tsconfig paths)
- Runtime-only remotes: fetching `@mf-types` via `remoteTypeUrls` + `mf dts`, incl. TLS/CA setup
- Runtime error triage (`RUNTIME-001` / `RUNTIME-008`)
- Bridge usage checks and local dev performance tuning

#### `frontend/react-component-structure`

**Source:** [alexandrebenkendorf/agents-playbooks](https://github.com/alexandrebenkendorf/agents-playbooks)  
**Local:** [SKILL.md](frontend/react-component-structure/SKILL.md) | [README.md](frontend/react-component-structure/README.md)

Guidelines for structuring React components consistently.

#### `frontend/react-testing`

**Source:** [alexandrebenkendorf/agents-playbooks](https://github.com/alexandrebenkendorf/agents-playbooks)  
**Local:** [SKILL.md](frontend/react-testing/SKILL.md) | [README.md](frontend/react-testing/README.md) | [Quick Ref](frontend/react-testing/quick-ref/testing-cheatsheet.md)

Testing best practices covering:

- New test creation patterns
- Legacy test refactoring guidelines
- Common testing patterns
- TypeScript testing conventions

### Git Skills

#### `git/commit-conventions`

**Source:** [alexandrebenkendorf/agents-playbooks](https://github.com/alexandrebenkendorf/agents-playbooks)  
**Local:** [SKILL.md](git/commit-conventions/SKILL.md) | [README.md](git/commit-conventions/README.md)

Git commit message conventions and formatting rules.

### Communication Skills

#### `communication/plain-language`

**Source:** [alexandrebenkendorf/agents-playbooks](https://github.com/alexandrebenkendorf/agents-playbooks)  
**Local:** [SKILL.md](communication/plain-language/SKILL.md)

Plain-word replies for developers:

- Short words, result first, jargon explained once
- Every caveat must carry an action (do this, decide this) or be dropped
- Asks to elaborate when the developer does not follow

### Design Skills

#### `design/awesome-design-md`

**Source:** [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (vendored, MIT)  
**Local:** [SKILL.md](design/awesome-design-md/SKILL.md)

84 brand DESIGN.md design-system references (colors, type, spacing, components) for building UI like a named site.

#### `design/web-design-guidelines`

**Source:** [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (vendored, adapted)  
**Local:** [SKILL.md](design/web-design-guidelines/SKILL.md)

Review UI code against Vercel's Web Interface Guidelines; rules vendored in `rules.md`, refreshed weekly or on demand with `update.sh`, logged in `FETCH_LOG.md`.

#### `design/design-taste-frontend`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/design-taste-frontend/SKILL.md)

Taste Skill v2 default: anti-slop art direction for marketing and public pages (not for dashboards or app screens); scripts need Node 22+ and Chrome/Edge.

#### `design/design-taste-frontend-v1`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/design-taste-frontend-v1/SKILL.md)

Taste Skill v1, legacy original.

#### `design/design-taste-frontend-v2-experimental`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/design-taste-frontend-v2-experimental/SKILL.md)

Taste Skill earlier experimental v2, single-file dial-driven version.

#### `design/gpt-taste`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/gpt-taste/SKILL.md)

Stricter taste variant tuned for GPT/Codex (GSAP motion, AIDA structure).

#### `design/redesign-existing-projects`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/redesign-existing-projects/SKILL.md)

Audit an existing site or app and upgrade it without breaking functionality.

#### `design/full-output-enforcement`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/full-output-enforcement/SKILL.md)

Complete output only: no placeholders, clean handling of token-limit splits.

#### `design/image-to-code`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/image-to-code/SKILL.md)

Generate design images first, analyze them, then implement the site to match (needs an image-generation tool).

#### `design/high-end-visual-design`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/high-end-visual-design/SKILL.md)

Style variant: high-end agency look (fonts, spacing, shadows, motion).

#### `design/minimalist-ui`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/minimalist-ui/SKILL.md)

Style variant: clean editorial, warm monochrome, flat bento grids.

#### `design/industrial-brutalist-ui`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/industrial-brutalist-ui/SKILL.md)

Style variant: Swiss print meets military terminal, rigid grids.

#### `design/stitch-design-taste`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/stitch-design-taste/SKILL.md)

Google Stitch-compatible rules with a DESIGN.md export.

#### `design/imagegen-frontend-web`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/imagegen-frontend-web/SKILL.md)

Image generation: one design reference image per web section; images only, no code.

#### `design/imagegen-frontend-mobile`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/imagegen-frontend-mobile/SKILL.md)

Image generation: premium mobile app screen concepts; images only, no code.

#### `design/brandkit`

**Source:** [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (vendored, MIT)  
**Local:** [SKILL.md](design/brandkit/SKILL.md)

Image generation: brand-guidelines boards and logo systems.

### Tooling Skills

#### `tooling/playwright-cli`

**Source:** [microsoft/playwright](https://playwright.dev/agent-cli/introduction) (copied from the `@playwright/cli` package)  
**Local:** [SKILL.md](tooling/playwright-cli/SKILL.md)

Drive a real browser to see the app (open, snapshot, screenshot, click through); needs `npm i -g @playwright/cli` and `playwright-cli install-browser`.

### Engineering Skills

#### `engineering/ask-matt`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/ask-matt/SKILL.md)

Ask which skill or flow fits your situation; a router over the engineering skills.

#### `engineering/diagnosing-bugs`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/diagnosing-bugs/SKILL.md)

Diagnosis loop for hard bugs and performance regressions.

#### `engineering/grill-with-docs`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/grill-with-docs/SKILL.md)

A relentless interview to sharpen a plan or design, which also creates docs (ADRs and a glossary) as it goes.

#### `engineering/triage`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/triage/SKILL.md)

Move issues and external PRs through a state machine of triage roles: categorise, verify, grill if needed, write agent-ready briefs.

#### `engineering/improve-codebase-architecture`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/improve-codebase-architecture/SKILL.md)

Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.

#### `engineering/setup-matt-pocock-skills`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/setup-matt-pocock-skills/SKILL.md)

Configure a repo for the engineering skills: issue tracker, triage label vocabulary, domain doc layout. Run once before the other engineering skills.

#### `engineering/tdd`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/tdd/SKILL.md)

Test-driven development: red-green-refactor, what a good test is, where tests go, mocking guidelines.

#### `engineering/to-spec`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/to-spec/SKILL.md)

Turn the current conversation into a spec and publish it to the project issue tracker; synthesis only, no interview.

#### `engineering/to-tickets`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/to-tickets/SKILL.md)

Break a plan, spec, or conversation into tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker.

#### `engineering/wayfinder`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/wayfinder/SKILL.md)

Plan work too large for one agent session as a shared map of decision tickets, resolved one at a time.

#### `engineering/implement`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/implement/SKILL.md)

Implement a piece of work based on a spec or set of tickets.

#### `engineering/implement-spec`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/implement-spec/SKILL.md)

Implement the result of `to-spec` and `to-tickets` in code.

#### `engineering/prototype`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/prototype/SKILL.md)

Build a throwaway prototype to answer a design question: sanity-check a state model, logic, or what a UI should look like.

#### `engineering/research`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/research/SKILL.md)

Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo.

#### `engineering/domain-modeling`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/domain-modeling/SKILL.md)

Build and sharpen a project's domain model: codebase terminology, `GLOSSARY.md`, ADRs.

#### `engineering/codebase-design`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/codebase-design/SKILL.md)

Shared vocabulary for designing deep modules: interfaces, deepening opportunities, seams, testability.

#### `engineering/code-review`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/code-review/SKILL.md)

Review changes since a fixed point along two axes (repo standards, originating spec), via parallel sub-agent reviews reported side by side.

#### `engineering/pr`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/pr/SKILL.md)

Write a PR body.

#### `engineering/retro`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/retro/SKILL.md)

Conduct a retrospective on a coding session.

#### `engineering/wizard`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](engineering/wizard/SKILL.md)

Generate an interactive bash wizard that walks a human through steps only they can perform (infra provisioning, credentials, third-party dashboards, one-off migrations).

### Productivity Skills

#### `productivity/grill-me`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](productivity/grill-me/SKILL.md)

A relentless interview to sharpen a plan or design.

#### `productivity/grilling`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](productivity/grilling/SKILL.md)

Grill the user relentlessly about a plan, decision, or idea; stress-tests their thinking.

#### `productivity/handoff`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](productivity/handoff/SKILL.md)

Compact the current conversation into a handoff document for another agent to pick up.

#### `productivity/teach`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](productivity/teach/SKILL.md)

Teach the user a new skill or concept, within the workspace.

#### `productivity/to-questionnaire`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](productivity/to-questionnaire/SKILL.md)

Turn a decision you can't fully answer into a questionnaire for someone else to fill in.

#### `productivity/wait-what`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](productivity/wait-what/SKILL.md)

Stop and re-pitch a message that didn't land.

#### `productivity/writing-for-agents`

**Source:** [mattpocock/skills](https://github.com/mattpocock/skills) (vendored, MIT)  
**Local:** [SKILL.md](productivity/writing-for-agents/SKILL.md)

Writing documents for agents; use when creating or editing skills, `AGENTS.md`, or `CLAUDE.md`.

---

## For Consumer Projects

Consumer repositories sync these skills via git subtree into `.agents/agents-playbooks/skills/`.

**Precedence in consumer repos:**

1. `/AGENTS.md`
2. `/.agents/local/skills/*` (consumer overrides)
3. `/.agents/agents-playbooks/skills/*` (from this repo)
4. Existing code and comments

If instructions conflict, follow the higher-precedence source.

📖 **Full documentation:** [../README.md](../README.md)
