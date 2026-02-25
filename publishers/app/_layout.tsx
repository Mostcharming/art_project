import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Font from "expo-font";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../globals.css";

import BottomNavbar from "@/components/BottomNavbar";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useUserStore } from "@/store/userStore";

export const unstable_settings = {
  anchor: "(tabs)",
};

const NAVBAR_SEGMENTS = ["dashboard", "profile", "settings", "tags"];

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const hasHydrated = useUserStore.persist.hasHydrated;

  useEffect(() => {
    if (!hasHydrated()) return;

    const inProtectedRoute = NAVBAR_SEGMENTS.some((seg) =>
      segments.includes(seg as never)
    );

    if (!isAuthenticated() && inProtectedRoute) {
      router.replace("/splash/splash1");
    }
  }, [segments, isAuthenticated, hasHydrated, router]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const pathname = usePathname();

  useProtectedRoute();

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

  const showBottomNavbar = NAVBAR_SEGMENTS.some((seg) =>
    pathname.includes(seg)
  );

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="splash/splash1"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="splash/splash2"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="splash/splash3"
            options={{ headerShown: false }}
          />
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
          <Stack.Screen
            name="auth/signup/account-setup"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="tags" options={{ headerShown: false }} />
          <Stack.Screen
            name="auth/forgotpassword/page1"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="auth/forgotpassword/page2"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="auth/forgotpassword/page3"
            options={{ headerShown: false }}
          />
        </Stack>
        {showBottomNavbar && <BottomNavbar />}
        <StatusBar
          style="light"
          translucent={true}
          backgroundColor="transparent"
        />
      </View>
    </ThemeProvider>
  );
}
