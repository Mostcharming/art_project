import { X } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
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
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.77)",
        paddingTop: topInset,
        zIndex: 50,
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
  );
}
