# Estás operando con un ejército de una sola persona. Y se nota.

Un agente de IA haciendo todo. Escribiendo código, revisando código, testeando código, desplegando código, planificando arquitectura, gestionando el backlog, manejando DevOps.

Eso no es un sistema. Es caos con un prompt.

¿Sabes qué pasa cuando un agente hace 10 trabajos? Lo mismo que pasa cuando un empleado hace 10 trabajos. Todo se hace. Nada se hace bien.

---

## El verdadero problema con el código con IA hoy

Todos hablan de agentes de IA. Nadie habla de cómo los está usando.

Esto es lo que hace la mayoría: abren Claude Code, le dan un prompt gigante y rezan. El agente escribe código, revisa su propio código, testea sus propios tests y despliega su propio desastre. Sin separación de responsabilidades. Sin límites. Sin rendición de cuentas.

Es como contratar a una sola persona para ser CEO, contador, conserje y jefe de seguridad. El mismo día. Con el mismo sueldo.

Funciona hasta que deja de funcionar. Y cuando deja de funcionar, no tienes idea de qué "rol" rompió todo — porque nunca hubo un rol real desde el principio.

---

## Squads resuelve esto

Un squad es un equipo. No un agente haciéndose pasar por un equipo. Un grupo estructurado real de agentes donde cada uno tiene un nombre, un trabajo, límites y tareas que le pertenecen.

Piénsalo así: en lugar de una IA haciendo todo, construyes un equipo donde cada agente es especialista.

- Un escritor que solo escribe
- Un revisor que solo revisa
- Un orquestador que coordina
- Un validador que verifica la calidad

Cada agente tiene su propio archivo markdown con una persona, comandos y reglas. Cada tarea tiene precondiciones y postcondiciones. Cada workflow define cómo colaboran los agentes — quién va primero, quién revisa, quién aprueba.

No configuras esto en alguna plataforma propietaria. No pagas por licencias. No aprendes una nueva herramienta.

Es un directorio. En tu proyecto. Con archivos markdown.

```
squads/my-squad/
├── squad.yaml          # el manifiesto — quién está en este equipo
├── agents/             # un archivo .md por agente
├── tasks/              # un archivo .md por tarea
├── workflows/          # patrones de colaboración
├── config/             # configuración del squad
└── README.md           # documentación
```

Copia el directorio a otro proyecto. El squad viene con él. Sin instalación, sin migración de config, sin API keys. Los agentes, tareas y workflows están todos ahí en la carpeta.

Eso es portabilidad. Portabilidad real. No la portabilidad de "exportar a JSON y rezar".

---

## Cómo funciona en la práctica

