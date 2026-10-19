# Agent Skills Playbook

---

## 🚨 FOR AI AGENTS - READ THIS FIRST 🚨

**If a user asked to "read and use" or "integrate" this repository:**

👉 **[READ THE INTEGRATION INSTRUCTIONS](AI-AGENT-INTEGRATION.md)** 👈

Then scroll down to "AI Agent Commands" section below for the actual commands.

---

Reusable AI agent skills for modern frontend development with React, TypeScript, and Clean Architecture.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📁 Skills Catalog

### Frontend

#### Framework-Agnostic

**[`frontend/code-standards`](./skills/frontend/code-standards/)**

- Naming conventions (React, TypeScript, DDD)
- General coding standards (functions, control flow, DRY)
- TypeScript best practices (type safety, inference, interface vs type)
- Clean Code principles (meaningful names, exceptions, small functions)
- SOLID principles (SRP, OCP, LSP, ISP, DIP)
- Clean Architecture (layers, entities, use cases, adapters)
- JavaScript performance patterns (DOM, caching, data structures, arrays)
- Helper function patterns (formatters, validators, parsers, guards)

#### React

**[`frontend/react-best-practices`](./skills/frontend/react-best-practices/)**  
Vendored from [Vercel Labs agent-skills](https://github.com/vercel-labs/agent-skills)

- 57 performance optimization rules across 8 categories
- Eliminating waterfalls (async patterns, Suspense)
- Bundle size optimization (dynamic imports, tree-shaking)
- Server-side performance (caching, parallel fetching)
- Re-render optimization (memo, state management)

**[`frontend/react-component-structure`](./skills/frontend/react-component-structure/)**

- Function declarations vs const (avoid React.FC)
- Single Responsibility Principle for components
- File organization patterns
- When to extract helpers vs keep inline
- Anti-patterns (god components, mixing concerns)

**[`frontend/react-testing`](./skills/frontend/react-testing/)**

- Vitest + React Testing Library patterns
- Creating new tests (AAA pattern, it.each)
- Legacy refactoring (Sinon → Vitest migration)
- TypeScript testing patterns
- Common patterns and quick reference

#### Module Federation

**[`frontend/module-federation`](./skills/frontend/module-federation/)**  
Vendored from the official [Module Federation `mf` skill](https://module-federation.io/ai/skill)

- Docs lookup that fetches only the relevant pages (no full-doc dumps)
- Project context detection (bundler, MF role, config, build artifacts)
- Integration into Rsbuild / Modern.js / Rspack / Webpack / Vite / Next.js
- Config, shared dependency, type, and Bridge diagnostics
- Runtime-only remotes: fetching `@mf-types` via `remoteTypeUrls` + `mf dts`
- Runtime error triage (`RUNTIME-001` / `RUNTIME-008`)

### Git

**[`git/commit-conventions`](./skills/git/commit-conventions/)**

- Conventional commit format with Jira tickets
- Generic `<PREFIX>-<number>` format (configurable per project)
- Atomic commit guidance
- AI assistant workflow

### Communication

**[`communication/plain-language`](./skills/communication/plain-language/)**

- Plain words, result first, jargon explained once
- Every caveat comes with an action or is removed
- Offers to elaborate when the developer does not follow

### Design

**[`design/awesome-design-md`](./skills/design/awesome-design-md/)**

- 84 brand DESIGN.md design-system references (colors, type, spacing, components) for building UI like a named site

**[`design/web-design-guidelines`](./skills/design/web-design-guidelines/)**

- Review UI code against Vercel's Web Interface Guidelines; rules vendored in `rules.md`, refreshed weekly or on demand with `update.sh`, logged in `FETCH_LOG.md`

**[`design/design-taste-frontend`](./skills/design/design-taste-frontend/)**

- Taste Skill v2 default: anti-slop art direction for marketing and public pages (not for dashboards or app screens); scripts need Node 22+ and Chrome/Edge

**[`design/design-taste-frontend-v1`](./skills/design/design-taste-frontend-v1/)**

- Taste Skill v1, legacy original

**[`design/design-taste-frontend-v2-experimental`](./skills/design/design-taste-frontend-v2-experimental/)**

- Taste Skill earlier experimental v2, single-file dial-driven version

**[`design/gpt-taste`](./skills/design/gpt-taste/)**

- Stricter taste variant tuned for GPT/Codex (GSAP motion, AIDA structure)

**[`design/redesign-existing-projects`](./skills/design/redesign-existing-projects/)**

- Audit an existing site or app and upgrade it without breaking functionality

**[`design/full-output-enforcement`](./skills/design/full-output-enforcement/)**

- Complete output only: no placeholders, clean handling of token-limit splits

**[`design/image-to-code`](./skills/design/image-to-code/)**

- Generate design images first, analyze them, then implement the site to match (needs an image-generation tool)

**[`design/high-end-visual-design`](./skills/design/high-end-visual-design/)**

- Style variant: high-end agency look (fonts, spacing, shadows, motion)

**[`design/minimalist-ui`](./skills/design/minimalist-ui/)**

- Style variant: clean editorial, warm monochrome, flat bento grids

**[`design/industrial-brutalist-ui`](./skills/design/industrial-brutalist-ui/)**

- Style variant: Swiss print meets military terminal, rigid grids

**[`design/stitch-design-taste`](./skills/design/stitch-design-taste/)**

- Google Stitch-compatible rules with a DESIGN.md export

**[`design/imagegen-frontend-web`](./skills/design/imagegen-frontend-web/)**

- Image generation: one design reference image per web section; images only, no code

**[`design/imagegen-frontend-mobile`](./skills/design/imagegen-frontend-mobile/)**

- Image generation: premium mobile app screen concepts; images only, no code

**[`design/brandkit`](./skills/design/brandkit/)**

- Image generation: brand-guidelines boards and logo systems

### Tooling

**[`tooling/playwright-cli`](./skills/tooling/playwright-cli/)**

- Drive a real browser to see the app (open, snapshot, screenshot, click through); needs `npm i -g @playwright/cli` and `playwright-cli install-browser`

### Engineering

Vendored from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT)

**[`engineering/ask-matt`](./skills/engineering/ask-matt/)**

- Router over the engineering skills: asks which skill or flow fits your situation

**[`engineering/diagnosing-bugs`](./skills/engineering/diagnosing-bugs/)**

- Diagnosis loop for hard bugs and performance regressions

**[`engineering/grill-with-docs`](./skills/engineering/grill-with-docs/)**

- Relentless interview to sharpen a plan or design, creating ADRs and a glossary as it goes

**[`engineering/triage`](./skills/engineering/triage/)**

- State machine for issues and external PRs: categorise, verify, grill if needed, write agent-ready briefs

**[`engineering/improve-codebase-architecture`](./skills/engineering/improve-codebase-architecture/)**

- Scan a codebase for deepening opportunities, present as a visual HTML report, then grill through one

**[`engineering/setup-matt-pocock-skills`](./skills/engineering/setup-matt-pocock-skills/)**

- One-time setup: issue tracker, triage label vocabulary, domain doc layout for the other engineering skills

**[`engineering/tdd`](./skills/engineering/tdd/)**

- Test-driven development: red-green-refactor, what a good test is, where tests go, mocking guidelines

**[`engineering/to-spec`](./skills/engineering/to-spec/)**

- Turn the current conversation into a spec and publish it to the project issue tracker

**[`engineering/to-tickets`](./skills/engineering/to-tickets/)**

- Break a plan, spec, or conversation into tracer-bullet tickets with blocking edges, published to the tracker

**[`engineering/wayfinder`](./skills/engineering/wayfinder/)**

- Plan work too large for one agent session as a shared map of decision tickets, resolved one at a time

**[`engineering/implement`](./skills/engineering/implement/)**

- Implement a piece of work based on a spec or set of tickets

**[`engineering/implement-spec`](./skills/engineering/implement-spec/)**

- Implement the result of `to-spec` and `to-tickets` in code

**[`engineering/prototype`](./skills/engineering/prototype/)**

- Build a throwaway prototype to sanity-check a state model, logic, or UI direction

**[`engineering/research`](./skills/engineering/research/)**

- Investigate a question against high-trust primary sources, captured as a Markdown file in the repo

**[`engineering/domain-modeling`](./skills/engineering/domain-modeling/)**

- Build and sharpen a project's domain model: terminology, `GLOSSARY.md`, ADRs

**[`engineering/codebase-design`](./skills/engineering/codebase-design/)**

- Shared vocabulary for designing deep modules: interfaces, deepening opportunities, seams, testability

**[`engineering/code-review`](./skills/engineering/code-review/)**

- Review changes since a fixed point along two axes (repo standards, originating spec) via parallel sub-agent reviews

**[`engineering/pr`](./skills/engineering/pr/)**

- Write a PR body

**[`engineering/retro`](./skills/engineering/retro/)**

- Conduct a retrospective on a coding session

**[`engineering/wizard`](./skills/engineering/wizard/)**

- Generate an interactive bash wizard for steps only a human can perform (infra, credentials, dashboards, cutovers)

### Productivity

Vendored from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT)

