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

## How it actually works

Squads is a skill for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). You install it once. Then you build teams.

### Install (30 seconds)

```bash
cp -r squads-skill/ your-project/.claude/skills/squads/
mkdir -p your-project/squads/
```

Done. No npm install. No pip install. No Docker. No YAML hell. The skill uses native Claude Code tools — Read, Write, Edit, Glob, Grep, Bash. Nothing external.

### Create your first squad

```bash
/squads *create-squad content-pipeline
```

This scaffolds the entire directory structure, generates a squad.yaml manifest, and sets up the config. You now have an empty team. Start adding agents.

```bash
/squads *add-agent content-pipeline writer
/squads *add-agent content-pipeline reviewer
/squads *add-agent content-pipeline publisher
```

Three agents. Each one gets its own .md file with a persona, expertise definition, and commands. The writer writes. The reviewer reviews. The publisher publishes. Nobody does someone else's job.

### Register for slash commands

```bash
/squads *register-squad content-pipeline
```

Now you can invoke any agent directly:

```bash
/SQUADS:content-pipeline:cp-writer
/SQUADS:content-pipeline:cp-reviewer
```

No extra config. No routing logic. Register once, use forever.

---

## 7 things you can do

| Command | What it does |
|---------|-------------|
| `*create-squad {name}` | Scaffolds a full squad directory |
| `*list-squads` | Shows all squads with agent counts |
| `*add-agent {squad} {role}` | Adds a specialist to the team |
| `*validate-squad {name}` | Runs 20 integrity checks |
| `*register-squad {name}` | Enables slash commands for the squad |
| `*install-squad-deps {name}` | Installs Node (pnpm) and Python (uv) deps |
| `*run-workflow {squad} {name}` | Executes a collaboration workflow |

There are more commands. These are the ones you'll use every day.

---

## Workflows — how agents actually collaborate

An agent alone is useful. Agents that collaborate are dangerous (in a good way).

5 patterns built in:

**Pipeline** — Agent A produces output, Agent B transforms it, Agent C finalizes. Sequential. Like an assembly line. Use this for content production, data processing, anything with clear stages.

**Hub-and-Spoke** — One orchestrator, multiple specialists. The orchestrator delegates, collects results, synthesizes. Use this when you need a coordinator.

**Review** — Agent does work, reviewer checks it, loops back if it fails. Quality gate pattern. Nothing ships until the reviewer approves. Use this for anything that needs to be correct.

**Parallel** — Multiple agents work on independent tasks at the same time, then merge results. Use this when tasks don't depend on each other.

**Teams** — Real-time coordination via Claude Code Agent Teams. Agents communicate during execution. Use this for complex multi-step work where agents need to react to each other.

Pick the pattern that fits. Or combine them. A pipeline where each step has a review loop. A hub-and-spoke where the specialists work in parallel. Mix and match.

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

```bash
/squads *install-squad-deps my-squad    # installs everything
/squads *check-squad-deps my-squad      # checks without installing
```

---

## Validation — 20 checks before you ship

```bash
/squads *validate-squad my-squad
```

9 blocking checks that must pass: valid squad.yaml, naming conventions, files exist, registration complete.

11 advisory checks that should pass: coding standards, README present, collaboration documented, dependencies installed.

Think of it as a linter for your agent team. Catches structural problems before they become runtime problems.

---

## Works with everything (or nothing)

Squads is framework-agnostic. Use it standalone. Use it with oh-my-claudecode, GSD, BMad Method, or whatever orchestration framework you prefer.

| Framework | How it integrates |
|-----------|------------------|
| Standalone | Works on its own, no dependencies |
| oh-my-claudecode | Multi-squad orchestration via `team`, `ralph`, `autopilot` |
| GSD | Squads as phase executors via `execute-phase` |
| BMad Method | Compatible as squad provider in BMad pipeline |
| Custom | Anything that uses Claude Code slash commands |

The framework handles coordination. Squads handles team structure. Clean separation.

---

## Who this is for

Solo developers who want structured AI teams without buying a platform.

Small teams who need repeatable agent workflows they can version control.

People building with Claude Code who are tired of one-agent-does-everything chaos.

Anyone who looked at their AI workflow and thought "this needs actual structure."

## Who this is NOT for

People who want a visual drag-and-drop agent builder. This is markdown files in directories. If you need a GUI, look elsewhere.

People who don't use Claude Code. Squads is a Claude Code skill. It runs inside Claude Code. That's the deal.

---

## Works on every AI coding system. Not just Claude Code.

This is the part people miss when they first look at Squads.

A squad is a directory with markdown files. A skill is a standard that every major AI coding system understands. Claude Code, Codex, Antigravity, Gemini CLI — they all speak the same language: skills.

Install the Squads skill on Claude Code. Your squads work. Install it on Codex. Same squads, same agents, same workflows. Move to Antigravity next month. Everything still works. The `squads/` directory doesn't care which AI system reads it. The agents are markdown. The tasks are markdown. The workflows are YAML. Universal formats.

You're not locked into one vendor. You're not rewriting agent definitions every time you switch tools. Build your squads once. Run them anywhere.

That is real portability. Not "works on our platform" portability. Works on every platform portability.

---

## There's already a marketplace

You don't have to build every squad from scratch.

[squads.sh](https://squads.sh) is a marketplace where people publish their squads. Free or paid — up to you. Built a content-pipeline squad that actually works? Post it. Made a code-review squad that catches bugs other tools miss? Sell it for whatever you want. Need a squad for SEO audits, landing pages, data analysis? Chances are someone already made one and put it up there.

Browse what exists. Grab what works. Tweak it. Or build your own from zero and let other people use it.

Either way, you're not starting alone: [squads.sh](https://squads.sh)

---

## The pitch in 30 seconds

Right now you have one AI agent doing everything. No boundaries. No specialization. No collaboration patterns. No validation.

Squads gives you structured teams. Each agent has a job. Each task has conditions. Each workflow defines collaboration. Everything lives in your repo as portable markdown. Zero context pollution. Zero external dependencies. Zero cost.

Install in 30 seconds. Create your first squad in 60 seconds. Start shipping with a real team instead of one agent pretending.

```bash
cp -r squads-skill/ .claude/skills/squads/
mkdir -p squads/
/squads *create-squad my-first-squad
```

Go build your team. Happy shipping.

---

<p align="center">
  <a href="#install-30-seconds">Install</a> · <a href="#create-your-first-squad">Create a squad</a> · <a href="#workflows--how-agents-actually-collaborate">Workflows</a> · <a href="#validation--20-checks-before-you-ship">Validation</a>
</p>

## Author

Luiz Gustavo Vieira Rodrigues ([@gutomec](https://github.com/gutomec))

## License

MIT

The concept of squads as structured multi-agent teams was originally inspired by [AIOX Framework](https://github.com/SynkraAI/aiox-core) (SynkraAI Inc.), itself derived from [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD) (BMad Code, LLC). This is an independent project that reimplements and expands the concept with its own architecture, protocols, and features.

---

[Português](README.pt.md) | [Español](README.es.md) | [中文](README.zh.md) | [हिन्दी](README.hi.md) | [العربية](README.ar.md)
