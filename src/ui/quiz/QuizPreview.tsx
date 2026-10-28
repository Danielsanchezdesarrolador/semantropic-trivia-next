import { useState, type CSSProperties } from 'react';
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

/** B03-B02: sólo el MOCKUP integrado. No hay timer activo, corrección ni partida. */
export default function QuizPreview() {
  const [category, setCategory] = useState<QuizCategory>('geografia');
  const [appearance, setAppearance] = useState<AnswerAppearance>('normal');
  const [timerAppearance, setTimerAppearance] = useState<TimerAppearance>('normal');
  const activeTheme = categoryThemes[category];
  const shellStyle = {
    '--quiz-accent': activeTheme.accent,
    '--quiz-deep': activeTheme.deep,
    '--quiz-background-desktop': `url("${categoryBackdrop(category, 'pc_16x9')}")`,
    '--quiz-background-mobile': `url("${categoryBackdrop(category, 'movil_9x16')}")`,
  } as CSSProperties;

  return (
    <main className="b03-preview-page">
      <header className="b03-preview-heading">
        <div>
          <p className="b03-preview-eyebrow">SEMANTROPIC TRIVIA 1.0 · B03-B02</p>
          <h1>Arena del Conocimiento</h1>
          <p>Integración visual del mockup aprobado. Sin partida, puntuación ni cronómetro activos.</p>
        </div>
        <a href="/" className="b03-to-lobby">Regresar al lobby oficial</a>
      </header>

      <section className="b03-qa-controls" aria-label="Controles del laboratorio de diseño">
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
      </section>

      <section className="b03-arena" style={shellStyle} aria-label="Vista previa de una pantalla de preguntas">
        <div className="b03-arena-top">
          <span className="b03-back-visual" aria-label="Botón volver, visual no operativo">
            <img src={backSurface} alt="" />
            <span>Salir</span>
          </span>

          <div className="b03-category-header" aria-label={'Categoría visual: ' + activeTheme.label}>
            <img className="b03-category-header-skin" src={quizAsset(activeTheme.bar)} alt="" />
            <img className="b03-category-icon" src={quizAsset(activeTheme.icon)} alt="" />
            <span className="b03-category-title">{activeTheme.label}</span>
            <span className="b03-category-count">3 / 10</span>
          </div>

          <div className="b03-timer" aria-label="Temporizador ilustrativo de 18 segundos; no está en marcha">
            <img src={timerSurfaces[timerAppearance]} alt="" />
            <span>18</span>
          </div>
        </div>

        <section className="b03-question" aria-label="Ejemplo de pregunta">
          <img src={questionSurface} alt="" className="b03-question-skin" />
          <div className="b03-question-content">
            <span className="b03-question-kicker">PREGUNTA DE EJEMPLO · 3 DE 10</span>
            <h2>¿Cuál es la capital de Australia?</h2>
          </div>
        </section>

        <div className="b03-answer-grid" aria-label="Alternativas ilustrativas no interactivas">
          {demoOptions.map(option => {
            const highlighted = appearance !== 'normal' && option.letter === 'C';
            const state = highlighted ? appearance : 'normal';
            return (
              <div className={'b03-answer b03-answer--' + state} key={option.letter}>
                <img src={answerSurfaces[state]} alt="" className="b03-answer-skin" />
                <span className="b03-answer-letter">{option.letter}</span>
                <span className="b03-answer-text">{option.text}</span>
                {highlighted && (appearance === 'correct' || appearance === 'incorrect') &&
                  <img className="b03-answer-feedback" alt="" src={quizAsset(appearance === 'correct' ? 'icono_correcta' : 'icono_incorrecta')} />}
              </div>
            );
          })}
        </div>

        <div className="b03-progress" aria-label="Progreso ilustrativo: pregunta 3 de 10, sin partida en curso">
          {Array.from({ length: 10 }, (_, index) => {
            const kind = index < 2 ? 'done' : index === 2 ? 'now' : 'pending';
            return <img key={index} src={progressSurfaces[kind]} alt="" />;
          })}
        </div>
        <img className="b03-crystal b03-crystal--cyan" src={quizAsset('cristal_cian')} alt="" />
        <img className="b03-crystal b03-crystal--violet" src={quizAsset('cristal_violeta')} alt="" />
      </section>

      <section className="b03-qa-controls b03-qa-controls--bottom" aria-label="Estados de diseño">
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
      </section>
    </main>
  );
}
