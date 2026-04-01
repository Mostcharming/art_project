import { useApiMutate } from "@/hooks/useApiMutate";
import { useUserStore } from "@/store/userStore";
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

const PERSONA_TYPES = ["Artist", "Gallery", "Collector"];

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

export default function AccountSetup() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const updateUser = useUserStore((state) => state.updateUser);
  const { mutate, isLoading } = useApiMutate();

  const [persona, setPersona] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bioRef = useRef<TextInput>(null);

  const isFormValid =
    persona.trim() !== "" && name.trim() !== "" && country.trim() !== "";
  const isDisabled = isLoading || !isFormValid;

  const handleProceed = async () => {
    if (!isFormValid) return;

    setError(null);

    const response = await mutate("/auth/complete-profile-setup", {
      method: "POST",
      dataType: "json",
      payload: {
        personaType: persona,
        name,
        country,
        bio,
      },
    });

    if (response.error) {
      console.error("Account setup error:", response);
      setError("Something went wrong. Please try again.");
    } else {
      updateUser({
        personaType: persona,
        name,
        country,
        bio,
        accountSetupComplete: true,
      });
      router.replace("/welcome");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
        {/* Back button */}
        <View className="flex-row items-center py-4 px-5">
          <Pressable className="p-2" onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-8">
            <Text
              className="text-3xl text-white leading-10 mb-0"
              style={{ fontFamily: "BankGothicBold" }}
            >
              Tell us about you
            </Text>
            <Text className="text-base text-gray-300 leading-6">
              We would like to get to know you a little more
            </Text>
          </View>

          {/* Select Persona */}
          <View className="mb-5">
            <Text className="text-sm text-white mb-2">Select Persona</Text>
            <Pressable
              className="flex-row items-center justify-between rounded-lg px-4 py-4 bg-neutral-700"
              onPress={() => setShowPersonaDropdown(true)}
            >
              <Text
                className={`text-base ${
                  persona ? "text-white" : "text-neutral-500"
                }`}
              >
                {persona || "Choose your persona"}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="#999999"
              />
            </Pressable>
          </View>

          {/* Name */}
          <View className="mb-5">
            <Text className="text-sm text-white mb-2">Name</Text>
            <View className="flex-row items-center rounded-lg px-4 bg-neutral-700">
              <TextInput
                className="flex-1 py-4 text-base text-white"
                placeholder="Enter your full name"
                placeholderTextColor="#666666"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Country */}
          <View className="mb-5">
            <Text className="text-sm text-white mb-2">Country</Text>
            <Pressable
              className="flex-row items-center justify-between rounded-lg px-4 py-4 bg-neutral-700"
              onPress={() => setShowCountryDropdown(true)}
            >
              <Text
                className={`text-base ${
                  country ? "text-white" : "text-neutral-500"
                }`}
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

          {/* Bio */}
          <View className="mb-5">
            <Text className="text-sm text-white mb-2">Bio</Text>
            <View className="rounded-lg px-4 bg-neutral-700">
              <TextInput
                ref={bioRef}
                className="py-4 text-base text-white"
                placeholder="Tell us a little about yourself..."
                placeholderTextColor="#666666"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ minHeight: 120 }}
              />
            </View>
          </View>

          {error && (
            <Text className="text-xs text-red-500 mb-3 leading-5">{error}</Text>
          )}

          {/* Proceed Button */}
          <Pressable
            className={`mt-4 mb-10 rounded-xl justify-center items-center ${
              isDisabled ? "bg-orange-900" : "bg-orange-600"
            }`}
            style={{ minHeight: 60 }}
            disabled={isDisabled}
            onPress={handleProceed}
          >
            <Text
              className={`text-base font-bold ${
                isDisabled ? "text-amber-700" : "text-white"
              }`}
            >
              {isLoading ? "Setting up..." : "Proceed"}
            </Text>
          </Pressable>
        </ScrollView>

        {/* Persona Dropdown Modal */}
        <Modal
          visible={showPersonaDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPersonaDropdown(false)}
        >
          <Pressable
            className="flex-1 bg-black/70 justify-end"
            onPress={() => setShowPersonaDropdown(false)}
          >
            <View className="bg-neutral-800 rounded-t-2xl pb-8 pt-4 px-5">
              <View className="w-10 h-1 bg-neutral-600 rounded-full self-center mb-4" />
              <Text className="text-lg text-white font-bold mb-4">
                Select Persona
              </Text>
              {PERSONA_TYPES.map((type) => (
                <Pressable
                  key={type}
                  className={`py-4 px-4 rounded-lg mb-1 ${
                    persona === type ? "bg-orange-600/20" : ""
                  }`}
                  onPress={() => {
                    setPersona(type);
                    setShowPersonaDropdown(false);
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base text-white">{type}</Text>
                    {persona === type && (
                      <MaterialIcons name="check" size={20} color="#EA580C" />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>

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
      </View>
    </TouchableWithoutFeedback>
  );
}
