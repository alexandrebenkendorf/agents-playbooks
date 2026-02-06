# .agents Directory

**This is the BASE repository for shared agent skills.**

Operational documentation for AI agent skills and playbooks.

---

## Overview

This repository (`agents-playbook`) is the **centralized base** for reusable AI agent skills. Consumer repositories sync this content using **git subtree**.

### Architecture

- **This repository** = Source of truth for shared skills
- **Consumer repositories** = Pull skills from here via subtree into `.agents/agents-playbooks/`
- **Consumer `.agents/local/`** = Repository-specific overrides (takes precedence)

---

## Directory Structure (This Repo)

```
.agents/
├── skills/           # Shared skills (testing, git, frontend, etc.)
│   ├── frontend/
│   ├── git/
│   └── ...
├── templates/        # Shared templates
└── README.md         # This file
```

---

## For Consumer Repositories

### Initial Setup

**Add this base repository to your project:**

```bash
git subtree add --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbook.git main --squash
```

This creates `.agents/agents-playbooks/` in your repo with all skills.

**Copy base files for your project:**
```bash
# Core documentation for human developers
cp .agents/agents-playbooks/DEVELOPMENT.md ./DEVELOPMENT.md

# Agent rules and precedence
cp .agents/agents-playbooks/AGENTS.md ./AGENTS.md

# Customize both with your project specifics
```

### Update Base Content

Pull latest changes from this repository:

```bash
git subtree pull --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbook.git main --squash
```

⚠️ **Warning:** This overwrites `.agents/agents-playbooks/`. Never edit that directory directly in consumer repos.

### Consumer Directory Structure

After subtree setup, consumer repos should have:

```
.agents/
├── agents-playbooks/     # Synced from THIS repo (read-only)
│   ├── skills/
│   ├── templates/
│   ├── AGENTS.md         # Base agent rules
│   └── DEVELOPMENT.md    # Base dev guide
├── local/                # Consumer-specific overrides (optional)
│   └── .gitkeep
└── README.md             # Consumer's config/documentation

AGENTS.md                 # Copied & customized from base
DEVELOPMENT.md            # Copied & customized from base
```

**Recommended:** Copy both `AGENTS.md` and `DEVELOPMENT.md` to your project root:
```bash
cp .agents/agents-playbooks/AGENTS.md ./AGENTS.md
cp .agents/agents-playbooks/DEVELOPMENT.md ./DEVELOPMENT.md
```
Customize with project-specific details while keeping the core patterns.

---

## Precedence Rules (Consumer Repos)

When an AI agent in a consumer repo looks for a skill:

1. **Check `.agents/local/`** first (consumer-specific)
2. **Fall back to `.agents/agents-playbooks/`** (from this repo)

This allows:
- ✅ Local customization without forking
- ✅ Safe experimentation
- ✅ Explicit promotion path (local → base → subtree)

---

## Local Overrides (Consumer Repos)

### When to Use Local

Consumer repos can use `.agents/local/` for:
- Repository-specific skills
- Experimental modifications
- Testing patterns before promoting to this base repo

### Creating a Local Override

In a consumer repo:

1. **Copy skill from base:**
   ```bash
   cp -r .agents/agents-playbooks/skills/frontend/react-testing \
         .agents/local/skills/frontend/react-testing
   ```

2. **Modify in `.agents/local/`**

3. **Test** - AI agents will use the local version

---

## Promotion Workflow (Consumer → Base)

When a consumer's local skill is ready to share:

1. **Create PR in the agents-playbook repository**
   - Fork https://github.com/alexandrebenkendorf/agents-playbook
   - Copy skill from your `.agents/local/` to the fork's `.agents/skills/`
   - Open pull request to agents-playbook
   - Get review and merge

2. **After merge, consumer updates subtree:**
   ```bash
   git subtree pull --prefix=.agents/agents-playbooks \
     https://github.com/alexandrebenkendorf/agents-playbook.git main --squash
   ```

