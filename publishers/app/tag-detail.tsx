import { CarouselListView } from "@/components/CarouselListView";
import { useCarouselList } from "@/hooks/useCarouselList";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { BackHandler, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TagDetail() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tag } = useLocalSearchParams();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { carousels, isLoading, refetch } = useCarouselList("publishers");

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [router])
  );

  // Filter carousels by selected tag
  const filteredCarousels = useMemo(() => {
    if (!tag) return carousels;
    return carousels.filter((carousel) => {
      if (!carousel.tag) return false;
      return carousel.tag.toLowerCase() === (tag as string).toLowerCase();
    });
  }, [tag, carousels]);

  const displayTag =
    typeof tag === "string" ? tag.charAt(0).toUpperCase() + tag.slice(1) : tag;

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      {/* Back Arrow - Top Left */}
      <View className="px-5 pt-4 pb-4">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-lg  justify-center items-center"
        >
          <MaterialIcons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Tag Name Header */}
        <View className="px-5 pb-6">
          <Text
            className="text-2xl text-white"
            style={{ fontFamily: "BankGothicBold" }}
          >
            {displayTag}
          </Text>
          <Text className="text-sm text-gray-400">
            Carousels available under this tag
          </Text>
        </View>

        {/* Carousel Count and View Mode Toggle */}
        <View className="px-5 mb-6 flex-row items-center justify-between">
          <Text className="text-base text-gray-400">
            carousel({filteredCarousels.length})
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              className={`w-10 h-10 rounded-lg justify-center items-center ${
                viewMode === "list"
                  ? "bg-neutral-800 border border-[#D8522E]"
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
                  ? "bg-neutral-800 border border-[#D8522E]"
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
        </View>

        {/* Carousels */}
        <View className="flex-1 px-0">
          {filteredCarousels.length === 0 && !isLoading ? (
            <View className="mx-5 mb-6 rounded-2xl p-12 items-center justify-center min-h-96">
              <MaterialIcons name="palette" size={56} color="#666666" />
              <Text
                style={{ fontFamily: "BankGothicBold" }}
                className="text-[20px] text-white mt-4 text-center"
              >
                No carousels found
              </Text>
              <Text className="text-sm text-gray-400 mt-2 text-center px-4">
                No carousels are tagged with &quot;{displayTag}&quot;. Try
                selecting a different tag.
              </Text>
            </View>
          ) : (
            <CarouselListView
              carousels={filteredCarousels}
              isLoading={isLoading}
              viewMode={viewMode}
              carouselType="publishers"
              onSelectCarousel={(carousel) => {
                console.log("Selected carousel:", carousel.id);
              }}
              onRefresh={refetch}
              onRefreshDashboard={refetch}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
