import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ds01Audio } from '../../audio/ds01/audioEngine';
import { useQuizAudio } from '../../audio/ds01/useQuizAudio';
import { currentQuestion } from '../../game/local/round';
import { useLocalPractice } from './useLocalPractice';
import TimerArc from './TimerArc';
import FullscreenControl from '../home/FullscreenControl';
import {
  answerSurfaces, backSurface, progressSurfaces, questionSurface,
  quizAsset, timerSurfaces, type AnswerAppearance, type TimerAppearance,
} from './quizAssets';
import { categoryBackdrop, categoryThemes, quizCategories, type QuizCategory } from './categoryThemes';
import './quiz-preview.css';

const demoOptions = [
  { letter: 'A', text: 'Sídney' },
  { letter: 'B', text: 'Melbourne' },
  { letter: 'C', text: 'Canberra' },
  { letter: 'D', text: 'Perth' },
] as const;
const DS01Panel = import.meta.env.DEV ? lazy(() => import('../../audio/ds01/DS01Panel')) : null;
const DS01Controls = import.meta.env.DEV ? lazy(() => import('../../audio/ds01/DS01Panel').then(module => ({ default: module.DS01Controls }))) : null;

/** Official: timed local practice. Default: independent B03-B02 visual laboratory. */
export default function QuizPreview({ official = false, onExit }: { official?: boolean; onExit?: () => void } = {}) {
  const [labCategory, setCategory] = useState<QuizCategory>('geografia');
  const [appearance, setAppearance] = useState<AnswerAppearance>('normal');
  const [timerAppearance, setTimerAppearance] = useState<TimerAppearance>('normal');
  const { session, round, remainingSeconds, durationSeconds, respond, advance, restart } = useLocalPractice(official);
  useQuizAudio(official ? round : null);
  const exit = onExit ? () => { ds01Audio.stop(); ds01Audio.play(['button']); onExit(); } : undefined;
  const nextQuestion = () => {
    if (round?.status === 'answered') { ds01Audio.play(['button']); advance(); }
  };
  const replay = () => {
    if (round?.status === 'finished') { ds01Audio.play(['button']); restart(); }
  };
  // Keep the final question visible with its feedback when the round finishes.
  const question = round ? currentQuestion(round) ?? round.questions[round.questionIndex] : null;
  const category = question?.category ?? labCategory;
  const questionNumber = round ? round.questionIndex + 1 : 3;
  const answer = round?.answers.find(item => item.questionId === question?.id);
  const timedOut = answer?.alternativeId === null;
  const options = question ? question.alternatives.map(option => ({ letter: option.id, text: option.text })) : demoOptions;
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!official) return;
    if (round?.status === 'finished') summary.current?.focus();
    else if (round?.status === 'answered') nextButton.current?.focus();
    else questionHeading.current?.focus();
  }, [official, round?.questionIndex, round?.status]);
  const activeTheme = categoryThemes[category];
  const shellStyle = {
    '--quiz-accent': activeTheme.accent,
    '--quiz-deep': activeTheme.deep,
    '--quiz-background-desktop': `url("${categoryBackdrop(category, 'pc_16x9')}")`,
    '--quiz-background-mobile': `url("${categoryBackdrop(category, 'movil_9x16')}")`,
  } as CSSProperties;

  return (
    <main className={'b03-preview-page' + (official ? ' b03-preview-page--official' : '')}>
      <header className="b03-preview-heading">
        <div>
          <p className="b03-preview-eyebrow">SEMANTROPIC TRIVIA 1.0 · {official ? 'PRÁCTICA LOCAL' : 'B03-B02'}</p>
          <h1>Arena del Conocimiento</h1>
          <p>{official ? `Práctica local · Diez preguntas · ${durationSeconds} segundos por pregunta.` : 'Integración visual del mockup aprobado. Sin partida, puntuación ni cronómetro activos.'}</p>
        </div>
        {official ? <div className="b03-preview-heading__actions">
          {DS01Controls ? <Suspense fallback={null}><DS01Controls /></Suspense> : null}
          <FullscreenControl />
          <button className="b03-to-lobby" type="button" onClick={exit}>Volver al lobby</button>
        </div> : <a href="/" className="b03-to-lobby">Regresar al lobby oficial</a>}
      </header>

      {!official && <section className="b03-qa-controls" aria-label="Controles del laboratorio de diseño">
        <div className="b03-control-heading"><strong>Categorías</strong><span>Elige una para ver cómo cambia el color de la arena</span></div>
        <div className="b03-category-pills" role="group" aria-label="Categoría del mockup">
          {quizCategories.map(id => (
            <button
              key={id} type="button" className={'b03-category-pill' + (category === id ? ' is-active' : '')}
              aria-pressed={category === id}
              style={{ '--pill-accent': categoryThemes[id].accent, '--pill-dark': categoryThemes[id].deep } as CSSProperties}
              onClick={() => setCategory(id)}
            >
              <img src={quizAsset(categoryThemes[id].icon)} alt="" width={28} height={28} />
              <span>{categoryThemes[id].label}</span>
            </button>
          ))}
        </div>
      </section>}

      <section className="b03-arena" style={shellStyle} aria-label={official ? 'Partida de práctica local' : 'Vista previa de una pantalla de preguntas'}>
        <div className="b03-arena-top">
          {official ? <button type="button" className="b03-back-visual b03-back-visual--interactive" onClick={exit} aria-label="Salir de Arena del Conocimiento">
            <img src={backSurface} alt="" />
            <span>Salir</span>
          </button> : <span className="b03-back-visual" aria-label="Botón volver, visual no operativo">
            <img src={backSurface} alt="" />
            <span>Salir</span>
          </span>}

          <div className="b03-category-header" aria-label={'Categoría visual: ' + activeTheme.label}>
            <img className="b03-category-header-skin" src={quizAsset(activeTheme.bar)} alt="" />
            <img className="b03-category-icon" src={quizAsset(activeTheme.icon)} alt="" />
            <span className="b03-category-title">{activeTheme.label}</span>
            <span className="b03-category-count">{questionNumber} / 10</span>
          </div>

          <div className="b03-timer" role="img" aria-label={official ? `${answer ? 'Tiempo detenido' : 'Tiempo restante'}: ${remainingSeconds} segundos` : 'Temporizador ilustrativo de 18 segundos; no está en marcha'}>
            <img src={timerSurfaces[official ? 'normal' : timerAppearance]} alt="" />
            {official && session && <TimerArc session={session} />}
            <span aria-hidden="true">{official ? remainingSeconds : '18'}</span>
          </div>
        </div>

        <section className="b03-question" aria-label={official ? 'Pregunta actual' : 'Ejemplo de pregunta'}>
          <img src={questionSurface} alt="" className="b03-question-skin" />
          <div className="b03-question-content">
            <span className="b03-question-kicker">{official ? 'PREGUNTA' : 'PREGUNTA DE EJEMPLO'} · {questionNumber} DE 10</span>
            <h2 ref={questionHeading} tabIndex={official ? -1 : undefined}>{question?.text ?? '¿Cuál es la capital de Australia?'}</h2>
          </div>
        </section>

        <div className="b03-answer-grid" role="group" aria-label={official ? 'Alternativas de respuesta' : 'Alternativas ilustrativas no interactivas'}>
          {options.map(option => {
            const selected = answer?.alternativeId === option.letter;
            let state: AnswerAppearance = appearance !== 'normal' && option.letter === 'C' ? appearance : 'normal';
            if (round) {
              const solution = round.questions[round.questionIndex].correctAlternativeId;
              state = !answer ? 'normal' : option.letter === solution ? 'correct' : selected ? 'incorrect' : 'normal';
            }
            const contents = <>
                <img src={answerSurfaces[state]} alt="" className="b03-answer-skin" />
                <span className="b03-answer-letter">{option.letter}</span>
                <span className="b03-answer-text">{option.text}</span>
                {(state === 'correct' || state === 'incorrect') &&
                  <img className="b03-answer-feedback" alt={state === 'correct' ? 'Respuesta correcta' : 'Respuesta incorrecta'} src={quizAsset(state === 'correct' ? 'icono_correcta' : 'icono_incorrecta')} />}
            </>;
            return official && question && round ? <button
              key={option.letter} type="button" className={'b03-answer b03-answer--interactive b03-answer--' + state}
              disabled={round.status !== 'awaiting-answer'} aria-pressed={selected}
              onClick={() => respond(question.id, option.letter)}
            >{contents}</button> : <div className={'b03-answer b03-answer--' + state} key={option.letter}>{contents}</div>;
          })}
        </div>

        <div className="b03-progress" role="img" aria-label={round ? `Pregunta ${questionNumber} de 10; ${round.answers.length} respuestas registradas` : 'Progreso ilustrativo: pregunta 3 de 10, sin partida en curso'}>
          {Array.from({ length: 10 }, (_, index) => {
            const kind = round ? index < round.answers.length ? 'done' : index === round.questionIndex ? 'now' : 'pending'
              : index < 2 ? 'done' : index === 2 ? 'now' : 'pending';
            return <img key={index} src={progressSurfaces[kind]} alt="" />;
          })}
        </div>
        <img className="b03-crystal b03-crystal--cyan" src={quizAsset('cristal_cian')} alt="" />
        <img className="b03-crystal b03-crystal--violet" src={quizAsset('cristal_violeta')} alt="" />
      </section>

      {official && round ? <div className="b03-visual-status" ref={summary} tabIndex={-1}>
        {round.status === 'finished' && <h2>Resultados de la práctica local</h2>}
        <p role="status">{round.status === 'finished' ?
          `Ronda finalizada · Aciertos: ${round.result.correct} de 10 · Errores: ${round.result.incorrect} · Puntuación: ${round.result.score} puntos.`
          : answer ? `${timedOut ? 'Tiempo agotado.' : answer.correct ? '¡Correcto!' : 'Respuesta incorrecta.'} ${round.questions[round.questionIndex].explanation}`
          : 'Selecciona una respuesta antes de que termine el tiempo.'}</p>
        {round.status === 'answered' && <button ref={nextButton} type="button" className="b03-to-lobby" onClick={nextQuestion}>Siguiente pregunta</button>}
        {round.status === 'finished' && <>
          <p>Preguntas completadas: {round.answers.length} de 10 · Respondidas: {round.answers.filter(item => item.alternativeId !== null).length} · Sin respuesta por tiempo: {round.answers.filter(item => item.alternativeId === null).length}</p>
          <p>{timedOut ? 'Tiempo agotado en la última pregunta. ' : ''}{round.questions[round.questionIndex].explanation}</p>
          <div className="b03-results-actions">
            <button type="button" className="b03-to-lobby" onClick={replay}>Volver a jugar</button>
            <button type="button" className="b03-to-lobby" onClick={exit}>Volver al inicio</button>
          </div>
        </>}
      </div> : <section className="b03-qa-controls b03-qa-controls--bottom" aria-label="Estados de diseño">
        <div className="b03-control-heading"><strong>Inspeccionar estados</strong><span>Estos controles muestran solamente variaciones visuales de los assets</span></div>
        <div className="b03-state-rows">
          <div className="b03-state-row" role="group" aria-label="Estado de respuesta de ejemplo">
            <span>Respuesta C</span>
            {(['normal', 'selected', 'correct', 'incorrect'] as const).map(id => (
              <button key={id} type="button" aria-pressed={appearance === id} onClick={() => setAppearance(id)}>
                {id === 'normal' ? 'Normal' : id === 'selected' ? 'Seleccionada' : id === 'correct' ? 'Correcta' : 'Incorrecta'}
              </button>
            ))}
          </div>
          <div className="b03-state-row" role="group" aria-label="Color del temporizador ilustrativo">
            <span>Reloj</span>
            {(['normal', 'alert', 'urgent'] as const).map(id => (
              <button key={id} type="button" aria-pressed={timerAppearance === id} onClick={() => setTimerAppearance(id)}>
                {id === 'normal' ? 'Azul' : id === 'alert' ? 'Amarillo' : 'Rojo'}
              </button>
            ))}
          </div>
        </div>
        <p className="b03-warning">B03-B02 · Previsualización de diseño: las respuestas no se pueden seleccionar para jugar, el reloj es estático y no se calculan puntos ni resultados. Las categorías y estados permiten revisar los recursos.</p>
      </section>}
      {official && DS01Panel ? <Suspense fallback={null}><DS01Panel /></Suspense> : null}
    </main>
  );
}
