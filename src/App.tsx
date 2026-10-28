import HomePreview from './ui/home/HomePreview';

/** Inicio oficial B02: mismo lobby aprobado, sin galería técnica ni partidas ficticias. */
export default function App() {
  return <HomePreview official showLibrary={false} />;
}
