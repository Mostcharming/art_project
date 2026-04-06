import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function GuestPage() {
  const router = useRouter();

  useEffect(() => {
    // Ensure router is available
  }, [router]);

  const handleNavigation = (path: any) => {
    try {
      if (router?.canGoBack && path === "back") {
        router.back();
      } else if (router) {
        router.push(path);
      }
    } catch (error) {
      console.warn("Navigation error:", error);
    }
  };

  return (
    <View className="flex-1 bg-black justify-center items-center px-6">
      <View className="items-center gap-8">
        <Text
          className="text-white text-4xl font-bold text-center"
          style={{ fontFamily: "BankGothicBold" }}
        >
          Guest Mode
        </Text>

        <Text className="text-white/80 text-center text-lg">
          You are browsing as a guest. Explore our collection of contemporary
          masterpieces.
        </Text>

        <View className="mt-8 gap-4 w-full">
          <Pressable
            onPress={() => handleNavigation("/")}
            className="bg-[#D8522E] rounded-lg h-12 items-center justify-center"
          >
            <Text className="text-white font-semibold text-lg">
              Browse Gallery
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleNavigation("back")}
            className="bg-transparent border-2 border-white/30 rounded-lg h-12 items-center justify-center"
          >
            <Text className="text-white/70 font-semibold text-lg">Go Back</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