**[`productivity/grill-me`](./skills/productivity/grill-me/)**

- Relentless interview to sharpen a plan or design

**[`productivity/grilling`](./skills/productivity/grilling/)**

- Grill the user relentlessly about a plan, decision, or idea to stress-test their thinking

**[`productivity/handoff`](./skills/productivity/handoff/)**

- Compact the current conversation into a handoff document for another agent to pick up

**[`productivity/teach`](./skills/productivity/teach/)**

- Teach the user a new skill or concept, within the workspace

**[`productivity/to-questionnaire`](./skills/productivity/to-questionnaire/)**

- Turn a decision you can't fully answer into a questionnaire for someone else to fill in

**[`productivity/wait-what`](./skills/productivity/wait-what/)**

- Stop and re-pitch a message that didn't land

**[`productivity/writing-for-agents`](./skills/productivity/writing-for-agents/)**

- Writing documents for agents: creating or editing skills, `AGENTS.md`, or `CLAUDE.md`

---

## 🤖 AI Agent Commands

**Only proceed here AFTER the user responded with 1 or 2 above.**

**⚠️ IMPORTANT: First check if `.agents/` folder exists. If not, run: `mkdir -p .agents`**

### If user chose 1 (Git Subtree):

```bash
# First ensure .agents exists (check first!)
[ ! -d .agents ] && mkdir -p .agents

# Then add subtree
git subtree add --prefix=.agents/agents-playbooks https://github.com/alexandrebenkendorf/agents-playbooks.git main --squash
# If AGENTS.md/DEVELOPMENT.md do not exist, copy them.
# If they already exist, replace with base versions and reapply your project-specific customizations.
cp .agents/agents-playbooks/AGENTS.md ./AGENTS.md
cp .agents/agents-playbooks/DEVELOPMENT.md ./DEVELOPMENT.md
```

