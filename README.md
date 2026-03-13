<div align="center">

```
███████╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ ███████╗
██╔════╝██╔═══██╗██║   ██║██╔══██╗██╔══██╗██╔════╝
███████╗██║   ██║██║   ██║███████║██║  ██║███████╗
╚════██║██║▄▄ ██║██║   ██║██╔══██║██║  ██║╚════██║
███████║╚██████╔╝╚██████╔╝██║  ██║██████╔╝███████║
╚══════╝ ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝
```

**Multi-Agent Teams for AI Coding**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Agent Skills Spec](https://img.shields.io/badge/Agent%20Skills%20Spec-v1.0-blue.svg)](https://agentskills.io)
[![skills.sh](https://img.shields.io/badge/skills.sh-squads-orange.svg)](https://skills.sh)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-green.svg)](https://docs.anthropic.com/en/docs/claude-code)
[![Codex CLI](https://img.shields.io/badge/Codex%20CLI-compatible-green.svg)](https://github.com/openai/codex)
[![Gemini CLI](https://img.shields.io/badge/Gemini%20CLI-compatible-green.svg)](https://github.com/google-gemini/gemini-cli)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Flow%20Tracker-E8A838.svg)](https://gutomec.github.io/ai-public-arsenal/demo/)

```bash
npx skills add gutomec/squads
```

[Install](#install) · [Commands](#commands) · [Workflows](#workflows--how-agents-collaborate) · [Triggers](#triggers--lifecycle-events) · [Flow Tracker](#flow-tracker--visualize-collaboration) · [Example Squads](#example-squads) · [Marketplace](https://squads.sh)

</div>

---

## You're running a one-man army. And it shows.

One AI agent doing everything. Writing code, reviewing code, testing code, deploying code, planning architecture, managing backlog, handling DevOps.

That is not a system. That is chaos with a prompt.

You know what happens when one agent does 10 jobs? The same thing that happens when one employee does 10 jobs. Everything gets done. Nothing gets done well.

---

## The real problem with AI coding right now

Everyone talks about AI agents. Nobody talks about how they're using them.

Here is what most people do: they open Claude Code, give it a massive prompt, and pray. The agent writes code, reviews its own code, tests its own tests, and deploys its own mess. No separation of concerns. No boundaries. No accountability.

It works until it doesn't. And when it doesn't, you have no idea which "role" broke things because there was never a real role to begin with.

---

## Squads fix this

A squad is a team. Not one agent pretending to be a team. An actual structured group of agents where each one has a name, a job, boundaries, and tasks it owns.

- A **writer** that only writes
- A **reviewer** that only reviews
- An **orchestrator** that coordinates
- A **validator** that checks quality

Each agent has its own markdown file with a persona, commands, and rules. Each task has pre-conditions and post-conditions. Each workflow defines how agents collaborate.

You don't configure this in some proprietary platform. You don't pay for seats. You don't learn a new tool. It is a directory in your project with markdown files.

```
squads/my-squad/
├── squad.yaml          # the manifest — who is on this team
├── agents/             # one .md file per agent
├── tasks/              # one .md file per task
├── workflows/          # collaboration patterns
├── config/             # squad-level settings
└── README.md           # documentation
```

Copy the directory to another project. The squad comes with it. No install, no config migration, no API keys.

That is portability. Real portability.

---

## Install

### Option 1: skills.sh (recommended)

```bash
npx skills add gutomec/squads
```

One command. Works with **Claude Code**, **Codex CLI**, **Gemini CLI**, **Cursor**, and any agent that supports the [Agent Skills Spec](https://agentskills.io).

### Option 2: Manual

```bash
git clone https://github.com/gutomec/squads.git .claude/skills/squads
mkdir -p squads/
```

No npm install. No pip install. No Docker. The skill uses native agent tools — Read, Write, Edit, Glob, Grep, Bash. Nothing external.

---

## How it works

```bash
# Create a squad
/squads *create-squad content-pipeline

# Add specialists
/squads *add-agent content-pipeline writer
/squads *add-agent content-pipeline reviewer
/squads *add-agent content-pipeline publisher

# Register for slash commands
/squads *register-squad content-pipeline

# Use any agent directly
/SQUADS:content-pipeline:cp-writer
/SQUADS:content-pipeline:cp-reviewer
```

---

## Commands

| Command | What it does |
|:--------|:------------|
| `*create-squad {name}` | Scaffold a full squad directory |
| `*list-squads` | Show all squads with agent counts |
| `*inspect-squad {name}` | Show squad details and structure |
| `*add-agent {squad} {role}` | Add a specialist to the team |
| `*remove-agent {squad} {id}` | Remove an agent from the squad |
| `*add-task {squad} {name}` | Add a task to existing squad |
| `*add-workflow {squad} {name}` | Add a workflow to existing squad |
| `*validate-squad {name}` | Run 26 integrity checks |
| `*register-squad {name}` | Enable slash commands for the squad |
| `*unregister-squad {name}` | Remove squad registration |
| `*install-squad-deps {name}` | Install Node (pnpm) and Python (uv) deps |
| `*check-squad-deps {name}` | Check dependency status without installing |
| `*run-workflow {squad} {wf}` | Execute a collaboration workflow |
| `*enable-triggers {name}` | Enable lifecycle triggers |
| `*disable-triggers {name}` | Disable lifecycle triggers |
| `*show-triggers {name}` | Show trigger configuration |
| `*trigger-log {name}` | Show trigger history |
| `*flow-preview {squad} {wf}` | Show planned flow map |
| `*flow-summary {squad}` | Show executed flow diagram |
| `*flow-live {squad}` | Enable/disable real-time tracking |
| `*setup-hooks` | Install Claude Code Hooks for automatic trigger emission |

---

## Workflows — how agents collaborate

5 built-in collaboration patterns:

| Pattern | Description | Use case |
|:--------|:-----------|:---------|
| **Pipeline** | A → B → C sequential | Content production, data processing |
| **Hub-and-Spoke** | Orchestrator delegates to specialists | Coordinated multi-step work |
| **Review** | Work → Review → Loop if fails | Quality gates, correctness |
| **Parallel** | Independent tasks, merge results | Non-dependent tasks |
| **Teams** | Real-time agent coordination | Complex reactive work |

Mix and match. A pipeline where each step has a review loop. A hub-and-spoke where specialists work in parallel.

---

## Triggers — lifecycle events

Opt-in lifecycle events that fire on key moments:

```yaml
# squad.yaml
triggers:
  enabled: true
  display: inline        # inline | log | both
  events:
    squad: true          # squad start/end
    agent: true          # agent start/end
    task: true           # task start/end
```

```
🚀 [SQUAD:bc] brandcraft v2.0.0 activated
   Agent: 🔍 bc-extractor
   Mission: Brand Asset Extraction

⚡ [TASK:bc] *extract-assets started
   Agent: bc-extractor

✅ [TASK:bc] bc-extractor completed *extract-assets
   Duration: 2m 15s
   Context: +12%

🏁 [SQUAD:bc] brandcraft session ended
   Duration: 13m 45s | Tasks: 8
```

Events are logged to JSONL for analysis, debugging, and [Flow Tracker](#flow-tracker--visualize-collaboration) visualization.

### Automatic emission with Claude Code Hooks

For reliable, zero-effort trigger emission, install the built-in hooks:

```bash
/squads *setup-hooks
```

This creates a Claude Code Hook that **automatically** emits JSONL events on every squad skill activation — no manual Bash commands needed. The hook detects squad context, tracks agent transitions, and writes events in real-time.

On platforms without hooks (Codex CLI, Gemini CLI, Cursor), the skill falls back to instruction-based emission.

---

## Flow Tracker — visualize collaboration

See exactly what your squad is doing with real-time flow diagrams — both in the terminal and in the browser.

> **[Try the live demo →](https://gutomec.github.io/ai-public-arsenal/demo/)**
>
> Watch a **21-agent hub-and-spoke team** (sales-funnel-masters) with parallel specialist flows, or an **8-agent sequential pipeline** (nirvana-squad-creator) — animated nodes, edges, and real-time event timeline.

### Terminal output

```
📋 Flow Preview: brandcraft / main-pipeline

  bc-extractor ──→ bc-inspector ──→ bc-templater ──→ bc-renderer
       │                                                   │
       └──────────── bc-illustrator (parallel) ────────────┘
                                    │
                              bc-refiner ←──→ bc-presenter
                              (review loop, max 3x)

  Agents: 6 | Steps: 7 | Pattern: pipeline + parallel + review
```

### Browser visualization

The Flow Tracker includes a browser-based viewer that renders squad pipelines as interactive SVG graphs via SSE (Server-Sent Events):

- **Adaptive BFS-level layout** — automatically arranges nodes by dependency depth; parallel agents appear side-by-side
- **Hub-and-spoke visualization** — orchestrators fan out to team leads, each with their own pipeline chain
- **Color-coded states**: gray (pending) → blue (active) → green (completed)
- **Animated transitions** on agent handoffs with particle effects
- **Live event timeline** with timestamps and task details
- **Progress bar** and execution metrics

**Two modes:**

| Mode | How | Best for |
|:-----|:----|:---------|
| **Demo** | Open [live demo](https://gutomec.github.io/ai-public-arsenal/demo/) or `demo/index.html` directly | Quick preview, sharing, GitHub Pages |
| **Dashboard** | `cd demo && node server.js` → `http://localhost:3001` | Real-time monitoring of live executions |

### A2UI Protocol

Flow Tracker supports the [A2UI protocol](https://a2ui.org/) for browser visualization — real-time graph updates via SSE with custom components:

| Component | Description |
|:----------|:-----------|
| `FlowGraph` | DAG layout container |
| `FlowNode` | Agent node with status (pending → active → completed) |
| `FlowEdge` | Delegation edge with artifact info |
| `FlowProgress` | Global progress bar |
| `FlowMetrics` | Duration, context delta, bottleneck |
| `FlowTimeline` | Vertical event timeline |

---

## Example Squads

This repo includes two production-ready squads you can study, copy, or use directly:

### nirvana-squad-creator

An 8-agent pipeline that creates other squads from scratch. Given a description of what you need, it analyzes requirements, creates agents, tasks, workflows, optimizes, validates, generates documentation, and publishes — fully automated.

```
squads/nirvana-squad-creator/
├── agents/    (8 specialists: analyzer, agent-creator, task-creator, ...)
├── tasks/     (22 tasks with pre/post conditions)
├── workflows/ (main pipeline + validation loop)
└── squad.yaml
```

### ultimate-landingpage

A 9-agent squad for building high-conversion landing pages. Researcher, strategist, copywriter, design architect, frontend dev, backend dev, image creator, integrator, and reviewer — each with clearly defined responsibilities.

```
squads/ultimate-landingpage/
├── agents/    (9 specialists: researcher, strategist, copywriter, ...)
├── tasks/     (33 tasks across the full LP lifecycle)
├── workflows/ (research → design → build → review pipeline)
└── squad.yaml
```

Browse the source in [`squads/`](squads/) to see how real squads are structured.

---

## Zero context pollution

Most multi-agent setups load every agent definition into the context window at startup. 10 agents? That is 10 markdown files eating your tokens before you even ask a question.

Squads loads **nothing** until you ask for it.

`*create-squad` loads the creation protocol. `*validate-squad` loads the validation checklist. `/SQUADS:my-squad:my-agent` loads that one agent's .md file. Nothing else.

100 squads in your project? Zero additional tokens in your context window until you call one.

---

## Dependencies

7 dependency types supported. Installation is lazy — nothing installs until you say so.

| Type | Manager | Status |
|:-----|:--------|:-------|
| Node | pnpm | Active |
| Python | uv | Active |
| System | — | Docs only |
| Squads (cross-squad) | — | Active |
| MCP tools | — | Docs only |
| Go | go modules | Reserved |
| Rust | cargo | Reserved |

Each squad keeps its own `node_modules/` and `.venv/`. No conflicts. No global pollution.

---

## Validation — 26 checks

```bash
/squads *validate-squad my-squad
```

**12 blocking** checks: valid squad.yaml, naming conventions, files exist, registration, trigger config.

**14 advisory** checks: coding standards, README, collaboration docs, dependencies, flow tracking.

A linter for your agent team.

---

## Works everywhere

This skill follows the [Agent Skills Spec](https://agentskills.io/specification) — the open standard for portable AI agent skills.

| Platform | Status |
|:---------|:-------|
| Claude Code | ✅ Full support |
| Codex CLI | ✅ Compatible |
| Gemini CLI | ✅ Compatible |
| Cursor | ✅ Compatible |
| Any Agent Skills Spec agent | ✅ Compatible |

Build your squads once. Run them anywhere.

---

## squads.sh marketplace

Browse, share, and install squads at [squads.sh](https://squads.sh).

Free or paid — your choice. Built a squad that works? Publish it. Need a squad for SEO, landing pages, data analysis? Someone already made one.

---

<div align="center">

```bash
npx skills add gutomec/squads
/squads *create-squad my-first-squad
```

**Go build your team.**

---

[Install](#install) · [Commands](#commands) · [Workflows](#workflows--how-agents-collaborate) · [Triggers](#triggers--lifecycle-events) · [Flow Tracker](#flow-tracker--visualize-collaboration) · [Example Squads](#example-squads) · [squads.sh](https://squads.sh)

</div>

## Author

**Luiz Gustavo Vieira Rodrigues** ([@gutomec](https://github.com/gutomec))

## License

MIT — see [LICENSE](LICENSE) for details.

<sub>The concept of squads as structured multi-agent teams was originally inspired by [AIOX Framework](https://github.com/SynkraAI/aiox-core) (SynkraAI Inc.), itself derived from [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD) (BMad Code, LLC). This is an independent project.</sub>

---

<div align="center">

[Português](README.pt.md) · [Español](README.es.md) · [中文](README.zh.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md)

</div>
