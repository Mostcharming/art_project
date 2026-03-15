import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CloudUpload } from "lucide-react-native";
import { useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UploadArtwork() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [frameTiming, setFrameTiming] = useState(10);
  const [showFrameDropdown, setShowFrameDropdown] = useState(false);

  const frameTimingOptions = [
    { label: "10 seconds", value: 10 },
    { label: "30 seconds", value: 30 },
    { label: "1 minute", value: 60 },
    { label: "2 minutes", value: 120 },
    { label: "3 minutes", value: 180 },
    { label: "4 minutes", value: 240 },
    { label: "5 minutes", value: 300 },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
        <ScrollView
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        >
          {/* Header with Back Button */}
          <View className="mb-8 mt-4">
            <Pressable onPress={() => router.back()} className="mb-4">
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <View>
              <Text
                className="text-3xl text-white leading-10 mb-0"
                style={{ fontFamily: "BankGothicBold" }}
              >
                Upload artwork
              </Text>
              <Text className="text-base text-gray-300 leading-6">
                Add your art and create your carousel
              </Text>
            </View>
          </View>

          {/* Frame Timing */}
          <View className="mb-5">
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
          </View>

          {/* Grey Boxes */}
          <View className="bg-neutral-800 rounded-lg p-6 mb-4 border border-neutral-700 h-40 justify-center items-center">
            <CloudUpload size={30} color="#ffffff" />
            <Text className="text-white mt-4 text-center font-semibold">
              Click to upload file or drag and drop
            </Text>
            <Text className="text-gray-400 mt-1 text-center text-xs">
              PNG or JPG (max. 800x400px)
            </Text>
          </View>

          <View className="bg-neutral-800 rounded-lg p-6 mb-10 border border-neutral-700">
            <Text className="text-white font-semibold text-base mb-3">
              Artwork Upload Requirements:
            </Text>
            <View className="gap-2">
              <View className="flex-row items-start">
                <Text className="text-gray-400 mr-2">•</Text>
                <Text className="text-gray-400 text-sm flex-1">
                  Images only: .JPG, .PNG, .TIFF
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-gray-400 mr-2">•</Text>
                <Text className="text-gray-400 text-sm flex-1">
                  Min size: 3000x3000px
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-gray-400 mr-2">•</Text>
                <Text className="text-gray-400 text-sm flex-1">
                  Min resolution: 300DPI
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-gray-400 mr-2">•</Text>
                <Text className="text-gray-400 text-sm flex-1">
                  No watermarks or borders
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-gray-400 mr-2">•</Text>
                <Text className="text-gray-400 text-sm flex-1">
                  Max file size: 25 MB
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            className="rounded-xl justify-center items-center bg-orange-600"
            style={{ minHeight: 60 }}
            onPress={() => {
              // Handle create action
            }}
          >
            <Text className="text-base font-bold text-white">
              Create Carousel
            </Text>
          </Pressable>
        </ScrollView>

        {/* Frame Timing Dropdown Modal */}
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
                  className={`py-4 px-4 rounded-lg mb-1 ${
                    frameTiming === opt.value ? "bg-orange-600/20" : ""
                  }`}
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
      </View>
    </TouchableWithoutFeedback>
  );
}