**Then stop. Do NOT commit.** Say: "✅ Setup complete. You can now customize AGENTS.md and DEVELOPMENT.md, then commit when ready."

### If user chose 2 (Simple Clone):

```bash
# First ensure .agents exists (check first!)
[ ! -d .agents ] && mkdir -p .agents

# Then clone
git clone https://github.com/alexandrebenkendorf/agents-playbooks.git .agents/agents-playbooks
rm -rf .agents/agents-playbooks/.git
# If AGENTS.md/DEVELOPMENT.md do not exist, copy them.
# If they already exist, replace with base versions and reapply your project-specific customizations.
cp .agents/agents-playbooks/AGENTS.md ./AGENTS.md
cp .agents/agents-playbooks/DEVELOPMENT.md ./DEVELOPMENT.md
```

**Then stop. Do NOT commit.** Say: "✅ Setup complete. You can now customize the files, then commit when ready."

### After Integration Checklist (Both Methods)

1. Ensure `AGENTS.md` and `DEVELOPMENT.md` are customized for this project.
1. If `.agents/README.md` exists, update it with the integration instructions and catalog from this README.
1. If `.agents/README.md` does not exist, create it with the catalog and update instructions.

---

## 🚀 Usage

### For Consumer Projects

This repository is the **base source** for shared agent skills and does **not** contain a `.agents/` folder.
You only create `.agents/` when **integrating this playbook into another project** (see options below).
Consumer projects can integrate these skills using one of two approaches:

#### Option 1: Git Subtree (Recommended for Production)

**Best for:** Long-term projects that want automatic updates and contribution workflow.

Add this repository to your project:

```bash
# Step 1: Ensure .agents directory exists
mkdir -p .agents

# Step 2: Add as subtree
git subtree add --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbooks.git main --squash

# Step 3: Copy base files to project root
cp .agents/agents-playbooks/AGENTS.md ./AGENTS.md
cp .agents/agents-playbooks/DEVELOPMENT.md ./DEVELOPMENT.md
```

