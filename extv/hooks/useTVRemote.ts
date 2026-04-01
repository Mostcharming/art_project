import { useEffect, useRef } from "react";
import { BackHandler, Platform } from "react-native";

export interface TVRemoteEvent {
  keyCode: number;
  action: "down" | "up";
  isLongPress: boolean;
}

export enum TVRemoteKeys {
  DPAD_UP = 19,
  DPAD_DOWN = 20,
  DPAD_LEFT = 21,
  DPAD_RIGHT = 22,
  DPAD_CENTER = 23,
  ENTER = 66,
  BACK = 4,
  HOME = 3,
  MENU = 82,
}

interface TVRemoteCallbacks {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onSelect?: () => void;
  onBack?: () => void;
}

export function useTVRemote(callbacks: TVRemoteCallbacks) {
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const handleBackPress = () => {
      if (callbacks.onBack) {
        callbacks.onBack();
        return true;
      }
      return false;
    };

    subscriptionRef.current = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, [callbacks]);
}

export function TVRemoteEventEmitter() {
  // This would be implemented using native module bridges
  // For now, we rely on standard Android key event handling
}
