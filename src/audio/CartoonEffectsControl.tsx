import { useEffect, useState } from 'react';
import { cartoonAudio } from './cartoonAudio';
import './cartoon-audio.css';

export default function CartoonEffectsControl() {
  const [active, setActive] = useState(cartoonAudio.active);
  const [volume, setVolume] = useState(cartoonAudio.volume);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) { cartoonAudio.hide(); setActive(false); }
    };
    document.addEventListener('visibilitychange', visibility);
    const route = () => { if (window.location.hash !== '#collection') cartoonAudio.stop(); };
    window.addEventListener('hashchange', route);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('hashchange', route);
      cartoonAudio.hide();
    };
  }, []);
  return <span className="st-cartoon-audio">
    <button type="button" aria-pressed={active} disabled={!cartoonAudio.available}
      title={!cartoonAudio.available ? 'Efectos no disponibles en esta versión' : undefined}
      onClick={async () => {
        if (active) { cartoonAudio.disable(); setActive(false); }
        else { const enabled = await cartoonAudio.enable(); setActive(enabled); setFailed(!enabled); }
      }}>{active ? 'Silenciar efectos' : 'Activar efectos'}</button>
    {active ? <label>Volumen de efectos
      <input type="range" min="0" max="100" value={Math.round(volume * 100)}
        onChange={event => {
          const next = Number(event.target.value) / 100;
          cartoonAudio.setVolume(next); setVolume(next);
        }} />
    </label> : null}
    {failed ? <span role="status">No se pudo activar el sonido. Puedes reintentarlo.</span> : null}
  </span>;
}
