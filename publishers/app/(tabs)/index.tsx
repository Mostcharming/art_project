import { StyleSheet, View } from "react-native";
import { SvgUri } from "react-native-svg";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <SvgUri
        width="100%"
        height="100%"
        uri={require("@/assets/images/background.svg")}
        preserveAspectRatio="xMidYMid slice"
        style={styles.background}
      />
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
});
