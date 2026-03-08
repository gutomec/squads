# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão Geral

Plataforma de orquestração de squads multi-agente construída sobre AIOS (Anthropic Infrastructure for Orchestrated Squads). Contém 4 squads especializados que demonstram diferentes capacidades do framework.

## Estrutura do Projeto

```
squads/
├── nirvana-squad-creator/   # Meta-tool: gera squads a partir de linguagem natural (prefix: nsc)
├── ultimate-landingpage/    # Builder full-stack de landing pages (prefix: ultimate-lp)
├── brandcraft/              # Geração de conteúdo visual: PDF, PPTX, vídeo, carrossel (prefix: brandcraft)
└── aios-forge-squad/        # Desenvolvimento e otimização do próprio framework AIOS (prefix: afs)
```

Cada squad segue a mesma anatomia:
- `squad.yaml` — Manifesto (nome, versão, componentes, dependências, AIOS mínimo: 2.1.0)
- `agents/*.md` — Definições de agentes (YAML frontmatter + Markdown com persona, comandos, dependências)
- `tasks/*.md` — Definições de tarefas (YAML frontmatter + Markdown com Entrada/Saída/Checklist/Error Handling)
- `workflows/*.yaml` — Fluxos de trabalho (sequências de agentes, transições, condicionais)
- `config/*.md` — Padrões de código, tech stack, source tree

## Padrões Arquiteturais

**Especificações AIOS:**
- `AGENT-PERSONALIZATION-STANDARD-V1` — Agentes com archetype (Flow_Master, Builder, Guardian, Balancer, Explorer), persona e estilo de comunicação
- `TASK-FORMAT-SPECIFICATION-V1` — Tarefas com contratos explícitos de Input/Output
- Classificação atômica: Atom → Molecule → Organism → Ecosystem

**Padrões de workflow:**
- Pipeline sequencial (nirvana-squad-creator: 9 fases lineares)
- Execução paralela (ultimate-landingpage: design + copy em paralelo; frontend + backend em paralelo)
- Componentes condicionais via feature flags (ultimate-landingpage: `backend`, `whatsapp`, `email`)
- Roteamento dinâmico (brandcraft: orchestrator roteia para pipeline correto)

## Tech Stack por Squad

**BrandCraft** (o maior, com node_modules):
- Puppeteer ^23 (HTML→PDF/PNG), PptxGenJS ^3.12 (PPTX), Remotion ^4 (vídeo React→MP4/WebM)
- Scripts de produção em `scripts/render.js` e `scripts/create-pptx.js`
- Geração de imagem via MCPs: nano-banana-pro (Gemini), dalle3, fal-video, flux

**Ultimate Landing Page:**
- Frontend: Next.js 15, React 19, TypeScript 5, Tailwind 4, shadcn/ui
- Backend (condicional): Python 3.12+, FastAPI, SQLAlchemy 2.0 async, Alembic

**Nirvana Squad Creator / AIOS Forge:** Node.js puro, zero dependências npm

## Convenções

- Arquivos de definição (agents, tasks) usam **português** no corpo (Entrada, Saída, Checklist) com YAML frontmatter em inglês
- Nomes de variáveis e código em **inglês**
- Sempre manter acentuação correta em PT-BR
- Encoding UTF-8 em todos os arquivos
