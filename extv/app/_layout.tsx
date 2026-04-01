import { TVNavigationProvider } from "@/contexts/TVNavigationContext";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../globals.css";

export const unstable_settings = {
  anchor: "landing",
};

export default function RootLayout() {
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <TVNavigationProvider>
          <View style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen name="landing" options={{ headerShown: false }} />
            </Stack>
            <StatusBar
              style="light"
              translucent={true}
              backgroundColor="transparent"
            />
          </View>
        </TVNavigationProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
