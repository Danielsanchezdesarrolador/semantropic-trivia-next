import { useEffect, useRef } from 'react';
import { getApprovedAsset, getOfficialAsset } from '../assets/assetRegistry';
import './lobby-transition-option-c.css';

/** B04-C2: composición de arte; el acceso al lobby no crea una sesión. */
export default function LobbyTransitionOptionC() {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => { title.current?.focus({ preventScroll: true }); }, []);

  return (
    <main className="b04-option-c" aria-labelledby="option-c-title">
      <div className="b04-option-c__stage">
        <picture className="b04-option-c__environment" aria-hidden="true">
          <source media="(max-aspect-ratio: 4/5)" srcSet={getOfficialAsset('lobby-option-c-mobile-v1').src} />
          <img src={getOfficialAsset('lobby-option-c-desktop-v1').src} alt="" fetchPriority="high" />
        </picture>
        <img className="b04-option-c__logo b04-logo" src={getApprovedAsset('brand/logo')!} alt="Semantropic Trivia" width={585} height={370} />
        <img className="b04-option-c__character b04-option-c__male" src={getOfficialAsset('protagonist-male-v1').src} alt="Protagonista masculino oficial" width={704} height={1100} />
        <img className="b04-option-c__character b04-option-c__female" src={getOfficialAsset('protagonist-female-v1').src} alt="Protagonista femenina oficial" width={653} height={1100} />
        <img className="b04-option-c__character b04-option-c__robot" src={getOfficialAsset('mascot-robot-v1').src} alt="Robot mascota oficial" width={1100} height={1044} />
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
