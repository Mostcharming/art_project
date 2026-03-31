/**
 * useTVRemote - Hook for handling TV remote navigation
 * Handles D-Pad, arrow keys, and remote control input
 */

import { useEffect, useRef } from 'react';

declare global {
  var window: any;
}

interface RemoteNavigationConfig {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onEnter?: () => void;
  onBack?: () => void;
}

const useTVRemote = (config: RemoteNavigationConfig) => {
  const configRef = useRef(config);

  // Update ref when config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent & { preventDefault(): void },
    ) => {
      const key = event.key;

      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          configRef.current.onUp?.();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          configRef.current.onDown?.();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          configRef.current.onLeft?.();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          configRef.current.onRight?.();
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          configRef.current.onEnter?.();
          break;
        case 'Escape':
        case 'Backspace':
          event.preventDefault();
          configRef.current.onBack?.();
          break;
        default:
          break;
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);
};

export default useTVRemote;
