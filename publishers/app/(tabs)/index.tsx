import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useAssets } from "expo-asset";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgUri } from "react-native-svg";

export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [assets] = useAssets([
    require("@/assets/images/background.svg"),
    require("@/assets/images/carsl.svg"),
  ]);
  const [svgUri, setSvgUri] = useState<string>("");
  const [carslUri, setCarslUri] = useState<string>("");

  useEffect(() => {
    if (assets && assets[0] && assets[1]) {
      setSvgUri(assets[0].uri);
      setCarslUri(assets[1].uri);
    }
  }, [assets]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push("/splash/splash1");
  //   }, 4000);

  //   return () => clearTimeout(timer);
  // }, [router]);

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
      {svgUri && (
        <SvgUri
          width={width * 1.1}
          height={height * 1.2}
          uri={svgUri}
          style={{
            position: "absolute",
            top: "40%",
            left: "40%",
            marginTop: -(height * 0.475),
            marginLeft: -(width * 0.475),
          }}
        />
      )}
      {!svgUri && (
        <View className="flex-1 bg-red-500 justify-center items-center">
          <Text>SVG not loaded. URI: {svgUri}</Text>
        </View>
      )}
      {carslUri && (
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
            <SvgUri
              width={Math.min(width * 0.3, 130)}
              height={Math.min(width * 0.3, 130)}
              uri={carslUri}
            />
            {/* <Text
              style={{
                fontSize: Math.max(24, width * 0.08),
                marginTop: 10,
                fontWeight: "bold",
                letterSpacing: 1,
                color: "#FFFFFF",
                fontFamily:
                  Platform.OS === "android"
                    ? "BankGothic Bold"
                    : "BankGothicBold",
                textAlign: "center",
              }}
            >
              THE MUSEUM OF MODERN ART
            </Text> */}
          </View>
        </View>
      )}
      <LoadingAnimation />
    </View>
  );
}
