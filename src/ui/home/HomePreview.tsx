import { ActionTile, GameFrame } from '../components/visual-primitives';
import { getApprovedAsset } from '../assets/assetRegistry';

/**
 * B02-C2 / iteración 3: fondo y logotipo del mockup aprobados, como recursos independientes.
 * La composición contiene UI React real, pero NO habilita juego.
 * Personajes, robot y demás ornamentos continúan pendientes de aprobación.
 */
const navItems = [
  { icon: '⌂', label: 'Inicio', current: true },
  { icon: '✧', label: 'Colección', current: false },
  { icon: '✦', label: 'Tienda', current: false },
  { icon: '♧', label: 'Amigos', current: false },
  { icon: '♛', label: 'Ranking', current: false },
] as const;

export default function HomePreview() {
  const approvedBackground = getApprovedAsset('environment/home-main');
  const approvedLogo = getApprovedAsset('brand/logo');
  if (!approvedBackground || !approvedLogo) {
    throw new Error('Fondo y logotipo oficiales deben estar registrados antes de montar la home');
  }
  return (
    <div className="st-home-preview-page">
      <GameFrame className="st-home st-home--approved-bg st-home--official-logo" aria-label="Previsualización visual SEMANTROPIC TRIVIA">
        <div className="st-home__scene" aria-hidden="true">
          <img
            className="st-home__asset st-home__approved-background"
            src={approvedBackground}
            alt=""
            width={1672}
            height={941}
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
          <div className="st-home__background-veil" />
        </div>
        <aside className="st-home__sidebar" aria-label="Secciones ilustrativas, todavía no navegables">
          <div className="st-home__sidebar-mark" aria-hidden="true">✦</div>
          <div className="st-home__nav">
            {navItems.map(item => (
              <div key={item.label} className={'st-home__nav-item ' + (item.current ? 'st-home__nav-item--active' : '')} aria-label={item.label + (item.current ? ', sección visual actual' : ', futura sección no disponible')}>
                <span className="st-home__nav-icon" aria-hidden="true">{item.icon}</span>
                <span className="st-home__nav-label">{item.label}</span>
              </div>
            ))}
          </div>
        </aside>
        <div className="st-home__content">
          <header className="st-home__header">
            <span className="st-home__stamp">B02-C2 · Arte aprobado</span>
            <span className="st-home__availability">Previsualización · Sin partidas</span>
          </header>
          <section className="st-home__hero st-home__hero--text" aria-labelledby="st-home-title">
            <h1 className="st-home__sr-only" id="st-home-title">SEMANTROPIC TRIVIA</h1>
            <img
              className="st-home__official-logo"
              src={approvedLogo}
              width={585}
              height={370}
              alt=""
              decoding="async"
              fetchPriority="high"
              draggable={false}
            />
          </section>
          <section className="st-home__actions" aria-labelledby="st-home-modes-title">
            <h2 id="st-home-modes-title" className="st-home__sr-only">Modalidades oficiales previstas</h2>
            <ActionTile
              label="JUGAR ONLINE"
              description="Normal 1v1 y clasificatoria 1v1 · En desarrollo"
              tone="blue"
              symbol={<span aria-hidden="true">◎</span>}
            />
            <ActionTile
              label="JUGAR CON AMIGOS"
              description="Salas 1v1, 2v2, 3v3 y todos contra todos · En desarrollo"
              tone="coral"
              symbol={<span aria-hidden="true">♧</span>}
            />
          </section>
          <section className="st-home__info" aria-label="Experiencia social, todavía no jugable">
            <div className="st-home__info-card st-home__info-card--gold">
              <span aria-hidden="true" className="st-home__info-icon">✧</span>
              <div><strong>Comparte</strong><small>Una experiencia familiar y social</small></div>
            </div>
            <div className="st-home__info-card st-home__info-card--violet">
              <span aria-hidden="true" className="st-home__info-icon">♛</span>
              <div><strong>Compite</strong><small>Clasificatorias justas entre personas</small></div>
            </div>
          </section>
          <section className="st-home__footer-panels" aria-label="Pilares de diseño">
            <div className="st-home__footer-card"><span aria-hidden="true">✦</span><strong>DESCUBRE</strong><small>Conocimiento y diversión</small></div>
            <div className="st-home__footer-card"><span aria-hidden="true">♡</span><strong>COMPARTE</strong><small>Reúnete con amigos</small></div>
            <div className="st-home__footer-card"><span aria-hidden="true">◇</span><strong>DESTACA</strong><small>Tu propia identidad</small></div>
          </section>
          <p className="st-home__disclaimer">Prototipo visual B02-C2 · Fondo y logotipo oficiales integrados; personajes pendientes. No hay partidas ni usuarios conectados.</p>
        </div>
      </GameFrame>
    </div>
  );
}