3. **Consumer removes local override:**
   ```bash
   git rm -r .agents/local/skills/promoted-skill
   git commit -m "chore: Remove local override after promotion to base"
   ```

---

## Contributing to Base (This Repo)

### Rules for This Repository

✅ **DO edit skills directly** - This IS the source of truth  
✅ **DO test changes before committing**  
✅ **DO follow semantic versioning for breaking changes**  
✅ **DO document skill changes in CHANGELOG.md**

❌ **DO NOT commit consumer-specific configuration**  
❌ **DO NOT commit secrets or tokens**  
❌ **DO NOT break existing skill contracts without major version bump**

### Skill Development

1. Create or modify skills in `.agents/skills/`
2. Test with AI agents
3. Update documentation
4. Open PR with clear description
5. After merge, consumers pull via subtree

---

## Consumer DON'Ts

❌ **DO NOT edit `.agents/agents-playbooks/` in consumer repos**  
It's managed by subtree. Changes will be lost on next pull.

❌ **DO NOT use git submodules**  
Use git subtree for better merge handling.

❌ **DO NOT duplicate skills unintentionally**  
If a skill exists in both local and base, local shadows base. Document your intent.

---

## Verification Report

**Last verified:** 2026-02-06  
**Verified by:** Autonomous documentation agent

### Structure Check
- ✅ `.agents/skills/` exists (base skills)
- ✅ `.agents/templates/` exists (base templates)
- ✅ This IS the base repository

### Git Configuration
- ✅ No git submodules detected
- ✅ Standard git repository (not a subtree consumer)

### Base Repository Status
- ✅ Repository structure follows base pattern
- ✅ Ready for consumers to sync via subtree

---

## Quick Reference

### For Consumers

**Initial setup:**
```bash
git subtree add --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbook.git main --squash
```

**Update base:**
```bash
git subtree pull --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbook.git main --squash
```

**Create local override:**
```bash
mkdir -p .agents/local/skills
cp -r .agents/agents-playbooks/skills/some-skill .agents/local/skills/
# Edit in .agents/local/ safely
```

**Promote to base:**
1. PR to this repo
2. After merge: `git subtree pull ...`
3. Remove local override

### For This Repo

**Add new skill:**
```bash
mkdir -p .agents/skills/category/skill-name
# Create SKILL.md and README.md
git add .agents/skills/category/skill-name
git commit -m "feat: Add new skill-name skill"
```

**Update existing skill:**
```bash
# Edit .agents/skills/category/skill-name/SKILL.md
git commit -m "docs: Update skill-name documentation"
```

---

## Project-Specific Configuration (For Consumers)

Consumer repositories should configure these in their own `.agents/README.md`:

### Jira Ticket Prefix

**Example:**
```markdown
**Current Project Prefix:** `PROJ`
```

Replace with your Jira project prefix (e.g., `PROJ`, `JIRA`, `TASK`).

When using the `git/commit-conventions` skill:
- Branch naming: `<PREFIX>-<number>-description`
- Commit format: `<type>: <PREFIX>-<number> <description>`

### Framework

**Example:**
```markdown
**Current Project:**
- [x] React + TypeScript
- [ ] Other: ___________
```

---

## Active Skills (Base Repository)

### Frontend Skills

- ✅ **frontend/code-standards** - TypeScript/JavaScript naming, Clean Code, SOLID, Clean Architecture
- ✅ **frontend/react-best-practices** - Vercel Labs React performance patterns
- ✅ **frontend/react-component-structure** - Function vs const, SRP, file organization
- ✅ **frontend/react-testing** - Vitest + React Testing Library patterns

### Git Skills

- ✅ **git/commit-conventions** - Conventional commits with Jira tickets

---

## Creating New Skills & Rules

### Skill Structure

Each skill should follow this structure:

