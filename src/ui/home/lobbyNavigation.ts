import { useEffect, useState } from 'react';

/**
 * B02-NAV: navegación REAL de menús sin partidas ni cuentas simuladas.
 * Fragmentos hash para que el botón Atrás del navegador también funcione.
 */
export type LobbyScreen =
  | 'home' | 'online' | 'friends' | 'collection' | 'shop' | 'ranking' | 'arena'
  | 'online-normal' | 'online-ranked'
  | 'private-1v1' | 'private-2v2' | 'private-3v3' | 'private-ffa';

const VALID_SCREENS: readonly LobbyScreen[] = [
  'home', 'online', 'friends', 'collection', 'shop', 'ranking', 'arena',
  'online-normal', 'online-ranked',
  'private-1v1', 'private-2v2', 'private-3v3', 'private-ffa',
] as const;

function readHash(): LobbyScreen {
  if (typeof window === 'undefined') return 'home';
  const value = decodeURIComponent(window.location.hash.slice(1));
  return VALID_SCREENS.includes(value as LobbyScreen) ? value as LobbyScreen : 'home';
}

export function activeSidebarScreen(screen: LobbyScreen): LobbyScreen {
  if (screen === 'arena') return 'home';
  if (screen.startsWith('online-')) return 'home';
  if (screen.startsWith('private-')) return 'friends';
  return screen === 'online' ? 'home' : screen;
}

export function useLobbyNavigation(official: boolean) {
  const [screen, setScreen] = useState<LobbyScreen>(() => official ? readHash() : 'home');

  useEffect(() => {
    if (!official) return;
    const syncHash = () => setScreen(readHash());
    window.addEventListener('hashchange', syncHash);
    syncHash();
    return () => window.removeEventListener('hashchange', syncHash);
  }, [official]);

  function navigate(next: LobbyScreen) {
    if (!official) return;
    setScreen(next);
    if (typeof window !== 'undefined') window.location.hash = next;
  }

  return { screen: official ? screen : 'home', navigate };
}
