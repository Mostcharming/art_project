import React from "react";
import { Text, View } from "react-native";

export default function Splash1() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold", color: "#FFFFFF" }}>
        Splash 1
      </Text>
    </View>
  );
}
