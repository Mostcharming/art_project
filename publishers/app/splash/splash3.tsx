import { MaterialIcons } from "@expo/vector-icons";
import { useAssets } from "expo-asset";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SvgUri } from "react-native-svg";

export default function Splash3() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const [assets] = useAssets([require("@/assets/images/splash/splash3.svg")]);
  const [splash3Uri, setSplash3Uri] = useState<string>("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000000",
      paddingTop: height * 0.1,
    },
    textSection: {
      alignItems: "flex-start",
      marginBottom: 20,
      marginHorizontal: 20,
    },
    heading: {
      fontSize: 35,
      fontWeight: "bold",
      color: "#FFFFFF",
      fontFamily: "BankGothicBold",
      lineHeight: 30,
    },
    imageContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
    },
    descriptionText: {
      fontSize: 16,
      color: "#FFFFFF",
      fontFamily: "BankGothicMediumBT",
      lineHeight: 24,
      marginTop: 10,
      marginHorizontal: 20,
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
    if (assets && assets.length > 0) {
      setSplash3Uri(assets[0].uri);
    }
  }, [assets]);

  return (
    <View style={styles.container}>
      <View style={styles.textSection}>
        <Text style={styles.heading}>Tell your story</Text>
      </View>

      <View style={styles.imageContainer}>
        {splash3Uri && <SvgUri uri={splash3Uri} width={500} height={500} />}
      </View>

      <Text style={styles.descriptionText}>
        Your art speaks, let it be heard. Share the journey behind every piece,
        the passion that fuels your craft, and the meaning that makes your work
        unforgettable.
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.skipButton}
          onPress={() => router.push("/auth/signup/page1")}
        >
          <Text style={styles.skipButtonText}>Skip {">>"}</Text>
        </Pressable>
        <Pressable
          style={styles.arrowButton}
          onPress={() => router.push("/auth/signup/page1")}
        >
          <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
