---
name: awesome-design-md
description: Reference DESIGN.md design-system write-ups (colors, typography, spacing, components) extracted from 84 real sites such as apple, airbnb, claude, cursor, stripe. Use when the user asks to build or restyle UI "like" a named brand or site, wants inspiration for a visual direction, or asks for a DESIGN.md.
---

# awesome-design-md

Vendored from https://github.com/VoltAgent/awesome-design-md (MIT, see `LICENSE`). Each `design-md/<brand>/DESIGN.md` is a plain-text design system: YAML front matter with tokens (colors, type, spacing), then prose on layout, components and do/don't rules.

## How to use

1. List brands: `ls design-md/`. Match the user's named site; if none fits, pick the closest by reading each candidate's `description` front matter only.
2. Read only the chosen `design-md/<brand>/DESIGN.md` (not the whole collection).
3. Apply its tokens and rules to the requested UI. Keep them as references: translate into the project's existing tokens and components rather than copying brand assets or logos.

## In this project

`client-react-app` has its own conventions (`docs/conventions/ui.md`, indexed from `DEVELOPMENT.md`) and they win over any brand DESIGN.md. Use these files for direction and inspiration, not to override existing UI rules.
