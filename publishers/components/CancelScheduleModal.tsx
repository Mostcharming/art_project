import { Carousel } from "@/hooks/useCarouselList";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface CancelScheduleModalProps {
  visible: boolean;
  carousel: Carousel | null;
  onClose: () => void;
  onConfirmCancel: (carousel: Carousel) => void;
  onSaveAsDraft?: (carousel: Carousel) => void;
  isLoading?: boolean;
}

export const CancelScheduleModal: React.FC<CancelScheduleModalProps> = ({
  visible,
  carousel,
  onClose,
  onConfirmCancel,
  onSaveAsDraft,
  isLoading = false,
}) => {
  if (!carousel) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.95)" }}
        onPress={onClose}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Pressable
            style={{
              backgroundColor: "#262626",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingVertical: 24,
              paddingBottom: 32,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: "#525252",
                borderRadius: 2,
                alignSelf: "center",
                marginBottom: 16,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 22,
                  fontFamily: "BankGothicBold",
                }}
              >
                Cancel schedule
              </Text>
              <Pressable onPress={onClose} disabled={isLoading}>
                <MaterialIcons name="close" size={24} color="#ffffff" />
              </Pressable>
            </View>

            {/* Description */}
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 14,
                lineHeight: 20,
                marginBottom: 24,
              }}
            >
              Are you sure you want to cancel this scheduled post? Once
              canceled, this post would be discarded automatically. You will
              need to schedule it again.
            </Text>

            {/* Action Buttons */}
            <View style={{ gap: 12 }}>
              {/* Delete Button */}
              <Pressable
                onPress={() => {
                  onConfirmCancel(carousel);
                }}
                disabled={isLoading}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: "#fbc4cd",
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 50,
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    color: isLoading ? "#9CA3AF" : "red",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {isLoading ? "Canceling..." : "Yes, cancel schedule"}
                </Text>
              </Pressable>

              {/* Save as Draft Button */}
              {onSaveAsDraft && (
                <Pressable
                  className="border border-gray-700 "
                  onPress={() => {
                    onSaveAsDraft(carousel);
                  }}
                  disabled={isLoading}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 50,
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  <Text
                    style={{
                      color: "#d8522e",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Save as draft
                  </Text>
                </Pressable>
              )}
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};
