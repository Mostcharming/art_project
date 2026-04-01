import { useCarouselList } from "@/hooks/useCarouselList";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ChevronRight, Tags as Tag } from "lucide-react-native";
import React, { useMemo } from "react";
import { BackHandler, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Tags() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { carousels, isLoading } = useCarouselList("publishers");

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

  // Extract unique tags from carousels with tag counts
  const tagStats = useMemo(() => {
    const tagMap = new Map<string, number>();

    carousels.forEach((carousel) => {
      if (carousel.tag) {
        const normalizedTag = carousel.tag.toLowerCase();
        tagMap.set(normalizedTag, (tagMap.get(normalizedTag) || 0) + 1);
      }
    });

    return Array.from(tagMap.entries())
      .map(([tag, count]) => ({
        tag,
        count,
        displayTag: tag.charAt(0).toUpperCase() + tag.slice(1),
      }))
      .sort((a, b) => b.count - a.count);
  }, [carousels]);

  const handleTagPress = (tagName: string) => {
    router.push({
      pathname: "/tag-detail",
      params: { tag: tagName },
    });
  };

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text
            className="text-2xl text-white"
            style={{ fontFamily: "BankGothicBold" }}
          >
            Browse by Tags
          </Text>
          <Text className="text-base text-gray-400 mt-2">
            See your carousels organized by tag
          </Text>
        </View>

        {/* Tag List */}
        <View className="px-5 mb-6 flex-row items-center justify-between">
          <Text className="text-base text-gray-400">Tag List</Text>
          <Tag size={20} color="#FFFFFF" strokeWidth={1.5} />
        </View>

        {/* Description */}

        {/* Tag Grid/List */}
        {tagStats.length > 0 && (
          <View className="px-5 mb-6">
            <View className="gap-3">
              {tagStats.map((tagItem) => (
                <Pressable
                  key={tagItem.tag}
                  onPress={() => handleTagPress(tagItem.tag)}
                  className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 flex-row items-center justify-between"
                >
                  <View className="flex-1">
                    <Text className="text-lg text-white font-bold">
                      {tagItem.displayTag}
                    </Text>
                    <Text className="text-sm text-gray-400 mt-1">
                      {tagItem.count} carousel{tagItem.count !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <ChevronRight size={24} color="#FFFFFF" />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Empty state when no tags exist */}
        {tagStats.length === 0 && !isLoading && (
          <View className="mx-5 mb-6 rounded-2xl p-12 items-center justify-center min-h-96">
            <MaterialIcons name="local-offer" size={56} color="#666666" />
            <Text
              style={{ fontFamily: "BankGothicBold" }}
              className="text-[20px] text-white mt-4 text-center"
            >
              No tags yet
            </Text>
            <Text className="text-sm text-gray-400 mt-2 text-center px-4">
              Create and publish carousels with tags to see them here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
