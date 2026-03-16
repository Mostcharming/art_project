import { Carousel } from "@/hooks/useCarouselList";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface CarouselActionMenuProps {
  visible: boolean;
  carousel: Carousel | null;
  onClose: () => void;
  onMoveToDraft: (carousel: Carousel) => void;
  onEdit: (carousel: Carousel) => void;
  onDelete: (carousel: Carousel) => void;
}

export const CarouselActionMenu: React.FC<CarouselActionMenuProps> = ({
  visible,
  carousel,
  onClose,
  onMoveToDraft,
  onEdit,
  onDelete,
}) => {
  if (!carousel) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onPress={onClose}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#1a1a1a",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 40,
              paddingHorizontal: 20,
              paddingTop: 20,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {carousel.name}
              </Text>
            </View>

            {/* Actions */}
            <View style={{ gap: 12 }}>
              {/* Move to Draft */}
              <Pressable
                onPress={() => {
                  onMoveToDraft(carousel);
                  onClose();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: "#262626",
                  borderRadius: 12,
                  gap: 12,
                }}
              >
                <MaterialIcons name="archive" size={20} color="#9CA3AF" />
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  Move to Draft
                </Text>
              </Pressable>

              {/* Edit Carousel */}
              <Pressable
                onPress={() => {
                  onEdit(carousel);
                  onClose();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: "#262626",
                  borderRadius: 12,
                  gap: 12,
                }}
              >
                <MaterialIcons name="edit" size={20} color="#9CA3AF" />
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  Edit Carousel
                </Text>
              </Pressable>

              {/* Delete Carousel */}
              <Pressable
                onPress={() => {
                  onDelete(carousel);
                  onClose();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: "#262626",
                  borderRadius: 12,
                  gap: 12,
                }}
              >
                <MaterialIcons name="delete" size={20} color="#EF4444" />
                <Text
                  style={{
                    color: "#EF4444",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  Delete Carousel
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};
