import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { lstat, open, realpath } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import approved from '../../docs/audio/DS01_MANIFIESTO_QA.json' with { type: 'json' };
import official from '../../docs/audio/SFX02_CATALOGO.json' with { type: 'json' };

const allowed = new Map(approved.samples.map(item => [item.filename, item]));
const officialAllowed = new Map(official.items.filter(item => item.sha256 && item.downloaded_filename)
  .map(item => [item.downloaded_filename, item]));
export function isPrivateHost(value) {
  const host = String(value).toLowerCase().replace(/^::ffff:/, '').replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host === '::1') return true;
  const parts = host.split('.');
  if (parts.length !== 4 || !parts.every(p => /^\d{1,3}$/.test(p) && Number(p) <= 255)) return false;
  const [a, b] = parts.map(Number);
  return a === 127 || a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}
async function privateBytes(root, filename, dirname = '.local-ds01-audio') {
  const directory = join(root, dirname);
  const directoryInfo = await lstat(directory);
  if (!directoryInfo.isDirectory() || directoryInfo.isSymbolicLink()) throw Error('Carpeta privada no válida');
  const canonicalRoot = await realpath(root);
  const canonicalDirectory = await realpath(directory);
  if (relative(canonicalRoot, canonicalDirectory) !== dirname) throw Error('Carpeta fuera del proyecto');
  const path = join(directory, filename);
  const info = await lstat(path);
  if (!info.isFile() || info.isSymbolicLink() || info.size > 5_000_000) throw Error('Archivo privado no válido');
  if (relative(canonicalDirectory, await realpath(path)) !== filename) throw Error('Archivo fuera de carpeta');
  const handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const opened = await handle.stat();
    if (opened.ino !== info.ino || opened.dev !== info.dev || !opened.isFile()) throw Error('Archivo cambió durante lectura');
    return await handle.readFile();
  } finally { await handle.close(); }
}
async function manifest(root, dirname = '.local-ds01-audio', registry = allowed) {
  const data = JSON.parse((await privateBytes(root, 'MANIFIESTO_SHA256.json', dirname)).toString('utf8'));
  if (!Array.isArray(data.archivos) || data.archivos.length !== registry.size) throw Error('Manifiesto incompleto');
  const seen = new Set();
  const archivos = data.archivos.map(item => {
    const known = registry.get(item.archivo);
    if (!known || seen.has(item.archivo) || item.sha256 !== known.sha256 || item.tamano !== known.bytes) throw Error('Manifiesto no coincide con DS-01 aprobado');
    seen.add(item.archivo);
    return { archivo: item.archivo, sha256: item.sha256, tamano: item.tamano };
  });
  return { lote: registry === allowed ? 'DS01' : 'SFX02', uso: 'SOLO QA LOCAL; redistribución pendiente', archivos };
}
export function ds01Middleware(root) {
  return privateMiddleware(root, '/__qa_ds01__', '.local-ds01-audio', allowed);
}
export function approvedMiddleware(root) {
  return privateMiddleware(root, '/__qa_approved__', '.local-sfx02-audio', officialAllowed);
}
function privateMiddleware(root, prefix, dirname, registry) {
  return async (req, res, next) => {
    let path;
    try { path = decodeURIComponent((req.url ?? '').split('?')[0]); }
    catch { res.writeHead(400); res.end(); return; }
    if (/\.local-(ds01|sfx02|approved)-audio/i.test(path)) { res.writeHead(403); res.end(); return; }
    if (!path.startsWith(prefix)) { next(); return; }
    try {
      const host = new URL(`http://${req.headers.host ?? ''}`).hostname;
      const origin = req.headers.origin ? new URL(req.headers.origin) : null;
      if (!isPrivateHost(req.socket.remoteAddress) || !isPrivateHost(host)
        || req.headers['sec-fetch-site'] === 'cross-site'
        || (origin && (!['http:', 'https:'].includes(origin.protocol) || origin.host !== req.headers.host))) {
        res.writeHead(403); res.end(); return;
      }
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
      const name = path.slice(prefix.length + 1);
      if (path !== `${prefix}/${name}` || (name !== 'manifest.json' && !registry.has(name))) {
        res.writeHead(404); res.end(); return;
      }
      const metadata = await manifest(root, dirname, registry);
      let bytes;
      if (name === 'manifest.json') bytes = Buffer.from(JSON.stringify(metadata));
      else {
        bytes = await privateBytes(root, name, dirname);
        const known = registry.get(name);
        if (bytes.length !== known.bytes || createHash('sha256').update(bytes).digest('hex') !== known.sha256) throw Error(`SHA-256 incorrecto: ${name}`);
      }
      res.writeHead(200, { 'Content-Type': name === 'manifest.json' ? 'application/json' : 'audio/mpeg',
        'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin', 'Content-Length': bytes.length });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      const missing = error.code === 'ENOENT';
      res.writeHead(missing ? 404 : 422, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ error: missing ? 'Falta archivo local o MANIFIESTO_SHA256.json' : 'Archivo/manifiesto privado no válido o hash distinto' }));
    }
  };
}
export function ds01DevPlugin() {
  return { name: 'ds01-private-dev', apply: 'serve', configureServer(server) {
    server.middlewares.use(ds01Middleware(resolve(server.config.root)));
    server.middlewares.use(approvedMiddleware(resolve(server.config.root)));
  } };
}
