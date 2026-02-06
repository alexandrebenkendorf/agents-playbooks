# Agent Skills Playbook

---

## 🚨 STOP - READ THIS FIRST 🚨

**FOR AI AGENTS:** If a user asked you to "read and use" or "integrate" this repository:

### STEP 1: ASK THE USER (DO NOT SKIP)

```
I can integrate the agents-playbook skills into your project.

Which method would you like?

1. Git Subtree (Production - automatic updates)
2. Simple Clone (Quick start - full control)

Please respond with 1 or 2.
```

### STEP 2: AFTER USER RESPONDS, EXECUTE BASED ON CHOICE

**If user chose 1 (Git Subtree):**
```bash
# Execute ALL these commands:
git subtree add --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbook.git main --squash
cp .agents/agents-playbooks/AGENTS.md ./AGENTS.md
cp .agents/agents-playbooks/DEVELOPMENT.md ./DEVELOPMENT.md
```
✅ Confirm completion: "Git subtree setup complete. Base files copied."

**If user chose 2 (Simple Clone):**
```bash
# Execute ALL these commands in order:
git clone https://github.com/alexandrebenkendorf/agents-playbook.git .agents/agents-playbooks
rm -rf .agents/agents-playbooks/.git
cp .agents/agents-playbooks/AGENTS.md ./AGENTS.md
cp .agents/agents-playbooks/DEVELOPMENT.md ./DEVELOPMENT.md
```
✅ Confirm completion: "Simple clone complete. Files ready for customization."

### CHECKLIST (Verify all items):
- [ ] Asked user for method choice (1 or 2)
- [ ] Executed integration commands
- [ ] Copied AGENTS.md to project root
- [ ] Copied DEVELOPMENT.md to project root
- [ ] Confirmed completion to user

**DO NOT:**
- ❌ Skip asking the user
- ❌ Run partial commands
- ❌ Commit changes (user decides when to commit)

---

Reusable AI agent skills for modern frontend development with React, TypeScript, and Clean Architecture.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📁 Skills Catalog

### Frontend

#### Framework-Agnostic

**[`frontend/code-standards`](./.agents/skills/frontend/code-standards/)**
- Naming conventions (React, TypeScript, DDD)
- General coding standards (functions, control flow, DRY)
- TypeScript best practices (type safety, inference, interface vs type)
- Clean Code principles (meaningful names, exceptions, small functions)
- SOLID principles (SRP, OCP, LSP, ISP, DIP)
- Clean Architecture (layers, entities, use cases, adapters)
- JavaScript performance patterns (DOM, caching, data structures, arrays)
- Helper function patterns (formatters, validators, parsers, guards)

#### React

