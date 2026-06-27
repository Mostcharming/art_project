import { Carousel } from "@/hooks/useCarouselList";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface DeleteConfirmationModalProps {
  visible: boolean;
  carousel: Carousel | null;
  onClose: () => void;
  onConfirmDelete: (carousel: Carousel) => void;
  onMoveToDraft?: (carousel: Carousel) => void;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({ visible, carousel, onClose, onConfirmDelete, onMoveToDraft }) => {
  if (!carousel) return null;

  const isDraft = carousel.status === "draft";

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
                  // fontWeight: "700",
                  fontFamily: "BankGothicBold",
                }}
              >
                Delete carousel
              </Text>
              <Pressable onPress={onClose}>
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
              Not every stroke makes the final piece. You can let this one go —
              or save it for later inspiration.
            </Text>

            {/* Action Buttons */}
            <View style={{ gap: 12 }}>
              {/* Delete Button */}
              <Pressable
                onPress={() => {
                  onConfirmDelete(carousel);
                  onClose();
                }}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: "#fbc4cd",
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 50,
                }}
              >
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Delete carousel
                </Text>
              </Pressable>

              {/* Move to Draft Button - Only show if not already a draft */}
              {!isDraft && onMoveToDraft && (
                <Pressable
                  className="border border-gray-700 "
                  onPress={() => {
                    onMoveToDraft(carousel);
                    onClose();
                  }}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    // backgroundColor: "#404040",
                    borderRadius: 12,

                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 50,
                  }}
                >
                  <Text
                    style={{
                      color: "#d8522e",
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Move to draft
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
