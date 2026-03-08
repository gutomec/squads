#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// SQUADS Flow Tracker Server v1.0.0
// Zero-dependency Node.js server that bridges JSONL squad triggers to browser
// via Server-Sent Events (SSE).
//
// Endpoints:
//   GET /                     — Serve flow-tracker.html
//   GET /flow/:squad          — SSE stream (watches JSONL, pushes new lines)
//   GET /flow/:squad/history  — All past events as JSON array
//   GET /artifacts/:squad/*   — Static files from squad output directory
//   GET /status               — Server status JSON
// ─────────────────────────────────────────────────────────────────────────────

const http = require('http');
const fs = require('fs');
const path = require('path');

// ─── Configuration ───────────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT, 10) || 3001;
const SQUADS_ROOT = process.env.SQUADS_ROOT || process.cwd();
const HTML_FILE = path.join(__dirname, 'flow-tracker.html');

// ─── State ───────────────────────────────────────────────────────────────────

const startTime = Date.now();
const connectedClients = new Map(); // clientId -> { squad, res, watcher }
let clientIdCounter = 0;

// ─── MIME types for artifact serving ─────────────────────────────────────────

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.pdf':  'application/pdf',
  '.txt':  'text/plain; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
  '.xml':  'application/xml',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.mp3':  'audio/mpeg',
  '.wav':  'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':  'font/ttf',
};

// ─── Utility functions ───────────────────────────────────────────────────────

/**
 * Resolve the JSONL file path for a given squad name.
 * Search order:
 *   1. {SQUADS_ROOT}/.aios/squad-triggers/{squad}.jsonl
 *   2. {SQUADS_ROOT}/squads/{squad}/.aios/triggers.jsonl
 *   3. Create option 1 directory + empty file if neither exists
 */
function resolveJsonlPath(squad) {
  const path1 = path.join(SQUADS_ROOT, '.aios', 'squad-triggers', `${squad}.jsonl`);
  if (fs.existsSync(path1)) return path1;

  const path2 = path.join(SQUADS_ROOT, 'squads', squad, '.aios', 'triggers.jsonl');
  if (fs.existsSync(path2)) return path2;

  // Create the first path option (directory + empty file)
  const dir1 = path.dirname(path1);
  fs.mkdirSync(dir1, { recursive: true });
  fs.writeFileSync(path1, '', 'utf-8');
  return path1;
}

/**
 * Read all lines from a JSONL file, parsing each as JSON.
 * Skips empty lines and lines that fail to parse.
 */
function readJsonlLines(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  return content
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

/**
 * Get file size safely (returns 0 if file does not exist).
 */
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

/**
 * Read new bytes from a file starting at the given offset.
 * Returns { lines, newOffset } where lines are parsed JSON objects.
 */
function readNewLines(filePath, fromOffset) {
  const size = getFileSize(filePath);
  if (size <= fromOffset) return { lines: [], newOffset: fromOffset };

  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(size - fromOffset);
  fs.readSync(fd, buffer, 0, buffer.length, fromOffset);
  fs.closeSync(fd);

  const chunk = buffer.toString('utf-8');
  const lines = chunk
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return { lines, newOffset: size };
}

/**
 * Set CORS headers on a response.
 */
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
}

/**
 * Send a JSON response.
 */
function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * Send a 404 response.
 */
function send404(res, message) {
  sendJson(res, 404, { error: message || 'Not found' });
}

/**
 * Resolve the artifact base directory for a squad.
 * Checks for /output/ first, then /artifacts/.
 */
function resolveArtifactDir(squad) {
  const outputDir = path.join(SQUADS_ROOT, 'squads', squad, 'output');
  if (fs.existsSync(outputDir)) return outputDir;

  const artifactsDir = path.join(SQUADS_ROOT, 'squads', squad, 'artifacts');
  if (fs.existsSync(artifactsDir)) return artifactsDir;

  return null;
}

// ─── Route Handlers ──────────────────────────────────────────────────────────

/**
 * GET / — Serve the flow-tracker.html file.
 */
