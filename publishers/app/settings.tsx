import { useUserStore } from "@/store/userStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import {
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [showFrameModal, setShowFrameModal] = useState(false);
  const frameTimingOptions = [
    { label: "10 seconds", value: 0.1667 },
    { label: "30 seconds", value: 0.5 },
    { label: "1 minute", value: 1 },
    { label: "2 minutes", value: 2 },
    { label: "3 minutes", value: 3 },
    { label: "4 minutes", value: 4 },
    { label: "5 minutes", value: 5 },
  ];
  const [frameTiming, setFrameTiming] = useState(frameTimingOptions[2].value); // default 1 minute
  const [showFrameDropdown, setShowFrameDropdown] = useState(false);

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
          <Pressable
            className="bg-neutral-900 rounded-xl p-5 border border-neutral-700 flex-row items-center justify-between"
            onPress={() => setShowFrameModal(true)}
          >
            <Text className="text-white text-base font-bold">
              Carousel Frame timing
            </Text>
            <ChevronRight color="#fff" size={22} />
          </Pressable>
          <View className="bg-neutral-900 rounded-xl p-5 border border-neutral-700 flex-row items-center justify-between">
            <Text className="text-white text-base font-bold">Membership</Text>
            <ChevronRight color="#fff" size={22} />
          </View>
          {/* Push Notifications Card */}
          <View className="bg-neutral-900 rounded-xl p-5 border border-neutral-700 flex-row items-center justify-between">
            <View>
              <Text className="text-white text-base font-bold">
                Push Notifications
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                Receive notifications on your device
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: "#444", true: "#ea580c" }}
              thumbColor={pushEnabled ? "#ea580c" : "#888"}
            />
          </View>
          <View
            className="bg-neutral-900 rounded-xl p-5 border border-neutral-700 flex-row items-center justify-between"
            onTouchEnd={() => {
              clearUser();
              router.replace("/splash/splash1");
            }}
          >
            <Text className="text-white text-base font-bold">Sign Out</Text>
            <ChevronRight color="#fff" size={22} />
          </View>
        </View>
      </ScrollView>
      {/* Frame Timing Modal */}
      <Modal
        visible={showFrameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFrameModal(false)}
      >
        <View className="flex-1 justify-end bg-black/80">
          <View
            className="bg-neutral-900 rounded-t-2xl p-6 pb-10"
            style={{ minHeight: 340 }}
          >
            <Pressable
              className="absolute right-4 top-4 z-10"
              onPress={() => setShowFrameModal(false)}
            >
              <MaterialIcons name="close" size={28} color="#fff" />
            </Pressable>
            <Text
              className="text-2xl text-white mb-6 text-left"
              style={{ fontFamily: "BankGothicBold", alignSelf: "flex-start" }}
            >
              Carousel Frame Timing
            </Text>
            <Text className="text-base text-white mb-2">
              Frame Timing (minutes per art work)
            </Text>
            <Pressable
              className="flex-row items-center justify-between rounded-lg px-4 py-4 bg-neutral-800 mb-4"
              onPress={() => setShowFrameDropdown(true)}
            >
              <Text className="text-lg text-white">
                {frameTimingOptions.find((opt) => opt.value === frameTiming)
                  ?.label || "Select duration"}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="#ea580c"
              />
            </Pressable>
            <Text className="text-xs text-gray-400 mb-6">
              Select a duration 10 seconds - 5 minutes
            </Text>
            <Pressable
              className="rounded-xl justify-center items-center bg-orange-600"
              style={{ minHeight: 54 }}
              onPress={() => setShowFrameModal(false)}
            >
              <Text className="text-base font-bold text-white">
                Save Changes
              </Text>
            </Pressable>
          </View>
        </View>
        {/* Dropdown Modal */}
        <Modal
          visible={showFrameDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFrameDropdown(false)}
        >
          <Pressable
            className="flex-1 bg-black/70 justify-end"
            onPress={() => setShowFrameDropdown(false)}
          >
            <View className="bg-neutral-800 rounded-t-2xl pb-8 pt-4 px-5">
              <View className="w-10 h-1 bg-neutral-600 rounded-full self-center mb-4" />
              <Text className="text-lg text-white font-bold mb-4">
                Select Frame Timing
              </Text>
              {frameTimingOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  className={`py-4 px-4 rounded-lg mb-1 ${frameTiming === opt.value ? "bg-orange-600/20" : ""}`}
                  onPress={() => {
                    setFrameTiming(opt.value);
                    setShowFrameDropdown(false);
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base text-white">{opt.label}</Text>
                    {frameTiming === opt.value && (
                      <MaterialIcons name="check" size={20} color="#EA580C" />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      </Modal>
    </View>
  );
}