**Update skills:**

```bash
git subtree pull --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbooks.git main --squash
```

⚠️ **Never edit `.agents/agents-playbooks/` directly** - it's managed by subtree.

#### Option 2: Simple Clone (Quick Start)

**Best for:** Prototypes, experiments, or projects that want full customization without subtree complexity.

```bash
# Step 1: Ensure .agents directory exists
mkdir -p .agents

# Step 2: Clone into .agents directory
git clone https://github.com/alexandrebenkendorf/agents-playbooks.git .agents/agents-playbooks

# Step 3: Remove git tracking (treat as vendored code)
rm -rf .agents/agents-playbooks/.git

# Step 4: Copy base files to project root
cp .agents/agents-playbooks/AGENTS.md ./AGENTS.md
cp .agents/agents-playbooks/DEVELOPMENT.md ./DEVELOPMENT.md
```

✅ **Done!** You can now customize the files and commit when ready.

**Trade-offs:**

- ✅ Simpler initial setup
- ✅ Full ownership - edit skills directly
- ✅ No subtree complexity
- ❌ Manual updates (re-clone or copy files)
- ❌ No automatic upstream sync
- ❌ Harder to contribute back

**Update skills (manual):**

```bash
# Backup your customizations
cp -r .agents/agents-playbooks .agents/agents-playbooks.backup

# Re-clone latest
rm -rf .agents/agents-playbooks
git clone https://github.com/alexandrebenkendorf/agents-playbooks.git .agents/agents-playbooks
rm -rf .agents/agents-playbooks/.git

# Merge your customizations
# (manually compare .agents/agents-playbooks.backup with new clone)
```

#### Comparison

| Feature               | Git Subtree                       | Simple Clone                 |
| --------------------- | --------------------------------- | ---------------------------- |
| **Setup**             | Complex                           | Simple                       |
| **Updates**           | Automatic merge                   | Manual copy                  |
| **Customization**     | `.agents/local/skills/` overrides | Direct editing               |
| **Contributing back** | Structured workflow               | Manual PR                    |
| **Best for**          | Production, team projects         | Prototypes, solo experiments |

Choose **git subtree** if you want to stay synced with upstream and contribute improvements.  
Choose **simple clone** if you want full control and don't need automatic updates.

#### Migrating from Simple Clone to Git Subtree

Since both options use the same `.agents/agents-playbooks/` structure, migration is seamless:

```bash
# You already have the right structure!
# Just ensure no .git folder (should already be removed)
rm -rf .agents/agents-playbooks/.git

# Commit current state if not already committed
git add .agents/
git commit -m "chore: Current state of agents-playbooks"

# From now on, use subtree pull for updates
git subtree pull --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbooks.git main --squash
```

**No deletion or re-setup needed** - the directory structure is already production-ready. You're simply switching from manual updates to git subtree updates.

#### Consumer Project Structure

**Git Subtree Structure:**

```
your-project/
├── .agents/
│   ├── agents-playbooks/    # Synced from this repo (read-only)
│   │   ├── skills/
│   │   └── templates/
│   ├── local/                # Your overrides (optional)
│   │   └── skills/
│   └── README.md             # Your project config
├── AGENTS.md                 # Copied & customized
└── DEVELOPMENT.md            # Copied & customized
```

**Simple Clone Structure:**

```
your-project/
├── .agents/
│   └── agents-playbooks/    # Vendored (edit directly)
│       ├── skills/
│       └── templates/
├── AGENTS.md                 # Copied & customized
└── DEVELOPMENT.md            # Copied & customized
```

**Benefits:**

- ✅ Automatic updates via subtree pull (Option 1)
- ✅ Safe local overrides in `.agents/local/skills/` (Option 1)
- ✅ Explicit promotion workflow (Option 1)
- ✅ No git submodule complexity
- ✅ Simple vendoring for full control (Option 2)

📖 **Full documentation:** See [README.md](./README.md)

---

## ⚙️ Configuration

### Consumer Project Setup

Create `README.md` in your project with configuration:

````markdown
# Project Agent Skills