**[`frontend/react-best-practices`](./.agents/skills/frontend/react-best-practices/)**  
Vendored from [Vercel Labs agent-skills](https://github.com/vercel-labs/agent-skills)
- 57 performance optimization rules across 8 categories
- Eliminating waterfalls (async patterns, Suspense)
- Bundle size optimization (dynamic imports, tree-shaking)
- Server-side performance (caching, parallel fetching)
- Re-render optimization (memo, state management)

**[`frontend/react-component-structure`](./.agents/skills/frontend/react-component-structure/)**
- Function declarations vs const (avoid React.FC)
- Single Responsibility Principle for components
- File organization patterns
- When to extract helpers vs keep inline
- Anti-patterns (god components, mixing concerns)

**[`frontend/react-testing`](./.agents/skills/frontend/react-testing/)**
- Vitest + React Testing Library patterns
- Creating new tests (AAA pattern, it.each)
- Legacy refactoring (Sinon → Vitest migration)
- TypeScript testing patterns
- Common patterns and quick reference

### Git

**[`git/commit-conventions`](./.agents/skills/git/commit-conventions/)**
- Conventional commit format with Jira tickets
- Generic `<PREFIX>-<number>` format (configurable per project)
- Atomic commit guidance
- AI assistant workflow

---

## 🚀 Usage

### For Consumer Projects

This repository is the **base source** for shared agent skills. Consumer projects can integrate these skills using one of two approaches:

#### Option 1: Git Subtree (Recommended for Production)

**Best for:** Long-term projects that want automatic updates and contribution workflow.

Add this repository to your project:

```bash
git subtree add --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbook.git main --squash

# Copy base files to project root
cp .agents/agents-playbooks/AGENTS.md ./AGENTS.md
cp .agents/agents-playbooks/DEVELOPMENT.md ./DEVELOPMENT.md
```

**Update skills:**
```bash
git subtree pull --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbook.git main --squash
```

⚠️ **Never edit `.agents/agents-playbooks/` directly** - it's managed by subtree.

#### Option 2: Simple Clone (Quick Start)

**Best for:** Prototypes, experiments, or projects that want full customization without subtree complexity.

```bash
# Step 1: Clone into .agents directory
git clone https://github.com/alexandrebenkendorf/agents-playbook.git .agents/agents-playbooks

# Step 2: Remove git tracking (treat as vendored code)
rm -rf .agents/agents-playbooks/.git

# Step 3: Copy base files to project root
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
git clone https://github.com/alexandrebenkendorf/agents-playbook.git .agents/agents-playbooks
rm -rf .agents/agents-playbooks/.git

# Merge your customizations
# (manually compare .agents/agents-playbooks.backup with new clone)
```

#### Comparison

| Feature | Git Subtree | Simple Clone |
|---------|-------------|--------------|
| **Setup** | Complex | Simple |
| **Updates** | Automatic merge | Manual copy |
| **Customization** | `.agents/local/` overrides | Direct editing |
| **Contributing back** | Structured workflow | Manual PR |
| **Best for** | Production, team projects | Prototypes, solo experiments |

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
  https://github.com/alexandrebenkendorf/agents-playbook.git main --squash
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
- ✅ Safe local overrides in `.agents/local/` (Option 1)
- ✅ Explicit promotion workflow (Option 1)
- ✅ No git submodule complexity
- ✅ Simple vendoring for full control (Option 2)

📖 **Full documentation:** See [.agents/README.md](./.agents/README.md)

---

## ⚙️ Configuration

### Consumer Project Setup

Create `.agents/README.md` in your project with configuration:

```markdown
# Project Agent Skills

Base skills synced from: [agents-playbook](https://github.com/alexandrebenkendorf/agents-playbook)

## Configuration

- **Jira Ticket Prefix**: `PROJ` (Your Project)
- **Branch Format**: `PROJ-<number>-description`
- **Framework**: React + TypeScript

## Updating Base Skills

```bash
git subtree pull --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbook.git main --squash

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

# Edit in .agents/local/ - AI agents will use your version
```

## Promoting Local Skills

1. Fork https://github.com/alexandrebenkendorf/agents-playbook
2. Copy from `.agents/local/` to fork's `.agents/skills/`
3. Open PR to agents-playbook
4. After merge: `git subtree pull ...`
5. Remove local override
```

Update `AGENTS.md` in your project (copied from base):

```markdown
## Order of precedence
1. `/AGENTS.md`
2. `/.agents/local/*` (your overrides)
3. `/.agents/agents-playbooks/skills/*` (base)
4. Existing code and comments

If instructions conflict, follow the higher-precedence source.
```

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

Templates for creating new skills and rules are in `.agents/templates/`:

- **`.agents/templates/_template.md`** - Rule structure with examples
- **`.agents/templates/_sections.md`** - Section organization guide

Use these templates to maintain consistency across all skills.

### Creating a New Skill

1. **Create skill directory:**
   ```bash
   mkdir -p .agents/skills/<category>/<skill-name>
   ```

2. **Add core files:**
   - `README.md` - Human-friendly overview
   - `SKILL.md` - Quick reference with frontmatter

3. **For multi-rule skills, add rules directory:**
   ```bash
   mkdir .agents/skills/<category>/<skill-name>/rules
   cp .agents/templates/_template.md .agents/skills/<category>/<skill-name>/rules/
   cp .agents/templates/_sections.md .agents/skills/<category>/<skill-name>/rules/
   ```

4. **Create rules following the template:**
   - Use section prefixes from `_sections.md`
   - Follow the structure in `_template.md`
   - Include clear examples and impact levels

**SKILL.md frontmatter:**
```yaml
---
name: Skill Name
description: Brief description
---
```

---

## 🤝 Contributing

### Adding a New Skill (Base Repository)

This repository is the source of truth for shared skills.

1. Create skill directory: `.agents/skills/category/skill-name/`
2. Add `SKILL.md` and `README.md`
3. For large skills, use `rules/` directory
4. Update this README and `.agents/skills/README.md`
5. Test with a real project
6. Document in CHANGELOG.md

### Contributing from Consumer Projects

If you developed a useful skill in a consumer project's `.agents/local/`:

1. **Fork this repository**
2. **Copy skill** from your `.agents/local/` to fork's `.agents/skills/`
3. **Generalize** - remove project-specific references
4. **Test thoroughly**
5. **Open PR** with clear description
6. **After merge**, update your subtree and remove local override

### Updating Existing Skills

1. Make changes in `.agents/skills/`
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

| Skill | Files | Lines | Token-Optimized? |
|-------|-------|-------|------------------|
| **frontend/code-standards** | 16 files | ~2,500 | ✅ Yes (modular by topic) |
| **frontend/react-best-practices** | 47 files | ~3,000 | ✅ Yes (vendored, modular) |
| **frontend/react-component-structure** | 1 file | ~300 | ✅ Yes (focused single file) |
| **frontend/react-testing** | 4 files | ~800 | ✅ Yes (task-specific routing) |
| **git/commit-conventions** | 1 file | ~200 | ✅ Yes (focused single file) |

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
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) - Robert C. Martin
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID) - Robert C. Martin
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Robert C. Martin

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/alexandrebenkendorf/agents-playbook/issues)
- **Discussions**: [GitHub Discussions](https://github.com/alexandrebenkendorf/agents-playbook/discussions)
