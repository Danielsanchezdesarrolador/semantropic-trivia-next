import { getApprovedAsset } from '../assets/assetRegistry';
import { sheetAssets, sheetById, sheetPalette, type SheetCategory } from '../assets/sheetAssets';
import './home-preview.css';

const nav = [
  { label: 'Inicio', icon: '⌂' },
  { label: 'Colección', icon: '▣' },
  { label: 'Tienda', icon: '✦' },
  { label: 'Amigos', icon: '♧' },
  { label: 'Ranking', icon: '♛' },
] as const;
const categories: readonly SheetCategory[] = [
  'Marca y personajes','Cristales y objetos','Botones de referencia',
  'Paneles de referencia','Capas de referencia',
];
const asset = (id: string) => sheetById(id).path;

function ModeButton({ name, id }: {name:string; id:'online'|'friends'}) {
  return (
    <button className="st-sheet-action" type="button" disabled aria-label={`${name}: en desarrollo, no disponible`}>
      <img src={asset(id)} alt="" width={id==='online'?144:145} height={105} />
      <span className="st-sr-only">{name} — próximamente</span>
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

export default function HomePreview() {
  const approvedBackground = getApprovedAsset('environment/home-main');
  if (!approvedBackground) throw new Error('Fondo aprobado no registrado');
  return (
    <main className="st-preview-page">
      <section className="st-home" aria-label="Vista de prueba de Semantropic Trivia con assets separados">
        <div className="st-home__scene" aria-hidden="true">
          <img className="st-home__asset st-home__approved-background" src={approvedBackground} width={1672} height={941} alt="" fetchPriority="high" />
          <div className="st-home__veil" />
        </div>
        <aside className="st-home__sidebar" aria-label="Navegación ilustrativa aún no disponible">
          <div className="st-home__sidebar-mark" aria-hidden="true">✦</div>
          {nav.map((n,i)=><div className={'st-home__nav '+(i===0?'st-home__nav--active':'')} key={n.label}>
            <span className="st-home__nav-icon" aria-hidden="true">{n.icon}</span>
            <span className="st-home__nav-label">{n.label}</span>
          </div>)}
        </aside>
        <div className="st-home__content">
          <header className="st-home__header"><span>B02-C2 · PRUEBA DE ASSETS</span><span>Sin partidas operativas</span></header>
          <div className="st-home__brand">
            <h1 className="st-sr-only">SEMANTROPIC TRIVIA</h1>
            <img className="st-home__official-logo" src={asset('logo')} width={235} height={161} alt="" fetchPriority="high" />
            <img className="st-home__crystal st-home__crystal--one" src={asset('crystal-blue')} alt="" />
            <img className="st-home__crystal st-home__crystal--two" src={asset('crystal-violet')} alt="" />
          </div>
          <div className="st-home__characters" aria-label="Personajes candidatos">
            <img className="st-home__character st-home__character--boy" src={asset('boy')} alt="Protagonista 01, arte provisional" width={173} height={194} />
            <img className="st-home__character st-home__character--girl" src={asset('girl')} alt="Protagonista 02, arte provisional" width={180} height={196} />
            <img className="st-home__character st-home__character--robot" src={asset('robot')} alt="Robot ilustrativo, no modo CPU" width={142} height={158} />
          </div>
          <div className="st-home__actions" aria-label="Modos oficiales previstos">
            <ModeButton id="online" name="Jugar Online" />
            <ModeButton id="friends" name="Jugar con Amigos" />
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
          <div className="st-home__notice">Vista de arte en desarrollo · personajes, logo extraído y paneles pendientes de revisión · sin contenido jugable.</div>
        </div>
      </section>
      <ResourceLibrary />
    </main>
  );
}
