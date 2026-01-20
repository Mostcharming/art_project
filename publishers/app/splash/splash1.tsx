import { useAssets } from "expo-asset";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SvgUri } from "react-native-svg";

export default function Splash1() {
  const { height } = useWindowDimensions();
  const [assets] = useAssets([require("@/assets/images/carsl.svg")]);
  const [carslUri, setCarslUri] = useState<string>("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000000",
      paddingTop: height * 0.1,
    },
    textSection: {
      alignItems: "flex-start",
      marginBottom: 0,
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
    splashText: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
  });

  useEffect(() => {
    if (assets && assets[0]) {
      setCarslUri(assets[0].uri);
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
      <Text style={styles.splashText}>Splash 1</Text>
    </View>
  );
}
