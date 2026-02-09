# Git Commit Conventions

Guidelines for creating properly formatted commit messages with Jira ticket integration.

## Overview

This skill provides:
- Conventional commit format
- Jira ticket number integration
- Commit type guidelines (feat, fix, docs, etc.)
- AI assistant workflow for automated commits
- Atomic commit best practices

## Format

```
<type>: <PREFIX>-<ticket-number> <description>
```

**Example:**
```bash
feat: PROJ-12345 Add user authentication flow
fix: TASK-678 Resolve memory leak in component unmounting
docs: JIRA-910 Update API documentation
```

## Commit Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `perf` - Performance improvements
- `build` - Build system changes
- `ci` - CI configuration changes
- `chore` - Other changes
- `revert` - Revert a commit
- `rollback` - Rollback to previous version

## AI Assistant Workflow

When committing changes, the AI should:
1. Run `git status` to see modified files
2. Run `git diff --staged` to review actual changes
3. Analyze changes to determine commit type
4. Check for multiple unrelated changes (suggest splitting)
5. Extract ticket number from branch name
6. Generate properly formatted commit message
7. Execute the commit

## Atomic Commits

Each commit should represent ONE logical change:
- ✅ Single feature addition
- ✅ Single bug fix
- ✅ Single refactoring
- ❌ Mixed changes (feature + fix + docs)

## Creating a New Rule

To convert to rules-based structure:

1. Create `rules/` directory
2. Copy templates from `templates/`
3. Create sections:
   - `format-` - Message format rules
   - `type-` - Commit type guidelines
   - `workflow-` - AI workflow patterns
   - `atomic-` - Atomic commit rules

## Usage

Reference this skill when:
- Committing changes
- Reviewing commit messages
- Setting up git hooks
- Training team on commit standards
- Configuring AI assistants for commits
