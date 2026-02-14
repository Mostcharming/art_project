import { useApiMutate } from "@/hooks/useApiMutate";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function ForgotPasswordPage2() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(["", "", "", ""]);
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
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullToken = otp.join("");
    if (!fullToken || fullToken.length !== 4) return;

    setError(null);

    const response = await mutate("/auth/verify-reset-token", {
      method: "POST",
      dataType: "json",
      payload: {
        email,
        code: fullToken,
      },
    });

    if (response.error) {
      console.error("Reset token verification error:", response);
      setError("Invalid reset code. Please try again.");
      Alert.alert(
        "Verification Failed",
        "Invalid reset code. Please try again."
      );
    } else {
      const resetSessionToken = response.data?.resetSessionToken;

      router.push({
        pathname: "/auth/forgotpassword/page3",
        params: { resetSessionToken },
      });
    }
  };

  const handleResendCode = async () => {
    setError(null);

    const response = await mutate("/auth/request-password-reset", {
      method: "POST",
      dataType: "json",
      payload: { email },
    });

    if (response.error) {
      console.error("Resend error:", response);
      Alert.alert("Error", "Failed to resend reset code. Please try again.");
    } else {
      setOtp(["", "", "", ""]);
      setTimeLeft(59);
      setIsResendActive(false);
      Alert.alert("Success", "A new reset code has been sent to your email.");
    }
  };

  const maskEmail = (emailStr: string): string => {
    if (!emailStr) return "";
    const [localPart, domain] = emailStr.split("@");
    const maskedLocal = localPart.substring(0, 2) + "...";
    return `${maskedLocal}@${domain}`;
  };

  const isTokenComplete = otp.every((d) => d !== "");
  const isVerifyDisabled = !isTokenComplete || isLoading;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black px-5" style={{ paddingTop: insets.top }}>
        {/* Back button */}
        <View className="flex-row items-center py-4">
          <Pressable className="p-2" onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View className="flex-1 items-center pt-3">
          {/* Header */}
          <Text
            className="text-3xl text-white leading-10 mb-1 self-start"
            style={{ fontFamily: "BankGothicBold" }}
          >
            Enter Reset Code
          </Text>
          <Text className="text-base text-gray-300 leading-6 text-left mb-3 self-start">
            We sent a 4 digit code to{" "}
            <Text className="font-bold">{maskEmail(email || "")}</Text>
          </Text>

          {/* OTP inputs */}
          <View className="flex-row justify-center gap-3 mb-5 mt-5">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="rounded-lg bg-neutral-700 border-2 border-neutral-500 text-white text-center"
                style={{
                  width: 70,
                  height: 80,
                  fontSize: 36,
                  fontWeight: "500",
                  lineHeight: 44,
                  textAlignVertical: "center",
                  includeFontPadding: false,
                  paddingVertical: 0,
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

          {/* Verify button */}
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
              {isLoading ? "Verifying..." : "Verify Code"}
            </Text>
          </Pressable>

          {error && (
            <Text className="text-xs text-red-500 mt-2 leading-5">{error}</Text>
          )}

          {/* Resend code */}
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
