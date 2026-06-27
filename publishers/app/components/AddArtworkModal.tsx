import { X } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";
import ArtworkUploadPrompt from "./ArtworkUploadPrompt";

interface AddArtworkModalProps {
  visible: boolean;
  topInset: number;
  onClose: () => void;
  onPickImage: () => void;
}

export default function AddArtworkModal({
  visible,
  topInset,
  onClose,
  onPickImage,
}: AddArtworkModalProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.77)",
          paddingTop: topInset,
        }}
      >
        <View className="flex-row items-center justify-between px-5 py-4">
          <Text
            className="text-white text-lg"
            style={{ fontFamily: "BankGothicBold" }}
          >
            Add Artwork
          </Text>
          <Pressable onPress={onClose}>
            <X size={24} color="#ffffff" />
          </Pressable>
        </View>

        <View className="px-5 py-6">
          <ArtworkUploadPrompt onPress={onPickImage} />
        </View>
      </View>
    </Modal>
  );
}
