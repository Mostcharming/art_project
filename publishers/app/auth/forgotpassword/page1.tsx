import { useApiMutate } from "@/hooks/useApiMutate";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ForgotPasswordPage1() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate, isLoading } = useApiMutate();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isDisabled = isLoading || !isEmailValid || email.trim() === "";

  const handleVerifyEmail = async () => {
    if (!isEmailValid) return;

    setError(null);

    const response = await mutate("/auth/request-password-reset", {
      method: "POST",
      dataType: "json",
      payload: { email },
    });

    if (response.error) {
      console.error("Forgot password error:", response);
      setError("No account found with this email. Please try again.");
    } else {
      router.push({
        pathname: "/auth/forgotpassword/page2",
        params: { email },
      });
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
            Recover Password
          </Text>
          <Text className="text-base text-gray-300 leading-6">
            To recover your password, enter your registered email address
          </Text>
        </View>

        {/* Email input */}
        <View className="mb-5">
          <Text className="text-sm text-white mb-2">Email</Text>
          <View
            className={`flex-row items-center rounded-lg px-4 bg-neutral-700 ${
              error ? "border-2 border-red-500" : ""
            }`}
          >
            <TextInput
              className="flex-1 py-4 text-base text-white"
              placeholder="Enter your email address"
              placeholderTextColor="#666666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <MaterialIcons name="mail-outline" size={18} color="#99999966" />
          </View>
          {error && (
            <Text className="text-xs text-red-500 mt-2 leading-5">{error}</Text>
          )}
        </View>

        {/* Verify Email button */}
        <Pressable
          className={`mt-10 rounded-xl justify-center items-center ${
            isDisabled ? "bg-orange-900" : "bg-orange-600"
          }`}
          style={{ minHeight: 60 }}
          disabled={isDisabled}
          onPress={handleVerifyEmail}
        >
          <Text
            className={`text-base font-bold ${
              isDisabled ? "text-amber-700" : "text-white"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}
