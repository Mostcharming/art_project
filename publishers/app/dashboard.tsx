import { CarouselListView } from "@/components/CarouselListView";
import { CarouselType, useCarouselList } from "@/hooks/useCarouselList";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useUserStore } from "@/store/userStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { BackHandler, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const {
    dashboardData,
    isLoading,
    refetch: refetchDashboard,
  } = useDashboardData();
  const [activeTab, setActiveTab] = useState<CarouselType>("published");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const {
    carousels,
    isLoading: carouselsLoading,
    refetch,
  } = useCarouselList(activeTab);

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

  const stats = [
    {
      label: "Live Projects",
      value: isLoading ? "-" : dashboardData?.liveProjects.toString() || "0",
    },
    {
      label: "Subscribers",
      value: isLoading ? "-" : dashboardData?.subscribers.toString() || "0",
    },
    {
      label: "Watch Time",
      value: isLoading ? "-" : `${dashboardData?.watchTimeInHours || "0"}hs`,
    },
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
            <View className="flex-row items-center gap-2">
              <Text
                className="text-2xl text-white"
                style={{ fontFamily: "BankGothicBold" }}
              >
                Hey {user?.name || "Creator"} 👋🏾
              </Text>
            </View>
            <Text className="text-lg text-gray-400 mt-1">
              Welcome back, Picasso
            </Text>
          </View>
          <Pressable
            className="w-11 h-11 rounded-full bg-neutral-800 justify-center items-center"
            onPress={() => {
              // TODO: Navigate to notifications
            }}
          >
            <MaterialIcons
              name="notifications-none"
              size={22}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Stats Row - Long Boxes */}
        <View className="mx-5 mb-8 flex-row gap-3">
          {stats.map((stat) => (
            <View
              key={stat.label}
              className="flex-1 bg-neutral-900 border-2 border-neutral-700 rounded-xl p-5"
            >
              <Text
                style={{ fontFamily: "BankGothicBold" }}
                className="text-3xl text-white"
              >
                {stat.value}
              </Text>
              <Text className="text-[14px] text-gray-400 mt-2">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between">
            {/* Tab buttons */}
            <View className="flex-row gap-6">
              {["published", "scheduled", "drafts"].map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab as typeof activeTab)}
                >
                  <Text
                    className={`text-base capitalize ${
                      activeTab === tab ? "text-orange-500" : "text-gray-400"
                    }`}
                  >
                    {tab}
                  </Text>
                  {activeTab === tab && (
                    <View
                      className="h-0.5 bg-orange-500 mt-2 rounded-full"
                      style={{ width: "100%" }}
                    />
                  )}
                </Pressable>
              ))}
            </View>

            {/* View Mode Toggle - Only show for publishers and scheduled tabs */}
            {activeTab !== "drafts" && (
              <View className="flex-row gap-2">
                <Pressable
                  className={`w-10 h-10 rounded-lg justify-center items-center ${
                    viewMode === "list"
                      ? "bg-neutral-800 border border-orange-500"
                      : "bg-transparent"
                  }`}
                  onPress={() => setViewMode("list")}
                >
                  <MaterialIcons
                    name="list"
                    size={20}
                    color={viewMode === "list" ? "#EA580C" : "#666666"}
                  />
                </Pressable>
                <Pressable
                  className={`w-10 h-10 rounded-lg justify-center items-center ${
                    viewMode === "grid"
                      ? "bg-neutral-800 border border-orange-500"
                      : "bg-transparent"
                  }`}
                  onPress={() => setViewMode("grid")}
                >
                  <MaterialIcons
                    name="grid-view"
                    size={20}
                    color={viewMode === "grid" ? "#EA580C" : "#666666"}
                  />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Content Area */}
        <View className="flex-1 px-0">
          {carousels.length === 0 && !carouselsLoading ? (
            <View className="mx-5 mb-6 rounded-2xl p-12 items-center justify-center min-h-96">
              <MaterialIcons name="palette" size={56} color="#666666" />
              <Text
                style={{ fontFamily: "BankGothicBold" }}
                className="text-[20px] text-white  mt-4 text-center"
              >
                {activeTab === "drafts"
                  ? "No drafts yet"
                  : activeTab === "scheduled"
                    ? "No scheduled carousels"
                    : "No published work yet"}
              </Text>
              <Text className="text-sm text-gray-400 mt-2 text-center px-4">
                {activeTab === "drafts"
                  ? "Create a new carousel draft to get started."
                  : activeTab === "scheduled"
                    ? "Schedule a carousel to appear here."
                    : "You have not published any of your art yet, go ahead and start creating."}
              </Text>
              <Pressable
                className="bg-orange-600 rounded-xl py-3 px-6 items-center mt-6"
                onPress={() => router.push("/create-carousel")}
              >
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="add" size={20} color="#FFFFFF" />
                  <Text className="text-base text-white ">New Carousel</Text>
                </View>
              </Pressable>
            </View>
          ) : (
            <CarouselListView
              carousels={carousels}
              isLoading={carouselsLoading}
              viewMode={viewMode}
              carouselType={activeTab}
              onSelectCarousel={(carousel) => {
                // TODO: Navigate to carousel details
                console.log("Selected carousel:", carousel.id);
              }}
              onRefresh={refetch}
              onRefreshDashboard={refetchDashboard}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
