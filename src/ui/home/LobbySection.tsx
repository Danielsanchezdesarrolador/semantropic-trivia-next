import type { LobbyScreen } from './lobbyNavigation';

type Navigate = (next: LobbyScreen) => void;

type ModeOption = Readonly<{
  id: LobbyScreen;
  title: string;
  description: string;
  emblem: string;
}>;

const ONLINE_OPTIONS: readonly ModeOption[] = [
  {
    id: 'online-normal',
    title: 'Normal 1v1',
    description: 'Partidas casuales contra otra persona. Rival IA opcional y siempre identificado, en una fase futura.',
    emblem: '◎',
  },
  {
    id: 'online-ranked',
    title: 'Clasificatoria 1v1',
    description: 'Competencia exclusivamente entre personas reales. No se permiten bots en clasificatorias.',
    emblem: '♛',
  },
];

const PRIVATE_OPTIONS: readonly ModeOption[] = [
  { id: 'private-1v1', title: '1v1', description: 'Dos amigos en una sala privada.', emblem: '1' },
  { id: 'private-2v2', title: '2v2', description: 'Dos equipos de dos personas.', emblem: '2' },
  { id: 'private-3v3', title: '3v3', description: 'Dos equipos de tres personas.', emblem: '3' },
  { id: 'private-ffa', title: 'Todos contra todos', description: 'Cada participante compite por su cuenta (FFA).', emblem: '★' },
];

const INFORMATIONAL_PAGES = {
  collection: {
    title: 'Colección',
    eyebrow: 'TU IDENTIDAD EN SEMANTROPIC',
    description: 'Aquí podrás personalizar tu avatar, marcos y elementos cosméticos.',
    note: 'Todavía no existe inventario ni objetos obtenidos. Este es un acceso navegable, no una colección simulada.',
    emblem: '◇',
  },
  shop: {
    title: 'Tienda',
    eyebrow: 'PERSONALIZACIÓN COSMÉTICA',
    description: 'Estamos preparando una tienda de objetos visuales que no concederán ventajas competitivas.',
    note: 'No hay precios, compras ni ofertas activas. Las futuras funciones requerirán aprobación.',
    emblem: '✦',
  },
  ranking: {
    title: 'Ranking',
    eyebrow: 'CLASIFICATORIAS JUSTAS',
    description: 'Las tablas mostrarán resultados reales de partidas clasificatorias entre personas.',
    note: 'No se muestran puestos ni jugadores ficticios. El ranking todavía no está implementado.',
    emblem: '♛',
  },
} as const;

function SelectionCard({ option, onNavigate }: { option: ModeOption; onNavigate: Navigate }) {
  return (
    <button
      type="button"
      className="st-lobby-panel__option"
      onClick={() => onNavigate(option.id)}
      aria-label={'Ver detalles de ' + option.title}
    >
      <span className="st-lobby-panel__option-icon" aria-hidden="true">{option.emblem}</span>
      <span className="st-lobby-panel__option-content">
        <strong>{option.title}</strong>
        <small>{option.description}</small>
        <span className="st-lobby-panel__option-link">Ver modalidad ›</span>
      </span>
    </button>
  );
}

export default function LobbySection({
  screen,
  onNavigate,
  logoSrc,
}: {
  screen: LobbyScreen;
  onNavigate: Navigate;
  logoSrc: string;
}) {
  const parent: LobbyScreen = screen.startsWith('online-')
    ? 'online'
    : screen.startsWith('private-') ? 'friends' : 'home';
  const choices = screen === 'online' ? ONLINE_OPTIONS : screen === 'friends' ? PRIVATE_OPTIONS : null;

  let title: string;
  let eyebrow: string;
  let description: string;
  let note: string | null = null;
  let emblem: string | null = null;

  if (screen === 'online') {
    title = 'Jugar Online';
    eyebrow = 'ELIGE TU EXPERIENCIA';
    description = 'Selecciona la modalidad para conocer cómo funcionará. El multijugador aún está en desarrollo.';
  } else if (screen === 'friends') {
    title = 'Jugar con Amigos';
    eyebrow = 'SALAS PRIVADAS';
    description = 'Explora los formatos de juego con amigos y familia. Todavía no es posible crear salas.';
  } else if (screen in INFORMATIONAL_PAGES) {
    const info = INFORMATIONAL_PAGES[screen as keyof typeof INFORMATIONAL_PAGES];
    ({ title, eyebrow, description, note, emblem } = info);
  } else {
    const option = [...ONLINE_OPTIONS, ...PRIVATE_OPTIONS].find(item => item.id === screen);
    if (!option) return null;
    title = option.title;
    eyebrow = screen.startsWith('online-') ? 'JUGAR ONLINE' : 'JUGAR CON AMIGOS';
    description = option.description;
    note = screen === 'online-ranked'
      ? 'Solo rivales humanos. Sin IA, clasificación simulada ni emparejamientos ficticios. Disponible en una fase posterior.'
      : screen === 'online-normal'
        ? 'El emparejamiento con humanos y la opción de rival IA identificada se construirán más adelante. No existe una búsqueda activa.'
        : 'La creación de salas privadas, invitaciones y partidas será implementada más adelante. Todavía no se ha creado ninguna sala.';
    emblem = option.emblem;
  }

  return (
    <section className="st-lobby-panel" aria-labelledby="st-lobby-panel-title">
      <div className="st-lobby-panel__top">
        <button
          type="button"
          className="st-lobby-panel__back"
          onClick={() => onNavigate(parent)}
        >
          <span aria-hidden="true">‹</span> {parent === 'home' ? 'Volver al inicio' : parent === 'online' ? 'Volver a Jugar Online' : 'Volver a Amigos'}
        </button>
        <span className="st-lobby-panel__status">En desarrollo</span>
      </div>

      <img className="st-lobby-panel__logo" src={logoSrc} alt="" width={585} height={370} />
      <div className="st-lobby-panel__body">
        <p className="st-lobby-panel__eyebrow">{eyebrow}</p>
        <h1 id="st-lobby-panel-title">{title}</h1>
        <p className="st-lobby-panel__description">{description}</p>

        {choices ? (
          <div className="st-lobby-panel__options" aria-label={'Modalidades de ' + title}>
            {choices.map(option => <SelectionCard key={option.id} option={option} onNavigate={onNavigate} />)}
          </div>
        ) : (
          <div className="st-lobby-panel__pending">
            <span className="st-lobby-panel__pending-icon" aria-hidden="true">{emblem || '✧'}</span>
            <strong>Próximamente</strong>
            <p>{note}</p>
          </div>
        )}
      </div>
      <p className="st-lobby-panel__footer">Navegación disponible · Las partidas y datos de usuario todavía no están activos.</p>
    </section>
  );
}