function handleIndex(req, res) {
  fs.readFile(HTML_FILE, (err, data) => {
    if (err) {
      sendJson(res, 500, { error: 'Could not read flow-tracker.html' });
      return;
    }
    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}

/**
 * GET /flow/:squad — SSE stream.
 * 1. Send existing lines as event: history
 * 2. Watch file for changes, send new lines as event: trigger
 * 3. Ping every 15s to keep alive
 * 4. Cleanup on disconnect
 */
function handleFlowSSE(req, res, squad) {
  const jsonlPath = resolveJsonlPath(squad);

  setCorsHeaders(res);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const clientId = ++clientIdCounter;

  // Helper to write SSE data
  function sendSSE(eventName, data) {
    res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  // 1. Send existing lines as history events
  const existingLines = readJsonlLines(jsonlPath);
  existingLines.forEach(line => {
    sendSSE('history', line);
  });

  // Send a connected confirmation
  sendSSE('connected', {
    clientId,
    squad,
    jsonlPath,
    historyCount: existingLines.length,
    timestamp: new Date().toISOString(),
  });

  // 2. Track file offset for incremental reads
  let fileOffset = getFileSize(jsonlPath);

  // 3. Watch file for changes
  let watcher = null;
  try {
    watcher = fs.watch(jsonlPath, { persistent: false }, (eventType) => {
      if (eventType === 'change') {
        const { lines, newOffset } = readNewLines(jsonlPath, fileOffset);
        fileOffset = newOffset;
        lines.forEach(line => {
          sendSSE('trigger', line);
        });
      }
    });
  } catch (err) {
    // If watch fails, we still keep the connection for history + pings
    console.warn(`[warn] Could not watch ${jsonlPath}: ${err.message}`);
  }

  // 4. Ping every 15s to keep connection alive
  const pingInterval = setInterval(() => {
    sendSSE('ping', { timestamp: new Date().toISOString() });
  }, 15000);

  // Store client info
  connectedClients.set(clientId, { squad, res, watcher });

  // 5. Cleanup on disconnect
  req.on('close', () => {
    clearInterval(pingInterval);
    if (watcher) {
      try { watcher.close(); } catch {}
    }
    connectedClients.delete(clientId);
  });
}

/**
 * GET /flow/:squad/history — Return all past events as JSON array.
 */
function handleFlowHistory(req, res, squad) {
  const jsonlPath = resolveJsonlPath(squad);
  const lines = readJsonlLines(jsonlPath);
  sendJson(res, 200, {
    squad,
    count: lines.length,
    events: lines,
  });
}

/**
 * GET /artifacts/:squad/* — Serve static files from squad output directory.
 */
function handleArtifacts(req, res, squad, artifactPath) {
  const baseDir = resolveArtifactDir(squad);
  if (!baseDir) {
    send404(res, `No artifacts directory found for squad "${squad}"`);
    return;
  }

  // Prevent path traversal
  const safePath = path.normalize(artifactPath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = path.join(baseDir, safePath);

  // Ensure the resolved path is within the base directory
  if (!fullPath.startsWith(baseDir)) {
    send404(res, 'Invalid artifact path');
    return;
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      send404(res, `Artifact not found: ${artifactPath}`);
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    setCorsHeaders(res);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
    });

    fs.createReadStream(fullPath).pipe(res);
  });
}

/**
 * GET /status — Server status information.
 */
function handleStatus(req, res) {
  const clients = [];
  connectedClients.forEach((info, id) => {
    clients.push({ id, squad: info.squad });
  });

  // Collect watched files
  const watchedFiles = new Set();
  connectedClients.forEach((info) => {
    watchedFiles.add(resolveJsonlPath(info.squad));
  });

  sendJson(res, 200, {
    server: 'squads-flow-tracker',
    version: '1.0.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    uptimeFormatted: formatUptime(Date.now() - startTime),
    connectedClients: clients.length,
    clients,
    watchedFiles: [...watchedFiles],
    squadsRoot: SQUADS_ROOT,
    port: PORT,
  });
}

/**
 * Format uptime from ms to human-readable string.
 */
function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

// ─── Request Router ──────────────────────────────────────────────────────────

function router(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // Only handle GET requests
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  // Route: GET /
  if (pathname === '/' || pathname === '/index.html') {
    handleIndex(req, res);
    return;
  }

  // Route: GET /status
  if (pathname === '/status') {
    handleStatus(req, res);
    return;
  }

  // Route: GET /flow/:squad/history
  const historyMatch = pathname.match(/^\/flow\/([a-zA-Z0-9_-]+)\/history$/);
  if (historyMatch) {
    handleFlowHistory(req, res, historyMatch[1]);
    return;
  }

  // Route: GET /flow/:squad
  const flowMatch = pathname.match(/^\/flow\/([a-zA-Z0-9_-]+)$/);
  if (flowMatch) {
    handleFlowSSE(req, res, flowMatch[1]);
    return;
  }

  // Route: GET /artifacts/:squad/*
  const artifactMatch = pathname.match(/^\/artifacts\/([a-zA-Z0-9_-]+)\/(.+)$/);
  if (artifactMatch) {
    handleArtifacts(req, res, artifactMatch[1], artifactMatch[2]);
    return;
  }

  // 404 fallback
  send404(res, `No route matches: ${pathname}`);
}

// ─── Server Start ────────────────────────────────────────────────────────────

const server = http.createServer(router);

server.listen(PORT, () => {
  const cwdDisplay = SQUADS_ROOT.length > 38
    ? '...' + SQUADS_ROOT.slice(-35)
    : SQUADS_ROOT;

  console.log(`
\x1b[33m╔══════════════════════════════════════════════════╗
║  SQUADS Flow Tracker v1.0.0                      ║
║                                                  ║
║  Dashboard:  http://localhost:${PORT}               ║
║  SSE:        http://localhost:${PORT}/flow/          ║
║  Artifacts:  http://localhost:${PORT}/artifacts/     ║
║                                                  ║
║  Watching: ${cwdDisplay.padEnd(38)}║
╚══════════════════════════════════════════════════╝\x1b[0m
`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[server] Shutting down...');
  connectedClients.forEach((info, id) => {
    if (info.watcher) {
      try { info.watcher.close(); } catch {}
    }
    try { info.res.end(); } catch {}
  });
  connectedClients.clear();
  server.close(() => {
    console.log('[server] Goodbye.');
    process.exit(0);
  });
});
