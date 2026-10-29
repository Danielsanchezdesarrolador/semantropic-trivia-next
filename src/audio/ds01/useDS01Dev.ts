import { useEffect } from 'react';
import { ds01Audio } from './audioEngine';
import { arenaMusic } from '../lobbyMusic';

export function useDS01Dev(official: boolean) {
  useEffect(() => {
    if (!import.meta.env.DEV || !official) return;
    ds01Audio.beginOfficial();
    void import('./autoLoadDev').then(module => module.prepareDS01Dev());
    void import('../sfx02/loadDev').then(module => module.loadOfficialDev());
    const gesture = (event: Event) => {
      if (!event.isTrusted || !(event.target instanceof Element)
        || !event.target.closest('button:not([disabled]), a, input[type=range]')) return;
      if (event.target.closest('.ds01-controls, .ds01-panel')) return; // Explicit controls own their gesture.
      if (event instanceof KeyboardEvent && !['Enter', ' '].includes(event.key)) return;
      // Unlock only: no indiscriminate click SFX. Event mappings remain unchanged.
      void ds01Audio.interaction();
      if (event.target.closest('.b03-answer--interactive')) arenaMusic.interaction();
    };
    document.addEventListener('pointerdown', gesture, true);
    document.addEventListener('keydown', gesture, true);
    return () => {
      document.removeEventListener('pointerdown', gesture, true);
      document.removeEventListener('keydown', gesture, true);
    };
  }, [official]);
}
