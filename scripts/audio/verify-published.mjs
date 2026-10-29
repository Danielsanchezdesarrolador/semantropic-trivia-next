import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdir } from 'node:fs/promises';
import catalog from '../../docs/audio/SFX02_CATALOGO.json' with { type: 'json' };

const root = process.env.ST_OFFICIAL_URL || 'https://semantropic-trivia-next-web.onrender.com/';
const expected = process.env.ST_EXPECTED_COMMIT;
assert.match(expected || '', /^[a-f0-9]{40}$/, 'ST_EXPECTED_COMMIT debe ser el SHA completo integrado');
const releaseResponse = await fetch(new URL('release.json?verify=' + Date.now(), root));
assert.ok(releaseResponse.ok);
const release = await releaseResponse.json();
assert.equal(release.commit, expected, 'Render debe servir el commit integrado exacto');
assert.equal(release.stage, 'B03-C5');
assert.deepEqual(release.audio, ['M1', 'V1', 'A1', 'X3', 'L7', 'C', 'CLK']);
const files = await readdir('dist/assets');
for (const item of catalog.items.filter(item => release.audio.includes(item.code))) {
  const filename = files.find(name => name.startsWith(item.downloaded_filename.slice(0, -4) + '-') && name.endsWith('.mp3'));
  assert.ok(filename, 'Falta asset compilado ' + item.code);
  const response = await fetch(new URL('assets/' + filename, root));
  assert.ok(response.ok, item.code);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.length, item.bytes, item.code);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256, item.code);
  console.log(`PASS público ${item.code}: original exacto, ${bytes.length} bytes`);
}
const historical = await fetch(new URL('assets/audio/music/semantropic_lobby_pop_familiar_v001.mp3?verify=' + Date.now(), root));
assert.notEqual(createHash('sha256').update(Buffer.from(await historical.arrayBuffer())).digest('hex'),
  'e82e7f4d6e129eddad15a9cf26c4118ae545646d4ae08fc33c19e45c27d37707', 'Histórico excluido de la publicación nueva');
console.log(`PASS Render público: SHA ${expected}, siete originales, histórico excluido`);
