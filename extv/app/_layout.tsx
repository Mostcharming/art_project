import {
  TVNavigationProvider,
  useTVNavigation,
} from "@/contexts/TVNavigationContext";
import { useFullScreenMode } from "@/hooks/useFullScreenMode";
import { useUserStore } from "@/store/userStore";
import { isTV } from "@/utils/deviceUtils";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../globals.css";
import GuestScreen from "./guest";
import HomeScreen from "./home";
import LandingScreen from "./landing";
import SignInScreen from "./signin";
import SignUpScreen from "./signup";

export const unstable_settings = {
  anchor: "landing",
};

function ScreenRenderer() {
  const { currentScreen } = useTVNavigation();

  switch (currentScreen) {
    case "Landing":
      return <LandingScreen />;
    case "Home":
      return <HomeScreen />;
    case "Guest":
      return <GuestScreen />;
    case "SignUp":
      return <SignUpScreen />;
    case "SignIn":
      return <SignInScreen />;
    default:
      return <LandingScreen />;
  }
}

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { user } = useUserStore();

  // Enable full screen mode for TV and phones
  useFullScreenMode();

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          BankGothicBold: require("@/assets/fonts/BankGothicBold.ttf"),
          BankGothicMediumBT: require("@/assets/fonts/BankGothicMediumBT.ttf"),
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
      <TVNavigationProvider initialScreen={user ? "Home" : "Landing"}>
        <View style={{ flex: 1 }}>
          <ScreenRenderer />
          {!isTV() && (
            <StatusBar
              style="light"
              translucent={true}
              backgroundColor="transparent"
            />
          )}
        </View>
      </TVNavigationProvider>
    </GestureHandlerRootView>
  );
}
