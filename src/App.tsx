const sections = [
  { label: 'Cliente web', description: 'React + TypeScript + Vite · estructura de fundación B01.' },
  { label: 'Phaser 4.2.1', description: 'Dependencia declarada, sin escenas ni Canvas activo.' },
  { label: 'Backend y base de datos', description: 'No implementados ni desplegados.' },
  { label: 'Modos de juego', description: 'Aprobados como visión; todavía no jugables.' },
  { label: 'Identidad gráfica', description: 'Pendiente de propuesta y aprobación en B02.' },
] as const;

function App() {
  return (
    <main className="page">
      <header className="intro" aria-labelledby="page-title">
        <p className="eyebrow">Fundación técnica · B01</p>
        <h1 id="page-title">SEMANTROPIC TRIVIA</h1>
        <p className="lede">Tablero de estado de la nueva etapa 1.0.</p>
        <p className="note">Esta página confirma únicamente que el cliente web puede publicarse. Aún no es una partida, un lobby ni un sistema multijugador.</p>
      </header>

      <section className="panel" aria-labelledby="scope-title">
        <h2 id="scope-title">Alcance técnico actual</h2>
        <dl className="items">
          {sections.map(({ label, description }) => (
            <div className="item" key={label}>
              <dt>{label}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="footer">B01 no se considerará completado hasta validar GitHub, CI, Render y pruebas en navegador.</footer>
    </main>
  );
}

export default App;
