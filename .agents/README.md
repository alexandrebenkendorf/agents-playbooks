# Agent Skills Configuration

This file contains project-specific configuration for the agent skills from [agents-playbook](https://github.com/alexandrebenkendorf/agents-playbook).

---

## Jira Ticket Prefix

**Current Project Prefix:** `<PREFIX>`

Replace `<PREFIX>` with your Jira project prefix (e.g., `PROJ`, `JIRA`, `TASK`).

### Usage

When using the `git/commit-conventions` skill:
- Replace `<PREFIX>` in all examples with your actual prefix
- Update your branch naming: `<PREFIX>-<number>-description`
- Commit format: `<type>: <PREFIX>-<number> <description>`

**Example for PROJ prefix:**
```bash
# Branch name
PROJ-12345-add-user-profile

# Commit message
feat: PROJ-12345 Add user profile component
```

---

## Framework

**Current Project:**
- [ ] React + TypeScript
- [ ] Other: ___________

---

## Skill Inventory

### Active Skills

Skills vendored from agents-playbook:

- ✅ **frontend/code-standards** - TypeScript/JavaScript naming, Clean Code, SOLID, Clean Architecture
- ✅ **frontend/react-best-practices** - Vercel Labs React performance patterns
- ✅ **frontend/react-component-structure** - Function vs const, SRP, file organization
- ✅ **frontend/react-testing** - Vitest + React Testing Library patterns
- ✅ **git/commit-conventions** - Conventional commits with Jira tickets

### Custom Skills

Project-specific skills not in agents-playbook:

- (none yet)

---

## Skill Usage Guide

### For AI Assistants

Reference skills in prompts to ensure consistency:

```
"Follow the testing guidelines to add tests for this component"
"Create a commit message following our conventions"
"Refactor this code according to our coding standards"
"Apply SOLID principles to this class"
```

### For Developers

Skills are located in `.agents/skills/` with the following structure:

```
.agents/skills/
├── frontend/
│   ├── code-standards/        # General TypeScript/JavaScript
│   ├── react-best-practices/  # Vercel React patterns
│   ├── react-component-structure/  # Component design
│   └── react-testing/         # Vitest + RTL
└── git/
    └── commit-conventions/    # Commit message format
```

See [DEVELOPMENT.md](../DEVELOPMENT.md) for human-friendly quick reference.

---

## Updating Skills

### From agents-playbook Repository

**If vendored (recommended):**

```bash
# Navigate to agents-playbook
cd /path/to/agents-playbook
git pull origin main

# Copy to your project
cp -r .agents/skills/* /path/to/your-project/.agents/skills/

# Review changes
cd /path/to/your-project
git diff .agents/skills/
```

**If using git submodule:**

```bash
cd /path/to/your-project
git submodule update --remote .agents/skills-source
```

### Version Tracking

Track which version of agents-playbook you're using:

**Current Version:** v1.0.0  
**Last Updated:** 2025-01-XX  
**Upstream:** https://github.com/alexandrebenkendorf/agents-playbook

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

## Troubleshooting

### AI Assistant Not Following Skills

**Check:**
- Skills are in `.agents/skills/` directory
- `AGENTS.md` references `.agents/skills/*` in precedence order
- Skill files have proper frontmatter (YAML)
- File paths are correct

**Solution:**
```
"Please review the skills in .agents/skills/ and follow them strictly"
```

### Conflicting Guidelines

**Order of Precedence:**
1. `/AGENTS.md` (root level)
2. `/.agents/skills/*` (all skills)
3. Existing code and comments

If skills conflict, follow root `AGENTS.md`. If `AGENTS.md` conflicts with skills, mention the conflict.

### Outdated Skills

Check agents-playbook repository for updates:
```bash
cd /path/to/agents-playbook
git log --oneline -10
```

Compare with your vendored version and update if needed.

---

## Support

**agents-playbook Issues:** https://github.com/alexandrebenkendorf/agents-playbook/issues  
**Project Issues:** (your project issue tracker)

---

## Maintenance Log

| Date | Version | Changes | Updated By |
|------|---------|---------|------------|
| 2025-01-XX | v1.0.0 | Initial vendor from agents-playbook | (your name) |
