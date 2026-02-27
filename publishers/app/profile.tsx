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

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [persona, setPersona] = useState(user?.personaType || "");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState(user?.country || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bioRef = useRef<TextInput>(null);

  const { mutate, isLoading } = useApiMutate();

  const isFormValid =
    persona.trim() !== "" &&
    name.trim() !== "" &&
    email.trim() !== "" &&
    country.trim() !== "";
  const isDisabled = !isFormValid;

  const handleSave = async () => {
    if (!isFormValid) return;
    setError(null);

    const response = await mutate("/update-profile", {
      method: "PATCH",
      dataType: "json",
      payload: {
        name,
        personaType: persona,
        country,
        bio,
        password,
      },
    });

    if (response.error) {
      setError(response.error || "Failed to update profile. Please try again.");
      return;
    }

    updateUser({
      name,
      personaType: persona,
      country,
      bio,
    });
    // Show alert for success (replacing Toast)
    alert("Profile updated! Your profile changes have been saved.");
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
          <View className="mb-8 mt-4">
            <Text
              className="text-3xl text-white leading-10 mb-0"
              style={{ fontFamily: "BankGothicBold" }}
            >
              Profile
            </Text>
            <Text className="text-base text-gray-300 leading-6">
              Manage your profile information
            </Text>
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

          {/* Email */}
          <View className="mb-5">
            <Text className="text-sm text-white mb-2">Email Address</Text>
            <View className="flex-row items-center rounded-lg px-4 bg-neutral-700">
              <TextInput
                className="flex-1 py-4 text-base text-white"
                placeholder="Enter your email"
                placeholderTextColor="#666666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={false}
              />
            </View>
          </View>

          {/* Password */}
          <View className="mb-5">
            <Text className="text-sm text-white mb-2">Password</Text>
            <View className="flex-row items-center rounded-lg px-4 bg-neutral-700">
              <TextInput
                className="flex-1 py-4 text-base text-white"
                placeholder="Enter new password"
                placeholderTextColor="#666666"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry={!showPassword}
              />
              <Pressable
                className="p-2"
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={18}
                  color="#99999966"
                />
              </Pressable>
            </View>
            <Text className="text-xs mt-2 leading-5 text-gray-400">
              At least 8 letters, 1 special character *%#@!
            </Text>
            {/* Validation indicators */}
            {password.length > 0 && (
              <View className="mt-2">
                <View className="flex-row items-center mb-1">
                  <MaterialIcons
                    name={password.length >= 8 ? "check-circle" : "cancel"}
                    size={14}
                    color={password.length >= 8 ? "#22c55e" : "#ef4444"}
                  />
                  <Text
                    className={`text-xs ml-1 ${
                      password.length >= 8 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    At least 8 characters
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialIcons
                    name={/[*%#@!]/.test(password) ? "check-circle" : "cancel"}
                    size={14}
                    color={/[*%#@!]/.test(password) ? "#22c55e" : "#ef4444"}
                  />
                  <Text
                    className={`text-xs ml-1 ${
                      /[*%#@!]/.test(password)
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    At least 1 special character (*%#@!)
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Select Persona */}
          <View className="mb-5">
            <Text className="text-sm text-white mb-2">Select Persona</Text>
            <Pressable
              className="flex-row items-center justify-between rounded-lg px-4 py-4 bg-neutral-700"
              onPress={() => setShowPersonaDropdown(true)}
            >
              <Text
                className={`text-base ${persona ? "text-white" : "text-neutral-500"}`}
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

          <Pressable
            className={`mt-4 mb-10 rounded-xl justify-center items-center ${
              isDisabled || isLoading ? "bg-orange-900" : "bg-orange-600"
            }`}
            style={{ minHeight: 60 }}
            disabled={isDisabled || isLoading}
            onPress={handleSave}
          >
            <Text
              className={`text-base font-bold ${
                isDisabled || isLoading ? "text-amber-700" : "text-white"
              }`}
            >
              {isLoading ? "Saving..." : "Save Changes"}
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
