import { FaceIdIcon } from "@/components/icons/FaceIdIcon";
import { useApiMutate } from "@/hooks/useApiMutate";
import {
  authenticateWithBiometrics,
  checkBiometricSupport,
} from "@/hooks/useBiometrics";
import { useUserStore } from "@/store/userStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

export default function LoginPage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const updateUser = useUserStore((state) => state.updateUser);
  const setToken = useUserStore((state) => state.setToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isLoading } = useApiMutate();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    console.log(biometricAvailable);
    checkBiometricSupport().then(({ isSupported }) => {
      setBiometricAvailable(isSupported);
    });
  }, []);

  const handleBiometricLogin = async () => {
    // Biometric login only works if the user has previously logged in
    // (we have stored credentials/token)
    if (!user?.email || !token) {
      Alert.alert(
        "Login Required",
        "Please log in with your email and password first. You can use biometrics for future logins."
      );
      return;
    }

    const success = await authenticateWithBiometrics();
    if (success) {
      // Biometric verified — user is who they say they are
      // Navigate based on their account state
      if (user.accountSetupComplete) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/signup/account-setup");
      }
    }
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid =
    email.trim() !== "" && password.trim() !== "" && isEmailValid;
  const isDisabled = isLoading || !isFormValid;

  const handleLogin = async () => {
    if (!isFormValid) return;

    setError(null);

    const response = await mutate("/auth/login", {
      method: "POST",
      dataType: "json",
      payload: {
        email,
        password,
      },
    });

    if (response.error) {
      console.error("Login error:", response);

      // Email not verified — resend code and navigate to token page
      if (response.error.includes("verify your email")) {
        updateUser({
          email,
          isEmailVerified: false,
          accountSetupComplete: false,
        });

        // Resend verification code
        await mutate("/auth/resend-verification-code", {
          method: "POST",
          dataType: "json",
          payload: { email },
        });

        router.push("/auth/signup/token");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } else {
      const { token, publisher } = response.data;

      setToken(token);
      updateUser({
        id: publisher.id,
        email: publisher.email,
        personaType: publisher.personaType,
        name: publisher.name,
        isEmailVerified: true,
        accountSetupComplete: publisher.accountSetupComplete,
      });

      if (publisher.accountSetupComplete) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/signup/account-setup");
      }
    }
  };

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
            Welcome back
          </Text>
          <Text className="text-base text-gray-300 leading-6">
            Enter your password to log into your account
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
              autoCapitalize="none"
            />
            <MaterialIcons name="help" size={18} color="#99999966" />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-sm text-white mb-2">Password</Text>
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
          {/* Validation indicators */}
          {password.length > 0 && (
            <View className="mt-2">
              <View className="flex-row items-center mb-1">
                <MaterialIcons
                  name={password.length >= 8 ? "check-circle" : "cancel"}
                  size={14}
                  color={password.length >= 8 ? "#22c55e" : "#ef4444"}
                />
                <Text
                  className={`text-xs ml-1 ${
                    password.length >= 8 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  At least 8 characters
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialIcons
                  name={/[*%#@!]/.test(password) ? "check-circle" : "cancel"}
                  size={14}
                  color={/[*%#@!]/.test(password) ? "#22c55e" : "#ef4444"}
                />
                <Text
                  className={`text-xs ml-1 ${
                    /[*%#@!]/.test(password) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  At least 1 special character (*%#@!)
                </Text>
              </View>
            </View>
          )}
        </View>

        <View className="flex-row mt-10 gap-3">
          <Pressable
            className={`flex-1 rounded-xl justify-center items-center ${
              isDisabled ? "bg-orange-900" : "bg-orange-600"
            }`}
            style={{ minHeight: 56 }}
            disabled={isDisabled}
            onPress={handleLogin}
          >
            <Text
              className={`text-base font-bold ${
                isDisabled ? "text-amber-700" : "text-white"
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </Pressable>
          <Pressable
            className="rounded-xl bg-orange-600 justify-center items-center"
            style={{
              minHeight: 56,
              width: 56,
              // display: biometricAvailable ? "flex" : "none",
            }}
            onPress={handleBiometricLogin}
          >
            <FaceIdIcon size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        <Pressable
          className="mt-4 self-center"
          onPress={() => router.push("/auth/forgotpassword/page1")}
        >
          <Text className="text-sm text-white">Forgot Password?</Text>
        </Pressable>

        <View className="mt-auto mb-12 items-center">
          <Pressable onPress={() => router.push("/auth/signup/email-password")}>
            <Text className="text-sm text-gray-400">
              New to ATFA? <Text className="text-white underline">Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
