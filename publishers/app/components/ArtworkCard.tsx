import { UploadedArtwork } from "@/types";
import { Grip, Trash2 } from "lucide-react-native";
import type { GestureResponderHandlers } from "react-native";
import { Image, Pressable, Text, View } from "react-native";

interface ArtworkCardProps {
  artwork: UploadedArtwork;
  index: number;
  dragHandlers?: GestureResponderHandlers;
  onDelete: (index: number) => void;
  isDragging?: boolean;
}

export default function ArtworkCard({
  artwork,
  index,
  dragHandlers,
  onDelete,
  isDragging = false,
}: ArtworkCardProps) {
  return (
    <View
      className={`rounded-lg p-4 flex-row items-center gap-4 border transition-all ${
        isDragging
          ? "bg-orange-600/20 border-orange-600 shadow-lg"
          : "bg-neutral-800 border-neutral-700"
      }`}
      style={{
        elevation: isDragging ? 10 : 2,
        shadowColor: isDragging ? "#ea580c" : "#000",
        shadowOffset: { width: 0, height: isDragging ? 4 : 2 },
        shadowOpacity: isDragging ? 0.4 : 0.25,
        shadowRadius: isDragging ? 8 : 4,
      }}
    >
      {/* Drag Handle Icon */}
      <View
        className={`justify-center items-center ${
          isDragging ? "opacity-100" : "opacity-60"
        }`}
        style={{ width: 36, height: 48 }}
        {...dragHandlers}
      >
        <Grip
          size={20}
          color={isDragging ? "#ea580c" : "#9ca3af"}
          strokeWidth={2.5}
        />
      </View>

      {/* Image Thumbnail */}
      <Image
        source={{ uri: artwork.uri || artwork.imageUrl || "" }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          opacity: isDragging ? 0.8 : 1,
        }}
        resizeMode="cover"
      />

      {/* Details - Stacked */}
      <View className="flex-1 gap-1">
        <Text className="text-gray-400 text-xs">
          {artwork.imageWidth}x{artwork.imageHeight}px
        </Text>
        <Text className="text-white text-sm font-bold">{artwork.title}</Text>
        <Text className="text-gray-300 text-xs">{artwork.artist}</Text>
      </View>

      {/* Delete Button */}
      <Pressable disabled={isDragging} onPress={() => onDelete(index)}>
        <Trash2 size={20} color="red" />
      </Pressable>
    </View>
  );
}
