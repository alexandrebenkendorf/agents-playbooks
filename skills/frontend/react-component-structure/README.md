# React Component Structure

Guidelines for structuring React components following best practices.

## Overview

This skill covers:
- Function declarations vs const arrow functions
- When to avoid React.FC
- Single Responsibility Principle for components
- File organization patterns
- When to extract helpers vs keep inline
- Common anti-patterns to avoid

## Key Principles

### Function Declarations Over Const

Use function declarations for React components:
- Better debugging (named functions in stack traces)
- Hoisting allows flexible file organization
- Clearer intent as a component

### Single Responsibility Principle

Each component should:
- Do one thing well
- Have a clear, focused purpose
- Be easy to name descriptively
- Be easy to test in isolation

### File Organization

- One component per file
- Co-locate related helpers
- Extract shared utilities to separate files
- Group by feature, not by type

## Common Anti-Patterns

- God components (too many responsibilities)
- Mixing concerns (logic + presentation + data fetching)
- Over-extraction (extracting everything to helpers)
- Under-extraction (massive inline logic)

## Creating a New Rule

This skill currently uses a single SKILL.md file. To convert to rules-based structure:

1. Create `rules/` directory
2. Copy templates from `templates/`
3. Create `_sections.md` defining component structure categories
4. Split SKILL.md content into individual rule files

## Usage

Reference this skill when:
- Creating new React components
- Reviewing component structure
- Refactoring existing components
- Discussing component design patterns
