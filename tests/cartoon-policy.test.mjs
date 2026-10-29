import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/audio/cartoonPolicy.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { isCartoonOpening, safeEffectsVolume } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
test('SFX-02: Cartoon 6 permanece reservado; Colección usa M1 por su despachador', () => {
  assert.equal(isCartoonOpening('home', 'collection'), false);
  assert.equal(isCartoonOpening('collection', 'collection'), false);
  for (const target of ['home', 'arena', 'shop', 'ranking', 'correct', 'incorrect', 'timeout', 'results', 'defeat']) {
    assert.equal(isCartoonOpening('collection', target), false, target);
  }
});
test('Cartoon: volumen persistido inválido o fuera de rango es inocuo', () => {
  for (const invalid of [null, undefined, '1', {}, NaN, Infinity]) assert.equal(safeEffectsVolume(invalid), 0.4);
  assert.equal(safeEffectsVolume(-1), 0);
  assert.equal(safeEffectsVolume(2), 1);
  assert.equal(safeEffectsVolume(0), 0);
});
