// filepath: /Users/mac/Documents/dev/art/publishers/app/auth/signup/token.tsx
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignUpToken() {
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000000",
      paddingTop: insets.top + 160,
      paddingHorizontal: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    heading: {
      fontSize: 30,
      fontWeight: "bold",
      color: "#FFFFFF",
      fontFamily: "BankGothicBold",
      lineHeight: 40,
      marginBottom: 20,
    },
    subheading: {
      fontSize: 16,
      color: "#CCCCCC",
      fontFamily: "BankGothicMediumBT",
      lineHeight: 24,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify Your Token</Text>
      <Text style={styles.subheading}>
        A verification token has been sent to your email
      </Text>
    </View>
  );
}
