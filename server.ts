import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const BLOCKED_EXACT = new Set([
  '/server.ts',
  '/package.json',
  '/package-lock.json',
  '/bun.lock',
  '/tsconfig.json',
  '/vite.config.ts',
  '/metadata.json',
  '/datos/build.js',
  '/datos/generar-banco.js',
]);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  let decodedPath = req.path;
  try {
    decodedPath = decodeURIComponent(req.path);
  } catch {
    res.status(400).send('Bad Request');
    return;
  }
  const normalized = path.posix.normalize(decodedPath);
  if (
    /(^|\/)\./.test(normalized) ||
    BLOCKED_EXACT.has(normalized) ||
    normalized.startsWith('/src/') ||
    normalized.endsWith('.ts') ||
    normalized.endsWith('.env')
  ) {
    res.status(404).send('Not Found');
    return;
  }
  next();
});

app.use(express.static(__dirname, { dotfiles: 'ignore' }));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
