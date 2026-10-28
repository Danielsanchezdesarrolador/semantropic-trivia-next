import { getApprovedAsset } from '../assets/assetRegistry';
import LobbySection from './LobbySection';
import { activeSidebarScreen, useLobbyNavigation } from './lobbyNavigation';
import { sheetAssets, sheetById, sheetPalette, type SheetCategory } from '../assets/sheetAssets';
import './home-preview.css';

const nav = [
  { label: 'Inicio', icon: '⌂', screen: 'home' },
  { label: 'Colección', icon: '▣', screen: 'collection' },
  { label: 'Tienda', icon: '✦', screen: 'shop' },
  { label: 'Amigos', icon: '♧', screen: 'friends' },
  { label: 'Ranking', icon: '♛', screen: 'ranking' },
] as const;
const categories: readonly SheetCategory[] = [
  'Marca y personajes','Cristales y objetos','Botones de referencia',
  'Paneles de referencia','Capas de referencia',
];
const asset = (id: string) => sheetById(id).path;

function ModeIcon({ id }: { id: 'online' | 'friends' }) {
  if (id === 'online') {
    return (
      <svg viewBox="0 0 80 80" role="presentation" aria-hidden="true" focusable="false">
        <circle cx="40" cy="40" r="29" fill="#f7fcff" stroke="#c7ecff" strokeWidth="3" />
        <path d="M11 40h58M40 11v58M18 23h44M18 57h44" fill="none" stroke="#1478cf" strokeWidth="3.6" strokeLinecap="round" />
        <ellipse cx="40" cy="40" rx="12" ry="29" fill="none" stroke="#167de0" strokeWidth="3.6" />
        <circle cx="40" cy="40" r="30" fill="none" stroke="#fff" strokeOpacity=".74" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" role="presentation" aria-hidden="true" focusable="false">
      <g fill="#fff7fc" stroke="#ffd6e9" strokeWidth="2.5" strokeLinejoin="round">
        <circle cx="40" cy="24" r="12"/><circle cx="17" cy="32" r="9"/><circle cx="63" cy="32" r="9"/>
        <path d="M17 44c-10 0-15 8-15 21v3h24V55c0-4-4-8-9-11ZM63 44c10 0 15 8 15 21v3H54V55c0-4 4-8 9-11Z"/>
        <path d="M40 40c-16 0-23 12-23 29v4h46v-4c0-17-7-29-23-29Z" strokeWidth="3"/>
      </g>
    </svg>
  );
}

function ModeButton({ name, id, onOpen }: {name:string; id:'online'|'friends'; onOpen?: () => void}) {
  return (
    <button className={`st-sheet-action st-sheet-action--${id}`} type="button" disabled={!onOpen} onClick={onOpen} aria-label={onOpen ? 'Abrir ' + name : name + ': en desarrollo, no disponible'}>
      <span className="st-sheet-action__icon"><ModeIcon id={id}/></span>
      <span className="st-sheet-action__title">{id === 'online' ? <>JUGAR<br/>ONLINE</> : <>JUGAR<br/>CON AMIGOS</>}</span>
      <span className="st-sheet-action__caption">{id === 'online' ? 'Reta a jugadores' : 'Crea salas privadas'}</span>
    </button>
  );
}

function ResourceLibrary() {
  return (
    <section className="st-library" aria-labelledby="st-library-title">
      <div className="st-library__header">
        <h2 id="st-library-title">Biblioteca de recursos · extracción de lámina</h2>
        <p>Recortes fieles del material entregado. Las transparencias se reconstruyeron a partir de una imagen aplanada: evalúa bordes y resolución antes de aprobar cada elemento.</p>
      </div>
      {categories.map(group => (
        <section key={group} className="st-library__group" aria-label={group}>
          <h3>{group}</h3>
          <div className="st-library__grid">
            {sheetAssets.filter(item=>item.category===group).map(item=>(
              <figure className="st-library__tile" key={item.id}>
                <div className="st-library__checker"><img src={item.path} alt={item.title} loading="eager" /></div>
                <figcaption><strong>{item.title}</strong><span>{item.state==='candidato'?'Candidato visual':'Referencia / no funcional'}</span>{item.note?<small>{item.note}</small>:null}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
      <section className="st-library__group" aria-label="Paleta de colores">
        <h3>Paleta de colores · 9 muestras</h3>
        <div className="st-palette">
          {sheetPalette.map(color=><div key={color.hex} className="st-palette__chip">
            <span style={{background:color.hex}}/><strong>{color.name}</strong><small>{color.hex}</small>
          </div>)}
        </div>
      </section>
    </section>
  );
}

export default function HomePreview({ official = false, showLibrary = true }: { official?: boolean; showLibrary?: boolean } = {}) {
  const approvedBackground = getApprovedAsset('environment/home-main');
  const approvedLogo = getApprovedAsset('brand/logo');
  const { screen, navigate } = useLobbyNavigation(official);
  const isHome = !official || screen === 'home';
  if (!approvedBackground || !approvedLogo) throw new Error('Fondo o logotipo oficial no registrado');
  return (
    <main className={'st-preview-page' + (official ? ' st-preview-page--official' : '')}>
      <section className="st-home" aria-label={official ? 'Pantalla principal de Semantropic Trivia' : 'Vista de prueba de Semantropic Trivia con assets separados'}>
        <div className="st-home__scene" aria-hidden="true">
          <img className="st-home__asset st-home__approved-background" src={approvedBackground} width={1672} height={941} alt="" fetchPriority="high" />
          <div className="st-home__veil" />
        </div>
        <aside className="st-home__sidebar" aria-label={official ? 'Navegación principal' : 'Navegación ilustrativa aún no disponible'}>
          <div className="st-home__sidebar-mark" aria-hidden="true">✦</div>
          {nav.map(n => {
            const selected = activeSidebarScreen(screen) === n.screen;
            const className = 'st-home__nav ' + (selected ? 'st-home__nav--active' : '');
            const iconAndLabel = <>
              <span className="st-home__nav-icon" aria-hidden="true">{n.icon}</span>
              <span className="st-home__nav-label">{n.label}</span>
            </>;
            return official
              ? <button
                  key={n.label}
                  type="button"
                  className={className}
                  onClick={() => navigate(n.screen)}
                  aria-current={selected ? 'page' : undefined}
                >{iconAndLabel}</button>
              : <div className={className} key={n.label}>{iconAndLabel}</div>;
          })}
        </aside>
        <div className={'st-home__content' + (!isHome ? ' st-home__content--section' : '')}>
          <header className="st-home__header">
            <span>{official ? 'SEMANTROPIC TRIVIA 1.0' : 'B02-C2 · PRUEBA DE ASSETS'}</span>
            <span>{official ? (isHome ? 'Modos próximamente' : 'Navegación habilitada') : 'Sin partidas operativas'}</span>
          </header>
          {isHome ? <>
          <div className="st-home__brand">
            <h1 className="st-sr-only">SEMANTROPIC TRIVIA</h1>
            <img className="st-home__official-logo" src={approvedLogo} width={585} height={370} alt="" fetchPriority="high" decoding="async" />
            <img className="st-home__crystal st-home__crystal--one" src={asset('crystal-blue')} alt="" />
            <img className="st-home__crystal st-home__crystal--two" src={asset('crystal-violet')} alt="" />
          </div>
          <div className="st-home__characters" aria-label="Personajes candidatos">
            <img className="st-home__character st-home__character--boy" src={asset('boy')} alt="Protagonista 01, arte provisional" width={173} height={194} />
            <img className="st-home__character st-home__character--girl" src={asset('girl')} alt="Protagonista 02, arte provisional" width={180} height={196} />
            <img className="st-home__character st-home__character--robot" src={asset('robot')} alt="Robot ilustrativo, no modo CPU" width={142} height={158} />
          </div>
          <div className="st-home__actions" aria-label="Modos oficiales previstos">
            <ModeButton id="online" name="Jugar Online" onOpen={official ? () => navigate('online') : undefined} />
            <ModeButton id="friends" name="Jugar con Amigos" onOpen={official ? () => navigate('friends') : undefined} />
          </div>
          <div className="st-home__ornaments" aria-hidden="true">
            <img className="st-home__ornament st-home__ornament--flowers" src={asset('flowers')} alt="" />
            <img className="st-home__ornament st-home__ornament--lantern" src={asset('lantern')} alt="" />
            <img className="st-home__ornament st-home__ornament--banner" src={asset('banner')} alt="" />
            <img className="st-home__ornament st-home__ornament--gold" src={asset('crystal-gold')} alt="" />
          </div>
          <section className="st-home__explain" aria-label="Estado actual">
            <div><b>Jugar Online</b><span>1v1 normal y clasificatoria solo entre personas.</span></div>
            <div><b>Jugar con Amigos</b><span>Salas privadas 1v1, 2v2, 3v3 y FFA.</span></div>
          </section>
          <div className="st-home__notice">
            {official
              ? 'Los menús ya se pueden explorar. Las partidas y el multijugador se incorporarán en los próximos bloques.'
              : 'Vista de arte en desarrollo · personajes, logo extraído y paneles pendientes de revisión · sin contenido jugable.'}
          </div>
          </> : <LobbySection screen={screen} onNavigate={navigate} logoSrc={approvedLogo} />}
        </div>
      </section>
      {showLibrary ? <ResourceLibrary /> : null}
    </main>
  );
}
