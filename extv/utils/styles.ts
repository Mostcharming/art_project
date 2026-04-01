import { type StyleProp, type TextStyle, type ViewStyle } from "react-native";

/**
 * Utility to merge NativeWind classes with inline styles
 * This is useful when you need to conditionally apply styles or override NativeWind classes
 */
export function cn(
  ...classes: (string | undefined | null | boolean)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Helper to safely apply styles from both NativeWind and inline styles
 */
export function mergeStyles(
  nativeWindClasses?: StyleProp<ViewStyle | TextStyle> | string,
  inlineStyles?: StyleProp<ViewStyle | TextStyle>
): StyleProp<ViewStyle | TextStyle> {
  // allow passing a NativeWind class string or style object; cast to satisfy StyleProp type
  return [nativeWindClasses as any, inlineStyles] as StyleProp<
    ViewStyle | TextStyle
  >;
}