Base skills synced from: [agents-playbook](https://github.com/alexandrebenkendorf/agents-playbook)

## Configuration

- **Jira Ticket Prefix**: `PROJ` (Your Project)
- **Branch Format**: `PROJ-<number>-description`
- **Framework**: React + TypeScript

## Updating Base Skills

```bash
git subtree pull --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbooks.git main --squash

# Review base file changes
cp .agents/agents-playbooks/AGENTS.md ./AGENTS.md
cp .agents/agents-playbooks/DEVELOPMENT.md ./DEVELOPMENT.md
# Reapply your customizations
```

## Local Overrides

To customize a skill:

```bash
# Copy from base to local
cp -r .agents/agents-playbooks/skills/frontend/react-testing \
      .agents/local/skills/frontend/react-testing

# Edit in .agents/local/skills/ - AI agents will use your version
```

## Promoting Local Skills

1. Fork https://github.com/alexandrebenkendorf/agents-playbook
2. Copy from `.agents/local/skills/` to fork's `skills/`
3. Open PR to agents-playbook
4. After merge: `git subtree pull ...`
5. Remove local override
````

Update `AGENTS.md` in your project (copied from base):

```markdown
## Order of precedence

1. `/AGENTS.md`
2. `/.agents/local/skills/*` (your overrides)
3. `/.agents/agents-playbooks/skills/*` (base)
4. Existing code and comments

If instructions conflict, follow the higher-precedence source.
```

### Consumer `.agents/README.md`

If `.agents/README.md` exists, update it with the integration instructions and catalog from this README. If it does not exist, create it with the catalog and update instructions.

Recommended contents:

1. Integration method used (subtree or clone) and the update command.
1. Skills catalog copied from `.agents/agents-playbooks/README.md` with links updated to `.agents/agents-playbooks/skills/...`.
1. Local overrides guidance for `.agents/local/skills/`.

---

## 📚 Skills Structure

Each skill follows a consistent structure optimized for AI agents:

```
skill-name/
├── README.md      # Human-friendly overview and usage guide
├── SKILL.md       # Quick reference for AI agents
├── AGENTS.md      # Compiled documentation (if using rules/)
├── metadata.json  # Version, abstract, references (optional)
└── rules/         # Individual rule files (optional)
    ├── _sections.md    # Section definitions
    ├── _template.md    # Rule template
    └── area-rule.md    # Individual rules
```

### Templates

Templates for creating new skills and rules are in `templates/`:

- **`templates/_template.md`** - Rule structure with examples
- **`templates/_sections.md`** - Section organization guide

Use these templates to maintain consistency across all skills.

### Creating a New Skill

1. **Create skill directory:**

   ```bash
   mkdir -p skills/<category>/<skill-name>
   ```

2. **Add core files:**
   - `README.md` - Human-friendly overview
   - `SKILL.md` - Quick reference with frontmatter

3. **For multi-rule skills, add rules directory:**

   ```bash
   mkdir skills/<category>/<skill-name>/rules
   cp templates/_template.md skills/<category>/<skill-name>/rules/
   cp templates/_sections.md skills/<category>/<skill-name>/rules/
   ```

4. **Create rules following the template:**
   - Use section prefixes from `_sections.md`
   - Follow the structure in `_template.md`
   - Include clear examples and impact levels

**SKILL.md frontmatter:**

```yaml
---
name: skill-name
description: Brief description
---
```

`name` must be lowercase letters, numbers, and hyphens only, and must match the skill's folder name exactly.
Use `description` for the human-readable summary.

---

## 🤝 Contributing

### Adding a New Skill (Base Repository)

This repository is the source of truth for shared skills.

1. Create skill directory: `skills/category/skill-name/`
2. Add `SKILL.md` and `README.md`
3. For large skills, use `rules/` directory
4. Update this README and `skills/README.md`
5. Test with a real project
6. Document in CHANGELOG.md

### Contributing from Consumer Projects

If you developed a useful skill in a consumer project's `.agents/local/skills/`:

1. **Fork this repository**
2. **Copy skill** from your `.agents/local/skills/` to fork's `skills/`
3. **Generalize** - remove project-specific references
4. **Test thoroughly**
5. **Open PR** with clear description
6. **After merge**, update your subtree and remove local override

### Updating Existing Skills

1. Make changes in `skills/`
2. Test with AI assistant
3. Update version/changelog if significant
4. Document changes in commit message

### Guidelines

- ✅ Keep skills **framework-agnostic** when possible
- ✅ Use **concrete examples** (code samples)
- ✅ Include **anti-patterns** (what NOT to do)
- ✅ Link to **authoritative sources** for deeper learning
- ✅ Keep files **focused and modular** (token efficiency)
- ✅ **No consumer-specific config** (keep generic)
- ❌ Don't mix framework-specific patterns in generic skills
- ❌ Don't create overly generic skills (be specific and actionable)
- ❌ Don't commit secrets or project-specific tokens

---

## 📖 Skill Breakdown

| Skill                                            | Files      | Lines  | Token-Optimized?               |
| ------------------------------------------------ | ---------- | ------ | ------------------------------ |
| **frontend/code-standards**                      | 16 files   | ~2,500 | ✅ Yes (modular by topic)      |
| **frontend/module-federation**                   | 19 files   | ~1,900 | ✅ Yes (on-demand sub-skills)  |
| **frontend/react-best-practices**                | 47 files   | ~3,000 | ✅ Yes (vendored, modular)     |
| **frontend/react-component-structure**           | 1 file     | ~300   | ✅ Yes (focused single file)   |
| **frontend/react-testing**                       | 4 files    | ~800   | ✅ Yes (task-specific routing) |
| **git/commit-conventions**                       | 1 file     | ~200   | ✅ Yes (focused single file)   |
| **communication/plain-language**                 | 1 file     | ~70    | ✅ Yes (focused single file)   |
| **design/awesome-design-md**                     | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/web-design-guidelines**                 | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/design-taste-frontend**                 | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/design-taste-frontend-v1**              | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/design-taste-frontend-v2-experimental** | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/gpt-taste**                             | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/redesign-existing-projects**            | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/full-output-enforcement**               | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/image-to-code**                         | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/high-end-visual-design**                | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/minimalist-ui**                         | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/industrial-brutalist-ui**               | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/stitch-design-taste**                   | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/imagegen-frontend-web**                 | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/imagegen-frontend-mobile**              | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **design/brandkit**                              | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **tooling/playwright-cli**                       | see folder | n/a    | ✅ Yes (loaded on demand)      |
| **engineering/ask-matt**                         | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/diagnosing-bugs**                  | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/grill-with-docs**                  | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/triage**                            | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/improve-codebase-architecture**    | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/setup-matt-pocock-skills**         | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/tdd**                               | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/to-spec**                          | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/to-tickets**                       | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/wayfinder**                        | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/implement**                        | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/implement-spec**                   | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/prototype**                        | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/research**                         | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/domain-modeling**                  | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/codebase-design**                  | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/code-review**                      | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/pr**                                | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/retro**                            | see folder | n/a    | ✅ Yes (vendored)              |
| **engineering/wizard**                           | see folder | n/a    | ✅ Yes (vendored)              |
| **productivity/grill-me**                        | see folder | n/a    | ✅ Yes (vendored)              |
| **productivity/grilling**                        | see folder | n/a    | ✅ Yes (vendored)              |
| **productivity/handoff**                         | see folder | n/a    | ✅ Yes (vendored)              |
| **productivity/teach**                           | see folder | n/a    | ✅ Yes (vendored)              |
| **productivity/to-questionnaire**                | see folder | n/a    | ✅ Yes (vendored)              |
| **productivity/wait-what**                       | see folder | n/a    | ✅ Yes (vendored)              |
| **productivity/writing-for-agents**              | see folder | n/a    | ✅ Yes (vendored)              |

---

## 🔄 Version History

### v1.0.0 (Initial Release)

- Frontend code standards (TypeScript, Clean Code, SOLID, Clean Architecture)
- React best practices (vendored from Vercel Labs)
- React component structure
- React testing (Vitest + RTL)
- Git commit conventions (generic Jira format)

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Vercel Labs agent-skills](https://github.com/vercel-labs/agent-skills) - React best practices patterns
- [Matt Pocock / mattpocock/skills](https://github.com/mattpocock/skills) - Engineering and productivity skills (TDD, code review, spec/ticket flows, domain modeling, grilling, and more)
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) - Robert C. Martin
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID) - Robert C. Martin
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Robert C. Martin

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/alexandrebenkendorf/agents-playbook/issues)
- **Discussions**: [GitHub Discussions](https://github.com/alexandrebenkendorf/agents-playbook/discussions)
