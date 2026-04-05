import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface SignInModalProps {
  visible: boolean;
  onSignUp?: () => void;
  onContinueAsGuest?: () => void;
  onClose?: () => void;
}

export default function SignInModal({
  visible,
  onSignUp,
  onContinueAsGuest,
  onClose,
}: SignInModalProps) {
  const [focusedButton, setFocusedButton] = useState<"signup" | "guest" | null>(
    null
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View
          className="relative flex flex-col items-center gap-8 rounded-2xl p-6 w-11/12 max-w-[535px]"
          style={{ backgroundColor: "#15171B" }}
        >
          {/* Close button */}
          <Pressable
            onPress={onClose}
            className="absolute top-5 right-5 p-2 z-10"
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M17 7L7 17M7 7L17 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>

          {/* Text content */}
          <View className="flex flex-col items-center gap-4 text-center w-full px-2 mt-4">
            <Text
              className="text-white text-2xl  tracking-widest uppercase w-full"
              style={{ fontFamily: "BankGothicBold", letterSpacing: 2 }}
            >
              Sign in to unlock feature
            </Text>
            <Text
              className="text-sm leading-6 w-full max-w-sm"
              style={{ color: "#D2D6DB" }}
            >
              You&apos;re exploring as a Guest. Sign up to save favorites, sync
              devices, unlock exclusive collections.
            </Text>
          </View>

          {/* Buttons */}
          <View className="flex flex-row gap-4 w-full px-2">
            {/* Sign up button */}
            <Pressable
              onPress={onSignUp}
              onFocus={() => setFocusedButton("signup")}
              onBlur={() => setFocusedButton(null)}
              className={`flex-1 h-12 rounded-full flex items-center justify-center transition-all ${
                focusedButton === "signup"
                  ? "ring-2 ring-orange-500 scale-105"
                  : ""
              }`}
              style={{
                backgroundColor: "#D8522E",
                borderWidth: 2,
                borderColor: "rgba(255, 255, 255, 0.12)",
              }}
            >
              <Text className="text-white text-base font-bold">Sign up</Text>
            </Pressable>

            {/* Continue as guest button */}
            <Pressable
              onPress={onContinueAsGuest}
              onFocus={() => setFocusedButton("guest")}
              onBlur={() => setFocusedButton(null)}
              className={`flex-1 h-12 rounded-full flex items-center justify-center transition-all ${
                focusedButton === "guest"
                  ? "ring-2 ring-orange-500 scale-105"
                  : ""
              }`}
              style={{
                borderWidth: 2,
                borderColor: "#D8522E",
              }}
            >
              <Text className="text-orange-600 text-base font-bold">
                Continue as guest
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
