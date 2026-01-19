import { useAssets } from "expo-asset";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SvgUri } from "react-native-svg";

export default function HomeScreen() {
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

  return (
    <View style={styles.container}>
      {svgUri ? (
        <SvgUri
          width="100%"
          height="100%"
          uri={svgUri}
          style={styles.background}
        />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "red",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>SVG not loaded. URI: {svgUri}</Text>
        </View>
      )}
      {carslUri && (
        <View style={styles.centerContent}>
          <SvgUri width={130} height={130} uri={carslUri} />
          <Text style={styles.museumTitle}>THE MUSEUM OF MODERN ART</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  centerContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -200 }, { translateY: -120 }],
    justifyContent: "center",
    alignItems: "center",
  },
  museumTitle: {
    fontFamily: "BankGothicBold",
    color: "white",
    textAlign: "center",
    marginTop: -45,
    fontSize: 30,
  },
});
