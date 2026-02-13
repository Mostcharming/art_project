import { useApiMutate } from "@/hooks/useApiMutate";
import { useUserStore } from "@/store/userStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

  const isTokenComplete = token.every((d) => d !== "");
  const isVerifyDisabled = !isTokenComplete || isLoading;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black px-5" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center py-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View className="flex-1 items-center pt-3">
          <Text
            className="text-3xl text-white leading-10 mb-0 self-start"
            style={{ fontFamily: "BankGothicBold" }}
          >
            Verify Your Email
          </Text>
          <Text className="text-base text-gray-300 leading-6 text-left mb-3 self-start">
            We just sent a 6 digit code to{" "}
            <Text className="font-bold">{maskEmail(email || "")}</Text>
          </Text>

          <View className="flex-row justify-center gap-3 mb-5 mt-5">
            {token.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="rounded-lg bg-neutral-700 border-2 border-neutral-500 text-white text-center"
                style={{
                  width: 70,
                  height: 80,
                  fontSize: 60,
                  fontWeight: "500",
                }}
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
            className={`mt-3 self-stretch rounded-xl justify-center items-center ${
              isVerifyDisabled ? "bg-orange-900" : "bg-orange-600"
            }`}
            style={{ minHeight: 60 }}
            disabled={isVerifyDisabled}
            onPress={handleVerify}
          >
            <Text
              className={`text-base font-bold ${
                isVerifyDisabled ? "text-amber-700" : "text-white"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Text>
          </Pressable>

          {error && (
            <Text className="text-xs text-red-500 mt-2 leading-5">{error}</Text>
          )}

          <View className="items-center mt-5">
            <Text className="text-sm text-gray-400 mb-0">
              {isResendActive ? (
                ""
              ) : (
                <>
                  Resend code in{" "}
                  <Text className="text-sm text-red-500 font-bold">
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
                className={`text-sm ${
                  isResendActive && !isLoading
                    ? "text-white underline"
                    : "text-neutral-500"
                }`}
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
