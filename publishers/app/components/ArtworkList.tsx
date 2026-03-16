import { UploadedArtwork } from "@/types";
import { useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const dragStartY = useRef(0);
  const animationValues = useRef(artworks.map(() => new Animated.Value(0)));

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    setTargetIndex(null);
    dragStartY.current = 0;

    // Animate the dragged item
    Animated.spring(animationValues.current[index], {
      toValue: 10,
      useNativeDriver: true,
      bounciness: 8,
    }).start();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setTargetIndex(null);

      // Reset animation
      Animated.timing(animationValues.current[draggedIndex || 0], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return;
    }

    // Create new array with reordered items
    const newArtworks = [...artworks];
    const draggedItem = newArtworks[draggedIndex];
    newArtworks.splice(draggedIndex, 1);
    newArtworks.splice(dropIndex, 0, draggedItem);

    // Update display order with animation
    Animated.timing(animationValues.current[draggedIndex], {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    onArtworksChange(newArtworks);
    setDraggedIndex(null);
    setTargetIndex(null);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      Animated.timing(animationValues.current[draggedIndex], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    setDraggedIndex(null);
    setTargetIndex(null);
  };

  return (
    <>
      {/* Header with Add Button */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white font-semibold">Uploaded artworks</Text>
        <Pressable
          className="flex-row items-center gap-2 px-4 py-2"
          onPress={onAddClick}
        >
          <Text className="text-orange-600 text-lg font-bold">+</Text>
          <Text className="text-orange-600 text-sm font-semibold">
            Add artwork
          </Text>
        </Pressable>
      </View>

      {/* Drag Instructions */}
      {draggedIndex === null && artworks.length > 1 && (
        <View className="mb-4 px-4 py-2 bg-neutral-800 rounded-lg border border-neutral-700">
          <Text className="text-gray-400 text-xs text-center">
            💡 Long press an item and drag up/down to reorder your carousel
          </Text>
        </View>
      )}

      {/* List of Uploaded Artworks */}
      <View className="gap-4 mb-6">
        {artworks.map((artwork, index) => (
          <Animated.View
            key={index}
            style={{
              transform: [
                {
                  translateY:
                    draggedIndex === index
                      ? animationValues.current[index]
                      : new Animated.Value(0),
                },
              ],
              opacity: draggedIndex === index ? 0.7 : 1,
            }}
          >
            <Pressable
              onLongPress={() => handleDragStart(index)}
              onPressOut={() => {
                handleDrop(targetIndex ?? draggedIndex ?? index);
                handleDragEnd();
              }}
              delayLongPress={300}
            >
              <ArtworkCard
                artwork={artwork}
                index={index}
                onDelete={onDelete}
                isDragging={draggedIndex === index}
              />
            </Pressable>
            {/* Drop target indicator */}
            {targetIndex === index && draggedIndex !== null && (
              <Animated.View
                style={{
                  opacity: new Animated.Value(1),
                }}
              >
                <View className="h-2 bg-orange-600 rounded-full mt-2 mx-2" />
              </Animated.View>
            )}
          </Animated.View>
        ))}
      </View>
    </>
  );
}
