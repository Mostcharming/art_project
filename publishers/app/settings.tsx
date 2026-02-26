import { useFocusEffect } from "@react-navigation/native";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { BackHandler, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Settings() {
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [])
  );

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Header */}
        <View className="px-5 pt-8 pb-6">
          <Text
            className="text-3xl text-white leading-10 mb-0"
            style={{ fontFamily: "BankGothicBold" }}
          >
            Settings
          </Text>
          <Text className="text-base text-gray-300 leading-6 mt-1">
            Manage your app setting here
          </Text>
        </View>

        {/* Stacked Setting Boxes */}
        <View className="mx-5 gap-4">
          <View className="bg-neutral-900 rounded-xl p-5 border border-neutral-700 flex-row items-center justify-between">
            <Text className="text-white text-base font-bold">Account</Text>
            <ChevronRight color="#fff" size={22} />
          </View>
          <View className="bg-neutral-900 rounded-xl p-5 border border-neutral-700 flex-row items-center justify-between">
            <Text className="text-white text-base font-bold">
              Notifications
            </Text>
            <ChevronRight color="#fff" size={22} />
          </View>
          <View className="bg-neutral-900 rounded-xl p-5 border border-neutral-700 flex-row items-center justify-between">
            <Text className="text-white text-base font-bold">Privacy</Text>
            <ChevronRight color="#fff" size={22} />
          </View>
          <View className="bg-neutral-900 rounded-xl p-5 border border-neutral-700 flex-row items-center justify-between">
            <Text className="text-white text-base font-bold">About</Text>
            <ChevronRight color="#fff" size={22} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
