import { CloudUpload } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface ArtworkUploadPromptProps {
  onPress: () => void;
}

export default function ArtworkUploadPrompt({ onPress }: ArtworkUploadPromptProps) {
  return (
    <>
      <Pressable
        onPress={onPress}
        className="bg-neutral-800 rounded-lg p-6 mb-4 border border-neutral-700 h-40 justify-center items-center"
      >
        <CloudUpload size={30} color="#ffffff" />
        <Text className="text-white mt-4 text-center font-semibold">
          Tap to upload artwork
        </Text>
        <Text className="text-gray-400 mt-1 text-center text-xs">
          PNG, JPG, or TIFF (auto-fitted to 1920x1080px)
        </Text>
      </Pressable>

      <View className="bg-neutral-800 rounded-lg p-6 mb-10 border border-neutral-700">
        <Text className="text-white font-semibold text-base mb-3">
          Artwork Upload Requirements:
        </Text>
        <View className="gap-2">
          {[
            "Images only: .JPG, .PNG, .TIFF",
            "Auto-fitted to 1920x1080px (Full HD)",
            "Min resolution: 300DPI",
            "No watermarks or borders",
          ].map((requirement) => (
            <View key={requirement} className="flex-row items-start">
              <Text className="text-gray-400 mr-2">•</Text>
              <Text className="text-gray-400 text-sm flex-1">
                {requirement}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}
