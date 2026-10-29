import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/ui/quiz/timerArcMath.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module:ts.ModuleKind.ESNext, target:ts.ScriptTarget.ES2022 } }).outputText;
const { timerArc } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));

test('B03-C3-HF1: arco proporcional exacto a 20, 15, 10, 5 y 0 segundos', () => {
  for (const [remaining, fraction, offset] of [[20000,1,0],[15000,.75,25],[10000,.5,50],[5000,.25,75],[0,0,100]]) {
    const arc = timerArc(remaining,20000);
    assert.equal(arc.progress,fraction);
    assert.equal(arc.dashOffset,offset);
  }
  assert.equal(timerArc(-1000,20000).progress,0);
  assert.equal(timerArc(25000,20000).progress,1);
  assert.equal(timerArc(1000,0).progress,0);
});

test('B03-C3-HF1: movimiento continuo entre segundos y colores interpolados sin saltos', () => {
  let previous = timerArc(20000,20000);
  const rgb = color => color.match(/[\d.]+/g).map(Number);
  for (let remaining=19990;remaining>=0;remaining-=10) {
    const current=timerArc(remaining,20000);
    assert.ok(current.dashOffset > previous.dashOffset);
    assert.ok(Math.abs(current.dashOffset-previous.dashOffset-.05)<1e-10);
    const before=rgb(previous.color), after=rgb(current.color);
    assert.ok(after.every((channel,index)=>Math.abs(channel-before[index])<.25));
    previous=current;
  }
  assert.equal(timerArc(20000,20000).color,'rgb(18, 202, 255)');
  assert.equal(timerArc(10000,20000).color,'rgb(255, 209, 68)');
  assert.equal(timerArc(0,20000).color,'rgb(255, 73, 109)');
});
