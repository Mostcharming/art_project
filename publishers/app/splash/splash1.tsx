import { usePreloadImages } from "@/hooks/usePreloadImages";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { SvgUri } from "react-native-svg";

export default function Splash1() {
  const router = useRouter();
  const { height } = useWindowDimensions();
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
      <View className="pt-8 mb-6">
        <Text
          className="text-3xl font-bold text-white leading-8 mb-2"
          style={{ fontFamily: "BankGothicBold" }}
        >
          GET DISCOVERED
        </Text>
        <View className="flex-row items-center gap-2">
          <Text
            className="text-3xl font-bold text-white leading-8"
            style={{ fontFamily: "BankGothicBold" }}
          >
            WITH
          </Text>
          {carslUri && <SvgUri uri={carslUri} width={100} height={35} />}
        </View>
      </View>

      <View className="flex-row items-start mb-6 gap-3">
        <View className="gap-3">
          {splashOneUri && (
            <SvgUri uri={splashOneUri} width={180} height={180} />
          )}
          {splashTwoUri && (
            <SvgUri uri={splashTwoUri} width={180} height={180} />
          )}
        </View>
        {splashThreeUri && (
          <SvgUri uri={splashThreeUri} width={140} height={370} />
        )}
      </View>

      <Text
        className="text-sm text-white leading-5"
        style={{ fontFamily: "BankGothicMediumBT" }}
      >
        For artists, galleries, and collectors, this is your world of art
        reimagined. A place to showcase, discover, and connect through
        creativity that inspires growth.
      </Text>

      <View className="flex-row justify-between items-center mt-auto mb-6 mx-2">
        <Pressable
          className="border border-gray-600 rounded-full px-6 py-3"
          onPress={() => router.push("/auth/signup/email-password")}
        >
          <Text
            className="text-base font-bold text-orange-600"
            style={{ fontFamily: "BankGothicMediumBT" }}
          >
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
