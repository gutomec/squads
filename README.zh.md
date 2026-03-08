# 你在用一个人扛所有事。而且看得出来。

一个 AI agent 干所有活。写代码、审代码、测代码、部署代码、规划架构、管理需求、处理 DevOps。

这不是系统。这是加了 prompt 的混乱。

你知道一个 agent 做 10 份工作会发生什么吗？跟一个员工做 10 份工作一样。所有事都做了。没有一件做好。

---

## AI 编程现在真正的问题

人人都在谈 AI agent。没人谈他们怎么用的。

大多数人是这么干的：打开 Claude Code，扔一个超长 prompt，然后祈祷。agent 写代码、审自己写的代码、测自己写的测试、部署自己搞出来的烂摊子。没有职责分离。没有边界。没有问责。

这就像雇一个人同时当 CEO、会计、清洁工和安保主管。同一天。同一份薪水。

能撑得住，直到撑不住的那天。而撑不住的时候，你完全不知道是哪个"角色"搞砸了——因为从来就没有真正的角色。

---

## Squads 解决这个问题

squad 是一支团队。不是一个 agent 假装是团队。而是真正有结构的 agent 群体，每个人都有名字、职责、边界和自己负责的任务。

想象一下：不再是一个 AI 包揽所有事，而是你搭建了一支团队，每个 agent 都是专家。

- 只写作的 writer
- 只审查的 reviewer
- 负责协调的 orchestrator
- 负责检验质量的 validator

每个 agent 都有自己的 markdown 文件，包含人设、命令和规则。每个任务都有前置条件和后置条件。每个 workflow 定义 agent 如何协作——谁先行动，谁来审查，谁来拍板。

不需要配置什么专有平台。不需要按席位付费。不需要学新工具。

就是一个目录。在你的项目里。里面是 markdown 文件。

```
squads/my-squad/
├── squad.yaml          # 清单 — 团队成员
├── agents/             # 每个 agent 一个 .md 文件
├── tasks/              # 每个任务一个 .md 文件
├── workflows/          # 协作模式
├── config/             # squad 级别配置
└── README.md           # 文档
```

把这个目录复制到另一个项目。squad 跟着走。不需要安装，不需要迁移配置，不需要 API key。agent、任务、workflow——全在这个文件夹里。

这才是可移植性。真正的可移植性。不是那种"导出成 JSON 然后祈祷"的可移植性。

---

## 它到底怎么运作

Squads 是 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 的一个 skill。装一次。然后去搭团队。

### 安装（30 秒）

```bash
cp -r squads-skill/ your-project/.claude/skills/squads/
mkdir -p your-project/squads/
```

完成。没有 npm install。没有 pip install。没有 Docker。没有 YAML 地狱。这个 skill 用的是 Claude Code 原生工具——Read、Write、Edit、Glob、Grep、Bash。没有外部依赖。

### 创建你的第一个 squad

```bash
/squads *create-squad content-pipeline
```

这会自动生成完整的目录结构、创建 squad.yaml 清单并配置好环境。现在你有了一支空团队。开始添加 agent。

```bash
/squads *add-agent content-pipeline writer
/squads *add-agent content-pipeline reviewer
/squads *add-agent content-pipeline publisher
```

三个 agent。每个都有自己的 .md 文件，包含人设、专业定义和命令。writer 写作。reviewer 审查。publisher 发布。没有人越界。

### 注册 slash commands

```bash
/squads *register-squad content-pipeline
```

现在你可以直接调用任何 agent：

```bash
/SQUADS:content-pipeline:cp-writer
/SQUADS:content-pipeline:cp-reviewer
```

不需要额外配置。不需要路由逻辑。注册一次，永久使用。

---

## 7 件你能做的事

