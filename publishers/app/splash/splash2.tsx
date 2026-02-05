import { usePreloadImages } from "@/hooks/usePreloadImages";
import { MaterialIcons } from "@expo/vector-icons";
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

export default function Splash2() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { imageUris, isLoading } = usePreloadImages([
    require("@/assets/images/splash/splash2.svg"),
  ]);
  const [splash2Uri, setSplash2Uri] = useState<string>("");

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
      // width: 500,
      height: 500,
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
      borderWidth: 1,
      borderColor: "#555555",
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
    if (imageUris && imageUris.length > 0) {
      setSplash2Uri(imageUris[0]);
    }
  }, [imageUris]);

  return (
    <View style={styles.container}>
      <View style={styles.textSection}>
        <Text style={styles.heading}>Define your space</Text>
      </View>

      <View style={styles.imageContainer}>
        {splash2Uri ? (
          <SvgUri uri={splash2Uri} width={500} height={500} />
        ) : (
          <View
            style={{
              width: 500,
              height: 500,
              backgroundColor: isLoading ? "#222222" : "#1a1a1a",
              borderRadius: 8,
              opacity: 0.6,
            }}
          />
        )}
      </View>

      <Text style={styles.descriptionText}>
        Own your vision and make it seen. This is where creativity meets
        identity, a place to shape how the world experiences your art, your
        story, and your style.
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.skipButton}
          onPress={() => router.push("/auth/signup/email-password")}
        >
          <Text style={styles.skipButtonText}>Skip {">>"}</Text>
        </Pressable>
        <Pressable
          style={styles.arrowButton}
          onPress={() => router.push("/splash/splash3")}
        >
          <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
