import { useEffect, useState } from 'react';

type StandaloneNavigator = Navigator & { standalone?: boolean };

/**
 * B02-FS — Pantalla completa iniciada SIEMPRE por una acción del usuario.
 * Los navegadores incompatibles muestran instrucciones reales, sin simular fullscreen.
 */
function isInstalledDisplayMode(): boolean {
  if (typeof window === 'undefined') return false;
  const fromManifest = window.matchMedia('(display-mode: fullscreen)').matches
    || window.matchMedia('(display-mode: standalone)').matches;
  const fromApple = (navigator as StandaloneNavigator).standalone === true;
  return fromManifest || fromApple;
}

export default function FullscreenControl() {
  const [fullscreen, setFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const sync = () => {
      setFullscreen(Boolean(document.fullscreenElement));
      setInstalled(isInstalledDisplayMode());
      if (document.fullscreenElement) setShowHelp(false);
    };
    sync();
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  async function toggle() {
    setShowHelp(false);
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        setShowHelp(true);
      }
      return;
    }

    // requestFullscreen debe llamarse directamente desde el clic.
    // Un navegador embebido o iOS puede denegar o no exponer la API.
    const element = document.documentElement;
    if (typeof element.requestFullscreen === 'function' && document.fullscreenEnabled !== false) {
      try {
        await element.requestFullscreen();
        return;
      } catch {
        // Mostrar opción honesta sin falsas promesas de ocultar barras.
      }
    }
    setShowHelp(true);
  }

  return (
    <div className="st-fullscreen-control">
      <button
        type="button"
        className="st-fullscreen-control__button"
        onClick={() => { void toggle(); }}
        aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        aria-pressed={fullscreen}
        title={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
      >
        {fullscreen ? (
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 3v6H3M15 3v6h6M3 15h6v6M21 15h-6v6"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6"/>
          </svg>
        )}
        <span className="st-fullscreen-control__label">{fullscreen ? 'Salir' : 'Pantalla completa'}</span>
      </button>
      {showHelp && (
        <div className="st-fullscreen-control__help" role="status">
          <div className="st-fullscreen-control__help-top">
            <strong>{installed ? 'Modo aplicación' : 'Cómo ampliar la pantalla'}</strong>
            <button type="button" aria-label="Cerrar ayuda de pantalla completa" onClick={() => setShowHelp(false)}>×</button>
          </div>
          {installed ? (
            <p>La aplicación ya está abierta desde la pantalla de inicio. Las barras del sistema dependen de tu dispositivo.</p>
          ) : (
            <p>Este navegador no permite activar pantalla completa aquí. Abre el enlace en <b>Chrome o Safari</b>; en Android usa el menú ⋮ → <b>Instalar aplicación</b> o <b>Añadir a pantalla de inicio</b>. En iPhone usa Compartir → <b>Añadir a pantalla de inicio</b>. En PC también puedes usar <b>F11</b>.</p>
          )}
        </div>
      )}
    </div>
  );
}
