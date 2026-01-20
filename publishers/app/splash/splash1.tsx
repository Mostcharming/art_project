import { MaterialIcons } from "@expo/vector-icons";
import { useAssets } from "expo-asset";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SvgUri } from "react-native-svg";

export default function Splash1() {
  const { height } = useWindowDimensions();
  const [assets] = useAssets([
    require("@/assets/images/carsl.svg"),
    require("@/assets/images/splash/splashone.svg"),
    require("@/assets/images/splash/splashtwo.svg"),
    require("@/assets/images/splash/splashthree.svg"),
  ]);
  const [carslUri, setCarslUri] = useState<string>("");
  const [splashOneUri, setSplashOneUri] = useState<string>("");
  const [splashTwoUri, setSplashTwoUri] = useState<string>("");
  const [splashThreeUri, setSplashThreeUri] = useState<string>("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000000",
      paddingTop: height * 0.1,
    },
    textSection: {
      alignItems: "flex-start",
      marginBottom: 20,
    },
    heading: {
      fontSize: 35,
      fontWeight: "bold",
      color: "#FFFFFF",
      fontFamily: "BankGothicBold",
      lineHeight: 30,
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    svgGridContainer: {
      flexDirection: "row",
    },
    leftColumn: {
      gap: 10,
    },
    rightColumn: {
      justifyContent: "center",
    },
    descriptionText: {
      fontSize: 16,
      color: "#FFFFFF",
      fontFamily: "BankGothicMediumBT",
      lineHeight: 24,
      marginTop: 30,
      paddingRight: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 40,
      marginHorizontal: 20,
    },
    skipButton: {
      borderWidth: 2,
      borderColor: "#888888",
      borderRadius: 25,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    skipButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#D8522E",
      fontFamily: "BankGothicMediumBT",
    },
    arrowButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#D8522E",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  useEffect(() => {
    if (assets && assets.length >= 4) {
      setCarslUri(assets[0].uri);
      setSplashOneUri(assets[1].uri);
      setSplashTwoUri(assets[2].uri);
      setSplashThreeUri(assets[3].uri);
    }
  }, [assets]);

  return (
    <View style={styles.container}>
      <View style={styles.textSection}>
        <Text style={styles.heading}>GET DISCOVERED</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.heading}>WITH</Text>
          {carslUri && <SvgUri uri={carslUri} />}
        </View>
      </View>

      <View style={styles.svgGridContainer}>
        <View style={styles.leftColumn}>
          {splashOneUri && (
            <SvgUri uri={splashOneUri} width={220} height={220} />
          )}
          {splashTwoUri && (
            <SvgUri uri={splashTwoUri} width={220} height={220} />
          )}
        </View>
        <View style={styles.rightColumn}>
          {splashThreeUri && <SvgUri uri={splashThreeUri} height={320} />}
        </View>
      </View>

      <Text style={styles.descriptionText}>
        For artists, galleries, and collectors, this is your world of art
        reimagined. A place to showcase, discover, and connect through
        creativity that inspires growth.
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.skipButton} onPress={() => {}}>
          <Text style={styles.skipButtonText}>Skip {">>"}</Text>
        </Pressable>
        <Pressable style={styles.arrowButton} onPress={() => {}}>
          <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
