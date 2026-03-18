import { Alert } from "@/components/ui/Alert";
import { useCarouselApi } from "@/hooks/useCarouselApi";
import { UploadedArtwork } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

interface PreviewCarousel {
  id: string;
  name: string;
  country: string;
  description?: string;
  frameTimingSeconds: number;
  artworks: UploadedArtwork[];
}

export default function CarouselPreview() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { publishDraft, saveDraft } = useCarouselApi();
  const params = useLocalSearchParams<{
    carousel?: string;
    isNew?: string;
  }>();

  const [carousel, setCarousel] = useState<PreviewCarousel | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [scheduleTime, setScheduleTime] = useState<string>("");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [carouselId, setCarouselId] = useState<string | null>(null);

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => {
      if (carousel) {
        if (prevIndex < carousel.artworks.length - 1) {
          return prevIndex + 1;
        } else {
          return 0;
        }
      }
      return prevIndex;
    });
  };

  const handleDatePick = () => {
    const today = new Date();
    setScheduleDate(today.toISOString().split("T")[0]);
  };

  const handleTimePick = () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    setScheduleTime(time);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          // Swiped right - go to previous
          setCurrentIndex((prevIndex) => {
            if (prevIndex > 0) {
              return prevIndex - 1;
            }
            return prevIndex;
          });
        } else if (gestureState.dx < -50) {
          // Swiped left - go to next
          handleNextImage();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (params.carousel) {
      try {
        const carouselData = JSON.parse(params.carousel);
        setCarousel(carouselData);

        // If this is a new carousel (id: "preview"), save it as a draft first
        if (params.isNew === "true" && carouselData.id === "preview") {
          // Immediately save draft for new carousels
          (async () => {
            try {
              const response = await saveDraft({
                name: carouselData.name,
                country: carouselData.country,
                description: carouselData.description,
                frameTimingSeconds: carouselData.frameTimingSeconds,
                artworks: carouselData.artworks,
              });

              if (response.error) {
                console.error("Failed to save draft:", response.error);
                setAlertMessage("Failed to save carousel draft");
                setShowAlert(true);
              } else if (response.data?.carousel?.id) {
                // Use the returned ID for publishing
                setCarouselId(response.data.carousel.id.toString());
              }
            } catch (error) {
              console.error("Save draft error:", error);
              setAlertMessage("Failed to save carousel draft");
              setShowAlert(true);
            }
          })();
        } else {
          // For existing carousels, just use the ID
          setCarouselId(carouselData.id);
        }
      } catch (error) {
        console.error("Failed to parse carousel data:", error);
        setAlertMessage("Failed to load carousel data");
        setShowAlert(true);
      }
    }
  }, [params.carousel, params.isNew]);

  const handlePublish = async () => {
    if (!carousel || !carouselId) {
      setAlertMessage("Carousel not ready to publish. Please try again.");
      setShowAlert(true);
      return;
    }

    setIsPublishing(true);
    try {
      const response = await publishDraft(carouselId);

      if (response.error) {
        setAlertMessage(response.error);
        setShowAlert(true);
      } else {
        setAlertMessage("Carousel published successfully!");
        setShowAlert(true);

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Publish error:", error);
      setAlertMessage("Failed to publish carousel");
      setShowAlert(true);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleContinueEditing = () => {
    router.back();
  };

  if (!carousel || carousel.artworks.length === 0) {
    return (
      <View
        className="flex-1 bg-black justify-center items-center"
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-gray-400">Loading carousel preview...</Text>
      </View>
    );
  }

  const currentArtwork = carousel.artworks[currentIndex];

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      {/* Header with Back Button */}
      <View className="px-5 py-3 flex-row items-center">
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Progress Line */}
      <View className="mx-5 mt-3 mb-0 flex-row gap-1">
        {carousel.artworks.map((_, index) => (
          <View
            key={index}
            className="flex-1 h-1 bg-neutral-700 rounded-full overflow-hidden"
          >
            <View
              className="h-full bg-white rounded-full"
              style={{
                width: index <= currentIndex ? "100%" : "0%",
              }}
            />
          </View>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Image Carousel with Overlay */}
        <View
          className="mx-5 mt-[-4px] mb-6 overflow-hidden rounded-2xl"
          {...panResponder.panHandlers}
        >
          <Pressable onPress={handleNextImage}>
            <Image
              source={{
                uri: currentArtwork.uri || currentArtwork.imageUrl || "",
              }}
              style={{
                width: screenWidth - 40,
                height: 400,
                borderRadius: 16,
              }}
              resizeMode="contain"
            />
            {/* Title and Info Overlay on Image - Bottom Full Width */}
            <View className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-3">
              <Text
                className="text-white text-lg mb-2"
                style={{ fontFamily: "BankGothicBold" }}
              >
                {currentArtwork.title}
              </Text>
              <Text className="text-gray-300 text-sm">
                by {currentArtwork.artist} * {currentArtwork.width}&quot; ×{" "}
                {currentArtwork.height}&quot;
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Carousel Info Box */}
        <View className="mx-5 mb-6 bg-neutral-800 rounded-lg p-4 border border-neutral-700">
          <Text className="text-white text-sm font-semibold mb-2">
            {carousel.name}
          </Text>
          <Text className="text-gray-400 text-xs">
            {carousel.description || "No description provided"}
          </Text>
        </View>

        {/* Schedule Post Section */}
        <View className="mx-5 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-white text-base font-semibold">
                Schedule Post
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Select a date and time to publish your art
              </Text>
            </View>
            <Switch
              value={scheduleEnabled}
              onValueChange={setScheduleEnabled}
              trackColor={{ false: "#444", true: "#ea580c" }}
              thumbColor={scheduleEnabled ? "#ea580c" : "#888"}
            />
          </View>

          {scheduleEnabled && (
            <View>
              <View className="mb-3">
                <Text className="text-gray-500 text-xs mb-2">Date</Text>
                <Pressable
                  onPress={handleDatePick}
                  className="bg-neutral-800 px-3 py-3 rounded-lg"
                >
                  <Text className="text-white text-sm">
                    {scheduleDate || "Select a date"}
                  </Text>
                </Pressable>
              </View>
              <View>
                <Text className="text-gray-500 text-xs mb-2">Time</Text>
                <Pressable
                  onPress={handleTimePick}
                  className="bg-neutral-800 px-3 py-3 rounded-lg"
                >
                  <Text className="text-white text-sm">
                    {scheduleTime || "Select a time"}
                  </Text>
                </Pressable>
              </View>

              {/* No modals needed - simple button-based approach */}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View
        className="px-5 py-4 bg-black border-t border-neutral-800"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row gap-3">
          <Pressable
            onPress={handleContinueEditing}
            style={{
              flex: 0.8,
              minHeight: 56,
              backgroundColor: "transparent",
              borderWidth: 2,
              borderColor: "#FFFFFF1A",
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text className="text-base text-white font-semibold">
              Continue Editing
            </Text>
          </Pressable>

          <Pressable
            onPress={handlePublish}
            disabled={isPublishing}
            style={{
              flex: 1.2,
              minHeight: 56,
              backgroundColor: "#ea580c",
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
              opacity: isPublishing ? 0.6 : 1,
            }}
          >
            <Text className="text-base text-white font-semibold">
              {isPublishing ? "Publishing..." : "Publish Now"}
            </Text>
          </Pressable>
        </View>
      </View>

      <Alert
        visible={showAlert}
        message={alertMessage}
        onClose={() => setShowAlert(false)}
        duration={4000}
      />
    </View>
  );
}
