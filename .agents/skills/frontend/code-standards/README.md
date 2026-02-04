# Code Standards

Comprehensive coding standards for TypeScript, JavaScript, and React development.

## Structure

- `rules/` - Individual rule files organized by category
  - `_sections.md` - Section definitions (naming, TypeScript, Clean Code, SOLID, etc.)
  - `_template.md` - Template for creating new rules
  - Individual rule files (e.g., `naming-react.md`, `typescript-best-practices.md`)
- `SKILL.md` - Quick reference for AI agents

## Categories

### 1. Naming Conventions
- React component naming
- TypeScript naming
- DDD (Domain-Driven Design) naming

### 2. General Standards
- Function design
- Control flow optimization
- DRY principles

### 3. TypeScript Best Practices
- Type safety
- Type inference
- Interface vs Type
- Generics usage

### 4. Clean Code Principles
- Meaningful names
- Functions should do one thing
- Error handling with exceptions
- Comments and documentation

### 5. SOLID Principles
- Single Responsibility Principle (SRP)
- Open/Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)

### 6. Clean Architecture
- Layers and boundaries
- Entities and use cases
- Adapters and frameworks
- Dependency rules

### 7. Performance Optimization
- DOM performance
- Caching strategies
- Data structures
- Array optimization

### 8. Helper Functions
- Formatters (dates, currency, strings)
- Validators (email, URLs, inputs)
- Parsers (JSON, URLs, data transformation)
- Type guards

## Creating a New Rule

1. Copy `rules/_template.md` to `rules/<prefix>-<description>.md`
2. Use appropriate prefix:
   - `naming-` for naming conventions
   - `general-` for general standards
   - `typescript-` for TypeScript practices
   - `clean-` for Clean Code principles
   - `solid-` for SOLID principles
   - `architecture-` for Clean Architecture
   - `performance-` for performance patterns
   - `helper-` for helper function patterns
3. Fill in frontmatter and content
4. Include clear examples

## Usage

Reference this skill when:
- Writing new code
- Reviewing code
- Refactoring existing code
- Setting up project standards
- Training team members