| 命令 | 功能 |
|---------|-------------|
| `*create-squad {name}` | 生成完整的 squad 目录 |
| `*list-squads` | 显示所有 squad 及 agent 数量 |
| `*add-agent {squad} {role}` | 向团队添加专家 |
| `*validate-squad {name}` | 运行 20 项完整性检查 |
| `*register-squad {name}` | 为 squad 启用 slash commands |
| `*install-squad-deps {name}` | 安装 Node (pnpm) 和 Python (uv) 依赖 |
| `*run-workflow {squad} {name}` | 执行协作 workflow |

还有更多命令。这些是你每天会用到的。

---

## Workflows — agent 怎么真正协作

单个 agent 有用。能协作的 agent 才危险（好的那种危险）。

内置 5 种模式：

**Pipeline** — Agent A 产出内容，Agent B 转化，Agent C 收尾。顺序执行。像流水线。用于内容生产、数据处理，以及任何有明确阶段的工作。

**Hub-and-Spoke** — 一个 orchestrator，多个专家。orchestrator 分发任务、收集结果、整合输出。需要协调者的时候用这个。

**Review** — Agent 完成工作，reviewer 检查，不通过就循环。质量门禁模式。reviewer 不批准就不发布。用于任何需要准确性的工作。

**Parallel** — 多个 agent 同时处理独立任务，然后合并结果。任务之间互不依赖时用这个。

**Teams** — 通过 Claude Code Agent Teams 实现实时协调。agent 在执行过程中互相通信。用于复杂的多步骤工作，agent 需要对彼此的输出做出反应。

选适合的模式。或者组合使用。一条 pipeline，每个步骤带 review 循环。一个 hub-and-spoke，专家们并行工作。随意搭配。

---

## 零上下文污染

这是其他方案都没做对的地方。

大多数多 agent 方案在启动时就把所有 agent 定义加载进上下文窗口。10 个 agent？那是 10 个 markdown 文件在你开口问问题之前就吃掉你的 token。

Squads 在你需要之前什么都不加载。

`*create-squad` 加载创建协议。`*validate-squad` 加载验证清单。`/SQUADS:my-squad:my-agent` 加载那一个 agent 的 .md 文件。仅此而已。

你的项目里有 10 个 squad？100 个？在你调用之前，上下文窗口里零额外 token。这个 skill 精准读取——只读它需要的引用文件，在它需要的那一刻。

你的上下文窗口始终保持干净。

---

## 依赖管理，不头疼

Squads 支持 7 种依赖类型。安装是懒加载的——你不说装，就不装。

| 类型 | 包管理器 | 状态 |
|------|---------|--------|
| Node | pnpm | 可用 |
| Python | uv | 可用 |
| System | — | 仅文档 |
| Squads（跨 squad） | — | 可用 |
| MCP tools | — | 仅文档 |
| Go | go modules | 预留 |
| Rust | cargo | 预留 |

每个 squad 有自己的 `node_modules/` 和 `.venv/`。squad 之间不冲突。没有全局污染。

```bash
/squads *install-squad-deps my-squad    # 安装所有依赖
/squads *check-squad-deps my-squad      # 仅检查，不安装
```

---

## 验证 — 发布前的 20 项检查

```bash
/squads *validate-squad my-squad
```

9 项阻断性检查，必须全部通过：有效的 squad.yaml、命名规范、文件存在、注册完成。

11 项建议性检查，应当通过：编码规范、README 存在、协作已记录、依赖已安装。

把它当成你的 agent 团队的 linter。在结构性问题变成运行时问题之前就发现它们。

---

## 兼容一切（或者什么都不依赖）

Squads 与框架无关。单独使用。或与 oh-my-claudecode、GSD、BMad Method，或者你喜欢的任何编排框架一起用。

| 框架 | 集成方式 |
|-----------|------------------|
| 独立使用 | 自身即可运行，无依赖 |
| oh-my-claudecode | 通过 `team`、`ralph`、`autopilot` 进行多 squad 编排 |
| GSD | Squad 作为阶段执行器，通过 `execute-phase` 调用 |
| BMad Method | 作为 BMad pipeline 中的 squad 提供者 |
| 自定义 | 任何使用 Claude Code slash commands 的方案 |

