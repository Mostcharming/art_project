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
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        onPress={onClose}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#000000",
              borderRadius: 20,
              paddingHorizontal: 24,
              paddingVertical: 32,
              width: "100%",
              maxWidth: 320,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Cancel Button */}
            <Pressable
              onPress={onClose}
              style={{
                alignSelf: "flex-end",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "#ffffff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="close" size={20} color="#000000" />
              </View>
            </Pressable>

            {/* Title */}
            <Text
              style={{
                color: "#ffffff",
                fontSize: 18,
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Delete carousel
            </Text>

            {/* Description */}
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 14,
                lineHeight: 20,
                textAlign: "center",
                marginBottom: 32,
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
                  backgroundColor: "#EF4444",
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 44,
                }}
              >
                <Text
                  style={{
                    color: "#ffffff",
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
                  onPress={() => {
                    onMoveToDraft(carousel);
                    onClose();
                  }}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    backgroundColor: "#262626",
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 44,
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
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
