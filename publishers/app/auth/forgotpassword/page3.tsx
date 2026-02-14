import { useApiMutate } from "@/hooks/useApiMutate";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ForgotPasswordPage3() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { resetSessionToken } = useLocalSearchParams<{
    resetSessionToken: string;
  }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isLoading } = useApiMutate();

  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[*%#@!]/.test(password);
  const isPasswordValid = hasMinLength && hasSpecialChar;
  const doPasswordsMatch = password === confirmPassword && password !== "";
  const isDisabled = isLoading || !isPasswordValid || !doPasswordsMatch;

  const handleCreatePassword = async () => {
    if (!isPasswordValid) return;
    if (!doPasswordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);

    const response = await mutate("/auth/reset-password", {
      method: "POST",
      dataType: "json",
      payload: {
        resetSessionToken,
        newPassword: password,
      },
    });

    if (response.error) {
      console.error("Reset password error:", response);
      setError("Failed to reset password. Please try again.");
      Alert.alert("Error", "Failed to reset password. Please try again.");
    } else {
      Alert.alert(
        "Password Reset",
        "Your password has been reset successfully. Please log in with your new password.",
        [
          {
            text: "Go to Login",
            onPress: () => router.replace("/auth/login"),
          },
        ]
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black px-5" style={{ paddingTop: insets.top }}>
        {/* Back button */}
        <View className="flex-row items-center py-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Header */}
        <View className="mb-8 mt-4">
          <Text
            className="text-3xl text-white leading-10 mb-1"
            style={{ fontFamily: "BankGothicBold" }}
          >
            Create New Password
          </Text>
          <Text className="text-base text-gray-300 leading-6">
            Create and confirm your new password
          </Text>
        </View>

        {/* Create Password input */}
        <View className="mb-5">
          <Text className="text-sm text-white mb-2">Create Password</Text>
          <View
            className={`flex-row items-center rounded-lg px-4 bg-neutral-700 ${
              password.length > 0 && !isPasswordValid
                ? "border-2 border-red-500"
                : ""
            }`}
          >
            <TextInput
              className="flex-1 py-4 text-base text-white"
              placeholder="Enter your new password"
              placeholderTextColor="#666666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={18}
                color="#99999966"
              />
            </Pressable>
          </View>
          <Text className="text-xs text-gray-400 mt-2 leading-5">
            At least 8 letters, 1 special character *%#@!
          </Text>
          {/* Validation indicators */}
          {password.length > 0 && (
            <View className="mt-2">
              <View className="flex-row items-center mb-1">
                <MaterialIcons
                  name={hasMinLength ? "check-circle" : "cancel"}
                  size={14}
                  color={hasMinLength ? "#22c55e" : "#ef4444"}
                />
                <Text
                  className={`text-xs ml-1 ${
                    hasMinLength ? "text-green-500" : "text-red-500"
                  }`}
                >
                  At least 8 characters
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons
                  name={hasSpecialChar ? "check-circle" : "cancel"}
                  size={14}
                  color={hasSpecialChar ? "#22c55e" : "#ef4444"}
                />
                <Text
                  className={`text-xs ml-1 ${
                    hasSpecialChar ? "text-green-500" : "text-red-500"
                  }`}
                >
                  At least 1 special character (*%#@!)
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Confirm Password input */}
        <View className="mb-5">
          <Text className="text-sm text-white mb-2">Confirm Password</Text>
          <View
            className={`flex-row items-center rounded-lg px-4 bg-neutral-700 ${
              confirmPassword.length > 0 && !doPasswordsMatch
                ? "border-2 border-red-500"
                : ""
            }`}
          >
            <TextInput
              className="flex-1 py-4 text-base text-white"
              placeholder="Confirm your new password"
              placeholderTextColor="#666666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialIcons
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={18}
                color="#99999966"
              />
            </Pressable>
          </View>
          {confirmPassword.length > 0 && !doPasswordsMatch && (
            <Text className="text-xs text-red-500 mt-2 leading-5">
              Passwords do not match
            </Text>
          )}
        </View>

        {/* Error message */}
        {error && (
          <Text className="text-xs text-red-500 mb-3 leading-5">{error}</Text>
        )}

        {/* Create Password button */}
        <Pressable
          className={`mt-10 rounded-xl justify-center items-center ${
            isDisabled ? "bg-orange-900" : "bg-orange-600"
          }`}
          style={{ minHeight: 60 }}
          disabled={isDisabled}
          onPress={handleCreatePassword}
        >
          <Text
            className={`text-base font-bold ${
              isDisabled ? "text-amber-700" : "text-white"
            }`}
          >
            {isLoading ? "Creating..." : "Create Password"}
          </Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}
