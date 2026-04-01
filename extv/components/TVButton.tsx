import { TV_COLORS, TV_LAYOUT } from "@/constants/tv";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

interface TVButtonProps {
  onPress: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function TVButton({
  onPress,
  onFocus,
  onBlur,
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
  testID,
}: TVButtonProps) {
  const [isFocused, setIsFocused] = useState(false);
  const pressableRef = useRef(null);

  const sizeStyles = {
    small: {
      height: 48,
      paddingHorizontal: 24,
    },
    medium: {
      height: TV_LAYOUT.BUTTON.HEIGHT,
      paddingHorizontal: TV_LAYOUT.BUTTON.PADDING_HORIZONTAL,
    },
    large: {
      height: 80,
      paddingHorizontal: 48,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: TV_COLORS.PRIMARY,
      borderColor: isFocused ? TV_COLORS.FOCUS : TV_COLORS.PRIMARY,
    },
    secondary: {
      backgroundColor: "transparent",
      borderColor: isFocused ? TV_COLORS.FOCUS : TV_COLORS.SECONDARY,
    },
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <Pressable
      ref={pressableRef}
      onPress={onPress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        sizeStyles[size],
        variantStyles[variant],
        {
          borderWidth: isFocused ? TV_LAYOUT.FOCUS_BORDER_WIDTH : 2,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          shadowColor: isFocused ? TV_COLORS.FOCUS : "transparent",
          shadowOpacity: isFocused ? 0.8 : 0,
          shadowRadius: isFocused ? 10 : 0,
          elevation: isFocused ? 10 : 0,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color:
              variant === "primary" ? TV_COLORS.BACKGROUND : TV_COLORS.PRIMARY,
            fontSize: size === "large" ? 32 : size === "small" ? 24 : 28,
          },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: TV_LAYOUT.CARD.BORDER_RADIUS,
    marginVertical: TV_LAYOUT.SPACING.SM,
    marginHorizontal: TV_LAYOUT.SPACING.SM,
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
