import { UploadedArtwork } from "@/types";
import { useEffect, useRef, useState } from "react";
import {
  LayoutAnimation,
  PanResponder,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from "react-native";
import ArtworkCard from "./ArtworkCard";

const ROW_HEIGHT = 128;
const LONG_PRESS_DELAY_MS = 180;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const artworksRef = useRef(artworks);
  const dragStateRef = useRef<{
    active: boolean;
    currentIndex: number;
    initialIndex: number;
    timeout: ReturnType<typeof setTimeout> | null;
  }>({
    active: false,
    currentIndex: -1,
    initialIndex: -1,
    timeout: null,
  });

  useEffect(() => {
    artworksRef.current = artworks;
  }, [artworks]);

  useEffect(() => {
    return () => {
      if (dragStateRef.current.timeout) {
        clearTimeout(dragStateRef.current.timeout);
      }
    };
  }, []);

  const moveArtwork = (fromIndex: number, toIndex: number) => {
    const nextArtworks = [...artworksRef.current];
    const [movedArtwork] = nextArtworks.splice(fromIndex, 1);
    nextArtworks.splice(toIndex, 0, movedArtwork);
    artworksRef.current = nextArtworks;
    onArtworksChange(nextArtworks);
  };

  const finishDrag = () => {
    if (dragStateRef.current.timeout) {
      clearTimeout(dragStateRef.current.timeout);
    }

    dragStateRef.current = {
      active: false,
      currentIndex: -1,
      initialIndex: -1,
      timeout: null,
    };
    setDraggingIndex(null);
  };

  const createDragHandlers = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (dragStateRef.current.timeout) {
          clearTimeout(dragStateRef.current.timeout);
        }

        dragStateRef.current = {
          active: false,
          currentIndex: index,
          initialIndex: index,
          timeout: setTimeout(() => {
            dragStateRef.current.active = true;
            setDraggingIndex(index);
          }, LONG_PRESS_DELAY_MS),
        };
      },
      onPanResponderMove: (_, gestureState) => {
        if (!dragStateRef.current.active || artworksRef.current.length < 2) {
          return;
        }

        const targetIndex = Math.max(
          0,
          Math.min(
            artworksRef.current.length - 1,
            dragStateRef.current.initialIndex +
              Math.round(gestureState.dy / ROW_HEIGHT),
          ),
        );

        if (targetIndex === dragStateRef.current.currentIndex) {
          return;
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        moveArtwork(dragStateRef.current.currentIndex, targetIndex);
        dragStateRef.current.currentIndex = targetIndex;
        setDraggingIndex(targetIndex);
      },
      onPanResponderRelease: finishDrag,
      onPanResponderTerminate: finishDrag,
      onPanResponderTerminationRequest: () => !dragStateRef.current.active,
      onShouldBlockNativeResponder: () => true,
    }).panHandlers;

  const getArtworkKey = (artwork: UploadedArtwork, index: number) =>
    artwork.id ||
    artwork.uri ||
    artwork.imageUrl ||
    `${artwork.title}-${artwork.artist}-${index}`;

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
          <View key={getArtworkKey(artwork, index)}>
            <ArtworkCard
              artwork={artwork}
              index={index}
              dragHandlers={createDragHandlers(index)}
              onDelete={onDelete}
              isDragging={draggingIndex === index}
            />
          </View>
        ))}
      </View>
    </>
  );
}
