import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { assertPublishable } from '../scripts/audio/guard-ds01.mjs';

const compile = path => ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const catalogUrl = moduleUrl(compile('../src/audio/ds01/catalog.ts'));
const { filenames, soundFilename } = await import(catalogUrl);
const { QuizAudioEvents } = await import(moduleUrl(compile('../src/audio/ds01/quizAudioEvents.ts')));
const contractsUrl = moduleUrl(compile('../src/game/local/contracts.ts'));
const roundUrl = moduleUrl(compile('../src/game/local/round.ts').replaceAll("'./contracts.ts'", `'${contractsUrl}'`));
const timedUrl = moduleUrl(compile('../src/game/local/timedRound.ts').replaceAll("'./round.ts'", `'${roundUrl}'`));
const { startTimedLocalRound, answerTimedLocalQuestion, advanceTimedLocalRound, syncTimedLocalRound } = await import(timedUrl);
const { exampleQuestions } = await import(moduleUrl(compile('../src/game/local/exampleQuestions.ts')));

test('DS-01: 13 nombres individuales, sin reels; B es última variante de selección/tiempo', () => {
  assert.equal(filenames.length, 13);
  assert.equal(soundFilename('selection', 'B'), 'POP02_SELECCION_B.mp3');
  assert.throws(() => soundFilename('selection', 'C'));
  assert.throws(() => soundFilename('timeout', 'C'));
  assert.ok(!filenames.some(name => /ESCUCHA|AUDICION/.test(name)));
});
test('DS-01: transiciones confirmadas emiten selección + feedback una vez, timeout único y reinicio independiente', () => {
  const observer = new QuizAudioEvents();
  const questions = [];
  const round = { questions, answers: [] };
  const played = [];
  const consume = state => observer.collect(state).forEach(events => played.push(...events));
  consume(round);
  const correct = { ...round, answers: [{ questionId: '1', alternativeId: 'A', correct: true }] };
  consume(correct); consume(correct); consume({ ...correct });
  assert.deepEqual(played, ['selection', 'correct']);
  const incorrect = { ...correct, answers: [...correct.answers, { questionId: '2', alternativeId: 'B', correct: false }] };
  consume(incorrect); consume(incorrect);
  const timeout = { ...incorrect, answers: [...incorrect.answers, { questionId: '3', alternativeId: null, correct: false }] };
  consume(timeout); consume(timeout);
  assert.deepEqual(played, ['selection', 'correct', 'selection', 'incorrect', 'timeout']);
  consume({ questions: [], answers: correct.answers });
  assert.deepEqual(played.slice(-2), ['selection', 'correct']);
});
test('DS-01 guard: rejects renamed audio, WAV, soundfont and unapproved extensions', () => {
  for (const [name, bytes] of [['public/POP01_BOTON_A.mp3', Buffer.from('fake')],
    ['public/innocent.dat', Buffer.from('ID3private')], ['dist/a.bin', Buffer.from('RIFF0000WAVE')],
    ['public/TimGM6mb.sf2', Buffer.from('RIFF0000sfbk')]]) assert.throws(() => assertPublishable(name, bytes));
  assert.doesNotThrow(() => assertPublishable('src/code.ts', Buffer.from('const a = 1;')));
});
test('DS-01: motor real, respuesta tardía, avance y reinicio con mock de reproducción', () => {
  const observer = new QuizAudioEvents();
  const calls = [];
  const playbackMock = events => calls.push([...events]);
  const syncAudio = session => observer.collect(session.round).forEach(playbackMock);
  let session = startTimedLocalRound(exampleQuestions, 100);
  const first = exampleQuestions[0];
  session = answerTimedLocalQuestion(session, first.id, first.correctAlternativeId, 110);
  syncAudio(session);
  session = answerTimedLocalQuestion(session, first.id, 'A', 120); syncAudio(session);
  assert.deepEqual(calls, [['selection', 'correct']]);
  session = advanceTimedLocalRound(session, 130);
  session = answerTimedLocalQuestion(session, exampleQuestions[1].id, 'A', 140); syncAudio(session);
  assert.deepEqual(calls.at(-1), ['selection', 'incorrect']);
  session = advanceTimedLocalRound(session, 150);
  session = syncTimedLocalRound(session, 25000); syncAudio(session);
  session = answerTimedLocalQuestion(session, exampleQuestions[2].id, 'A', 26000); syncAudio(session);
  assert.deepEqual(calls, [['selection', 'correct'], ['selection', 'incorrect'], ['timeout']]);
  session = startTimedLocalRound(exampleQuestions, 27000);
  session = answerTimedLocalQuestion(session, first.id, first.correctAlternativeId, 27010); syncAudio(session);
  assert.equal(calls.length, 4);
});
test('DS-01 engine: no samples, mute, autoplay rejection and volume zero never play', async () => {
  const { DS01AudioEngine } = await import(moduleUrl(compile('../src/audio/ds01/audioEngine.ts')
    .replaceAll("'./catalog'", `'${catalogUrl}'`).replaceAll('import.meta.env.DEV', 'true')));
  const original = { context: globalThis.AudioContext, document: globalThis.document };
  globalThis.document = { hidden: false };
  let started = 0;
  class FakeContext {
    state = 'suspended'; currentTime = 0; destination = {};
    createGain() { return { gain: { value: 0, setTargetAtTime() {} }, connect() {} }; }
    async resume() { this.state = 'running'; }
    async decodeAudioData() { return { duration: 0.3 }; }
    createBufferSource() { return { connect() {}, disconnect() {}, stop() {}, start() { started++; } }; }
  }
  globalThis.AudioContext = FakeContext;
  try {
    const engine = new DS01AudioEngine();
    engine.play(['correct']); await engine.enable(); engine.play(['correct']);
    assert.equal(started, 0);
    const file = { name: 'TIKI01_ACIERTO_A.mp3', size: 3, async arrayBuffer() { return new ArrayBuffer(3); } };
    await engine.importFiles([file]);
    engine.play(['correct']); assert.equal(started, 1);
    engine.mute(); engine.play(['correct']); assert.equal(started, 1);
    await engine.enable(); engine.setVolume(0); engine.play(['correct']); assert.equal(started, 1);
    engine.clear(); assert.equal(engine.samples.length, 0);
    globalThis.AudioContext = class extends FakeContext { async resume() { throw Error('autoplay'); } };
    const blocked = new DS01AudioEngine(); await blocked.enable();
    assert.equal(blocked.active, false); assert.match(blocked.message, /No se pudo/);
  } finally { globalThis.AudioContext = original.context; globalThis.document = original.document; }
});
