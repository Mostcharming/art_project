import { useUserStore } from "@/store/userStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";
import { BackHandler, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

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

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const quickActions = [
    {
      icon: "add-circle-outline" as const,
      label: "Upload Art",
      color: "#EA580C",
    },
    {
      icon: "collections" as const,
      label: "My Gallery",
      color: "#3B82F6",
    },
    {
      icon: "explore" as const,
      label: "Discover",
      color: "#8B5CF6",
    },
    {
      icon: "people-outline" as const,
      label: "Community",
      color: "#10B981",
    },
  ];

  const stats = [
    { label: "Artworks", value: "0", icon: "palette" as const },
    { label: "Followers", value: "0", icon: "people" as const },
    { label: "Views", value: "0", icon: "visibility" as const },
    { label: "Likes", value: "0", icon: "favorite" as const },
  ];

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-6">
          <View className="flex-1">
            <Text className="text-sm text-gray-400">{greeting()}</Text>
            <Text
              className="text-2xl text-white mt-1"
              style={{ fontFamily: "BankGothicBold" }}
            >
              {user?.name || "Creator"}
            </Text>
            {user?.personaType && (
              <View className="flex-row items-center mt-1">
                <View className="bg-orange-600/20 rounded-full px-3 py-1">
                  <Text className="text-xs text-orange-500">
                    {user.personaType}
                  </Text>
                </View>
              </View>
            )}
          </View>
          <Pressable
            className="w-11 h-11 rounded-full bg-neutral-800 justify-center items-center"
            onPress={() => {
              // TODO: Navigate to profile/settings
            }}
          >
            <MaterialIcons name="person" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Stats Row */}
        <View className="flex-row mx-5 mb-6 gap-3">
          {stats.map((stat) => (
            <View
              key={stat.label}
              className="flex-1 bg-neutral-900 rounded-xl p-4 items-center"
            >
              <MaterialIcons name={stat.icon} size={20} color="#999999" />
              <Text className="text-xl text-white font-bold mt-2">
                {stat.value}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="mx-5 mb-6">
          <Text className="text-lg text-white font-bold mb-4">
            Quick Actions
          </Text>
          <View className="flex-row gap-3">
            {quickActions.map((action) => (
              <Pressable
                key={action.label}
                className="flex-1 bg-neutral-900 rounded-xl p-4 items-center"
              >
                <View
                  className="w-12 h-12 rounded-full justify-center items-center mb-3"
                  style={{ backgroundColor: `${action.color}20` }}
                >
                  <MaterialIcons
                    name={action.icon}
                    size={24}
                    color={action.color}
                  />
                </View>
                <Text className="text-xs text-gray-300 text-center">
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Get Started Card */}
        <View className="mx-5 mb-6 bg-neutral-900 rounded-2xl p-5">
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="auto-awesome" size={20} color="#EA580C" />
            <Text className="text-base text-white font-bold ml-2">
              Complete Your Profile
            </Text>
          </View>
          <Text className="text-sm text-gray-400 leading-5 mb-4">
            Add your first artwork, set up your gallery, and start building your
            presence. The art world is waiting for you.
          </Text>
          <View className="bg-neutral-800 rounded-full h-2 overflow-hidden">
            <View
              className="bg-orange-600 h-full rounded-full"
              style={{ width: "25%" }}
            />
          </View>
          <Text className="text-xs text-gray-500 mt-2">1 of 4 steps done</Text>
        </View>

        {/* Recent Activity */}
        <View className="mx-5 mb-6">
          <Text className="text-lg text-white font-bold mb-4">
            Recent Activity
          </Text>
          <View className="bg-neutral-900 rounded-2xl p-6 items-center">
            <MaterialIcons name="history" size={40} color="#444444" />
            <Text className="text-base text-gray-500 mt-3 text-center">
              No activity yet
            </Text>
            <Text className="text-sm text-gray-600 mt-1 text-center">
              Start uploading artwork to see your activity here
            </Text>
          </View>
        </View>

        {/* Trending Section */}
        <View className="mx-5 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg text-white font-bold">
              Trending on CARSL
            </Text>
            <Pressable>
              <Text className="text-sm text-orange-500">See all</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className="bg-neutral-900 rounded-2xl overflow-hidden"
                style={{ width: 200 }}
              >
                <View className="bg-neutral-800 h-40 justify-center items-center">
                  <MaterialIcons name="image" size={40} color="#444444" />
                </View>
                <View className="p-3">
                  <Text className="text-sm text-white font-bold">
                    Artwork Title
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    by Artist Name
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Logout (temporary for dev) */}
        <View className="mx-5 mt-4">
          <Pressable
            className="border border-neutral-700 rounded-xl py-4 items-center"
            onPress={() => {
              clearUser();
              router.replace("/splash/splash1");
            }}
          >
            <Text className="text-sm text-gray-400">Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
