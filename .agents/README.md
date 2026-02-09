# .agents Directory

This directory contains shared agent skills and templates for the agents-playbook base repository.

## 📁 Structure

```
.agents/
├── skills/           # Base skills (source of truth)
│   ├── frontend/     # Frontend-related skills
│   ├── git/          # Git workflow skills
│   └── ...
├── templates/        # Shared templates for creating new skills
└── README.md         # This file
```

## 🎯 Base Repository vs Consumer Projects

### This Repository (Base)

This is the **source repository** (agents-playbook). The `.agents/` directory here contains:

- **`.agents/skills/`** - The authoritative source for all skills
- **`.agents/templates/`** - Templates for creating new skills

These are directly editable and serve as the source of truth.

### Consumer Projects

Consumer projects integrate this repository using git subtree or simple clone:

```
consumer-project/
├── .agents/
│   ├── agents-playbooks/    # Synced from this base repo (read-only)
│   │   ├── skills/
│   │   ├── templates/
│   │   └── README.md
│   ├── local/                # Consumer-specific overrides
│   │   └── skills/
│   └── README.md             # Consumer configuration
├── AGENTS.md                 # Copied and customized
└── DEVELOPMENT.md            # Copied and customized
```

**Precedence in consumer projects:**
1. `/AGENTS.md` (project root)
2. `/.agents/local/skills/*` (consumer overrides)
3. `/.agents/agents-playbooks/skills/*` (synced from base)
4. Existing code and comments

## 📖 Usage

### For Base Repository Contributors

Edit skills directly in `.agents/skills/`:

```bash
# Create new skill
mkdir -p .agents/skills/category/skill-name
cp .agents/templates/_template.md .agents/skills/category/skill-name/SKILL.md

# Edit existing skill
vim .agents/skills/frontend/code-standards/SKILL.md

# Commit and push
git add .agents/skills/
git commit -m "feat: Add new skill"
git push
```

### For Consumer Projects

See [README.md](../README.md) for integration instructions (git subtree or simple clone).

## 🔄 Syncing Changes

### Base Repository → Consumer

**Git Subtree:**
```bash
git subtree pull --prefix=.agents/agents-playbooks \
  https://github.com/alexandrebenkendorf/agents-playbook.git main --squash
```

**Simple Clone:**
```bash
# Manual update
rm -rf .agents/agents-playbooks
git clone https://github.com/alexandrebenkendorf/agents-playbook.git .agents/agents-playbooks
rm -rf .agents/agents-playbooks/.git
```

### Consumer → Base Repository

1. Copy skill from `.agents/local/` to a fork of this repository under `.agents/skills/`
2. Open PR to this repository
3. After merge, consumers can pull via subtree/clone

## 📝 Skill Structure

Each skill must contain:

```
.agents/skills/<category>/<skill-name>/
├── SKILL.md           # Main skill documentation (required)
├── README.md          # Optional overview
├── metadata.json      # Optional metadata
├── quick-ref/         # Optional quick reference materials
└── rules/             # Optional detailed rules
```

## 🛠️ Templates

Use templates to create consistent skills:

```bash
# Copy template
cp .agents/templates/_template.md .agents/skills/<category>/<skill>/SKILL.md

# Or for granular rules
cp .agents/templates/_sections.md .agents/skills/<category>/<skill>/rules/<name>.md
```

## 📚 Available Skills

See [skills/README.md](./skills/README.md) for the complete catalog.

## 🤝 Contributing

1. Create or update skills in `.agents/skills/`
2. Test with actual AI agents
3. Update this README if adding new categories
4. Submit PR with clear description

---

For more information, see the [main README](../README.md).
