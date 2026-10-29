import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

// Execute the actual TypeScript engine without adding a runtime dependency or repo output.
const output = mkdtempSync(join(tmpdir(), 'semantropic-b03-c1-'));
after(() => rmSync(output, { recursive: true, force: true }));
for (const name of ['contracts', 'round', 'exampleQuestions']) {
  const source = readFileSync(new URL(`../src/game/local/${name}.ts`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText.replaceAll("./contracts.ts", './contracts.mjs');
  writeFileSync(join(output, `${name}.mjs`), compiled);
}
const { startLocalRound, currentQuestion, answerLocalQuestion, advanceLocalRound } =
  await import(pathToFileURL(join(output, 'round.mjs')).href);
const { exampleQuestions } = await import(pathToFileURL(join(output, 'exampleQuestions.mjs')).href);
const { localCategories } = await import(pathToFileURL(join(output, 'contracts.mjs')).href);

function answer(state, correct = true) {
  const question = exampleQuestions[state.questionIndex];
  const option = correct ? question.correctAlternativeId
    : question.alternatives.find(option => option.id !== question.correctAlternativeId).id;
  return answerLocalQuestion(state, question.id, option);
}

test('B03-C1: diez ejemplos válidos cubren exactamente las seis categorías oficiales', () => {
  assert.equal(exampleQuestions.length, 10);
  assert.deepEqual(new Set(exampleQuestions.map(question => question.category)), new Set(localCategories));
  const themes = readFileSync(new URL('../src/ui/quiz/categoryThemes.ts', import.meta.url), 'utf8');
  const visualIds = [...themes.matchAll(/^  (\w+): \{ label:/gm)].map(match => match[1]);
  assert.deepEqual(localCategories, visualIds);
  for (const question of exampleQuestions) {
    assert.equal(question.alternatives.length, 4);
    assert.equal(new Set(question.alternatives.map(option => option.text)).size, 4);
    assert.ok(question.explanation.length > 0);
  }
  assert.equal(startLocalRound(exampleQuestions).status, 'awaiting-answer');
});

test('B03-C1: inicio y pregunta actual no exponen solución en el contrato visual', () => {
  const state = startLocalRound(exampleQuestions);
  assert.equal(state.mode, 'local-practice');
  assert.equal(state.questionIndex, 0);
  assert.deepEqual(state.answers, []);
  assert.equal(state.result, null);
  assert.equal(currentQuestion(state).id, exampleQuestions[0].id);
  assert.equal('correctAlternativeId' in currentQuestion(state), false);
  assert.equal('explanation' in currentQuestion(state), false);
  assert.strictEqual(advanceLocalRound(state), state);
});

test('B03-C1: respuesta correcta suma uno; error suma cero; avance exige respuesta', () => {
  const initial = startLocalRound(exampleQuestions);
  const first = answer(initial);
  assert.equal(first.status, 'answered');
  assert.equal(first.questionIndex, 0);
  assert.deepEqual(first.answers[0], {
    questionId: exampleQuestions[0].id, alternativeId: 'C', correct: true, points: 1,
  });
  assert.deepEqual(initial.answers, []);
  const next = advanceLocalRound(first);
  assert.equal(next.questionIndex, 1);
  assert.equal(currentQuestion(next).id, exampleQuestions[1].id);
  assert.strictEqual(advanceLocalRound(next), next);
  const wrong = answer(next, false);
  assert.equal(wrong.answers[1].correct, false);
  assert.equal(wrong.answers[1].points, 0);
  assert.equal(wrong.result, null);
});

test('B03-C1: respuestas duplicadas, tardías y alternativas inválidas son inocuas', () => {
  const state = startLocalRound(exampleQuestions);
  assert.strictEqual(answerLocalQuestion(state, 'unknown', 'A'), state);
  assert.strictEqual(answerLocalQuestion(state, exampleQuestions[0].id, 'Z'), state);
  const answered = answer(state);
  assert.strictEqual(answer(answered), answered);
  assert.strictEqual(answer(answered, false), answered);
  const next = advanceLocalRound(answered);
  assert.strictEqual(answerLocalQuestion(next, exampleQuestions[0].id, 'C'), next);
  assert.equal(next.answers.length, 1);
});

for (const correctCount of [0, 6, 10]) {
  test(`B03-C1: ronda completa determinista con ${correctCount} aciertos y cierre en décima respuesta`, () => {
    function play() {
      let state = startLocalRound(exampleQuestions);
      for (let index = 0; index < 10; index++) {
        assert.equal(state.status, 'awaiting-answer');
        assert.equal(state.questionIndex, index);
        state = answer(state, index < correctCount);
        assert.equal(state.answers.length, index + 1);
        if (index < 9) {
          assert.equal(state.status, 'answered');
          assert.equal(state.result, null);
          state = advanceLocalRound(state);
        }
      }
      assert.equal(state.status, 'finished');
      assert.equal(state.questionIndex, 9);
      assert.equal(currentQuestion(state), null);
      assert.deepEqual(state.result, {
        mode: 'local-practice', total: 10, correct: correctCount,
        incorrect: 10 - correctCount, score: correctCount, answers: state.answers,
      });
      assert.strictEqual(advanceLocalRound(state), state);
      assert.strictEqual(answer(state), state);
      return state;
    }
    assert.deepEqual(play(), play());
  });
}

test('B03-C1: inicio rechaza tamaño incorrecto, IDs repetidos y preguntas inválidas', () => {
  for (const size of [0, 9, 11]) {
    const questions = Array.from({ length: size }, (_, i) => exampleQuestions[i % 10]);
    assert.throws(() => startLocalRound(questions), /exactly ten/);
  }
  const invalidVariants = [
    { id: exampleQuestions[1].id }, { id: '' }, { text: ' ' }, { category: 'casino' },
    { explanation: '' }, { correctAlternativeId: 'Z' },
    { alternatives: exampleQuestions[0].alternatives.slice(1) },
    { alternatives: Array(4).fill(exampleQuestions[0].alternatives[0]) },
    { alternatives: exampleQuestions[0].alternatives.map(option => ({ ...option, text: '' })) },
  ];
  for (const variant of invalidVariants) {
    const questions = structuredClone(exampleQuestions);
    Object.assign(questions[0], variant);
    assert.throws(() => startLocalRound(questions), /Invalid local/);
  }
});

test('B03-C1: cada ronda es independiente y protege su estado de mutaciones externas', () => {
  const input = structuredClone(exampleQuestions);
  const state = startLocalRound(input);
  input[0].correctAlternativeId = 'A';
  input[0].alternatives[0].text = 'Alterado';
  assert.equal(answer(state).answers[0].correct, true);
  assert.notEqual(currentQuestion(state).alternatives[0].text, 'Alterado');
  assert.throws(() => state.answers.push({}), TypeError);
  assert.throws(() => { state.questionIndex = 9; }, TypeError);
  assert.throws(() => { state.questions[0].correctAlternativeId = 'A'; }, TypeError);
  const answered = answer(state);
  assert.throws(() => { answered.answers[0].points = 50; }, TypeError);
  const fresh = startLocalRound(exampleQuestions);
  assert.deepEqual(fresh.answers, []);
  assert.equal(fresh.questionIndex, 0);
});
