import { tvColors } from "@/constants/tv-colors";
import { TV_CONFIG } from "@/constants/tv-config";
import { Pressable, StyleSheet, Text } from "react-native";

interface TVButtonProps {
  title: string;
  onPress: () => void;
  isFocused?: boolean;
  variant?: "primary" | "secondary" | "outlined";
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

/**
 * TV-optimized button component
 * - Large touch targets (min 48dp)
 * - Clear focus indication
 * - Accessible text sizes
 */
export function TVButton({
  title,
  onPress,
  isFocused = false,
  variant = "primary",
  disabled = false,
  testID,
  accessibilityLabel,
}: TVButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = styles.button;

    switch (variant) {
      case "secondary":
        return [
          baseStyle,
          styles.buttonSecondary,
          isFocused && styles.buttonFocused,
          disabled && styles.buttonDisabled,
        ];
      case "outlined":
        return [
          baseStyle,
          styles.buttonOutlined,
          isFocused && styles.buttonOutlinedFocused,
          disabled && styles.buttonDisabled,
        ];
      case "primary":
      default:
        return [
          baseStyle,
          styles.buttonPrimary,
          isFocused && styles.buttonFocused,
          disabled && styles.buttonDisabled,
        ];
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: isFocused }}
      accessibilityLabel={accessibilityLabel || title}
      testID={testID}
      style={getButtonStyle()}
    >
      <Text
        style={[
          styles.buttonText,
          isFocused && styles.buttonTextFocused,
          disabled && styles.buttonTextDisabled,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: TV_CONFIG.DIMENSIONS.MIN_TAP_TARGET,
    minWidth: TV_CONFIG.DIMENSIONS.MIN_TAP_TARGET,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    // transition: "all 200ms ease-out",
  },

  buttonPrimary: {
    backgroundColor: tvColors.secondary,
  },

  buttonSecondary: {
    backgroundColor: tvColors.backgroundLight,
  },

  buttonOutlined: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: tvColors.textSecondary,
  },

  buttonFocused: {
    borderWidth: 3,
    borderColor: tvColors.focusBorder,
    backgroundColor: tvColors.focusBackground,
    transform: [{ scale: 1.05 }],
  },

  buttonOutlinedFocused: {
    borderColor: tvColors.focusBorder,
    backgroundColor: tvColors.focusBackground,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    fontSize: TV_CONFIG.DIMENSIONS.TEXT_SIZES.LARGE,
    fontWeight: "600",
    color: tvColors.textPrimary,
  },

  buttonTextFocused: {
    color: tvColors.textPrimary,
    fontWeight: "700",
  },

  buttonTextDisabled: {
    color: tvColors.textTertiary,
  },
});
