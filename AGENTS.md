# AGENTS

**For Consumer Projects:** Copy this file to your project root and customize with project-specific rules (commands, repo composition, CI/CD, etc.) while keeping the precedence order and base patterns.

---

## 🚨 FOR AI AGENTS - INTEGRATION INSTRUCTION 🚨

**If a user asked to "read and use" or "integrate" this repository:**

👉 **[READ THE INTEGRATION INSTRUCTIONS](AI-AGENT-INTEGRATION.md)** 👈

---

Global, authoritative rules for this repository.

## Order of precedence

1. `/AGENTS.md`
2. `/skills/*`
3. Existing code and comments

If instructions conflict, follow the higher-precedence source and mention the conflict.

### Vendoring external skills (copy, don't install)

If asked to "copy" or "create a skill based on" a skill from skills.sh (e.g. vercel-labs/agent-skills):

- DO vendor the skill **as-is** under `/skills/<skill-name>/`
- A vendored skill folder must contain at least `SKILL.md` (and may include `README.md`, `metadata.json`).
- DO NOT create extra namespaces like `guidelines/`.
- DO NOT split a single skill into many "rules/\*.md" files unless the upstream skill is already structured that way.
- After copying, add the skill to `/skills/README.md`.
- Check if the references are correct and update them if needed (usually the references are pointing to the repo path and we need to reference the local).

---

## Repo composition

- Application code: React + TypeScript
- CI/CD: YAML pipelines (GitHub Actions / Azure Pipelines)
- Tooling/scripts: shell scripts (if present)

---

## Non-negotiable rules

- Do NOT invent APIs, routes, env var names, pipeline variables, job names, or secrets.
- Do NOT log secrets or tokens (even masked values).
- Keep changes minimal and incremental.
- Prefer explicit contracts at boundaries; inference inside implementations.
- Avoid nested ternaries for non-trivial logic.

---

## CI/CD safety

- Pipeline edits must preserve existing stages/jobs unless explicitly requested.
- Any new step must document inputs/outputs and required env vars.
- Prefer least-privilege permissions/scopes.

---

## Commands that must pass

- Install: `npm i`
- Format: `npm run format`
- Lint: `npm run lint:fix`
- Test: `npm test -- <file> --run`
- Build: `npm build`
- Preview: `npm preview`

---

## Definition of Done

- [ ] Tests added or updated
- [ ] Lint and tests passing
- [ ] Format check passes (`npm run format:check`)
- [ ] No duplicated constants or paths
- [ ] Skills and/or documentations updated if a new pattern was introduced
- [ ] `DEVELOPMENT.md` updated when introducing new patterns, conventions, or quick reference material relevant to human developers
