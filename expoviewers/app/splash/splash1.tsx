import Carsl from "@/assets/images/carsl.svg";
import SplashOne from "@/assets/images/splash/splashone.svg";
import SplashThree from "@/assets/images/splash/splashthree.svg";
import SplashTwo from "@/assets/images/splash/splashtwo.svg";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Splash1() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black pt-16">
      <View className="items-start mx-5">
        <Text
          className="text-3xl text-white leading-8 mb-0"
          style={{ fontFamily: "BankGothicBold" }}
        >
          get discovered
        </Text>
        <View className="flex-row items-center gap-2">
          <Text
            className="text-3xl text-white leading-8"
            style={{ fontFamily: "BankGothicBold" }}
          >
            with
          </Text>
          <Carsl width={120} height={35} />
        </View>
      </View>

      <View className="flex-1 flex-row justify-center items-start w-full px-3 gap-3 -mt-4">
        <View className="flex-1">
          <SplashOne width="100%" height="50%" />
          <SplashTwo width="100%" height="50%" />
        </View>
        <View className="flex-1 mt-32">
          <SplashThree width="100%" height="50%" />
        </View>
      </View>

      <Text className="text-base text-white leading-7 mx-3 pr-5 mb-4">
        For artists, galleries, and collectors, this is your world of art
        reimagined. A place to showcase, discover, and connect through
        creativity that inspires growth.
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
          onPress={() => router.push("/splash/splash2")}
        >
          <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
