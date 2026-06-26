import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, Platform, ScrollView } from "react-native";

interface KeyboardAwareScrollOptions {
  androidExtraPadding?: number;
  androidFocusDelay?: number;
  focusDelay?: number;
  keyboardShownDelay?: number;
}

export function useKeyboardAwareScroll(
  scrollViewRef: RefObject<ScrollView | null>,
  {
    androidExtraPadding = 24,
    androidFocusDelay = 350,
    focusDelay = 250,
    keyboardShownDelay = 50,
  }: KeyboardAwareScrollOptions = {},
) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputFocusedRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToEnd = useCallback(
    (delay = focusDelay) => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, delay);
    },
    [focusDelay, scrollViewRef],
  );

  useEffect(() => {
    const keyboardShowSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        if (Platform.OS === "android") {
          setKeyboardHeight(event.endCoordinates.height);
        }

        if (inputFocusedRef.current) {
          scrollToEnd(keyboardShownDelay);
        }
      },
    );
    const keyboardHideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        if (Platform.OS === "android") {
          setKeyboardHeight(0);
        }
      },
    );

    return () => {
      keyboardShowSubscription.remove();
      keyboardHideSubscription.remove();

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [keyboardShownDelay, scrollToEnd]);

  const handleInputFocus = useCallback(() => {
    inputFocusedRef.current = true;
    scrollToEnd(Platform.OS === "android" ? androidFocusDelay : focusDelay);
  }, [androidFocusDelay, focusDelay, scrollToEnd]);

  const handleInputBlur = useCallback(() => {
    inputFocusedRef.current = false;
  }, []);

  const androidKeyboardPadding =
    Platform.OS === "android" && keyboardHeight > 0
      ? keyboardHeight + androidExtraPadding
      : 0;

  return {
    androidKeyboardPadding,
    handleInputBlur,
    handleInputFocus,
    scrollToEnd,
  };
}

export function useAndroidKeyboardHeight(enabled = true) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== "android" || !enabled) {
      setKeyboardHeight(0);
      return;
    }

    const keyboardShowSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );
    const keyboardHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardShowSubscription.remove();
      keyboardHideSubscription.remove();
    };
  }, [enabled]);

  return keyboardHeight;
}
