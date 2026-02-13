import { usePreloadImages } from "@/hooks/usePreloadImages";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SvgUri } from "react-native-svg";

export default function Splash1() {
  const router = useRouter();
  const { imageUris, isLoading } = usePreloadImages([
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
          {carslUri && <SvgUri uri={carslUri} width={120} height={35} />}
        </View>
      </View>

      <View className="flex-1 flex-row justify-center items-start w-full px-3 gap-3 -mt-4">
        {splashOneUri && splashTwoUri && splashThreeUri ? (
          <>
            <View className="flex-1">
              <SvgUri uri={splashOneUri} width="100%" height="50%" />
              <SvgUri uri={splashTwoUri} width="100%" height="50%" />
            </View>
            <View className="flex-1 mt-32">
              <SvgUri uri={splashThreeUri} width="100%" height="50%" />
            </View>
          </>
        ) : (
          <View
            className={`flex-1 h-full rounded opacity-60 ${
              isLoading ? "bg-gray-800" : "bg-gray-950"
            }`}
          />
        )}
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
