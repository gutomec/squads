# Você está rodando um exército de um homem só. E dá pra ver.

Um agente de IA fazendo tudo. Escrever código, revisar código, testar, fazer deploy, planejar arquitetura, gerenciar backlog, cuidar de DevOps.

Isso não é um sistema. É caos com um prompt.

Sabe o que acontece quando um agente faz 10 trabalhos? A mesma coisa que acontece quando um funcionário faz 10 trabalhos. Tudo fica pronto. Nada fica bem feito.

---

## O problema real com IA pra código hoje

Todo mundo fala de agentes de IA. Ninguém fala de como está usando.

O que a maioria das pessoas faz: abre o Claude Code, manda um prompt gigante e torce. O agente escreve o código, revisa o próprio código, testa os próprios testes, e faz deploy da própria bagunça. Sem separação de responsabilidades. Sem limites. Sem accountability.

É como contratar uma pessoa pra ser CEO, contador, faxineiro e chefe de segurança. No mesmo dia. Pelo mesmo salário.

Funciona até parar de funcionar. E quando para, você não tem a menor ideia de qual "função" quebrou as coisas — porque nunca existiu uma função de verdade.

---

## Squads resolve isso

Um squad é um time. Não um agente fingindo ser um time. Um grupo estruturado de agentes onde cada um tem nome, função, limites e tarefas que são dele.

Em vez de um AI fazendo tudo, você monta um time onde cada agente é especialista.

- Um writer que só escreve
- Um reviewer que só revisa
- Um orchestrator que coordena
- Um validator que verifica qualidade

Cada agente tem seu próprio arquivo markdown com persona, comandos e regras. Cada tarefa tem pré-condições e pós-condições. Cada workflow define como os agentes colaboram — quem vai primeiro, quem revisa, quem aprova.

Você não configura nada em plataforma proprietária. Não paga por seat. Não aprende ferramenta nova.

É um diretório. No seu projeto. Com arquivos markdown.

```
squads/my-squad/
├── squad.yaml          # o manifesto — quem está no time
├── agents/             # um arquivo .md por agente
├── tasks/              # um arquivo .md por tarefa
├── workflows/          # padrões de colaboração
├── config/             # configurações do squad
└── README.md           # documentação
```

Copia o diretório pra outro projeto. O squad vai junto. Sem install, sem migração de config, sem API keys. Agentes, tarefas e workflows estão todos ali na pasta.

Isso é portabilidade. Portabilidade de verdade. Não aquela de "exportar pra JSON e rezar".

---

## Como funciona na prática

