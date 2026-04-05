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

export default function SignInScreen() {
  const { setCurrentScreen } = useScreenManager();
  const { loginUser } = useUserStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.post("/viewers/login", {
        email,
        password,
      });

      if (response.error) {
        setError(response.error);
        setIsLoading(false);
        return;
      }

      // Save user and token to store - state persists until logout
      loginUser(response.data.viewer, response.data.token);

      // Navigate to home screen
      setCurrentScreen("Home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      label: "Sign In",
      action: handleSignIn,
    },
    { label: "Create Account", action: () => setCurrentScreen("SignUp") },
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
          Sign In
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-8 py-12">
        <Text className="text-white/80 text-lg leading-7 mb-8">
          Welcome back! Sign in to access your account and saved favorites.
        </Text>

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
        </View>

        {error && (
          <View className="bg-red-900/50 border border-red-600 rounded-lg p-3 mb-6">
            <Text className="text-red-200 text-sm">{error}</Text>
          </View>
        )}

        <Pressable className="mb-8">
          <Text className="text-[#D8522E] text-sm">Forgot your password?</Text>
        </Pressable>
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