```
.agents/skills/<category>/<skill-name>/
├── README.md           # Human-friendly overview
├── SKILL.md            # Quick reference for AI agents
├── AGENTS.md           # Compiled documentation (if using rules/)
├── metadata.json       # Version, abstract, references (optional)
└── rules/              # Individual rule files (optional)
    ├── _sections.md    # Section definitions
    ├── _template.md    # Rule template
    └── area-rule.md    # Individual rules
```

### Creating a New Rule

Use the templates in `.agents/templates/`:

1. **Review templates:**
   - `.agents/templates/_template.md` - Rule structure and examples
   - `.agents/templates/_sections.md` - Section organization

2. **Copy the rule template:**
   ```bash
   cp .agents/templates/_template.md .agents/skills/<category>/<skill>/rules/<prefix>-<name>.md
   ```

3. **Fill in the frontmatter:**
   ```yaml
   ---
   title: Your Rule Title
   impact: MEDIUM
   impactDescription: "Reduces re-renders by 30%"
   tags: performance, react, memo
   ---
   ```

4. **Write the rule:**
   - Clear explanation of WHY it matters
   - **Incorrect** example with explanation
   - **Correct** example with explanation
   - Quantify impact when possible
   - Add references to official docs

5. **File naming convention:**
   - Use section prefix from `_sections.md` (e.g., `async-`, `bundle-`, `rerender-`)
   - Descriptive name: `async-defer-await.md`, `bundle-barrel-imports.md`
   - Files starting with `_` are special (templates, excluded from builds)

### Impact Levels

- **CRITICAL** - Major gains (eliminates waterfalls, critical security)
- **HIGH** - Significant improvements (bundle size, accessibility)
- **MEDIUM-HIGH** - Moderate-high gains
- **MEDIUM** - Moderate improvements (re-renders, code clarity)
- **LOW-MEDIUM** - Low-medium gains
- **LOW** - Incremental (micro-optimizations, style)

### Example: Creating a Performance Rule

```bash
# 1. Copy template
cp .agents/templates/_template.md \
   .agents/skills/frontend/react-best-practices/rules/rerender-use-memo.md

# 2. Edit the file
# 3. Add to version control
git add .agents/skills/frontend/react-best-practices/rules/rerender-use-memo.md
```

---

## Customization

### Project-Specific Overrides

If you need to override a skill for this project:

1. Copy the skill to a new directory: `.agents/skills/custom/`
2. Modify as needed
3. Update `.agents/AGENTS.md` to prioritize custom skills
4. Document the override in this file

### Contributing Back

If you create a useful pattern that could benefit other projects:

1. Test thoroughly in this project
2. Generalize (remove project-specific references)
3. Submit PR to agents-playbook repository
4. Update this file when merged

---

## Troubleshooting (For Consumers)

### AI Assistant Not Following Skills

**In consumer repos, check:**
- Skills are in `.agents/agents-playbooks/skills/` (synced from base)
- Local overrides are in `.agents/local/skills/` (if any)
- `AGENTS.md` references both directories in correct precedence order
- Skill files have proper frontmatter (YAML)

**Solution:**
```
"Please review the skills in .agents/agents-playbooks/skills/ and follow them strictly"
```

### Conflicting Guidelines (Consumer Repos)

**Order of Precedence:**
1. `/AGENTS.md` (root level in consumer repo)
2. `/.agents/local/*` (consumer-specific overrides)
3. `/.agents/agents-playbooks/skills/*` (from this base repo)
4. Existing code and comments

If skills conflict, follow root `AGENTS.md`. If `AGENTS.md` conflicts with skills, mention the conflict.

### Updating Skills (Consumer Repos)

Pull latest from this base repository:
```bash
git subtree pull --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbook.git main --squash
```

---

## Support

**Base Repository Issues:** https://github.com/alexandrebenkendorf/agents-playbook/issues  
**Base Repository Discussions:** https://github.com/alexandrebenkendorf/agents-playbook/discussions
