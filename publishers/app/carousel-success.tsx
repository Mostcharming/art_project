import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SuccessCarousel {
  id: string;
  name: string;
  artworks: {
    uri?: string;
    imageUrl?: string;
    title: string;
  }[];
}

export default function CarouselSuccess() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    carousel?: string;
    type?: string;
  }>();

  const [carousel, setCarousel] = useState<SuccessCarousel | null>(null);
  const isScheduled = params.type === "scheduled";

  useEffect(() => {
    if (params.carousel) {
      try {
        const carouselData = JSON.parse(params.carousel);
        setCarousel(carouselData);
      } catch (error) {
        console.error("Failed to parse carousel data:", error);
      }
    }
  }, [params.carousel]);

  const handleBackToHome = () => {
    router.push("/dashboard");
  };

  if (!carousel) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-gray-400">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <View className="items-center mt-10 mb-6 px-5">
          {isScheduled ? (
            <>
              <Text
                className="text-white text-3xl mb-3 text-center"
                style={{ fontFamily: "BankGothicBold" }}
              >
                Launching soon
              </Text>
              <Text className="text-gray-300 text-lg text-center">
                your art has been scheduled to go live
              </Text>
            </>
          ) : (
            <>
              <Text
                className="text-white text-3xl mb-3 text-center"
                style={{ fontFamily: "BankGothicBold" }}
              >
                Your masterpiece is live
              </Text>
              <Text className="text-gray-300 text-lg text-center">
                Collectors, curators and admirers can now explore your work
              </Text>
            </>
          )}
        </View>
        {/* Content Container */}
        <View className="flex-1 justify-center items-center px-5 py-12">
          {/* Stacked Artwork Images */}
          {carousel.artworks.length > 0 && (
            <View
              style={{
                width: 360,
                height: 360,
                marginBottom: 40,
                position: "relative",
              }}
            >
              {/* Stack effect - show up to 3 images */}
              {carousel.artworks.slice(0, 3).map((artwork, idx) => (
                <Image
                  key={idx}
                  source={{
                    uri: artwork.uri || artwork.imageUrl || "",
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 16,
                    position: "absolute",
                    transform: [
                      { translateY: idx * 12 },
                      { translateX: idx * 8 },
                      { scale: 1 - idx * 0.05 },
                    ],
                  }}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}

          {/* Success Message */}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View
        className="px-5 py-4 bg-black border-t border-neutral-800"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleBackToHome}
          style={{
            minHeight: 56,
            backgroundColor: "#ea580c",
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text className="text-base text-white font-semibold">
            Back to home
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
