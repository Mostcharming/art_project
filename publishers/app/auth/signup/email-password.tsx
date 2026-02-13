import { useApiMutate } from "@/hooks/useApiMutate";
import { useUserStore } from "@/store/userStore";
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

export default function SignUpPage1() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const updateUser = useUserStore((state) => state.updateUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isLoading } = useApiMutate();

  // Validation logic
  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[*%#@!]/.test(password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid =
    email.trim() !== "" && hasMinLength && hasSpecialChar && isEmailValid;

  const handleCreateAccount = async () => {
    if (!isFormValid) return;

    setError(null);

    const response = await mutate("/auth/signup", {
      method: "POST",
      dataType: "json",
      payload: {
        email,
        password,
      },
    });

    if (response.error) {
      console.error("Signup error:", response);
      if (response.error === "Email already registered") {
        setError("Email already registered, please login");
      } else {
        setError("Error signing up, try again later");
      }
    } else {
      updateUser({
        email,
        isEmailVerified: false,
        accountSetupComplete: false,
      });
      router.push({
        pathname: "/auth/signup/token",
      });
    }
  };

  const isDisabled = isLoading || !isFormValid;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className="flex-1 bg-black px-5"
        style={{ paddingTop: insets.top + 80 }}
      >
        <View className="mb-8">
          <Text
            className="text-3xl text-white leading-10 mb-0"
            style={{ fontFamily: "BankGothicBold" }}
          >
            Let&apos;s get you started
          </Text>
          <Text className="text-base text-gray-300 leading-6">
            Create an account in quick, easy steps
          </Text>
        </View>

        <View className="mb-5">
          <Text className="text-sm text-white mb-2">Email</Text>
          <View
            className={`flex-row items-center rounded-lg px-4 bg-neutral-700 ${
              error ? "border-2 border-red-500" : ""
            }`}
          >
            <TextInput
              className="flex-1 py-4 text-base text-white"
              placeholder="Example@gmail.com"
              placeholderTextColor="#666666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <MaterialIcons name="help" size={18} color="#99999966" />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-sm text-white mb-2">Create Password</Text>
          <View
            className={`flex-row items-center rounded-lg px-4 bg-neutral-700 ${
              error ? "border-2 border-red-500" : ""
            }`}
          >
            <TextInput
              className="flex-1 py-4 text-base text-white"
              placeholder="Enter your password"
              placeholderTextColor="#666666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable
              className="p-2"
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={18}
                color="#99999966"
              />
            </Pressable>
          </View>
          <Text
            className={`text-xs mt-2 leading-5 ${
              error ? "text-red-500" : "text-gray-400"
            }`}
          >
            {error ? error : "At least 8 letters, 1 special character *%#@!"}
          </Text>
        </View>

        <Pressable
          className={`mt-10 rounded-xl justify-center items-center ${
            isDisabled ? "bg-orange-900" : "bg-orange-600"
          }`}
          style={{ minHeight: 60 }}
          disabled={isDisabled}
          onPress={handleCreateAccount}
        >
          <Text
            className={`text-base font-bold ${
              isDisabled ? "text-amber-700" : "text-white"
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Text>
        </Pressable>

        <View className="mt-5 items-center">
          <Text
            className="text-gray-400 text-center px-5 leading-5"
            style={{ fontSize: 13 }}
          >
            By clicking &quot;Create Account&quot;, you agree to our
          </Text>
          <View className="flex-row items-center justify-center mt-1">
            <Text className="text-white underline" style={{ fontSize: 13 }}>
              Terms of Service
            </Text>
            <Text className="text-gray-400 mx-1" style={{ fontSize: 13 }}>
              and
            </Text>
            <Text className="text-white underline" style={{ fontSize: 13 }}>
              Privacy Policy
            </Text>
          </View>
        </View>

        <View className="mt-auto mb-12 items-center">
          <Pressable onPress={() => router.push("/auth/login")}>
            <Text className="text-sm text-white underline">
              Already have an account? Log in
            </Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
