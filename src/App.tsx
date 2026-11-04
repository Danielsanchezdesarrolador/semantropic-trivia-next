import HomePreview from './ui/home/HomePreview';
import { useEffect, useState } from 'react';
import AccessPortal, { isAccessRoute } from './ui/access/AccessPortal';

/** B04-C1: entrada visual; las rutas del lobby y Arena conservan su implementación. */
export default function App() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1));
  useEffect(() => {
    const sync = () => setRoute(window.location.hash.slice(1));
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  return isAccessRoute(route) ? <AccessPortal route={route} /> : <HomePreview official showLibrary={false} />;
}
