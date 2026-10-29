import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const compiled = ts.transpileModule(readFileSync(new URL('../src/audio/sfx02/policy.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { navigationSound, clockSlot } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
test('SFX-02: Colección M1, misma pantalla silenciosa y retorno V1 excluyente', () => {
  assert.equal(navigationSound('home', 'collection'), 'M1');
  assert.equal(navigationSound('collection', 'collection'), null);
  assert.equal(navigationSound('collection', 'home', 'back'), 'V1');
  assert.equal(navigationSound('arena', 'home', 'back'), 'V1');
  assert.equal(navigationSound('collection', 'home'), 'M1');
});
test('SFX-02: slots por deadline 2000/1000/650/350 ms, cero o negativo sin tic', () => {
  assert.equal(clockSlot(20000), 0); assert.equal(clockSlot(18000), 1);
  assert.equal(clockSlot(10000), 5); assert.equal(clockSlot(9000), 6);
  assert.equal(clockSlot(5000), 10); assert.equal(clockSlot(4350), 11);
  assert.equal(clockSlot(2000), 15); assert.equal(clockSlot(1650), 16);
  assert.equal(clockSlot(300), 19); assert.equal(clockSlot(0), null); assert.equal(clockSlot(-1), null);
  // Returning from background consumes one current slot, not the skipped sequence.
  const seen = new Set([clockSlot(20000)]); seen.add(clockSlot(1000));
  assert.equal(seen.size, 2);
});
