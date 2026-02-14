import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";

export async function checkBiometricSupport(): Promise<{
  isSupported: boolean;
  biometricType: "faceid" | "fingerprint" | "iris" | "none";
}> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    return { isSupported: false, biometricType: "none" };
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    return { isSupported: false, biometricType: "none" };
  }

  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

  let biometricType: "faceid" | "fingerprint" | "iris" | "none" = "none";
  if (
    types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
  ) {
    biometricType = "faceid";
  } else if (
    types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
  ) {
    biometricType = "fingerprint";
  } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    biometricType = "iris";
  }

  return { isSupported: true, biometricType };
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    const { isSupported } = await checkBiometricSupport();

    if (!isSupported) {
      Alert.alert(
        "Biometrics Unavailable",
        "Your device does not support biometric authentication, or it is not set up."
      );
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Log in to CARSL",
      fallbackLabel: "Use password",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });

    if (result.success) {
      return true;
    }

    if (result.error === "user_cancel" || result.error === "system_cancel") {
      // User cancelled — do nothing
      return false;
    }

    if (result.error === "user_fallback") {
      // User chose to use password instead
      return false;
    }

    Alert.alert(
      "Authentication Failed",
      "Biometric authentication failed. Please try again or use your password."
    );
    return false;
  } catch (error) {
    console.error("Biometric auth error:", error);
    Alert.alert("Error", "Something went wrong with biometric authentication.");
    return false;
  }
}
