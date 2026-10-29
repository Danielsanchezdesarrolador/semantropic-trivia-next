import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Fail closed: only existing, explicitly approved audio bytes may be published.
const allowed = new Set([
  'e82e7f4d6e129eddad15a9cf26c4118ae545646d4ae08fc33c19e45c27d37707',
  '54a2f8b4f7b984a4ae76ef37ae8a4110bb76a36232edd6a8f1511bbe528023ed',
]);
export function assertPublishable(path, bytes) {
  const audioExtension = /\.(mp3|wav|ogg|opus|flac|aac|m4a|aiff|sf2|sf3|mid|midi|webm|zip|7z)$/i.test(path);
  const signature = bytes.subarray(0, 12).toString('latin1');
  const audioMagic = signature.startsWith('ID3') || signature.startsWith('OggS') || signature.startsWith('fLaC')
    || (signature.startsWith('RIFF') && /WAVE|sfbk/.test(signature))
    || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
  if ((audioExtension || audioMagic) && !allowed.has(createHash('sha256').update(bytes).digest('hex'))) {
    throw Error(`Audio no autorizado para publicación: ${path}. DS-01 permanece SOLO QA LOCAL.`);
  }
  if (/\.(tsx?|m?js|html|json)$/i.test(path) && /data:audio\/[\w.+-]+;base64,[A-Za-z0-9+/=]{64}/.test(bytes.toString('utf8'))) {
    throw Error(`Audio inline no autorizado: ${path}`);
  }
  if (path.replaceAll('\\', '/').includes('/dist/') && extname(path) === '.js'
    && (bytes.includes(Buffer.from('Cargar 13 MP3 locales')) || bytes.includes(Buffer.from('Cargar 18_lobby_pop_familiar.mp3')))) {
    throw Error('Importador privado presente en build pública');
  }
  if (path.replaceAll('\\', '/').includes('/dist/') && extname(path) === '.js'
    && bytes.includes(Buffer.from('/assets/audio/music/semantropic_lobby_pop_familiar_v001.mp3'))) {
    throw Error('Asignación automática de música dev presente en build pública');
  }
  if (path.replaceAll('\\', '/').includes('/dist/') && extname(path) === '.js'
    && (bytes.includes(Buffer.from('/__qa_ds01__')) || bytes.includes(Buffer.from('DS-01 · PREVIEW / QA local'))
      || bytes.includes(Buffer.from('.local-ds01-audio'))
      || bytes.includes(Buffer.from('TimGM6mb.sf2 / MIDI / FluidSynth; no Foley humano')))) {
    throw Error('Endpoint, cargador o panel DS-01 dev presente en build pública');
  }
}
async function walk(path) {
  let entries;
  try { entries = await readdir(path, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(path, entry.name)) : [join(path, entry.name)]))).flat();
}
export async function guard(root = process.cwd(), includeBuild = true) {
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean).map(p => join(root, p));
  const files = new Set([...tracked, ...await walk(join(root, 'public')), ...await walk(join(root, 'src')),
    ...(includeBuild ? await walk(join(root, 'dist')) : [])]);
  for (const path of files) assertPublishable(path, await readFile(path));
  console.log(`PASS guard DS-01: ${files.size} archivos revisados; sin binarios QA ni panel en producción`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await guard(process.cwd(), !process.argv.includes('--sources'));
