# Skills

**This is the BASE repository for shared agent skills.**

This directory contains the source of truth for AI agent skills that are synced to consumer repositories via git subtree.

## Installed Skills

### Frontend Skills

#### `frontend/code-standards`
**Source:** [alexandrebenkendorf/agents-playbooks](https://github.com/alexandrebenkendorf/agents-playbooks)  
**Local:** [SKILL.md](frontend/code-standards/SKILL.md) | [README.md](frontend/code-standards/README.md)

Comprehensive coding standards covering:
- General coding standards
- TypeScript best practices and naming conventions
- Clean code principles and SOLID principles
- Clean architecture and DDD naming
- Data structures and helper function patterns
- Performance optimization (arrays, control flow, DOM, caching)

#### `frontend/react-best-practices`
**Source:** [alexandrebenkendorf/agents-playbooks](https://github.com/alexandrebenkendorf/agents-playbooks)  
**Local:** [SKILL.md](frontend/react-best-practices/SKILL.md) | [README.md](frontend/react-best-practices/README.md) | [Quick Ref](frontend/react-best-practices/quick-ref/performance-top10.md)

React-specific best practices including:
- Re-rendering optimization (memo, transitions, derived state, dependencies)
- Async patterns (parallel execution, suspense, API routes)
- Bundle optimization (dynamic imports, conditional imports, barrel imports)
- Server-side patterns (caching, serialization, parallel fetching)
- Client-side patterns (event listeners, SWR, localStorage)
- Rendering optimization (hydration, content visibility, SVG)
- Advanced patterns (useLatest, event handler refs, init once)

#### `frontend/react-component-structure`
**Source:** [alexandrebenkendorf/agents-playbooks](https://github.com/alexandrebenkendorf/agents-playbooks)  
**Local:** [SKILL.md](frontend/react-component-structure/SKILL.md) | [README.md](frontend/react-component-structure/README.md)

Guidelines for structuring React components consistently.

#### `frontend/react-testing`
**Source:** [alexandrebenkendorf/agents-playbooks](https://github.com/alexandrebenkendorf/agents-playbooks)  
**Local:** [SKILL.md](frontend/react-testing/SKILL.md) | [README.md](frontend/react-testing/README.md) | [Quick Ref](frontend/react-testing/quick-ref/testing-cheatsheet.md)

Testing best practices covering:
- New test creation patterns
- Legacy test refactoring guidelines
- Common testing patterns
- TypeScript testing conventions

### Git Skills

#### `git/commit-conventions`
**Source:** [alexandrebenkendorf/agents-playbooks](https://github.com/alexandrebenkendorf/agents-playbooks)  
**Local:** [SKILL.md](git/commit-conventions/SKILL.md) | [README.md](git/commit-conventions/README.md)

Git commit message conventions and formatting rules.

---

## For Consumer Projects

Consumer repositories sync these skills via git subtree into `.agents/agents-playbooks/skills/`.

**Precedence in consumer repos:**
1. `/AGENTS.md`
2. `/.agents/local/*` (consumer overrides)
3. `/.agents/agents-playbooks/skills/*` (from this repo)
4. Existing code and comments

If instructions conflict, follow the higher-precedence source.

📖 **Full documentation:** [../README.md](../README.md)
