import Background from "@/assets/images/background.svg";
import Carsl from "@/assets/images/carsl.svg";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        router.push("/splash/splash1");
      }, 4000);

      return () => clearTimeout(timer);
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: "#000000",
      }}
    >
      <Background
        width={width * 1.1}
        height={height * 1.2}
        style={{
          position: "absolute",
          top: "40%",
          left: "40%",
          marginTop: -(height * 0.475),
          marginLeft: -(width * 0.475),
        }}
      />
      <View
        style={{
          position: "absolute",
          top: insets.top,
          left: insets.left,
          right: insets.right,
          bottom: insets.bottom,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Carsl
            width={Math.min(width * 0.3, 130)}
            height={Math.min(width * 0.3, 130)}
          />
        </View>
      </View>
      <LoadingAnimation />
    </View>
  );
}
