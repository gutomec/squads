#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// SQUADS Flow Tracker — Test Event Generator
//
// Writes JSONL events to a trigger file, simulating what the squad skill
// would produce during a real nirvana-squad-creator execution.
//
// Usage: node test-events.js [squad-name]
// Default squad: nirvana-squad-creator
//
// Events are written to: {cwd}/.aios/squad-triggers/{squad}.jsonl
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const SQUAD_NAME = process.argv[2] || 'nirvana-squad-creator';
const SQUADS_ROOT = process.env.SQUADS_ROOT || process.cwd();
const TRIGGERS_DIR = path.join(SQUADS_ROOT, '.aios', 'squad-triggers');
const JSONL_PATH = path.join(TRIGGERS_DIR, `${SQUAD_NAME}.jsonl`);

// ─── Ensure directory exists and start fresh ─────────────────────────────────

fs.mkdirSync(TRIGGERS_DIR, { recursive: true });
fs.writeFileSync(JSONL_PATH, '', 'utf-8');

console.log(`\x1b[33m[test-events]\x1b[0m Writing events to: ${JSONL_PATH}`);
console.log(`\x1b[33m[test-events]\x1b[0m Squad: ${SQUAD_NAME}`);
console.log('');

// ─── Helper to append a JSONL line ───────────────────────────────────────────

function writeEvent(event) {
  const line = JSON.stringify(event) + '\n';
  fs.appendFileSync(JSONL_PATH, line, 'utf-8');
  const typeLabel = event.type.padEnd(20);
  const detail = event.agent || event.task || event.edge || event.squad || '';
  console.log(`  \x1b[36m${typeLabel}\x1b[0m ${detail}`);
}

// ─── Schedule events with delays ─────────────────────────────────────────────

