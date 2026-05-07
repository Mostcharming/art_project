import { UploadedArtwork } from "@/types";
import { Pressable, Text, View } from "react-native";
import ArtworkCard from "./ArtworkCard";

interface ArtworkListProps {
  artworks: UploadedArtwork[];
  onArtworksChange: (artworks: UploadedArtwork[]) => void;
  onAddClick: () => void;
  onDelete: (index: number) => void;
}

export default function ArtworkList({
  artworks,
  onArtworksChange,
  onAddClick,
  onDelete,
}: ArtworkListProps) {
  return (
    <>
      {/* Header with Add Button */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white">Uploaded artworks</Text>
        <Pressable
          className="flex-row items-center gap-2 px-4 py-2"
          onPress={onAddClick}
        >
          <Text className="text-orange-600 text-lg font-bold">+</Text>
          <Text className="text-orange-600 text-sm">Add artwork</Text>
        </Pressable>
      </View>

      {/* List of Uploaded Artworks */}
      <View className="gap-4 mb-6">
        {artworks.map((artwork, index) => (
          <View key={index}>
            <ArtworkCard
              artwork={artwork}
              index={index}
              onDelete={onDelete}
              isDragging={false}
            />
          </View>
        ))}
      </View>
    </>
  );
}
