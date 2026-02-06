---
name: Git Commit Conventions
description: Conventional commit format and workflow with Jira ticket integration
---

# Git Commit Conventions

Guidelines for creating properly formatted commit messages with Jira ticket numbers.

---

## Configuration

**Set your Jira project prefix in `.agents/README.md`:**

```markdown
# Project Configuration

- **Jira Ticket Prefix**: `PROJ` (e.g., JIRA, DEV, TASK)
- **Branch Format**: `<PREFIX>-<number>-description`
```

---

## Conventional Commit Format

```
<type>: <PREFIX>-<ticket-number> <description>
```

**Where:**

- `<type>` = Commit type (feat, fix, docs, etc.)
- `<PREFIX>` = Your Jira project prefix (PROJ, JIRA, etc.)
- `<ticket-number>` = Jira ticket number
- `<description>` = Imperative description

### Commit Types

| Type       | Usage                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| `feat`     | A new feature                                                                                          |
| `fix`      | A bug fix                                                                                              |
| `docs`     | Documentation only changes                                                                             |
| `style`    | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| `refactor` | A code change that neither fixes a bug nor adds a feature                                              |
| `perf`     | A code change that improves performance                                                                |
| `test`     | Adding missing tests or correcting existing tests                                                      |
| `build`    | Changes that affect the build system or external dependencies                                          |
| `ci`       | Changes to our CI configuration files and scripts                                                      |
| `chore`    | Other changes that don't modify src or test files                                                      |
| `revert`   | Reverts a previous commit                                                                              |
| `rollback` | Rolling back to a previous version                                                                     |

---

## Message Guidelines

- **Use imperative mood** in the description (e.g., "Add feature" not "Added feature")
- **Keep the description concise** but descriptive
- **Capitalize the first letter** of the description
- **Do not end with a period**

---

## Ticket Number Format

- Always include the **Jira ticket number** from your current branch
- Extract the ticket number from your branch name
  - Example: `PROJ-134713-FE-Add-GitHub-unittest.instructions.md-for-vitest` → `PROJ-134713`
  - Example: `TASK-456-implement-user-auth` → `TASK-456`

---

## Examples

```bash
# Adding a new feature
git commit -m "feat: PROJ-134713 Add GitHub unittest instructions for Vitest best practices"
git commit -m "feat: TASK-456 Implement user authentication flow"

# Fixing a bug
git commit -m "fix: PROJ-134714 Resolve memory leak in component unmounting"
git commit -m "fix: JIRA-789 Correct email validation regex"

# Documentation update
git commit -m "docs: PROJ-134715 Update API documentation for user service"

# Refactoring code
git commit -m "refactor: PROJ-134716 Simplify user authentication logic"

# Rolling back changes
git commit -m "rollback: PROJ-134717 Revert to previous version due to performance issues"

# Adding tests
git commit -m "test: PROJ-134718 Add unit tests for UserProfile component"

# Performance improvement
git commit -m "perf: PROJ-134719 Optimize database query for user search"
```

---

## AI Assistant Workflow

**When user says "commit the changes" or similar:**

### Step-by-step process:

1. ✅ **Run `git status`** to see modified files
2. ✅ **Run `git diff --staged`** (or `git diff` if nothing staged) to review actual code changes
   - **CRITICAL:** This step is mandatory - never skip it
3. ✅ **Analyze the actual code changes** in detail (not just filenames)
4. ✅ **Check if changes should be split into multiple commits**
   - If staged changes contain **multiple unrelated changes** (e.g., feature + refactor + docs):
     - **STOP** and inform the user
     - Recommend unstaging: `git reset HEAD <file>`
     - Suggest staging related changes separately
     - Example: "Your staged changes include both feature changes and documentation updates. Consider splitting these into separate commits for better history."
   - Each commit should represent **one logical change**
5. ✅ **Determine the appropriate commit type** based on what actually changed:
   - New functionality → `feat`
   - Bug fixes → `fix`
   - Tests only → `test`
   - Documentation → `docs`
   - Code cleanup/restructuring → `refactor`
   - Performance improvements → `perf`
   - Build/CI changes → `build` or `ci`
6. ✅ **Extract the ticket number** from the current branch name
   - Read project's Jira prefix from `.agents/README.md` if available
   - Or detect from branch name pattern (e.g., `PROJ-`, `TASK-`, etc.)
7. ✅ **Generate a properly formatted commit message** based on actual changes
8. ✅ **Execute the commit** with the generated message (only if changes are cohesive)

### Atomic Commits

**Each commit should represent ONE logical change:**

✅ **Good - Focused commits:**

```bash
# Commit 1
git add src/components/UserProfile.tsx
git commit -m "feat: PROJ-12345 Add user avatar display to UserProfile"

# Commit 2
git add src/utils/validation.ts
git commit -m "fix: PROJ-12345 Correct email validation regex"

# Commit 3
git add README.md
git commit -m "docs: PROJ-12345 Update UserProfile component documentation"
```

❌ **Bad - Mixed changes:**

```bash
# Mixing feature, fix, and docs in one commit
git add src/components/UserProfile.tsx src/utils/validation.ts README.md
git commit -m "feat: PROJ-12345 Add avatar, fix validation, update docs"
```

**When to split commits:**

- Changes serve different purposes (feature vs fix vs refactor)
- Changes affect unrelated areas of the codebase
- One change could be reverted independently
- Changes would have different commit types

### DO NOT:

- ❌ Create commit messages based only on `git status` output
- ❌ Assume what changed based on filenames alone
- ❌ Skip reviewing the actual code diff
- ❌ Guess the commit type without seeing the changes
- ❌ Commit multiple unrelated changes together
- ❌ Mix different commit types in a single commit (e.g., feat + refactor + docs)

---

## User Prompts

### Recommended Prompts

**Best (let AI analyze):**

```
"Commit the changes"
"Review my staged changes and create a commit message"
```

**Good (with context):**

```
"I've updated the authentication flow and added error handling.
Check my changes and create a commit message."
```

**Acceptable (manual description):**

```
"Create a commit message. I added unit tests for the UserProfile component
and fixed a bug in the validation logic."
```

---

## Example Workflow

1. Make your code changes
2. Stage your changes: `git add .`
3. Ask the AI assistant: **"Commit the changes"**
4. The assistant will:
   - Run `git status` to see what files changed
   - **Run `git diff --staged` to see the actual code changes**
   - Analyze the changes to determine the proper commit type
   - Extract the ticket number from the branch name
   - Generate a properly formatted commit message:
     ```
     feat: PROJ-134801 Add error handling to authentication flow
     ```
5. Execute the commit: `git commit -m "feat: PROJ-134801 Add error handling to authentication flow"`
