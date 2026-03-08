# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Overview

Squads is an Agent Skill for managing multi-agent teams. It follows the [Agent Skills Spec](https://agentskills.io/specification) and is installable via `npx skills add gutomec/squads`.

## Repository Structure

```
├── SKILL.md              # Agent Skills Spec skill definition (frontmatter + instructions)
├── references/           # Progressive disclosure reference files (loaded on demand)
├── examples/squads/      # Example squads for demonstration
│   ├── nirvana-squad-creator/   # Meta-tool: generates squads from natural language
│   └── ultimate-landingpage/    # Full-stack landing page builder
├── README.md             # Documentation
├── LICENSE               # MIT
└── CLAUDE.md             # This file
```

## Key Files

- `SKILL.md` — The main skill definition. Body must stay under 5000 tokens per Agent Skills Spec.
- `references/` — 11 reference files loaded progressively (squad-creation-protocol, agent-schema, task-schema, workflow-schema, workflow-patterns, validation-checklist, registration-protocol, dependency-management, triggers-protocol, flow-tracker-protocol, squad-yaml-schema).
- Reference paths in SKILL.md use relative paths: `references/filename.md`

## Conventions

- Body text in Portuguese (PT-BR) with correct accents
- Variable names and code in English
- UTF-8 encoding everywhere
- YAML frontmatter fields in English
