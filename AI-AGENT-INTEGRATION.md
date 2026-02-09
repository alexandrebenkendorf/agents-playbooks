# AI Agent Integration Instructions

**If a user asked to "read and use" or "integrate" this repository:**

## ⛔ STOP AND ASK THIS FIRST ⛔

Ask the user exactly this (copy/paste):

```
I can integrate agents-playbook into your project. Which method?

1 = Git Subtree (production, auto-updates)
2 = Simple Clone (quick start, full control)

Reply with just: 1 or 2
```

**⚠️ WAIT FOR THEIR RESPONSE. DO NOT RUN ANY COMMANDS UNTIL THEY REPLY.**
Do not ask for clone/subtree permission or suggest commands until they choose a method.

---

## After They Reply

### Before Running Any Commands:

1. **Check if `.agents/` folder exists** in the target project
2. If it does NOT exist, create it first: `mkdir -p .agents`
3. **After integration, scan `.agents/` for skills**: read `.agents/README.md` (if present) and check for skill folders under `.agents/**/skills/*/SKILL.md`
4. **Customize `DEVELOPMENT.md` for the consumer project** (e.g., update Jira ticket prefix and any project-specific conventions)
5. Then proceed with the commands from README.md

**Critical Rules:**

1. Do NOT run any git commands before asking
2. Do NOT assume which method they want
3. Do NOT ask for clone/subtree permission before they choose a method
4. Always check for `.agents/` folder and create if missing
5. Clone/subtree INTO `.agents/agents-playbooks/` (not root)
6. Do NOT commit changes automatically
7. Wait for explicit user response before proceeding
8. Customize `DEVELOPMENT.md` with project-specific values (e.g., Jira ticket prefix)
9. Follow the exact commands from README.md for their chosen method

---

## Why This Matters

Different projects have different needs:

- **Git Subtree (1)**: Production projects that want automatic updates from this repository
- **Simple Clone (2)**: Quick prototypes or projects that want full control without git history

Let the user decide based on their project requirements.
