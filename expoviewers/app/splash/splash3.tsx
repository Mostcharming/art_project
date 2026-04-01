import Splash3Svg from "@/assets/images/splash/splash3.svg";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Splash3() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black pt-16">
      <View className="items-start mb-8 mx-5">
        <Text
          className="text-3xl text-white leading-8 mb-0"
          style={{ fontFamily: "BankGothicBold" }}
        >
          Tell your story
        </Text>
      </View>

      <View className="flex-1 justify-center items-center w-full">
        <Splash3Svg width="100%" height="100%" />
      </View>

      <Text className="text-sm text-white leading-7 mx-5 pr-5 mb-4">
        Your art speaks, let it be heard. Share the journey behind every piece,
        the passion that fuels your craft, and the meaning that makes your work
        unforgettable.
      </Text>

      <View className="flex-row justify-between items-center mt-auto mb-12 mx-5 gap-3">
        <Pressable
          className="flex-1 border border-gray-700 rounded-lg px-6 py-4 justify-center items-center"
          onPress={() => router.push("/auth/login")}
        >
          <Text className="text-base font-bold text-orange-600">Sign In</Text>
        </Pressable>
        <Pressable
          className="flex-1 rounded-lg bg-orange-600 px-6 py-4 justify-center items-center"
          onPress={() => router.push("/auth/signup/email-password")}
        >
          <Text className="text-base font-bold text-white">Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}