Squads es un skill para [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Lo instalas una vez. Después construyes equipos.

### Instalar (30 segundos)

```bash
cp -r squads-skill/ your-project/.claude/skills/squads/
mkdir -p your-project/squads/
```

Listo. Sin npm install. Sin pip install. Sin Docker. Sin infierno de YAML. El skill usa las herramientas nativas de Claude Code — Read, Write, Edit, Glob, Grep, Bash. Nada externo.

### Crea tu primer squad

```bash
/squads *create-squad content-pipeline
```

Esto genera toda la estructura de directorios, crea el manifiesto squad.yaml y configura todo. Ahora tienes un equipo vacío. Empieza a agregar agentes.

```bash
/squads *add-agent content-pipeline writer
/squads *add-agent content-pipeline reviewer
/squads *add-agent content-pipeline publisher
```

Tres agentes. Cada uno tiene su propio archivo .md con una persona, definición de expertise y comandos. El writer escribe. El reviewer revisa. El publisher publica. Nadie hace el trabajo del otro.

### Registra para slash commands

```bash
/squads *register-squad content-pipeline
```

Ahora puedes invocar cualquier agente directamente:

```bash
/SQUADS:content-pipeline:cp-writer
/SQUADS:content-pipeline:cp-reviewer
```

Sin config adicional. Sin lógica de routing. Registras una vez, usas para siempre.

---

## 7 cosas que puedes hacer

| Comando | Qué hace |
|---------|----------|
| `*create-squad {name}` | Genera un directorio de squad completo |
| `*list-squads` | Muestra todos los squads con cantidad de agentes |
| `*add-agent {squad} {role}` | Agrega un especialista al equipo |
| `*validate-squad {name}` | Ejecuta 20 verificaciones de integridad |
| `*register-squad {name}` | Habilita slash commands para el squad |
| `*install-squad-deps {name}` | Instala dependencias de Node (pnpm) y Python (uv) |
| `*run-workflow {squad} {name}` | Ejecuta un workflow de colaboración |

Hay más comandos. Estos son los que vas a usar todos los días.

---

## Workflows — cómo colaboran los agentes de verdad

Un agente solo es útil. Agentes que colaboran son peligrosos (en el buen sentido).

5 patrones incluidos:

**Pipeline** — El Agente A produce output, el Agente B lo transforma, el Agente C finaliza. Secuencial. Como una línea de montaje. Úsalo para producción de contenido, procesamiento de datos, todo lo que tiene etapas claras.

**Hub-and-Spoke** — Un orquestador, múltiples especialistas. El orquestador delega, recolecta resultados, sintetiza. Úsalo cuando necesitas un coordinador.

**Review** — El agente hace el trabajo, el revisor lo verifica, vuelve atrás si falla. Patrón de control de calidad. Nada se envía hasta que el revisor aprueba. Úsalo para todo lo que necesita ser correcto.

**Parallel** — Múltiples agentes trabajan en tareas independientes al mismo tiempo y después fusionan los resultados. Úsalo cuando las tareas no dependen unas de otras.

**Teams** — Coordinación en tiempo real vía Claude Code Agent Teams. Los agentes se comunican durante la ejecución. Úsalo para trabajo complejo de múltiples pasos donde los agentes necesitan reaccionar entre sí.

Elige el patrón que encaja. O combínalos. Un pipeline donde cada paso tiene un review loop. Un hub-and-spoke donde los especialistas trabajan en paralelo. Mezcla y combina.

---

## Cero contaminación de contexto

Esta es la parte que nadie más hace bien.

La mayoría de los setups multi-agente cargan la definición de cada agente en la ventana de contexto al arrancar. ¿10 agentes? Eso son 10 archivos markdown consumiendo tus tokens antes de que hagas una sola pregunta.

Squads no carga nada hasta que lo pides.

`*create-squad` carga el protocolo de creación. `*validate-squad` carga el checklist de validación. `/SQUADS:my-squad:my-agent` carga el archivo .md de ese agente específico. Nada más.

¿10 squads en tu proyecto? ¿100 squads? Cero tokens adicionales en tu ventana de contexto hasta que llames a uno. El skill lee quirúrgicamente — solo el archivo de referencia que necesita, en el momento exacto que lo necesita.

Tu ventana de contexto se mantiene limpia. Siempre.

---

## Dependencias sin el dolor de cabeza

Squads soporta 7 tipos de dependencias. La instalación es lazy — nada se instala hasta que lo dices.

| Tipo | Manager | Estado |
|------|---------|--------|
| Node | pnpm | Activo |
| Python | uv | Activo |
| Sistema | — | Solo docs |
| Squads (cross-squad) | — | Activo |
| MCP tools | — | Solo docs |
| Go | go modules | Reservado |
| Rust | cargo | Reservado |

Cada squad mantiene su propio `node_modules/` y `.venv/`. Sin conflictos entre squads. Sin contaminación global.

```bash
/squads *install-squad-deps my-squad    # instala todo
/squads *check-squad-deps my-squad      # verifica sin instalar
```

---

## Validación — 20 verificaciones antes de publicar

```bash
/squads *validate-squad my-squad
```

9 verificaciones bloqueantes que deben pasar: squad.yaml válido, convenciones de nombres, archivos existentes, registro completo.

11 verificaciones sugeridas que deberían pasar: estándares de código, README presente, colaboración documentada, dependencias instaladas.

Piénsalo como un linter para tu equipo de agentes. Detecta problemas estructurales antes de que se conviertan en problemas en tiempo de ejecución.

---

## Funciona con todo (o con nada)

Squads es agnóstico a frameworks. Úsalo standalone. Úsalo con oh-my-claudecode, GSD, BMad Method, o cualquier framework de orquestación que prefieras.

| Framework | Cómo se integra |
|-----------|----------------|
| Standalone | Funciona solo, sin dependencias |
| oh-my-claudecode | Orquestación multi-squad vía `team`, `ralph`, `autopilot` |
| GSD | Squads como ejecutores de fase vía `execute-phase` |
| BMad Method | Compatible como proveedor de squads en el pipeline BMad |
| Custom | Cualquier cosa que use slash commands de Claude Code |

El framework maneja la coordinación. Squads maneja la estructura del equipo. Separación limpia.

---

## Para quién es esto

Desarrolladores solos que quieren equipos de IA estructurados sin comprar una plataforma.

Equipos pequeños que necesitan workflows de agentes repetibles con control de versiones.

Personas que trabajan con Claude Code y están hartas del caos de un-agente-hace-todo.

Cualquiera que miró su workflow de IA y pensó "esto necesita estructura de verdad."

## Para quién NO es esto

Personas que quieren un constructor visual de agentes con drag-and-drop. Esto son archivos markdown en directorios. Si necesitas una GUI, busca en otro lado.

Personas que no usan Claude Code. Squads es un skill de Claude Code. Corre dentro de Claude Code. Ese es el trato.

---

## Funciona en cualquier sistema de IA. No solo en Claude Code.

Esto es lo que la gente se pierde cuando ve Squads por primera vez.

Un squad es un directorio con archivos markdown. Un skill es un estándar que entienden todos los sistemas de IA importantes. Claude Code, Codex, Antigravity, Gemini CLI — todos hablan el mismo idioma: skills.

Instala el skill de Squads en Claude Code. Tus squads funcionan. Instálalo en Codex. Los mismos squads, los mismos agentes, los mismos workflows. Migra a Antigravity el mes que viene. Todo sigue funcionando. El directorio `squads/` no le importa qué sistema de IA lo lee. Los agentes son markdown. Las tareas son markdown. Los workflows son YAML. Formatos universales.

No quedas atado a un solo vendor. No reescribes las definiciones de agentes cada vez que cambias de herramienta. Construyes tus squads una vez. Los corres donde quieras.

Eso es portabilidad real. No la portabilidad de "funciona en nuestra plataforma". Portabilidad que funciona en cualquier plataforma.

---

## Ya existe un marketplace

No tienes que construir cada squad desde cero.

[squads.sh](https://squads.sh) es un marketplace donde la gente publica sus squads. Gratis o de pago — tú decides. ¿Construiste un squad de content-pipeline que funciona de verdad? Publícalo. ¿Hiciste un squad de code-review que atrapa bugs que otras herramientas se pierden? Véndelo por lo que quieras. ¿Necesitas un squad para auditorías SEO, landing pages, análisis de datos? Hay chances de que alguien ya lo hizo y lo subió.

Navega lo que hay. Toma lo que sirve. Ajústalo. O construye el tuyo desde cero y deja que otros lo usen.

De cualquier manera, no empiezas solo: [squads.sh](https://squads.sh)

---

## El pitch en 30 segundos

Ahora mismo tienes un agente de IA haciendo todo. Sin límites. Sin especialización. Sin patrones de colaboración. Sin validación.

Squads te da equipos estructurados. Cada agente tiene un trabajo. Cada tarea tiene condiciones. Cada workflow define la colaboración. Todo vive en tu repo como markdown portable, sin dependencias externas, sin costo, sin contaminar tu contexto.

Instalas en 30 segundos. Creas tu primer squad en 60 segundos. Empiezas a publicar con un equipo real en lugar de un agente haciéndose pasar por uno.

```bash
cp -r squads-skill/ .claude/skills/squads/
mkdir -p squads/
/squads *create-squad my-first-squad
```

Ve a construir tu equipo.

---

<p align="center">
  <a href="#instalar-30-segundos">Instalar</a> · <a href="#crea-tu-primer-squad">Crear un squad</a> · <a href="#workflows--cómo-colaboran-los-agentes-de-verdad">Workflows</a> · <a href="#validación--20-verificaciones-antes-de-publicar">Validación</a>
</p>

## Autor

Luiz Gustavo Vieira Rodrigues ([@gutomec](https://github.com/gutomec))

## Licencia

MIT

El concepto de squads como equipos multi-agente estructurados fue inspirado originalmente por [AIOX Framework](https://github.com/SynkraAI/aiox-core) (SynkraAI Inc.), derivado a su vez de [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD) (BMad Code, LLC). Este es un proyecto independiente que reimplementa y expande el concepto con su propia arquitectura, protocolos y funcionalidades.

---

[English](README.md) | [Português](README.pt.md) | [中文](README.zh.md) | [हिन्दी](README.hi.md) | [العربية](README.ar.md)
