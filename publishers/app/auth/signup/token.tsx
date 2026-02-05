import { useApiMutate } from "@/hooks/useApiMutate";
import { useUserStore } from "@/store/userStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignUpToken() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const email = useUserStore((state) => state.user?.email);
  const updateUser = useUserStore((state) => state.updateUser);
  const [token, setToken] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(59);
  const [isResendActive, setIsResendActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);
  const { mutate, isLoading } = useApiMutate();

  useEffect(() => {
    if (isResendActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsResendActive(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isResendActive]);

  const handleTokenChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newToken = [...token];
      newToken[index] = value;
      setToken(newToken);

      // Auto-focus to next input when a digit is entered
      if (value !== "" && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index: number, e: any) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === "Backspace" && token[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullToken = token.join("");
    if (!fullToken || fullToken.length !== 4) return;

    setError(null);

    const response = await mutate("/auth/verify-email", {
      method: "POST",
      dataType: "json",
      payload: {
        email,
        verificationCode: fullToken,
      },
    });

    if (response.error) {
      console.error("Verification error:", response);
      setError("Invalid verification code. Please try again.");
      Alert.alert(
        "Verification Failed",
        "Invalid verification code. Please try again."
      );
    } else {
      // Update user and navigate to account setup
      updateUser({
        isEmailVerified: true,
      });
      router.push({
        pathname: "/auth/signup/account-setup",
      });
    }
  };

  const handleResendCode = async () => {
    setError(null);

    const response = await mutate("/auth/resend-verification-code", {
      method: "POST",
      dataType: "json",
      payload: {
        email,
      },
    });

    if (response.error) {
      console.error("Resend error:", response);
      Alert.alert(
        "Error",
        "Failed to resend verification code. Please try again."
      );
    } else {
      setTimeLeft(59);
      setIsResendActive(false);
      Alert.alert("Success", "Verification code sent to your email.");
    }
  };

  const maskEmail = (emailStr: string): string => {
    if (!emailStr) return "";
    const [localPart, domain] = emailStr.split("@");
    const maskedLocal = localPart.substring(0, 2) + "...";
    return `${maskedLocal}@${domain}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000000",
      paddingTop: insets.top,
      paddingHorizontal: 20,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
    },
    backButton: {
      padding: 8,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 10,
    },
    heading: {
      fontSize: 30,
      fontWeight: "bold",
      color: "#FFFFFF",
      fontFamily: "BankGothicBold",
      lineHeight: 40,
      marginBottom: 0,
      alignSelf: "flex-start",
    },
    subheading: {
      fontSize: 16,
      color: "#CCCCCC",
      fontFamily: "BankGothicMediumBT",
      lineHeight: 24,
      textAlign: "left",
      marginBottom: 10,
      alignSelf: "flex-start",
    },
    tokenContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
      marginBottom: 20,
      marginTop: 20,
    },
    tokenInput: {
      width: 70,
      height: 80,
      borderRadius: 8,
      backgroundColor: "#333333",
      borderWidth: 2,
      borderColor: "#666666",
      fontSize: 60,
      fontWeight: "500",
      color: "#FFFFFF",
      textAlign: "center",
    },
    verifyButton: {
      marginTop: 10,
      minHeight: 60,
      borderRadius: 12,
      backgroundColor: "#D8522E",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "stretch",
    },
    verifyButtonDisabled: {
      marginTop: 10,
      minHeight: 60,
      borderRadius: 12,
      backgroundColor: "#8B3D1F",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "stretch",
    },
    verifyButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFFFFF",
      fontFamily: "BankGothicMediumBT",
    },
    verifyButtonTextDisabled: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#A67C52",
      fontFamily: "BankGothicMediumBT",
    },
    errorMessage: {
      fontSize: 12,
      color: "#FF4444",
      fontFamily: "BankGothicMediumBT",
      marginTop: 8,
      lineHeight: 18,
    },
    resendContainer: {
      alignItems: "center",
      marginTop: 20,
    },
    resendText: {
      fontSize: 14,
      color: "#999999",
      fontFamily: "BankGothicMediumBT",
      marginBottom: 0,
    },
    resendTimer: {
      fontSize: 14,
      color: "#FF4444",
      fontFamily: "BankGothicMediumBT",
      fontWeight: "bold",
    },
    resendLink: {
      fontSize: 14,
      color: "#FFFFFF",
      fontFamily: "BankGothicMediumBT",
      textDecorationLine: "underline",
    },
    resendLinkDisabled: {
      fontSize: 14,
      color: "#666666",
      fontFamily: "BankGothicMediumBT",
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.heading}>Verify Your Email</Text>
          <Text style={styles.subheading}>
            We just sent a 6 digit code to{" "}
            <Text style={{ fontWeight: "bold" }}>{maskEmail(email || "")}</Text>
          </Text>

          <View style={styles.tokenContainer}>
            {token.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                style={styles.tokenInput}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(value) => handleTokenChange(index, value)}
                onKeyPress={(e) => handleKeyPress(index, e)}
                placeholder="0"
                placeholderTextColor="#666666"
              />
            ))}
          </View>

          <Pressable
            style={
              token.every((d) => d !== "") && !isLoading
                ? styles.verifyButton
                : styles.verifyButtonDisabled
            }
            disabled={!token.every((d) => d !== "") || isLoading}
            onPress={handleVerify}
          >
            <Text
              style={
                token.every((d) => d !== "") && !isLoading
                  ? styles.verifyButtonText
                  : styles.verifyButtonTextDisabled
              }
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Text>
          </Pressable>

          {error && <Text style={styles.errorMessage}>{error}</Text>}

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              {isResendActive ? (
                ""
              ) : (
                <>
                  Resend code in{" "}
                  <Text style={styles.resendTimer}>
                    00:{timeLeft.toString().padStart(2, "0")}
                  </Text>
                </>
              )}
            </Text>
            <Pressable
              onPress={handleResendCode}
              disabled={!isResendActive || isLoading}
            >
              <Text
                style={
                  isResendActive && !isLoading
                    ? styles.resendLink
                    : styles.resendLinkDisabled
                }
              >
                {isLoading ? "Sending..." : isResendActive ? "Resend Code" : ""}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
