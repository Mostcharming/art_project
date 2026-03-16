import { Alert } from "@/components/ui/Alert";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Nigeria",
  "South Africa",
  "Ghana",
  "Kenya",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Australia",
  "Japan",
  "South Korea",
  "Brazil",
  "Mexico",
  "India",
  "UAE",
  "Singapore",
];

export default function CreateCarousel() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [carouselName, setCarouselName] = useState("");
  const [carouselTag, setCarouselTag] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const descriptionRef = useRef<TextInput>(null);

  const isFormValid = carouselName.trim() !== "" && country.trim() !== "";
  const isDisabled = !isFormValid;

  const handleCreate = async () => {
    if (!carouselName.trim()) {
      setAlertMessage("Please enter a carousel name");
      setAlertVisible(true);
      return;
    }

    if (!country.trim()) {
      setAlertMessage("Please select a country");
      setAlertVisible(true);
      return;
    }

    // Navigate to upload artwork page
    router.push("/upload-artwork");
  };

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
            <Pressable
              onPress={() => router.replace("/dashboard")}
              className="mb-4"
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <View>
              <Text
                className="text-3xl text-white leading-10 mb-0"
                style={{ fontFamily: "BankGothicBold" }}
              >
                Create Carousel
              </Text>
              <Text className="text-base text-gray-300 leading-6">
                create a new art to share with your viewers
              </Text>
            </View>
          </View>

          {/* Carousel Name */}
          <View className="mb-5">
            <Text className="text-sm text-white mb-2">Carousel Name</Text>
            <View className="flex-row items-center rounded-lg px-4 bg-neutral-700">
              <TextInput
                className="flex-1 py-4 text-base text-white"
                placeholder="Enter carousel name"
                placeholderTextColor="#666666"
                value={carouselName}
                onChangeText={setCarouselName}
                autoCapitalize="words"
              />
            </View>
            <Text className="text-xs mt-2 leading-5 text-gray-400">
              A descriptive name that your viewers will see
            </Text>
          </View>

          {/* Carousel Tag */}
          <View className="mb-5">
            <Text className="text-sm text-white mb-2">
              Carousel Tag (optional)
            </Text>
            <View className="flex-row items-center rounded-lg px-4 bg-neutral-700">
              <TextInput
                className="flex-1 py-4 text-base text-white"
                placeholder="Enter tag"
                placeholderTextColor="#666666"
                value={carouselTag}
                onChangeText={setCarouselTag}
                autoCapitalize="words"
              />
            </View>
            <Text className="text-xs mt-2 leading-5 text-gray-400">
              This allows you to group similar carousels together
            </Text>
          </View>

          {/* Country */}
          <View className="mb-5">
            <Text className="text-sm text-white mb-2">Country</Text>
            <Pressable
              className="flex-row items-center justify-between rounded-lg px-4 py-4 bg-neutral-700"
              onPress={() => setShowCountryDropdown(true)}
            >
              <Text
                className={`text-base ${country ? "text-white" : "text-neutral-500"}`}
              >
                {country || "Select your country"}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="#999999"
              />
            </Pressable>
          </View>

          {/* Description */}
          <View className="mb-5">
            <Text className="text-sm text-white mb-2">Description</Text>
            <View className="rounded-lg px-4 bg-neutral-700">
              <TextInput
                ref={descriptionRef}
                className="py-4 text-base text-white"
                placeholder="Describe your carousel..."
                placeholderTextColor="#666666"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ minHeight: 120 }}
              />
            </View>
          </View>

          <Pressable
            className="mt-4 mb-10 rounded-xl justify-center items-center bg-orange-600"
            style={{ minHeight: 60 }}
            disabled={isDisabled}
            onPress={handleCreate}
          >
            <Text className="text-base font-bold text-white">
              Continue to upload artwork
            </Text>
          </Pressable>
        </ScrollView>

        {/* Country Dropdown Modal */}
        <Modal
          visible={showCountryDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCountryDropdown(false)}
        >
          <Pressable
            className="flex-1 bg-black/70 justify-end"
            onPress={() => setShowCountryDropdown(false)}
          >
            <View
              className="bg-neutral-800 rounded-t-2xl pb-8 pt-4 px-5"
              style={{ maxHeight: "60%" }}
            >
              <View className="w-10 h-1 bg-neutral-600 rounded-full self-center mb-4" />
              <Text className="text-lg text-white font-bold mb-4">
                Select Country
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {COUNTRIES.map((c) => (
                  <Pressable
                    key={c}
                    className={`py-4 px-4 rounded-lg mb-1 ${
                      country === c ? "bg-orange-600/20" : ""
                    }`}
                    onPress={() => {
                      setCountry(c);
                      setShowCountryDropdown(false);
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base text-white">{c}</Text>
                      {country === c && (
                        <MaterialIcons name="check" size={20} color="#EA580C" />
                      )}
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
        <Alert
          message={alertMessage}
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          duration={3000}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
