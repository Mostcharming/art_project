import { useScreenManager } from "@/contexts/TVNavigationContext";
import { useTVRemote } from "@/hooks/useTVRemote";
import { useUserStore } from "@/store/userStore";
import { apiService } from "@/utils/apiService";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { setCurrentScreen } = useScreenManager();
  const { loginUser } = useUserStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First register the viewer
      const registerResponse = await apiService.post("/viewers/register", {
        email,
        password,
      });

      if (registerResponse.error) {
        setError(registerResponse.error);
        setIsLoading(false);
        return;
      }

      // Then automatically log them in
      const loginResponse = await apiService.post("/viewers/login", {
        email,
        password,
      });

      if (loginResponse.error) {
        setError(loginResponse.error);
        setIsLoading(false);
        return;
      }

      // Save user and token to store - state persists until logout
      loginUser(loginResponse.data.viewer, loginResponse.data.token);

      // Navigate to home screen
      setCurrentScreen("Home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      label: "Sign Up",
      action: handleSignUp,
    },
    { label: "Sign In Instead", action: () => setCurrentScreen("SignIn") },
    { label: "Back", action: () => setCurrentScreen("Landing") },
  ];

  useTVRemote({
    onUp: () =>
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : menuItems.length - 1)),
    onDown: () =>
      setSelectedIndex((prev) => (prev < menuItems.length - 1 ? prev + 1 : 0)),
    onSelect: () => menuItems[selectedIndex].action(),
  });

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="pt-12 pb-8 items-center border-b border-white/20">
        <Text
          className="text-white text-4xl font-bold"
          style={{ fontFamily: "BankGothicBold" }}
        >
          Create Account
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-8 py-12">
        <Text className="text-white/80 text-lg leading-7 mb-8">
          Join us to save your favorite artworks and get personalized
          recommendations.
        </Text>

        {error && (
          <View className="bg-red-900/50 border border-red-600 rounded-lg p-3 mb-6">
            <Text className="text-red-200 text-sm">{error}</Text>
          </View>
        )}

        {/* Form Fields */}
        <View className="gap-6 mb-8">
          {/* Email Field */}
          <View>
            <Text className="text-white/60 text-sm mb-2">Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="rgba(255,255,255,0.3)"
              className="bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20"
            />
          </View>

          {/* Password Field */}
          <View>
            <Text className="text-white/60 text-sm mb-2">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
              className="bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20"
            />
          </View>

          {/* Confirm Password Field */}
          <View>
            <Text className="text-white/60 text-sm mb-2">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
              className="bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20"
            />
          </View>
        </View>

        <Text className="text-white/60 text-xs">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>

      {/* Menu Items */}
      <View className="px-8 py-12 gap-4">
        {menuItems.map((item, index) => (
          <Pressable
            key={item.label}
            onPress={() => {
              if (!isLoading) {
                item.action();
              }
            }}
            disabled={isLoading}
            className={[
              "h-14 rounded-lg items-center justify-center transition-all duration-200 flex-row",
              selectedIndex === index && !isLoading
                ? "bg-[#D8522E] ring-2 ring-white"
                : "bg-white/10 border border-white/20",
              isLoading ? "opacity-60" : "",
            ].join(" ")}
            style={{
              transform:
                selectedIndex === index && !isLoading
                  ? [{ scale: 1.05 }]
                  : [{ scale: 1 }],
            }}
          >
            {isLoading && selectedIndex === index ? (
              <ActivityIndicator
                color="white"
                size="small"
                style={{ marginRight: 8 }}
              />
            ) : null}
            <Text
              className={[
                "font-semibold text-lg",
                selectedIndex === index && !isLoading
                  ? "text-white"
                  : "text-white/70",
              ].join(" ")}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
