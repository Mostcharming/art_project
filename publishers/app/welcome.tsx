import WelcomeSvg from "@/assets/images/welcome.svg";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-black px-5" style={{ paddingTop: insets.top }}>
      {/* Top text */}
      <View className="items-center mt-auto mb-4">
        <Text
          className="text-3xl text-white leading-10 text-center "
          style={{ fontFamily: "BankGothicBold" }}
        >
          Welcome to CARSL
        </Text>

        <Text className="text-base text-gray-400 text-center leading-6 px-4">
          We&apos;re excited you&apos;re here and can&apos;t wait to see your
          art
        </Text>
      </View>

      {/* Welcome SVG */}
      <View
        className="justify-center items-center w-full"
        style={{ height: 500 }}
      >
        <WelcomeSvg width="100%" height="100%" />
      </View>

      {/* Let's Gooo button */}
      <View className="mt-4 mb-auto px-2">
        <Pressable
          className="rounded-xl bg-orange-600 justify-center items-center"
          style={{ minHeight: 60 }}
          onPress={() => router.replace("/dashboard")}
        >
          <Text className="text-base font-bold text-white">
            Let&apos;s gooo
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