const events = [
  // 0s — Squad starts
  {
    delay: 0,
    event: {
      type: 'squad-start',
      squad: SQUAD_NAME,
      version: '1.0.0',
      timestamp: null,
      agents: ['nsc-analyzer', 'nsc-agent-creator', 'nsc-task-creator', 'nsc-workflow-creator', 'nsc-optimizer', 'nsc-validator', 'nsc-readme-creator', 'nsc-publisher'],
      totalAgents: 8,
    },
  },

  // 0.5s — Flow preview with graph topology
  {
    delay: 500,
    event: {
      type: 'flow-preview',
      squad: SQUAD_NAME,
      timestamp: null,
      nodes: [
        { id: 'analyzer',         name: 'nsc-analyzer',         emoji: '\u{1F50D}', desc: 'Analyze Requirements',       order: 0 },
        { id: 'agent-creator',    name: 'nsc-agent-creator',    emoji: '\u{1F916}', desc: 'Create Agent Definitions',   order: 1 },
        { id: 'task-creator',     name: 'nsc-task-creator',     emoji: '\u{1F4CB}', desc: 'Create Task Definitions',    order: 2 },
        { id: 'workflow-creator', name: 'nsc-workflow-creator', emoji: '\u{1F504}', desc: 'Create Workflows',           order: 3 },
        { id: 'optimizer',        name: 'nsc-optimizer',        emoji: '\u{26A1}',  desc: 'Optimize Squad',             order: 4 },
        { id: 'validator',        name: 'nsc-validator',        emoji: '\u{2705}',  desc: 'Validate 6 Categories',      order: 5 },
        { id: 'readme-creator',   name: 'nsc-readme-creator',   emoji: '\u{1F4DD}', desc: 'Generate 6-Language READMEs', order: 6 },
        { id: 'publisher',        name: 'nsc-publisher',        emoji: '\u{1F680}', desc: 'Deploy + Publish',           order: 7 },
      ],
      edges: [
        { from: 'analyzer',         to: 'agent-creator',    label: 'analysis-report.json' },
        { from: 'agent-creator',    to: 'task-creator',     label: 'agents/*.md' },
        { from: 'task-creator',     to: 'workflow-creator', label: 'tasks/*.md' },
        { from: 'workflow-creator', to: 'optimizer',        label: 'workflows/*.yaml' },
        { from: 'optimizer',        to: 'validator',        label: 'optimization-report.md' },
        { from: 'validator',        to: 'readme-creator',   label: 'validation-report.md' },
        { from: 'readme-creator',   to: 'publisher',        label: 'README.md (6 langs)' },
      ],
    },
  },

  // ─── Agent 1: Analyzer (90s) ───────────────────────────────────────────────

  // 1s — Analyzer agent starts
  {
    delay: 1000,
    event: {
      type: 'agent-start',
      squad: SQUAD_NAME,
      agent: 'nsc-analyzer',
      task: 'analyze-requirements',
      timestamp: null,
    },
  },

  // 1.5s — Task starts
  {
    delay: 500,
    event: {
      type: 'task-start',
      squad: SQUAD_NAME,
      agent: 'nsc-analyzer',
      task: 'analyze-requirements',
      timestamp: null,
    },
  },

  // 4s — Task ends
  {
    delay: 2500,
    event: {
      type: 'task-end',
      squad: SQUAD_NAME,
      agent: 'nsc-analyzer',
      task: 'analyze-requirements',
      duration: 90,
      context: 10,
      artifacts: ['analysis-report.json', 'requirements-matrix.md'],
      timestamp: null,
    },
  },

  // 4.5s — Agent ends
  {
    delay: 500,
    event: {
      type: 'agent-end',
      squad: SQUAD_NAME,
      agent: 'nsc-analyzer',
      duration: 90,
      context: 10,
      timestamp: null,
    },
  },

  // 5s — Transition: analyzer -> agent-creator
  {
    delay: 500,
    event: {
      type: 'flow-transition',
      squad: SQUAD_NAME,
      edge: 'analyzer->agent-creator',
      from: 'analyzer',
      to: 'agent-creator',
      handoff: 'analysis-report.json',
      artifactCount: 2,
      progress: { completed: 1, total: 8, percent: 13 },
      timestamp: null,
    },
  },

  // ─── Agent 2: Agent Creator (120s) ─────────────────────────────────────────

  {
    delay: 500,
    event: {
      type: 'agent-start',
      squad: SQUAD_NAME,
      agent: 'nsc-agent-creator',
      task: 'create-agents',
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'task-start',
      squad: SQUAD_NAME,
      agent: 'nsc-agent-creator',
      task: 'create-agents',
      timestamp: null,
    },
  },

  {
    delay: 3000,
    event: {
      type: 'task-end',
      squad: SQUAD_NAME,
      agent: 'nsc-agent-creator',
      task: 'create-agents',
      duration: 120,
      context: 15,
      artifacts: ['agents/analyzer.md', 'agents/creator.md', 'agents/optimizer.md', 'agents/validator.md'],
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'agent-end',
      squad: SQUAD_NAME,
      agent: 'nsc-agent-creator',
      duration: 120,
      context: 15,
      timestamp: null,
    },
  },

  // Transition: agent-creator -> task-creator
  {
    delay: 500,
    event: {
      type: 'flow-transition',
      squad: SQUAD_NAME,
      edge: 'agent-creator->task-creator',
      from: 'agent-creator',
      to: 'task-creator',
      handoff: 'agents/*.md',
      artifactCount: 4,
      progress: { completed: 2, total: 8, percent: 25 },
      timestamp: null,
    },
  },

  // ─── Agent 3: Task Creator (105s) ──────────────────────────────────────────

  {
    delay: 500,
    event: {
      type: 'agent-start',
      squad: SQUAD_NAME,
      agent: 'nsc-task-creator',
      task: 'create-tasks',
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'task-start',
      squad: SQUAD_NAME,
      agent: 'nsc-task-creator',
      task: 'create-tasks',
      timestamp: null,
    },
  },

  {
    delay: 2500,
    event: {
      type: 'task-end',
      squad: SQUAD_NAME,
      agent: 'nsc-task-creator',
      task: 'create-tasks',
      duration: 105,
      context: 12,
      artifacts: ['tasks/analyze.md', 'tasks/create.md', 'tasks/optimize.md', 'tasks/validate.md'],
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'agent-end',
      squad: SQUAD_NAME,
      agent: 'nsc-task-creator',
      duration: 105,
      context: 12,
      timestamp: null,
    },
  },

  // Transition: task-creator -> workflow-creator
  {
    delay: 500,
    event: {
      type: 'flow-transition',
      squad: SQUAD_NAME,
      edge: 'task-creator->workflow-creator',
      from: 'task-creator',
      to: 'workflow-creator',
      handoff: 'tasks/*.md',
      artifactCount: 4,
      progress: { completed: 3, total: 8, percent: 38 },
      timestamp: null,
    },
  },

  // ─── Agent 4: Workflow Creator (90s) ───────────────────────────────────────

  {
    delay: 500,
    event: {
      type: 'agent-start',
      squad: SQUAD_NAME,
      agent: 'nsc-workflow-creator',
      task: 'create-workflows',
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'task-start',
      squad: SQUAD_NAME,
      agent: 'nsc-workflow-creator',
      task: 'create-workflows',
      timestamp: null,
    },
  },

  {
    delay: 2500,
    event: {
      type: 'task-end',
      squad: SQUAD_NAME,
      agent: 'nsc-workflow-creator',
      task: 'create-workflows',
      duration: 90,
      context: 10,
      artifacts: ['workflows/main-pipeline.yaml', 'workflows/validation.yaml'],
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'agent-end',
      squad: SQUAD_NAME,
      agent: 'nsc-workflow-creator',
      duration: 90,
      context: 10,
      timestamp: null,
    },
  },

  // Transition: workflow-creator -> optimizer
  {
    delay: 500,
    event: {
      type: 'flow-transition',
      squad: SQUAD_NAME,
      edge: 'workflow-creator->optimizer',
      from: 'workflow-creator',
      to: 'optimizer',
      handoff: 'workflows/*.yaml',
      artifactCount: 2,
      progress: { completed: 4, total: 8, percent: 50 },
      timestamp: null,
    },
  },

  // ─── Agent 5: Optimizer (75s) ──────────────────────────────────────────────

  {
    delay: 500,
    event: {
      type: 'agent-start',
      squad: SQUAD_NAME,
      agent: 'nsc-optimizer',
      task: 'optimize-squad',
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'task-start',
      squad: SQUAD_NAME,
      agent: 'nsc-optimizer',
      task: 'optimize-squad',
      timestamp: null,
    },
  },

  {
    delay: 2000,
    event: {
      type: 'task-end',
      squad: SQUAD_NAME,
      agent: 'nsc-optimizer',
      task: 'optimize-squad',
      duration: 75,
      context: 8,
      artifacts: ['optimization-report.md', 'agent-dropout-analysis.json'],
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'agent-end',
      squad: SQUAD_NAME,
      agent: 'nsc-optimizer',
      duration: 75,
      context: 8,
      timestamp: null,
    },
  },

  // Transition: optimizer -> validator
  {
    delay: 500,
    event: {
      type: 'flow-transition',
      squad: SQUAD_NAME,
      edge: 'optimizer->validator',
      from: 'optimizer',
      to: 'validator',
      handoff: 'optimization-report.md',
      artifactCount: 2,
      progress: { completed: 5, total: 8, percent: 63 },
      timestamp: null,
    },
  },

  // ─── Agent 6: Validator (45s) ──────────────────────────────────────────────

  {
    delay: 500,
    event: {
      type: 'agent-start',
      squad: SQUAD_NAME,
      agent: 'nsc-validator',
      task: 'validate-squad',
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'task-start',
      squad: SQUAD_NAME,
      agent: 'nsc-validator',
      task: 'validate-squad',
      timestamp: null,
    },
  },

  {
    delay: 1500,
    event: {
      type: 'task-end',
      squad: SQUAD_NAME,
      agent: 'nsc-validator',
      task: 'validate-squad',
      duration: 45,
      context: 5,
      artifacts: ['validation-report.md', 'validation-summary.json'],
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'agent-end',
      squad: SQUAD_NAME,
      agent: 'nsc-validator',
      duration: 45,
      context: 5,
      timestamp: null,
    },
  },

  // Transition: validator -> readme-creator
  {
    delay: 500,
    event: {
      type: 'flow-transition',
      squad: SQUAD_NAME,
      edge: 'validator->readme-creator',
      from: 'validator',
      to: 'readme-creator',
      handoff: 'validation-report.md',
      artifactCount: 2,
      progress: { completed: 6, total: 8, percent: 75 },
      timestamp: null,
    },
  },

  // ─── Agent 7: README Creator (60s) ─────────────────────────────────────────

  {
    delay: 500,
    event: {
      type: 'agent-start',
      squad: SQUAD_NAME,
      agent: 'nsc-readme-creator',
      task: 'create-multilingual-readme',
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'task-start',
      squad: SQUAD_NAME,
      agent: 'nsc-readme-creator',
      task: 'create-multilingual-readme',
      timestamp: null,
    },
  },

  {
    delay: 2000,
    event: {
      type: 'task-end',
      squad: SQUAD_NAME,
      agent: 'nsc-readme-creator',
      task: 'create-multilingual-readme',
      duration: 60,
      context: 6,
      artifacts: ['README.md', 'README-pt.md', 'README-es.md', 'README-fr.md', 'README-de.md', 'README-ja.md'],
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'agent-end',
      squad: SQUAD_NAME,
      agent: 'nsc-readme-creator',
      duration: 60,
      context: 6,
      timestamp: null,
    },
  },

  // Transition: readme-creator -> publisher
  {
    delay: 500,
    event: {
      type: 'flow-transition',
      squad: SQUAD_NAME,
      edge: 'readme-creator->publisher',
      from: 'readme-creator',
      to: 'publisher',
      handoff: 'README.md (6 langs)',
      artifactCount: 6,
      progress: { completed: 7, total: 8, percent: 88 },
      timestamp: null,
    },
  },

  // ─── Agent 8: Publisher (30s) ──────────────────────────────────────────────

  {
    delay: 500,
    event: {
      type: 'agent-start',
      squad: SQUAD_NAME,
      agent: 'nsc-publisher',
      task: 'deploy-squad',
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'task-start',
      squad: SQUAD_NAME,
      agent: 'nsc-publisher',
      task: 'deploy-squad',
      timestamp: null,
    },
  },

  {
    delay: 1500,
    event: {
      type: 'task-end',
      squad: SQUAD_NAME,
      agent: 'nsc-publisher',
      task: 'deploy-squad',
      duration: 30,
      context: 3,
      artifacts: ['deploy-manifest.json', 'package.json'],
      timestamp: null,
    },
  },

  {
    delay: 500,
    event: {
      type: 'agent-end',
      squad: SQUAD_NAME,
      agent: 'nsc-publisher',
      duration: 30,
      context: 3,
      timestamp: null,
    },
  },

  // ─── Flow complete ─────────────────────────────────────────────────────────

  {
    delay: 800,
    event: {
      type: 'flow-complete',
      squad: SQUAD_NAME,
      totalDuration: 615,
      agentsExecuted: 8,
      totalAgents: 8,
      contextDelta: 69,
      reviewIterations: 0,
      rejections: 0,
      parallelBranches: 0,
      artifacts: 24,
      timestamp: null,
    },
  },

  // Squad end
  {
    delay: 500,
    event: {
      type: 'squad-end',
      squad: SQUAD_NAME,
      status: 'success',
      totalDuration: 615,
      timestamp: null,
    },
  },
];

// ─── Execute events with timing ──────────────────────────────────────────────

let cumulativeDelay = 0;

events.forEach(({ delay, event }) => {
  cumulativeDelay += delay;

  setTimeout(() => {
    // Fill in the timestamp at write time
    event.timestamp = new Date().toISOString();
    writeEvent(event);
  }, cumulativeDelay);
});

// Final message
setTimeout(() => {
  console.log('');
  console.log(`\x1b[32m[test-events] All ${events.length} events written.\x1b[0m`);
  console.log(`\x1b[33m[test-events]\x1b[0m File: ${JSONL_PATH}`);
}, cumulativeDelay + 500);
