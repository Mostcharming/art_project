import { tvColors } from "@/constants/tv-colors";
import { TV_CONFIG } from "@/constants/tv-config";
import { StyleSheet, Text, View } from "react-native";

interface TVHeaderProps {
  title: string;
  subtitle?: string;
  showSafeArea?: boolean;
}

/**
 * TV-optimized header component
 * - Large, readable text
 * - Proper spacing from edges
 * - High contrast for visibility
 */
export function TVHeader({
  title,
  subtitle,
  showSafeArea = true,
}: TVHeaderProps) {
  return (
    <View
      style={[styles.header, showSafeArea && styles.headerWithSafeArea]}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
    >
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: tvColors.backgroundDark,
    borderBottomWidth: 2,
    borderBottomColor: tvColors.secondary,
  },

  headerWithSafeArea: {
    paddingHorizontal: 48,
    marginLeft: 24,
    marginRight: 24,
  },

  title: {
    fontSize: TV_CONFIG.DIMENSIONS.TEXT_SIZES.EXTRA_LARGE,
    fontWeight: "700",
    color: tvColors.textPrimary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: TV_CONFIG.DIMENSIONS.TEXT_SIZES.MEDIUM,
    color: tvColors.textSecondary,
  },
});