框架处理协调。Squads 处理团队结构。职责清晰分离。

---

## 这是为谁设计的

不想买平台、但想要结构化 AI 团队的独立开发者。

需要可版本控制的、可重复执行的 agent workflow 的小团队。

用 Claude Code 做开发、厌倦了一个 agent 包干所有事的混乱的人。

任何看着自己的 AI workflow 心想"这需要真正的结构"的人。

## 这不适合谁

想要可视化拖拽式 agent 构建器的人。这里是目录里的 markdown 文件。需要 GUI 的话，去别处找。

不用 Claude Code 的人。Squads 是 Claude Code 的 skill。它在 Claude Code 里运行。就是这样。

---

## 能在每一个 AI 编程系统上运行。不只是 Claude Code。

大多数人第一眼看到 Squads 时会漏掉这一点。

一个 squad 是一个装着 markdown 文件的目录。一个 skill 是每个主流 AI 编程系统都理解的标准。Claude Code、Codex、Antigravity、Gemini CLI——它们说同一种语言：skills。

在 Claude Code 上装 Squads skill。你的 squad 能跑。装到 Codex 上。同样的 squad，同样的 agent，同样的 workflow。下个月迁移到 Antigravity。一切照常运行。`squads/` 目录不在乎是哪个 AI 系统在读它。agent 是 markdown。任务是 markdown。workflow 是 YAML。通用格式。

你不被绑死在一个厂商上。每次换工具都不需要重写 agent 定义。squad 搭一次。到处能跑。

这才是真正的可移植性。不是"在我们平台上能跑"的可移植性。是在每个平台上都能跑的可移植性。

---

## 市场已经有了

不是每个 squad 都要从零搭建。

[squads.sh](https://squads.sh) 是一个让人们发布 squad 的市场。免费或付费，由你决定。搭了一个真正好用的 content-pipeline squad？发出去。做了一个能抓到其他工具漏掉的 bug 的 code-review squad？想卖多少卖多少。需要 SEO 审计、落地页、数据分析的 squad？很可能已经有人做了并放上去了。

浏览现有的，拿好用的，改一改。或者从零搭自己的，让别人来用。

不管哪种，你不是一个人开始：[squads.sh](https://squads.sh)

---

## 30 秒推介

现在你有一个 AI agent 干所有事。没有边界。没有专业分工。没有协作模式。没有验证。

Squads 给你结构化的团队。每个 agent 有职责。每个任务有条件。每个 workflow 定义协作方式。所有东西都以可移植的 markdown 形式存在于你的仓库里。零上下文污染。零外部依赖。零成本。

30 秒完成安装。60 秒创建第一个 squad。用真正的团队发货，而不是靠一个 agent 假装。

```bash
cp -r squads-skill/ .claude/skills/squads/
mkdir -p squads/
/squads *create-squad my-first-squad
```

去搭建你的团队。愉快发货。

---

<p align="center">
  <a href="#安装30-秒">安装</a> · <a href="#创建你的第一个-squad">创建 squad</a> · <a href="#workflows--agent-怎么真正协作">Workflows</a> · <a href="#验证--发布前的-20-项检查">验证</a>
</p>

## 作者

Luiz Gustavo Vieira Rodrigues ([@gutomec](https://github.com/gutomec))

## 许可证

MIT

squad 作为结构化多 agent 团队的概念最初受到 [AIOX Framework](https://github.com/SynkraAI/aiox-core)（SynkraAI Inc.）的启发，而该框架本身源自 [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD)（BMad Code, LLC）。本项目是独立项目，以自己的架构、协议和特性重新实现并扩展了这一概念。

---

[English](README.md) | [Português](README.pt.md) | [Español](README.es.md) | [हिन्दी](README.hi.md) | [العربية](README.ar.md)
