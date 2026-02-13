import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../globals.css";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          BankGothicBold: require("@/assets/fonts/BankGothicBold.ttf"),
          BankGothicMediumBT: require("@/assets/fonts/BankGothicMediumBT.ttf"),
          BankGothicMdBT: require("@/assets/fonts/BankGothicMdBT.ttf"),
          BankGothicLight: require("@/assets/fonts/BankGothicLightRegular.otf"),
        });
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="splash/splash1" options={{ headerShown: false }} />
        <Stack.Screen name="splash/splash2" options={{ headerShown: false }} />
        <Stack.Screen name="splash/splash3" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/signup/email-password"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/signup/token"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/login/index"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar
        style="light"
        translucent={true}
        backgroundColor="transparent"
      />
    </ThemeProvider>
  );
}
