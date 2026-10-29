import { useEffect } from 'react';
import { ds01Audio } from './audioEngine';

export function useDS01Dev(official: boolean) {
  useEffect(() => {
    if (!import.meta.env.DEV || !official) return;
    void import('./autoLoadDev').then(module => module.prepareDS01Dev());
    const gesture = (event: Event) => {
      if (!event.isTrusted || !(event.target instanceof Element)
        || !event.target.closest('button:not([disabled]), a, input[type=range]')) return;
      if (event.target.closest('.ds01-controls, .ds01-panel')) return; // Explicit controls own their gesture.
      if (event instanceof KeyboardEvent && !['Enter', ' '].includes(event.key)) return;
      // Unlock only: no indiscriminate click SFX. Event mappings remain unchanged.
      void ds01Audio.interaction();
    };
    document.addEventListener('pointerdown', gesture, true);
    document.addEventListener('keydown', gesture, true);
    return () => {
      document.removeEventListener('pointerdown', gesture, true);
      document.removeEventListener('keydown', gesture, true);
    };
  }, [official]);
}
