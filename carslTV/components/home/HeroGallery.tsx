import { getNextFocusIndex, useTVRemote } from "@/hooks/use-tv-remote";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Image, Platform, Pressable, Text, View } from "react-native";

const CARDS = [
  // 1 — Far left (partially off-screen)
  {
    src: "https://joincarsl.com/api/uploads/artworks/7.png",
    alt: "Carsl",
    title: "Carsl",
    artist: "Carsl",
    bg: "bg-[#1a0a2e]",
    pos: "left-[-10%] top-[60%] w-[17.7%] h-[30.5%]",
    partial: true,
  },
  // 2 — Left medium
  {
    src: "https://joincarsl.com/api/uploads/artworks/6.png",
    alt: "Carsl",
    title: "Carsl",
    artist: "Carsl",
    bg: "bg-[#1a237e]",
    pos: "left-[6.1%] top-[41.2%] w-[17.7%] h-[40.6%]",
    partial: false,
  },
  // 3 — Left tall
  {
    src: "https://joincarsl.com/api/uploads/artworks/5.png",
    alt: "Carsl",
    title: "Carsl",
    artist: "Carsl",
    bg: "bg-[#111111]",
    pos: "left-[22.2%] top-[21.9%] w-[17.7%] h-[46.5%]",
    partial: false,
  },
  // 4 — CENTER (tallest)
  {
    src: "https://joincarsl.com/api/uploads/artworks/1.png",
    alt: "Carsl",
    title: "Carsl",
    artist: "Carsl",
    bg: "bg-[#6b1a1a]",
    pos: "left-[38.3%] top-[0%] w-[23.4%] h-[54.2%]",
    partial: false,
    isCenter: true,
  },
  // 5 — Right tall
  {
    src: "https://joincarsl.com/api/uploads/artworks/2.png",
    alt: "Carsl",
    title: "Carsl",
    artist: "Carsl",
    bg: "bg-[#7a2800]",
    pos: "left-[60.1%] top-[22.4%] w-[17.7%] h-[46.5%]",
    partial: false,
  },
  // 6 — Right medium
  {
    src: "https://joincarsl.com/api/uploads/artworks/3.png",
    alt: "Carsl",
    title: "Carsl",
    artist: "Carsl",
    bg: "bg-[#d4d0c8]",
    pos: "left-[76.2%] top-[39.4%] w-[17.7%] h-[39.4%]",
    partial: false,
  },
  // 7 — Far right (partially off-screen)
  {
    src: "https://joincarsl.com/api/uploads/artworks/4.png",
    alt: "Carsl",
    title: "Carsl",
    artist: "Carsl",
    bg: "bg-[#5a2d00]",
    pos: "left-[92.3%] top-[60%] w-[17.7%] h-[29.3%]",
    partial: true,
  },
];

const FOCUSABLE_INDICES = [1, 2, 3, 4, 5]; // Non-partial card indices

export function HeroGallery() {
  const [focusedIndex, setFocusedIndex] = useState(3); // Center card (index 3)
  const viewRef = useRef<View>(null);
  const router = useRouter();

  const handleCardSelect = () => {
    // Navigate to secondIndex page
    router.push("/pages/secondIndex");
  };

  // Set up TV remote controls
  useTVRemote({
    onLeft: () => {
      const newIndex = getNextFocusIndex(
        focusedIndex,
        FOCUSABLE_INDICES,
        "left"
      );
      setFocusedIndex(newIndex);
    },
    onRight: () => {
      const newIndex = getNextFocusIndex(
        focusedIndex,
        FOCUSABLE_INDICES,
        "right"
      );
      setFocusedIndex(newIndex);
    },
    onSelect: handleCardSelect,
  });

  const handleTap = () => {
    // Navigate to the next screen on tap (for Android phones/tablets)
    if (Platform.OS === "android") {
      handleCardSelect();
    }
  };

  const handleCardFocus = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <Pressable
      onPress={handleTap}
      className="relative w-full flex-1"
      ref={viewRef}
      accessible={true}
      accessibilityRole="tablist"
      accessibilityLabel="Gallery carousel"
    >
      {/* 16:9 container — fills the viewport width */}
      <View className="absolute inset-0 bg-black overflow-hidden flex-1">
        {/* Background gradient overlay for depth */}
        <View className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />

        {/* Cards */}
        {CARDS.map((card, index) => {
          // Only non-partial cards are focusable
          const isFocusable = !card.partial;
          const isFocused = isFocusable && index === focusedIndex;

          return (
            <Pressable
              key={card.src}
              onPress={() => isFocusable && handleCardFocus(index)}
              accessible={isFocusable}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={`${card.title} by ${card.artist}`}
              className={[
                "absolute overflow-hidden rounded-xl",
                card.bg,
                card.pos,
                isFocused
                  ? "scale-[1.05] z-30 ring-4 ring-white/80 shadow-2xl"
                  : card.isCenter
                  ? "z-10"
                  : "z-0",
              ].join(" ")}
            >
              <Image
                source={{ uri: card.src }}
                className="w-full h-full"
                style={{
                  resizeMode: "cover",
                  transform: isFocused ? [{ scale: 1.05 }] : undefined,
                }}
              />

              {/* Info overlay — always visible when focused */}
              {isFocused && (
                <View className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                  <Text
                    className="text-white font-semibold leading-tight"
                    numberOfLines={1}
                    style={{ fontFamily: "Space_Grotesk" }}
                  >
                    {card.title}
                  </Text>
                  <Text
                    className="text-white/60 text-sm leading-tight"
                    numberOfLines={1}
                  >
                    {card.artist}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Bottom text prompt */}
        <View className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-20">
          <Text className="text-white text-sm">
            Press Enter(ok) to continue
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
