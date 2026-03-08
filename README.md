# You're running a one-man army. And it shows.

One AI agent doing everything. Writing code, reviewing code, testing code, deploying code, planning architecture, managing backlog, handling DevOps.

That is not a system. That is chaos with a prompt.

You know what happens when one agent does 10 jobs? The same thing that happens when one employee does 10 jobs. Everything gets done. Nothing gets done well.

---

## The real problem with AI coding right now

Everyone talks about AI agents. Nobody talks about how they're using them.

Here is what most people do: they open Claude Code, give it a massive prompt, and pray. The agent writes code, reviews its own code, tests its own tests, and deploys its own mess. No separation of concerns. No boundaries. No accountability.

That is like hiring one person to be the CEO, accountant, janitor, and head of security. On the same day. For the same salary.

It works until it doesn't. And when it doesn't, you have no idea which "role" broke things because there was never a real role to begin with.

---

## Squads fix this

A squad is a team. Not one agent pretending to be a team. An actual structured group of agents where each one has a name, a job, boundaries, and tasks it owns.

Think of it like this: instead of one AI doing everything, you build a team where each agent is a specialist.

- A writer that only writes
- A reviewer that only reviews
- An orchestrator that coordinates
- A validator that checks quality

Each agent has its own markdown file with a persona, commands, and rules. Each task has pre-conditions and post-conditions. Each workflow defines how agents collaborate — who goes first, who reviews, who signs off.

You don't configure this in some proprietary platform. You don't pay for seats. You don't learn a new tool.

It is a directory. In your project. With markdown files.

```
squads/my-squad/
├── squad.yaml          # the manifest — who is on this team
├── agents/             # one .md file per agent
├── tasks/              # one .md file per task
├── workflows/          # collaboration patterns
├── config/             # squad-level settings
└── README.md           # documentation
```

Copy the directory to another project. The squad comes with it. No install, no config migration, no API keys. The agents, tasks, and workflows are all right there in the folder.

That is portability. Real portability. Not "export to JSON and pray" portability.

---

## Install

### Option 1: skills.sh (recommended)

```bash
npx skills add gutomec/squads
```

