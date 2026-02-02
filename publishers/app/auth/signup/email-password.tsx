import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignUpPage1() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation logic
  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[*%#@!]/.test(password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid =
    email.trim() !== "" && hasMinLength && hasSpecialChar && isEmailValid;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000000",
      paddingTop: insets.top + 160,
      paddingHorizontal: 20,
    },
    textSection: {
      marginBottom: 30,
    },
    heading: {
      fontSize: 30,
      fontWeight: "bold",
      color: "#FFFFFF",
      fontFamily: "BankGothicBold",
      lineHeight: 40,
      marginBottom: 0,
    },
    subheading: {
      fontSize: 16,
      color: "#CCCCCC",
      fontFamily: "BankGothicMediumBT",
      lineHeight: 24,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      color: "#FFFFFF",
      fontFamily: "BankGothicMediumBT",
      marginBottom: 8,
    },
    input: {
      borderWidth: 0,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: "#FFFFFF",
      fontFamily: "BankGothicMediumBT",
      backgroundColor: "#333333",
    },
    createButton: {
      marginTop: 40,
      minHeight: 60,
      borderRadius: 12,
      backgroundColor: "#D8522E",
      justifyContent: "center",
      alignItems: "center",
    },
    createButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFFFFF",
      fontFamily: "BankGothicMediumBT",
    },
    createButtonTextDisabled: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#A67C52",
      fontFamily: "BankGothicMediumBT",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#333333",
      borderRadius: 8,
      paddingHorizontal: 16,
    },
    inputField: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: "#FFFFFF",
      fontFamily: "BankGothicMediumBT",
    },
    iconButton: {
      padding: 8,
    },
    passwordInstructions: {
      fontSize: 12,
      color: "#999999",
      fontFamily: "BankGothicMediumBT",
      marginTop: 8,
      lineHeight: 18,
    },
    createButtonDisabled: {
      marginTop: 40,
      minHeight: 60,
      borderRadius: 12,
      backgroundColor: "#8B3D1F",
      justifyContent: "center",
      alignItems: "center",
    },
    termsContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    termsText: {
      paddingHorizontal: 20,
      fontSize: 13,
      color: "#999999",
      fontFamily: "BankGothicMediumBT",
      lineHeight: 16,
      textAlign: "center",
    },
    termsLink: {
      textDecorationLine: "underline",
      color: "#FFFFFF",
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.textSection}>
          <Text style={styles.heading}>Let&apos;s get you started</Text>
          <Text style={styles.subheading}>
            Create an account in quick, easy steps
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputField}
              placeholder="Example@gmail.com"
              placeholderTextColor="#666666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <MaterialIcons name="help" size={18} color="#99999966" />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Create Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter your password"
              placeholderTextColor="#666666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable
              style={styles.iconButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={18}
                color="#99999966"
              />
            </Pressable>
          </View>
          <Text style={styles.passwordInstructions}>
            At least 8 letters, 1 special character *%#@!
          </Text>
        </View>

        <Pressable
          style={
            isFormValid ? styles.createButton : styles.createButtonDisabled
          }
          disabled={!isFormValid}
        >
          <Text
            style={
              isFormValid
                ? styles.createButtonText
                : styles.createButtonTextDisabled
            }
          >
            Create Account
          </Text>
        </Pressable>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By clicking &quot;Create Account&quot;, you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
