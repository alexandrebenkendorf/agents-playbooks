# Agent Skills Playbook

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

### Option 1: Vendoring (Recommended)

Copy skills into your project:

```bash
# Clone this repository
git clone https://github.com/your-org/agents-playbook.git

# Copy skills to your project
mkdir -p your-project/.agents/skills
cp -r agents-playbook/.agents/skills/* your-project/.agents/skills/
```

**Benefits:**
- ✅ Full control over skill versions
- ✅ Can customize per-project
- ✅ No external dependencies

### Option 2: Git Submodule

```bash
cd your-project
git submodule add https://github.com/your-org/agents-playbook.git .agents/skills-source
ln -s .agents/skills-source/.agents/skills .agents/skills
```

**Benefits:**
- ✅ Easy to update (`git submodule update --remote`)
- ✅ Shared across all projects
- ❌ Harder to customize per-project

---

## ⚙️ Configuration

### Project Setup

Create `.agents/README.md` in your project:

```markdown
# Project Agent Skills

Skills are sourced from: [agents-playbook](https://github.com/your-org/agents-playbook)

## Configuration

- **Jira Ticket Prefix**: `PROJ` (Your Project)
- **Branch Format**: `PROJ-<number>-description`
- **Framework**: React + TypeScript

## Skill Usage

Reference skills in prompts:

\```
"Follow the testing guidelines to add tests for this component"
"Create a commit message following our conventions"
"Refactor this code according to our coding standards"
\```

## Updating Skills

\```bash
# If vendored
cd /path/to/agents-playbook
git pull
cp -r .agents/skills/* /path/to/your-project/.agents/skills/

# If using submodule
git submodule update --remote .agents/skills-source
\```
```

Update `AGENTS.md` in your project:

```markdown
## Order of precedence
1. `/AGENTS.md`
2. `/.agents/skills/*`
3. Existing code and comments

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

### Adding a New Skill

1. Create skill directory: `.agents/skills/category/skill-name/`
2. Add `SKILL.md` with frontmatter
3. For large skills, use `rules/` directory
4. Update this README
5. Test with a real project

### Updating Existing Skills

1. Make changes in skill files
2. Test with AI assistant
3. Update version/changelog if significant
4. Document changes in commit message

### Guidelines

- ✅ Keep skills **framework-agnostic** when possible
- ✅ Use **concrete examples** (code samples)
- ✅ Include **anti-patterns** (what NOT to do)
- ✅ Link to **authoritative sources** for deeper learning
- ✅ Keep files **focused and modular** (token efficiency)
- ❌ Don't mix framework-specific patterns in generic skills
- ❌ Don't create overly generic skills (be specific and actionable)

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

- **Issues**: [GitHub Issues](https://github.com/your-org/agents-playbook/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/agents-playbook/discussions)
