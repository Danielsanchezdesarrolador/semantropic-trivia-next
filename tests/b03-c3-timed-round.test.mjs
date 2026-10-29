import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const output = mkdtempSync(join(tmpdir(), 'semantropic-b03-c3-'));
after(() => rmSync(output, { recursive: true, force: true }));
for (const name of ['contracts', 'round', 'exampleQuestions', 'timedRound']) {
  const source = readFileSync(new URL(`../src/game/local/${name}.ts`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText.replace(/from '(\.\/.+)\.ts'/g, "from '$1.mjs'");
  writeFileSync(join(output, `${name}.mjs`), compiled);
}
const { startTimedLocalRound, syncTimedLocalRound, answerTimedLocalQuestion, advanceTimedLocalRound,
  LOCAL_QUESTION_DURATION_MS } = await import(pathToFileURL(join(output, 'timedRound.mjs')).href);
const { exampleQuestions: questions } = await import(pathToFileURL(join(output, 'exampleQuestions.mjs')).href);
const start = () => startTimedLocalRound(questions, 1_000);
const respond = (state, now, correct = true) => {
  const q = questions[state.round.questionIndex];
  const choice = correct ? q.correctAlternativeId : q.alternatives.find(option => option.id !== q.correctAlternativeId).id;
  return answerTimedLocalQuestion(state, q.id, choice, now);
};

test('B03-C3: duración central provisional 20s, configuración validada e inicio correcto', () => {
  assert.equal(LOCAL_QUESTION_DURATION_MS, 20_000);
  assert.equal(start().deadline, 21_000);
  assert.equal(start().remainingMs, 20_000);
  assert.equal(startTimedLocalRound(questions, 0, 5_000).deadline, 5_000);
  for (const duration of [0, -1, NaN, Infinity]) assert.throws(() => startTimedLocalRound(questions, 0, duration));
  assert.throws(() => startTimedLocalRound(questions, NaN));
});

test('B03-C3: reloj calcula tiempo real sin acumular ticks ni otorgar tiempo por retroceso', () => {
  const original = start();
  const elapsed = syncTimedLocalRound(original, 8_500);
  assert.equal(elapsed.remainingMs, 12_500);
  assert.equal(elapsed.deadline, 21_000);
  assert.equal(original.remainingMs, 20_000);
  assert.strictEqual(syncTimedLocalRound(elapsed, 2_000), elapsed);
  assert.strictEqual(syncTimedLocalRound(elapsed, 8_500), elapsed);
});

test('B03-C3: agotamiento exacto y reanudación tras larga inactividad cierran una sola pregunta', () => {
  for (const now of [21_000, 90_000]) {
    const expired = syncTimedLocalRound(start(), now);
    assert.equal(expired.remainingMs, 0);
    assert.equal(expired.round.status, 'answered');
    assert.deepEqual(expired.round.answers, [{ questionId: questions[0].id, alternativeId: null, correct: false, points: 0 }]);
    assert.strictEqual(syncTimedLocalRound(expired, now + 100_000), expired);
    assert.strictEqual(respond(expired, now + 1), expired);
    assert.equal(expired.round.questionIndex, 0);
  }
});

test('B03-C3: responder antes del límite detiene el reloj y nunca suma dos veces', () => {
  const answered = respond(start(), 20_999);
  assert.equal(answered.remainingMs, 1);
  assert.equal(answered.round.answers[0].points, 1);
  assert.strictEqual(syncTimedLocalRound(answered, 100_000), answered);
  assert.strictEqual(respond(answered, 100_000, false), answered);
});

test('B03-C3: respuesta en el límite o posterior es timeout aunque el último tick no haya ocurrido', () => {
  for (const now of [21_000, 21_001, 100_000]) {
    const answered = respond(start(), now);
    assert.equal(answered.round.answers.length, 1);
    assert.equal(answered.round.answers[0].alternativeId, null);
    assert.equal(answered.round.answers[0].points, 0);
  }
});

test('B03-C3: solo avanzar tras resolver inicia un nuevo plazo; eventos tardíos no contestan otra pregunta', () => {
  const initial = start();
  assert.strictEqual(advanceTimedLocalRound(initial, 5_000), initial);
  const expired = syncTimedLocalRound(initial, 30_000);
  const next = advanceTimedLocalRound(expired, 90_000);
  assert.equal(next.deadline, 110_000);
  assert.equal(next.remainingMs, 20_000);
  assert.equal(next.round.questionIndex, 1);
  const stale = answerTimedLocalQuestion(next, questions[0].id, 'C', 90_000);
  assert.strictEqual(stale, next);
  assert.strictEqual(advanceTimedLocalRound(next, 95_000), next);
  assert.equal(stale.round.answers.length, 1);
});

for (const mode of ['correct', 'incorrect', 'timeout', 'mixed']) {
  test(`B03-C3: diez preguntas ${mode}, resultado exacto, reloj final detenido y reinicio limpio`, () => {
    let state = start();
    let correctCount = 0;
    let timeouts = 0;
    for (let i = 0; i < 10; i++) {
      const timeout = mode === 'timeout' || (mode === 'mixed' && i % 3 === 0);
      const correct = mode === 'correct' || (mode === 'mixed' && i % 3 === 1);
      if (timeout) { state = syncTimedLocalRound(state, state.deadline + 100); timeouts++; }
      else { state = respond(state, state.observedAt + 100, correct); if (correct) correctCount++; }
      assert.equal(state.round.answers.length, i + 1);
      if (i < 9) {
        assert.equal(state.round.status, 'answered');
        state = advanceTimedLocalRound(state, state.observedAt + 1_000);
        assert.equal(state.remainingMs, 20_000);
      }
    }
    assert.equal(state.round.status, 'finished');
    assert.equal(state.round.result.total, 10);
    assert.equal(state.round.result.correct, correctCount);
    assert.equal(state.round.result.incorrect, 10 - correctCount);
    assert.equal(state.round.result.score, correctCount);
    assert.equal(state.round.answers.filter(answer => answer.alternativeId === null).length, timeouts);
    assert.strictEqual(syncTimedLocalRound(state, 999_999), state);
    assert.strictEqual(respond(state, 999_999), state);
    assert.strictEqual(advanceTimedLocalRound(state, 999_999), state);
    const restart = startTimedLocalRound(questions, 999_999);
    assert.equal(restart.round.questionIndex, 0);
    assert.deepEqual(restart.round.answers, []);
    assert.equal(restart.remainingMs, 20_000);
  });
}
