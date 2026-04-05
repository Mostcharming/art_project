# Font Usage Guide - BankGothic Fonts

Your BankGothic fonts are now set up and ready to use throughout your Expo app with NativeWind.

## Available Fonts

The following custom fonts are loaded and configured:

1. **BankGothic** - Light Regular (default)
2. **BankGothicBold** - Bold variant
3. **BankGothicMedium** - Medium variant

## How to Use Fonts

### Method 1: Using NativeWind Classes (Recommended)

You can use the font family classes configured in your `tailwind.config.ts`:

```tsx
import { Text } from "react-native";
import { useStyles } from "nativewind";

export function MyComponent() {
  return (
    <>
      <Text className="font-bankgothic">Regular BankGothic Text</Text>
      <Text className="font-bankgothicbold">Bold BankGothic Text</Text>
      <Text className="font-bankgothicmedium">Medium BankGothic Text</Text>
    </>
  );
}
```

### Method 2: Using React Native StyleSheet

Use the `fontFamily` style property directly:

```tsx
import { StyleSheet, Text } from "react-native";

export function MyComponent() {
  return (
    <>
      <Text style={styles.regularText}>Regular BankGothic Text</Text>
      <Text style={styles.boldText}>Bold BankGothic Text</Text>
      <Text style={styles.mediumText}>Medium BankGothic Text</Text>
    </>
  );
}

const styles = StyleSheet.create({
  regularText: {
    fontFamily: "BankGothic",
    fontSize: 16,
  },
  boldText: {
    fontFamily: "BankGothicBold",
    fontSize: 16,
  },
  mediumText: {
    fontFamily: "BankGothicMedium",
    fontSize: 16,
  },
});
```

### Method 3: Using ThemedText Component

Extend the `ThemedText` component to support custom fonts:

```tsx
import { ThemedText } from "@/components/themed-text";

// In any component:
<ThemedText type="title" style={{ fontFamily: "BankGothic" }}>
  Your Text Here
</ThemedText>;
```

## Complete Example

Here's a complete example using all three fonts:

```tsx
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function FontShowcase() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        BankGothic Fonts
      </ThemedText>

      <ThemedText style={styles.regularText}>
        This is BankGothic Light Regular
      </ThemedText>

      <ThemedText style={styles.boldText}>This is BankGothic Bold</ThemedText>

      <ThemedText style={styles.mediumText}>
        This is BankGothic Medium
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 15,
  },
  title: {
    fontFamily: "BankGothic",
    fontSize: 28,
    marginBottom: 10,
  },
  regularText: {
    fontFamily: "BankGothic",
    fontSize: 16,
  },
  boldText: {
    fontFamily: "BankGothicBold",
    fontSize: 16,
    fontWeight: "bold",
  },
  mediumText: {
    fontFamily: "BankGothicMedium",
    fontSize: 16,
  },
});
```

## Font Files Location

Font files are located in: `/assets/fonts/`

- `BankGothicLightRegular.otf` → fontFamily: `'BankGothic'`
- `BankGothicBold.ttf` → fontFamily: `'BankGothicBold'`
- `BankGothicMediumBT.ttf` → fontFamily: `'BankGothicMedium'`

## Font Loading

Fonts are automatically loaded when the app starts (in `app/_layout.tsx`). The splash screen will wait until all fonts are loaded before showing the app.

## Troubleshooting

If fonts don't appear:

1. **Clear cache**: Run `expo start -c`
2. **Rebuild app**: Rebuild on your target platform (iOS/Android/Web)
3. **Check font names**: Ensure you're using the exact font family names as configured in `app/_layout.tsx`

## NativeWind Setup

Your project is configured with:

- **NativeWind** v4.2.3 for utility-first styling
- **Tailwind CSS** for configuration
- Custom font families in `tailwind.config.ts`

Use NativeWind classes with any React Native component:

```tsx
import { View, Text } from "react-native";

<View className="flex items-center justify-center bg-white p-4">
  <Text className="font-bankgothic text-2xl text-black">
    Styled with NativeWind!
  </Text>
</View>;
```
