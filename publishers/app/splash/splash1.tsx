import { usePreloadImages } from "@/hooks/usePreloadImages";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SvgUri } from "react-native-svg";

export default function Splash1() {
  const router = useRouter();
  const { imageUris } = usePreloadImages([
    require("@/assets/images/carsl.svg"),
    require("@/assets/images/splash/splashone.svg"),
    require("@/assets/images/splash/splashtwo.svg"),
    require("@/assets/images/splash/splashthree.svg"),
  ]);
  const [carslUri, setCarslUri] = useState<string>("");
  const [splashOneUri, setSplashOneUri] = useState<string>("");
  const [splashTwoUri, setSplashTwoUri] = useState<string>("");
  const [splashThreeUri, setSplashThreeUri] = useState<string>("");

  useEffect(() => {
    if (imageUris && imageUris.length >= 4) {
      setCarslUri(imageUris[0]);
      setSplashOneUri(imageUris[1]);
      setSplashTwoUri(imageUris[2]);
      setSplashThreeUri(imageUris[3]);
    }
  }, [imageUris]);

  return (
    <View className="flex-1 bg-black px-5">
      <View className="pt-16 mb-6">
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
          {carslUri && <SvgUri uri={carslUri} width={100} height={35} />}
        </View>
      </View>

      <View className="flex-row items-start mb-6 gap-3">
        <View className="">
          {splashOneUri && (
            <SvgUri uri={splashOneUri} width={180} height={250} />
          )}
          {splashTwoUri && (
            <SvgUri uri={splashTwoUri} width={180} height={250} />
          )}
        </View>
        {splashThreeUri && (
          <View className="mt-32 ml-2">
            <SvgUri uri={splashThreeUri} width={180} height={250} />
          </View>
        )}
      </View>

      <Text className="text-lg text-white leading-5">
        For artists, galleries, and collectors, this is your world of art
        reimagined. A place to showcase, discover, and connect through
        creativity that inspires growth.
      </Text>

      <View className="flex-row justify-between items-center mt-auto mb-12 mx-2">
        <Pressable
          className="border border-gray-600 rounded-full px-6 py-3"
          onPress={() => router.push("/auth/signup/email-password")}
        >
          <Text className="text-base font-bold text-orange-600">
            Skip {">>"}
          </Text>
        </Pressable>
        <Pressable
          className="w-12 h-12 rounded-full bg-orange-600 justify-center items-center"
          onPress={() => router.push("/splash/splash2")}
        >
          <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
