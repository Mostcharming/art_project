import { Alert } from "@/components/ui/Alert";
import { useCarouselApi } from "@/hooks/useCarouselApi";
import { UploadedArtwork } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
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
  const { publishDraft, saveDraft, scheduleCarousel } = useCarouselApi();
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
  const [scheduleHour, setScheduleHour] = useState<string>("");
  const [scheduleMinute, setScheduleMinute] = useState<string>("");
  const [scheduleAmPm, setScheduleAmPm] = useState<"AM" | "PM">("AM");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [carouselId, setCarouselId] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());

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
    setShowDatePicker(true);
  };

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    setScheduleDate(dateString);
    setSelectedDateObj(date);
    setShowDatePicker(false);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "Select a date";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.carousel, params.isNew]);

  const handlePublish = async () => {
    if (!carousel || !carouselId) {
      setAlertMessage("Carousel not ready to publish. Please try again.");
      setShowAlert(true);
      return;
    }

    // Validate scheduling inputs if schedule is enabled
    if (scheduleEnabled) {
      if (!scheduleDate) {
        setAlertMessage("Please select a schedule date.");
        setShowAlert(true);
        return;
      }
      if (!scheduleHour || !scheduleMinute) {
        setAlertMessage("Please select a schedule time.");
        setShowAlert(true);
        return;
      }
    }

    setIsPublishing(true);
    try {
      let response;

      if (scheduleEnabled) {
        // Convert 12-hour format to 24-hour format
        let hour = parseInt(scheduleHour, 10);
        if (scheduleAmPm === "PM" && hour !== 12) {
          hour += 12;
        } else if (scheduleAmPm === "AM" && hour === 12) {
          hour = 0;
        }

        // Create the scheduled date with the selected time
        const [year, month, day] = scheduleDate.split("-");
        const scheduledDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          hour,
          parseInt(scheduleMinute)
        );

        response = await scheduleCarousel(carouselId, scheduledDate);

        if (response.error) {
          setAlertMessage(response.error);
          setShowAlert(true);
        } else {
          setAlertMessage("Carousel scheduled successfully!");
          setShowAlert(true);

          setTimeout(() => {
            router.push({
              pathname: "/carousel-success" as any,
              params: {
                carousel: JSON.stringify(carousel),
                type: "scheduled",
              },
            });
          }, 1500);
        }
      } else {
        // Publish immediately
        response = await publishDraft(carouselId);

        if (response.error) {
          setAlertMessage(response.error);
          setShowAlert(true);
        } else {
          setAlertMessage("Carousel published successfully!");
          setShowAlert(true);

          setTimeout(() => {
            router.push({
              pathname: "/carousel-success" as any,
              params: {
                carousel: JSON.stringify(carousel),
                type: "published",
              },
            });
          }, 1500);
        }
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
                backgroundColor: "#000000",
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
              {/* Date and Time Row */}
              <View className="flex-row gap-3">
                {/* Date */}
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs mb-2">Date</Text>
                  <Pressable
                    onPress={handleDatePick}
                    className="bg-neutral-800 px-3 py-3 rounded-lg"
                  >
                    <Text className="text-white text-sm">
                      {scheduleDate
                        ? formatDateDisplay(scheduleDate)
                        : "Select a date"}
                    </Text>
                  </Pressable>
                </View>

                {/* Time */}
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs mb-2">Time</Text>
                  <Pressable
                    onPress={() => setShowTimePicker(true)}
                    className="bg-neutral-800 px-3 py-3 rounded-lg"
                  >
                    <Text className="text-white text-sm">
                      {scheduleHour && scheduleMinute && scheduleAmPm
                        ? `${scheduleHour}:${scheduleMinute} ${scheduleAmPm}`
                        : "Select a time"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Time Picker Modal */}
        <Modal
          visible={showTimePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <Pressable
            className="flex-1 bg-black/95"
            onPress={() => setShowTimePicker(false)}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={0}
              style={{ flex: 1, justifyContent: "flex-end" }}
            >
              <Pressable
                className="bg-neutral-800 rounded-t-2xl px-5 py-4"
                onPress={(e) => e.stopPropagation()}
                style={{ paddingBottom: Math.max(insets.bottom, 20) }}
              >
                {/* Drag Handle */}
                <View className="w-10 h-1 bg-neutral-600 rounded-full self-center mb-4" />

                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-white text-xl font-bold">
                    Select Time
                  </Text>
                  <Pressable onPress={() => setShowTimePicker(false)}>
                    <MaterialIcons name="close" size={24} color="#ffffff" />
                  </Pressable>
                </View>

                {/* Time Input Section */}
                <View className="gap-4 mb-6">
                  {/* Hour and Minute Inputs */}
                  <View className="flex-row gap-3">
                    {/* Hour Input */}
                    <View className="flex-1">
                      <Text className="text-gray-400 text-sm mb-2">Hour</Text>
                      <TextInput
                        className="bg-neutral-700 text-white text-lg px-4 py-3 rounded-lg text-center"
                        placeholder="12"
                        placeholderTextColor="#666"
                        keyboardType="number-pad"
                        maxLength={2}
                        value={scheduleHour}
                        onChangeText={(text) => {
                          if (text === "") {
                            setScheduleHour("");
                          } else if (/^\d+$/.test(text)) {
                            const num = parseInt(text, 10);
                            if (num >= 0 && num <= 12) {
                              setScheduleHour(text);
                            }
                          }
                        }}
                      />
                    </View>

                    {/* Minute Input */}
                    <View className="flex-1">
                      <Text className="text-gray-400 text-sm mb-2">Minute</Text>
                      <TextInput
                        className="bg-neutral-700 text-white text-lg px-4 py-3 rounded-lg text-center"
                        placeholder="00"
                        placeholderTextColor="#666"
                        keyboardType="number-pad"
                        maxLength={2}
                        value={scheduleMinute}
                        onChangeText={(text) => {
                          if (text === "") {
                            setScheduleMinute("");
                          } else if (/^\d+$/.test(text)) {
                            const num = parseInt(text, 10);
                            if (num >= 0 && num <= 59) {
                              setScheduleMinute(text);
                            }
                          }
                        }}
                      />
                    </View>
                  </View>

                  {/* AM/PM Selector */}
                  <View>
                    <Text className="text-gray-400 text-sm mb-2">AM/PM</Text>
                    <View className="flex-row gap-3">
                      <Pressable
                        onPress={() => setScheduleAmPm("AM")}
                        className={`flex-1 py-3 rounded-lg ${
                          scheduleAmPm === "AM"
                            ? "bg-orange-600"
                            : "bg-neutral-700"
                        }`}
                      >
                        <Text
                          className={`text-center text-lg font-semibold ${
                            scheduleAmPm === "AM"
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        >
                          AM
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setScheduleAmPm("PM")}
                        className={`flex-1 py-3 rounded-lg ${
                          scheduleAmPm === "PM"
                            ? "bg-orange-600"
                            : "bg-neutral-700"
                        }`}
                      >
                        <Text
                          className={`text-center text-lg font-semibold ${
                            scheduleAmPm === "PM"
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        >
                          PM
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>

                {/* Done Button */}
                <Pressable
                  onPress={() => setShowTimePicker(false)}
                  className="bg-orange-600 py-4 rounded-lg"
                >
                  <Text className="text-white text-center font-semibold text-base">
                    Done
                  </Text>
                </Pressable>
              </Pressable>
            </KeyboardAvoidingView>
          </Pressable>
        </Modal>

        {/* Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <Pressable
            className="flex-1 bg-black/95"
            onPress={() => setShowDatePicker(false)}
          >
            <View className="flex-1 justify-end">
              <Pressable
                className="bg-neutral-800 rounded-t-2xl px-5 py-4"
                onPress={(e) => e.stopPropagation()}
              >
                {/* Drag Handle */}
                <View className="w-10 h-1 bg-neutral-600 rounded-full self-center mb-4" />

                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-white text-xl font-bold">
                    Select Date
                  </Text>
                  <Pressable onPress={() => setShowDatePicker(false)}>
                    <MaterialIcons name="close" size={24} color="#ffffff" />
                  </Pressable>
                </View>

                {/* Month/Year Navigation */}
                <View className="flex-row items-center justify-between mb-6">
                  <Pressable
                    onPress={() => {
                      const newDate = new Date(selectedDateObj);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setSelectedDateObj(newDate);
                    }}
                  >
                    <MaterialIcons
                      name="chevron-left"
                      size={28}
                      color="#ea580c"
                    />
                  </Pressable>
                  <Text className="text-white text-lg font-semibold">
                    {selectedDateObj.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                  <Pressable
                    onPress={() => {
                      const newDate = new Date(selectedDateObj);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setSelectedDateObj(newDate);
                    }}
                  >
                    <MaterialIcons
                      name="chevron-right"
                      size={28}
                      color="#ea580c"
                    />
                  </Pressable>
                </View>

                {/* Weekday Headers */}
                <View className="flex-row mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <View key={day} className="flex-1">
                        <Text className="text-gray-500 text-center text-xs font-semibold mb-2">
                          {day}
                        </Text>
                      </View>
                    )
                  )}
                </View>

                {/* Calendar Days */}
                <View className="mb-6">
                  {(() => {
                    const daysInMonth = getDaysInMonth(selectedDateObj);
                    const firstDay = getFirstDayOfMonth(selectedDateObj);
                    const days = [];

                    // Empty cells for days before month starts
                    for (let i = 0; i < firstDay; i++) {
                      days.push(
                        <View key={`empty-${i}`} className="flex-1 py-3" />
                      );
                    }

                    // Days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(
                        selectedDateObj.getFullYear(),
                        selectedDateObj.getMonth(),
                        day
                      );
                      const dateStr = date.toISOString().split("T")[0];
                      const isSelected = scheduleDate === dateStr;
                      const isToday =
                        new Date().toISOString().split("T")[0] === dateStr;

                      days.push(
                        <Pressable
                          key={day}
                          onPress={() => handleDateSelect(date)}
                          className={`flex-1 py-3 rounded-lg items-center justify-center ${
                            isSelected
                              ? "bg-orange-600"
                              : isToday
                                ? "bg-neutral-700"
                                : "bg-transparent"
                          }`}
                        >
                          <Text
                            className={`text-sm font-semibold ${
                              isSelected
                                ? "text-white"
                                : isToday
                                  ? "text-[#D8522E]"
                                  : "text-white"
                            }`}
                          >
                            {day}
                          </Text>
                        </Pressable>
                      );
                    }

                    // Render in rows of 7
                    const rows = [];
                    for (let i = 0; i < days.length; i += 7) {
                      rows.push(
                        <View key={`row-${i}`} className="flex-row gap-1 mb-1">
                          {days.slice(i, i + 7)}
                        </View>
                      );
                    }

                    return rows;
                  })()}
                </View>

                {/* Cancel Button */}
                <Pressable
                  onPress={() => setShowDatePicker(false)}
                  className="bg-orange-600 py-4 rounded-lg"
                >
                  <Text className="text-white text-center font-semibold text-base">
                    Done
                  </Text>
                </Pressable>

                <View style={{ marginBottom: 20 }} />
              </Pressable>
            </View>
          </Pressable>
        </Modal>
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
              {isPublishing
                ? "Publishing..."
                : scheduleEnabled
                  ? "Schedule post"
                  : "Publish Now"}
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
