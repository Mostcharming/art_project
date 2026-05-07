import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox } from "react-native";
import "../globals.css";

import { useColorScheme } from "@/hooks/use-color-scheme";

// Suppress Reanimated strict mode warnings
// These warnings occur in development when libraries internally use reanimated
// but are not a concern for production
LogBox.ignoreLogs([
  "Reading from `value` during component render",
  "Writing to `value` during component render",
]);

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    BankGothic: require("@/assets/fonts/BankGothicLightRegular.otf"),
    BankGothicBold: require("@/assets/fonts/BankGothicBold.ttf"),
    BankGothicMedium: require("@/assets/fonts/BankGothicMediumBT.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: "#000000",
            flex: 1,
          },
          headerStyle: { backgroundColor: "#000000" },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="pages/secondIndex"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="pages/guestPage" options={{ headerShown: false }} />
        <Stack.Screen
          name="pages/signupPage"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pages/signinPage"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="light" hidden={false} />
    </ThemeProvider>
  );
}