One command. Works with Claude Code, Codex CLI, Gemini CLI, Cursor, and any agent that supports the [Agent Skills Spec](https://agentskills.io).

### Option 2: Manual

```bash
# Clone into your project's skills directory
git clone https://github.com/gutomec/squads.git .claude/skills/squads

# Or copy just what you need
mkdir -p .claude/skills/squads
cp SKILL.md .claude/skills/squads/
cp -r references/ .claude/skills/squads/references/
```

Then create your squads directory:

```bash
mkdir -p squads/
```

Done. No npm install. No pip install. No Docker. No YAML hell. The skill uses native agent tools — Read, Write, Edit, Glob, Grep, Bash. Nothing external.

---

## How it works

### Create your first squad

```
/squads *create-squad content-pipeline
```

This scaffolds the entire directory structure, generates a squad.yaml manifest, and sets up the config. You now have an empty team. Start adding agents.

```
/squads *add-agent content-pipeline writer
/squads *add-agent content-pipeline reviewer
/squads *add-agent content-pipeline publisher
```

Three agents. Each one gets its own .md file with a persona, expertise definition, and commands. The writer writes. The reviewer reviews. The publisher publishes. Nobody does someone else's job.

### Register for slash commands

```
/squads *register-squad content-pipeline
```

Now you can invoke any agent directly:

```
/SQUADS:content-pipeline:cp-writer
/SQUADS:content-pipeline:cp-reviewer
```

No extra config. No routing logic. Register once, use forever.

---

## Commands

| Command | What it does |
|---------|-------------|
| `*create-squad {name}` | Scaffolds a full squad directory |
| `*list-squads` | Shows all squads with agent counts |
| `*inspect-squad {name}` | Shows squad details and structure |
| `*add-agent {squad} {role}` | Adds a specialist to the team |
| `*remove-agent {squad} {id}` | Removes an agent from the squad |
| `*add-task {squad} {name}` | Adds a task to existing squad |
| `*add-workflow {squad} {name}` | Adds a workflow to existing squad |
| `*validate-squad {name}` | Runs 26 integrity checks |
| `*register-squad {name}` | Enables slash commands for the squad |
| `*unregister-squad {name}` | Removes squad registration |
| `*install-squad-deps {name}` | Installs Node (pnpm) and Python (uv) deps |
| `*check-squad-deps {name}` | Checks dependency status without installing |
| `*run-workflow {squad} {wf}` | Executes a collaboration workflow |
| `*enable-triggers {name}` | Enable lifecycle triggers |
| `*disable-triggers {name}` | Disable lifecycle triggers |
| `*show-triggers {name}` | Show trigger configuration |
| `*trigger-log {name}` | Show trigger history |
| `*flow-preview {squad} {wf}` | Show planned flow map (terminal + A2UI) |
| `*flow-summary {squad}` | Show executed flow diagram |
| `*flow-live {squad}` | Enable/disable real-time flow tracking |

---

## Workflows — how agents collaborate

An agent alone is useful. Agents that collaborate are dangerous (in a good way).

5 patterns built in:

**Pipeline** — Agent A produces output, Agent B transforms it, Agent C finalizes. Sequential. Like an assembly line. Use this for content production, data processing, anything with clear stages.

**Hub-and-Spoke** — One orchestrator, multiple specialists. The orchestrator delegates, collects results, synthesizes. Use this when you need a coordinator.

**Review** — Agent does work, reviewer checks it, loops back if it fails. Quality gate pattern. Nothing ships until the reviewer approves. Use this for anything that needs to be correct.

**Parallel** — Multiple agents work on independent tasks at the same time, then merge results. Use this when tasks don't depend on each other.

**Teams** — Real-time coordination via Claude Code Agent Teams. Agents communicate during execution. Use this for complex multi-step work where agents need to react to each other.

Pick the pattern that fits. Or combine them. A pipeline where each step has a review loop. A hub-and-spoke where the specialists work in parallel. Mix and match.

---

## Triggers — lifecycle events for squads

Squads support opt-in lifecycle triggers that fire on key events:

- **squad-start** / **squad-end** — when a squad session begins/ends
- **agent-start** / **agent-end** — when an agent is invoked/completes
- **task-start** / **task-end** — when a task begins/completes
- **delegation** — when one agent hands off to another
- **error** — when something fails

Triggers are opt-in per squad via `squad.yaml`. Events are logged to JSONL for analysis and debugging. Enable with `*enable-triggers {squad}`, check with `*show-triggers {squad}`.

---

## Flow Tracker — visualize agent collaboration

See exactly what your squad is doing with ASCII flow diagrams:

- **`*flow-preview`** — shows the planned execution path before running
- **`*flow-live`** — real-time tracking as agents execute
- **`*flow-summary`** — post-execution diagram of what happened

Flow diagrams render in terminal and optionally in A2UI browser interface. Track delegation chains, identify bottlenecks, understand how your agents actually collaborate.

---

## Zero context pollution

This is the part nobody else gets right.

Most multi-agent setups load every agent definition into the context window at startup. 10 agents? That is 10 markdown files eating your tokens before you even ask a question.

Squads loads nothing until you ask for it.

`*create-squad` loads the creation protocol. `*validate-squad` loads the validation checklist. `/SQUADS:my-squad:my-agent` loads that one agent's .md file. Nothing else.

10 squads in your project? 100 squads? Zero additional tokens in your context window until you call one. The skill reads surgically — only the reference file it needs, at the exact moment it needs it.

Your context window stays clean. Always.

---

## Dependencies without the headache

Squads support 7 dependency types. Installation is lazy — nothing installs until you say so.

| Type | Manager | Status |
|------|---------|--------|
| Node | pnpm | Active |
| Python | uv | Active |
| System | — | Docs only |
| Squads (cross-squad) | — | Active |
| MCP tools | — | Docs only |
| Go | go modules | Reserved |
| Rust | cargo | Reserved |

Each squad keeps its own `node_modules/` and `.venv/`. No conflicts between squads. No global pollution.

```
/squads *install-squad-deps my-squad    # installs everything
/squads *check-squad-deps my-squad      # checks without installing
```

---

## Validation — 26 checks before you ship

```
/squads *validate-squad my-squad
```

12 blocking checks that must pass: valid squad.yaml, naming conventions, files exist, registration complete, trigger config valid.

14 advisory checks that should pass: coding standards, README present, collaboration documented, dependencies installed, flow tracking configured.

Think of it as a linter for your agent team. Catches structural problems before they become runtime problems.

---

## Works everywhere — not just Claude Code

A squad is a directory with markdown files. A skill is a standard that every major AI coding system understands.

This skill follows the [Agent Skills Spec](https://agentskills.io/specification) — the open standard for portable AI agent skills. Install it on Claude Code, Codex CLI, Gemini CLI, Cursor, or any agent that supports the spec. Same squads, same agents, same workflows. The `squads/` directory doesn't care which AI system reads it.

Install via [skills.sh](https://skills.sh):

```bash
npx skills add gutomec/squads
```

You're not locked into one vendor. Build your squads once. Run them anywhere.

| Platform | Status |
|----------|--------|
| Claude Code | Full support |
| Codex CLI | Compatible |
| Gemini CLI | Compatible |
| Cursor | Compatible |
| Any Agent Skills Spec agent | Compatible |

---

## squads.sh marketplace

You don't have to build every squad from scratch.

[squads.sh](https://squads.sh) is a marketplace where people publish their squads. Free or paid — up to you. Built a content-pipeline squad that actually works? Post it. Made a code-review squad that catches bugs other tools miss? Sell it for whatever you want. Need a squad for SEO audits, landing pages, data analysis? Chances are someone already made one and put it up there.

Browse what exists. Grab what works. Tweak it. Or build your own from zero and let other people use it.

Either way, you're not starting alone: [squads.sh](https://squads.sh)

---

## The pitch in 30 seconds

Right now you have one AI agent doing everything. No boundaries. No specialization. No collaboration patterns. No validation.

Squads gives you structured teams. Each agent has a job. Each task has conditions. Each workflow defines collaboration. Everything lives in your repo as portable markdown. Zero context pollution. Zero external dependencies. Zero cost.

Install in one command. Create your first squad in 60 seconds. Start shipping with a real team instead of one agent pretending.

```bash
npx skills add gutomec/squads
/squads *create-squad my-first-squad
```

Go build your team. Happy shipping.

---

<p align="center">
  <a href="#install">Install</a> · <a href="#how-it-works">Create a squad</a> · <a href="#workflows--how-agents-collaborate">Workflows</a> · <a href="#triggers--lifecycle-events-for-squads">Triggers</a> · <a href="#flow-tracker--visualize-agent-collaboration">Flow Tracker</a> · <a href="#validation--26-checks-before-you-ship">Validation</a>
</p>

## Author

Luiz Gustavo Vieira Rodrigues ([@gutomec](https://github.com/gutomec))

## License

MIT — see [LICENSE](LICENSE) for details.

The concept of squads as structured multi-agent teams was originally inspired by [AIOX Framework](https://github.com/SynkraAI/aiox-core) (SynkraAI Inc.), itself derived from [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD) (BMad Code, LLC). This is an independent project that reimplements and expands the concept with its own architecture, protocols, and features.

---

[Português](README.pt.md) · [Español](README.es.md) · [中文](README.zh.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md)