Squads é uma skill para o [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Você instala uma vez. Depois monta os times.

### Install (30 segundos)

```bash
cp -r squads-skill/ your-project/.claude/skills/squads/
mkdir -p your-project/squads/
```

Pronto. Sem npm install. Sem pip install. Sem Docker. Sem YAML hell. A skill usa as ferramentas nativas do Claude Code — Read, Write, Edit, Glob, Grep, Bash. Nada externo.

### Crie seu primeiro squad

```bash
/squads *create-squad content-pipeline
```

Isso cria toda a estrutura de diretórios, gera um manifesto squad.yaml e configura tudo. Agora você tem um time vazio. Começa a adicionar agentes.

```bash
/squads *add-agent content-pipeline writer
/squads *add-agent content-pipeline reviewer
/squads *add-agent content-pipeline publisher
```

Três agentes. Cada um ganha seu arquivo .md com persona, definição de expertise e comandos. O writer escreve. O reviewer revisa. O publisher publica. Ninguém faz o trabalho do outro.

### Registre para slash commands

```bash
/squads *register-squad content-pipeline
```

Agora você invoca qualquer agente diretamente:

```bash
/SQUADS:content-pipeline:cp-writer
/SQUADS:content-pipeline:cp-reviewer
```

Sem config extra. Sem lógica de roteamento. Registra uma vez, usa pra sempre.

---

## 7 coisas que você pode fazer

| Comando | O que faz |
|---------|-----------|
| `*create-squad {name}` | Cria a estrutura completa do squad |
| `*list-squads` | Lista todos os squads com contagem de agentes |
| `*add-agent {squad} {role}` | Adiciona um especialista ao time |
| `*validate-squad {name}` | Roda 20 verificações de integridade |
| `*register-squad {name}` | Habilita slash commands para o squad |
| `*install-squad-deps {name}` | Instala dependências Node (pnpm) e Python (uv) |
| `*run-workflow {squad} {name}` | Executa um workflow de colaboração |

Tem mais comandos. Esses são os que você vai usar todo dia.

---

## Workflows — como os agentes colaboram de verdade

Um agente sozinho é útil. Agentes que colaboram são perigosos — no bom sentido.

5 padrões já incluídos:

**Pipeline** — Agente A produz, Agente B transforma, Agente C finaliza. Sequencial, como uma linha de montagem. Use pra produção de conteúdo, processamento de dados, qualquer coisa com etapas bem definidas.

**Hub-and-Spoke** — Um orchestrator, vários especialistas. O orchestrator delega, coleta resultados, sintetiza. Use quando você precisa de um coordenador no meio do processo.

**Review** — Agente faz o trabalho, reviewer confere, volta se reprovar. Padrão de quality gate. Nada sai até o reviewer aprovar. Use pra qualquer coisa que precisa estar certa.

**Parallel** — Vários agentes trabalham em tarefas independentes ao mesmo tempo, depois mesclam os resultados. Use quando as tarefas não dependem uma da outra.

**Teams** — Coordenação em tempo real via Claude Code Agent Teams. Agentes se comunicam durante a execução. Use pra trabalho multi-step complexo onde os agentes precisam reagir um ao outro.

Escolhe o padrão que encaixa. Ou combina. Um pipeline onde cada etapa tem um review loop. Um hub-and-spoke onde os especialistas trabalham em paralelo. Mistura à vontade.

---

## Zero poluição de contexto

Essa é a parte que ninguém acerta.

A maioria dos setups multi-agente carrega a definição de todo agente na context window na inicialização. 10 agentes? São 10 arquivos markdown comendo seus tokens antes de você fazer a primeira pergunta.

Squads não carrega nada até você pedir.

`*create-squad` carrega o protocolo de criação. `*validate-squad` carrega o checklist de validação. `/SQUADS:my-squad:my-agent` carrega o arquivo .md daquele agente específico. Mais nada.

10 squads no projeto? 100 squads? Zero tokens adicionais na sua context window até você chamar um. A skill lê cirurgicamente — só o arquivo de referência que precisa, no momento exato que precisa.

Sua context window fica limpa. Sempre.

---

## Dependências sem dor de cabeça

Squads suportam 7 tipos de dependência. A instalação é lazy — nada instala até você mandar.

| Tipo | Gerenciador | Status |
|------|-------------|--------|
| Node | pnpm | Ativo |
| Python | uv | Ativo |
| System | — | Apenas docs |
| Squads (cross-squad) | — | Ativo |
| MCP tools | — | Apenas docs |
| Go | go modules | Reservado |
| Rust | cargo | Reservado |

Cada squad mantém seu próprio `node_modules/` e `.venv/`. Sem conflitos entre squads. Sem poluição global.

```bash
/squads *install-squad-deps my-squad    # instala tudo
/squads *check-squad-deps my-squad      # verifica sem instalar
```

---

## Validação — 20 checks antes de subir

```bash
/squads *validate-squad my-squad
```

9 checks bloqueantes que precisam passar: squad.yaml válido, convenções de nomenclatura, arquivos existentes, registro completo.

11 checks consultivos que deveriam passar: padrões de código, README presente, colaboração documentada, dependências instaladas.

Pensa como um linter pra seu time de agentes. Captura problemas estruturais antes que virem problemas em runtime.

---

## Funciona com qualquer coisa (ou com nada)

Squads é agnóstico de framework. Use standalone. Use com oh-my-claudecode, GSD, BMad Method, ou qualquer framework de orquestração que você preferir.

| Framework | Como integra |
|-----------|--------------|
| Standalone | Funciona sozinho, sem dependências |
| oh-my-claudecode | Orquestração multi-squad via `team`, `ralph`, `autopilot` |
| GSD | Squads como executores de fase via `execute-phase` |
| BMad Method | Compatível como squad provider no pipeline BMad |
| Custom | Qualquer coisa que use slash commands do Claude Code |

O framework cuida da coordenação. Squads cuida da estrutura do time. Separação limpa.

---

## Pra quem é isso

Devs solo que querem times de AI estruturados sem comprar plataforma.

Times pequenos que precisam de workflows de agente repetíveis e que dá pra versionar.

Pessoas que desenvolvem com Claude Code e estão cansadas do caos de um-agente-faz-tudo.

Qualquer um que olhou pro próprio workflow de AI e pensou "isso aqui precisa de estrutura de verdade."

## Pra quem NÃO é

Quem quer um builder visual de agentes com drag-and-drop. Isso aqui são arquivos markdown em diretórios. Se precisar de GUI, procura em outro lugar.

Quem não usa Claude Code. Squads é uma skill do Claude Code. Roda dentro do Claude Code. Esse é o deal.

---

## Funciona em qualquer sistema de IA. Não só no Claude Code.

Essa é a parte que a galera não percebe de primeira.

Um squad é um diretório com arquivos markdown. Uma skill é um padrão que todo sistema de IA moderno entende. Claude Code, Codex, Antigravity, Gemini CLI — todos falam a mesma língua: skills.

Instala a skill do Squads no Claude Code. Seus squads funcionam. Instala no Codex. Os mesmos squads, os mesmos agentes, os mesmos workflows. Migra pro Antigravity mês que vem. Continua funcionando. O diretório `squads/` não sabe nem liga pra qual sistema de IA está lendo. Os agentes são markdown. As tarefas são markdown. Os workflows são YAML. Formatos universais.

Você não fica preso num vendor. Não reescreve definição de agente toda vez que troca de ferramenta. Monta seus squads uma vez. Roda em qualquer lugar.

Isso é portabilidade de verdade. Não "funciona na nossa plataforma". Funciona em toda plataforma.

---

## Já tem marketplace

Você não precisa construir cada squad do zero.

[squads.sh](https://squads.sh) é um marketplace onde as pessoas publicam seus squads. Gratuito ou pago — você decide. Montou um squad de content-pipeline que funciona de verdade? Publica. Fez um squad de code-review que pega bugs que outras ferramentas deixam passar? Vende pelo preço que quiser. Precisa de um squad pra auditoria de SEO, landing pages, análise de dados? Provavelmente alguém já fez e colocou lá.

Navega pelo que existe. Pega o que funciona. Adapta. Ou constrói do zero e deixa outros usarem.

De qualquer forma, você não começa sozinho: [squads.sh](https://squads.sh)

---

## O pitch em 30 segundos

Agora você tem um agente de AI fazendo tudo. Sem limites. Sem especialização. Sem padrões de colaboração. Sem validação.

Squads te dá times estruturados. Cada agente tem uma função. Cada tarefa tem condições. Cada workflow define a colaboração. Tudo fica no seu repo como markdown portável. Zero poluição de contexto. Zero dependências externas. Zero custo.

Instala em 30 segundos. Cria o primeiro squad em 60 segundos. Começa a entregar com um time real em vez de um agente fingindo.

```bash
cp -r squads-skill/ .claude/skills/squads/
mkdir -p squads/
/squads *create-squad my-first-squad
```

Vai montar seu time.

---

<p align="center">
  <a href="#install-30-segundos">Install</a> · <a href="#crie-seu-primeiro-squad">Criar um squad</a> · <a href="#workflows--como-os-agentes-colaboram-de-verdade">Workflows</a> · <a href="#validação--20-checks-antes-de-subir">Validação</a>
</p>

## Autor

Luiz Gustavo Vieira Rodrigues ([@gutomec](https://github.com/gutomec))

## License

MIT

O conceito de squads como times multi-agente estruturados foi originalmente inspirado pelo [AIOX Framework](https://github.com/SynkraAI/aiox-core) (SynkraAI Inc.), que por sua vez deriva do [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD) (BMad Code, LLC). Este é um projeto independente que reimplementa e expande o conceito com arquitetura, protocolos e funcionalidades próprias.

---

[English](README.md) | [Español](README.es.md) | [中文](README.zh.md) | [हिन्दी](README.hi.md) | [العربية](README.ar.md)
