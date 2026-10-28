import { ActionTile, GameFrame } from '../components/visual-primitives';
import { previewAssets } from '../assets/previewAssets';

/** Solo vista gráfica: no contiene rutas de gameplay ni datos de usuario ficticios. */
function Scene({ src, className }: { src: string; className: string }) {
  return <img aria-hidden="true" className={'st-home__asset ' + className} src={src} alt="" draggable={false} />;
}

const navItems = [
  { icon: '⌂', label: 'Inicio', current: true },
  { icon: '✧', label: 'Colección', current: false },
  { icon: '✦', label: 'Tienda', current: false },
  { icon: '♧', label: 'Amigos', current: false },
  { icon: '♛', label: 'Ranking', current: false },
] as const;

export default function HomePreview() {
  return (
    <div className="st-home-preview-page">
      <GameFrame className="st-home" aria-label="Previsualización visual SEMANTROPIC TRIVIA">
        <div className="st-home__scene" aria-hidden="true">
          <Scene src={previewAssets.plaza} className="st-home__plaza" />
          <Scene src={previewAssets.night} className="st-home__night" />
          <Scene src={previewAssets.islands} className="st-home__islands" />
          <Scene src={previewAssets.crystalCyan} className="st-home__crystal st-home__crystal--one" />
          <Scene src={previewAssets.crystalWarm} className="st-home__crystal st-home__crystal--two" />
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
            <span className="st-home__stamp">B02-C2 · Vista artística</span>
            <span className="st-home__availability">Solo previsualización · Sin partidas</span>
          </header>
          <section className="st-home__hero" aria-label="Marca y ambiente visual del juego">
            <Scene src={previewAssets.logo} className="st-home__logo" />
            <Scene src={previewAssets.leftHero} className="st-home__character st-home__character--left" />
            <Scene src={previewAssets.rightHero} className="st-home__character st-home__character--right" />
            <Scene src={previewAssets.robot} className="st-home__character st-home__character--robot" />
          </section>
          <section className="st-home__actions" aria-labelledby="st-home-modes-title">
            <h1 id="st-home-modes-title" className="st-home__sr-only">Modalidades oficiales previstas</h1>
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
          <p className="st-home__disclaimer">Prototipo visual B02-C2 · Recursos ilustrativos candidatos, pendientes de aprobación · No hay partidas ni usuarios conectados.</p>
        </div>
      </GameFrame>
    </div>
  );
}
