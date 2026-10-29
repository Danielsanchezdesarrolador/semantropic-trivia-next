import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Originales privados para evaluación; nunca se agregan a public/ ni a Git.
const source = process.argv[2];
if (!source) throw Error('Uso: node scripts/audio/import-pixabay-cartoon.mjs <carpeta-de-originales>');
const files = [
  ['match_funny_event', 'lucadialessandro-funny-cartoon-sound-4-464864.mp3', '670cdd264c8537de534d94685254bcc137874eef78edd760de8b044e83ff8a28'],
  ['match_defeat_trombone', '11325622-cartoon-trombone-sound-effect-241387.mp3', '8f1cc3ddcaf80f12645653cbfb7d3be7789f911e4d45e813d3583af14306a94e'],
  ['ui_open_cartoon_6', 'alexzavesa-cartoon-6-468373.mp3', '54a2f8b4f7b984a4ae76ef37ae8a4110bb76a36232edd6a8f1511bbe528023ed'],
];
const verified = await Promise.all(files.map(async ([id, filename, hash]) => {
  const bytes = await readFile(resolve(source, filename));
  if (createHash('sha256').update(bytes).digest('hex') !== hash) throw Error(`SHA-256 incorrecto: ${filename}`);
  return { id, bytes };
}));
const target = resolve('artifacts/private-cartoon-sfx');
await mkdir(target, { recursive: true });
for (const { id, bytes } of verified) {
  const destination = resolve(target, `${id}.mp3`);
  try {
    const existing = await readFile(destination);
    if (!existing.equals(bytes)) throw Error(`No se sobrescribe un original distinto: ${destination}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeFile(destination, bytes, { flag: 'wx' });
  }
  console.log(`${id}: SHA-256 verificado, ${bytes.length} bytes`);
}
