import { useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

interface TVRemoteOptions {
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  onSelect?: () => void;
  onBack?: () => void;
}

export function useTVRemote(options: TVRemoteOptions) {
  useEffect(() => {
    const { RCTDeviceEventEmitter } = NativeModules;

    let eventEmitter: any;
    try {
      eventEmitter = new NativeEventEmitter(RCTDeviceEventEmitter);
    } catch (e) {
      console.warn('NativeEventEmitter not available', e);
      return;
    }

    const subscriptions: any[] = [];

    if (eventEmitter) {
      // Left key
      if (options.onLeft) {
        subscriptions.push(
          eventEmitter.addListener('onRemoteKey', (event: any) => {
            if (event.keyName === 'KEYCODE_DPAD_LEFT') {
              options.onLeft?.();
            }
          })
        );
      }

      // Right key
      if (options.onRight) {
        subscriptions.push(
          eventEmitter.addListener('onRemoteKey', (event: any) => {
            if (event.keyName === 'KEYCODE_DPAD_RIGHT') {
              options.onRight?.();
            }
          })
        );
      }

      // Up key
      if (options.onUp) {
        subscriptions.push(
          eventEmitter.addListener('onRemoteKey', (event: any) => {
            if (event.keyName === 'KEYCODE_DPAD_UP') {
              options.onUp?.();
            }
          })
        );
      }

      // Down key
      if (options.onDown) {
        subscriptions.push(
          eventEmitter.addListener('onRemoteKey', (event: any) => {
            if (event.keyName === 'KEYCODE_DPAD_DOWN') {
              options.onDown?.();
            }
          })
        );
      }

      // Select/Enter key
      if (options.onSelect) {
        subscriptions.push(
          eventEmitter.addListener('onRemoteKey', (event: any) => {
            if (
              event.keyName === 'KEYCODE_DPAD_CENTER' ||
              event.keyName === 'KEYCODE_ENTER'
            ) {
              options.onSelect?.();
            }
          })
        );
      }

      // Back key
      if (options.onBack) {
        subscriptions.push(
          eventEmitter.addListener('onRemoteKey', (event: any) => {
            if (event.keyName === 'KEYCODE_BACK') {
              options.onBack?.();
            }
          })
        );
      }
    }

    return () => {
      subscriptions.forEach(sub => sub.remove());
    };
  }, [options]);
}

export function getNextFocusIndex(
  currentIndex: number,
  focusableIndices: number[],
  direction: 'left' | 'right'
): number {
  const currentPosition = focusableIndices.indexOf(currentIndex);

  if (currentPosition === -1) {
    return focusableIndices[0];
  }

  if (direction === 'left') {
    const nextPosition = currentPosition - 1;
    return nextPosition >= 0
      ? focusableIndices[nextPosition]
      : focusableIndices[focusableIndices.length - 1];
  } else {
    const nextPosition = currentPosition + 1;
    return nextPosition < focusableIndices.length
      ? focusableIndices[nextPosition]
      : focusableIndices[0];
  }
}
