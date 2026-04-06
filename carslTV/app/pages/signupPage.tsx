import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 bg-black justify-center items-center px-6">
      <View className="items-center gap-8 w-full max-w-md">
        <Text
          className="text-white text-4xl font-bold text-center"
          style={{ fontFamily: "BankGothicBold" }}
        >
          Sign Up
        </Text>

        <View className="gap-4 w-full">
          <View>
            <Text className="text-white/80 text-sm mb-2">Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#ffffff40"
              value={email}
              onChangeText={setEmail}
              className="bg-white/10 border-2 border-white/20 rounded-lg h-12 px-4 text-white"
              style={{ fontFamily: "BankGothicMediumBT" }}
            />
          </View>

          <View>
            <Text className="text-white/80 text-sm mb-2">Password</Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#ffffff40"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="bg-white/10 border-2 border-white/20 rounded-lg h-12 px-4 text-white"
              style={{ fontFamily: "BankGothicMediumBT" }}
            />
          </View>
        </View>

        <View className="gap-4 w-full mt-6">
          <Pressable className="bg-[#D8522E] rounded-lg h-12 items-center justify-center">
            <Text className="text-white font-semibold text-lg">
              Create Account
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="bg-transparent border-2 border-white/30 rounded-lg h-12 items-center justify-center"
          >
            <Text className="text-white/70 font-semibold text-lg">Go Back</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
