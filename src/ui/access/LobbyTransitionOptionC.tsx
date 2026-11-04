import { useEffect, useRef } from 'react';
import './lobby-transition-option-c.css';

const assets = '/assets/access/b04-option-c/';

/** B04-C2: composición de arte; el acceso al lobby no crea una sesión. */
export default function LobbyTransitionOptionC() {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => { title.current?.focus({ preventScroll: true }); }, []);

  return (
    <main className="b04-option-c" aria-labelledby="option-c-title">
      <div className="b04-option-c__stage">
        <picture className="b04-option-c__environment" aria-hidden="true">
          <source media="(max-aspect-ratio: 4/5)" srcSet={assets + 'lobby-option-c-mobile-1080x1920.webp'} />
          <img src={assets + 'lobby-option-c-desktop-2560x1440.webp'} alt="" fetchPriority="high" />
        </picture>
        <img className="b04-option-c__logo b04-logo" src="/assets/home/brand/semantropic-trivia-logo-v1.png" alt="Semantropic Trivia" width={585} height={370} />
        <img className="b04-option-c__character b04-option-c__male" src={assets + 'protagonist-male-v1-web.webp'} alt="Protagonista masculino oficial" width={704} height={1100} />
        <img className="b04-option-c__character b04-option-c__female" src={assets + 'protagonist-female-v1-web.webp'} alt="Protagonista femenina oficial" width={653} height={1100} />
        <img className="b04-option-c__character b04-option-c__robot" src={assets + 'mascot-robot-v1-web.webp'} alt="Robot mascota oficial" width={1100} height={1044} />
        <div className="b04-option-c__copy">
          <h1 id="option-c-title" ref={title} tabIndex={-1}>¡Bienvenido/a!</h1>
          <p>Preparando tu entrada al lobby</p>
        </div>
        <a className="b04-option-c__cta" href="#home" onKeyDown={event => {
          if (event.key === ' ') { event.preventDefault(); event.currentTarget.click(); }
        }}>ABRIR LOBBY LOCAL</a>
      </div>
    </main>
  );
}
