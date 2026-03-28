/**
 * useTVRemote - Hook for handling TV remote navigation
 * Handles D-Pad, arrow keys, and remote control input
 */

import { useEffect } from 'react';

interface RemoteNavigationConfig {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onEnter?: () => void;
  onBack?: () => void;
}

export const useTVRemote = (config: RemoteNavigationConfig) => {
  const handleKeyDown = (event: KeyboardEvent & { preventDefault(): void }) => {
    const key = event.key;

    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        config.onUp?.();
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        config.onDown?.();
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        config.onLeft?.();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        config.onRight?.();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        config.onEnter?.();
        break;
      case 'Escape':
      case 'Backspace':
        event.preventDefault();
        config.onBack?.();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [config]);
};

export default useTVRemote;
