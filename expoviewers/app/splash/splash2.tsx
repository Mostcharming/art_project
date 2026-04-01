import Splash2Svg from "@/assets/images/splash/splash2.svg";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Splash2() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black pt-16">
      <View className="items-start mb-8 mx-5">
        <Text
          className="text-3xl text-white leading-8 mb-0"
          style={{ fontFamily: "BankGothicBold" }}
        >
          Define your space
        </Text>
      </View>

      <View className="flex-1 justify-center items-center w-full">
        <Splash2Svg width="100%" height="100%" />
      </View>

      <Text className="text-base text-white leading-7 mx-3 pr-5 mb-4">
        Own your vision and make it seen. This is where creativity meets
        identity, a place to shape how the world experiences your art, your
        story, and your style.
      </Text>

      <View className="flex-row justify-between items-center mt-auto mb-12 mx-5">
        <Pressable
          className="border border-gray-700 rounded-lg px-6 py-3"
          onPress={() => router.push("/auth/signup/email-password")}
        >
          <Text className="text-base font-bold text-orange-600">
            Skip {">>"}
          </Text>
        </Pressable>
        <Pressable
          className="w-12 h-12 rounded-lg bg-orange-600 justify-center items-center"
          onPress={() => router.push("/splash/splash3")}
        >
          <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
