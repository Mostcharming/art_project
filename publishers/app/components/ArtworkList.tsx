import { UploadedArtwork } from "@/types";
import { useEffect, useRef, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import ArtworkCard from "./ArtworkCard";

const ROW_HEIGHT = 128;
const LONG_PRESS_DELAY_MS = 180;
const REORDER_ANIMATION = {
  create: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  duration: 180,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

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
  onDragStateChange?: (isDragging: boolean) => void;
}

export default function ArtworkList({
  artworks,
  onArtworksChange,
  onAddClick,
  onDelete,
  onDragStateChange,
}: ArtworkListProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragLockIndex, setDragLockIndex] = useState<number | null>(null);
  const artworksRef = useRef(artworks);
  const onDragStateChangeRef = useRef(onDragStateChange);
  const dragStateRef = useRef<{
    active: boolean;
    currentIndex: number;
    initialIndex: number;
    startY: number;
    timeout: ReturnType<typeof setTimeout> | null;
  }>({
    active: false,
    currentIndex: -1,
    initialIndex: -1,
    startY: 0,
    timeout: null,
  });

  useEffect(() => {
    onDragStateChangeRef.current = onDragStateChange;
  }, [onDragStateChange]);

  useEffect(() => {
    artworksRef.current = artworks;
  }, [artworks]);

  useEffect(() => {
    return () => {
      if (dragStateRef.current.timeout) {
        clearTimeout(dragStateRef.current.timeout);
      }
      onDragStateChangeRef.current?.(false);
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
      startY: 0,
      timeout: null,
    };
    setDraggingIndex(null);
    setDragLockIndex(null);
    onDragStateChangeRef.current?.(false);
  };

  const handleDragStart = (index: number, pageY: number) => {
    if (dragStateRef.current.timeout) {
      clearTimeout(dragStateRef.current.timeout);
    }

    setDragLockIndex(index);
    onDragStateChangeRef.current?.(true);
    dragStateRef.current = {
      active: false,
      currentIndex: index,
      initialIndex: index,
      startY: pageY,
      timeout: setTimeout(() => {
        dragStateRef.current.active = true;
        setDraggingIndex(index);
      }, LONG_PRESS_DELAY_MS),
    };
  };

  const handleDragMove = (pageY: number) => {
    if (!dragStateRef.current.active || artworksRef.current.length < 2) {
      return;
    }

    const targetIndex = Math.max(
      0,
      Math.min(
        artworksRef.current.length - 1,
        dragStateRef.current.initialIndex +
          Math.round((pageY - dragStateRef.current.startY) / ROW_HEIGHT),
      ),
    );

    if (targetIndex === dragStateRef.current.currentIndex) {
      return;
    }

    LayoutAnimation.configureNext(REORDER_ANIMATION);
    moveArtwork(dragStateRef.current.currentIndex, targetIndex);
    dragStateRef.current.currentIndex = targetIndex;
    setDragLockIndex(targetIndex);
    setDraggingIndex(targetIndex);
  };

  const getArtworkKey = (artwork: UploadedArtwork, index: number) =>
    artwork.id ||
    artwork.uri ||
    artwork.imageUrl ||
    `${artwork.title}-${artwork.artist}-${index}`;

  return (
    <>
      {/* Header with Add Button */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Uploaded artworks</Text>
        <Pressable
          onPress={onAddClick}
          style={styles.addButton}
        >
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>Add artwork</Text>
        </Pressable>
      </View>

      {/* List of Uploaded Artworks */}
      <View style={styles.list}>
        {artworks.map((artwork, index) => (
          <View key={getArtworkKey(artwork, index)}>
            <ArtworkCard
              artwork={artwork}
              index={index}
              onDragEnd={finishDrag}
              onDragMove={handleDragMove}
              onDragStart={handleDragStart}
              onDelete={onDelete}
              isDragLocked={dragLockIndex === index}
              isDragging={draggingIndex === index}
            />
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addIcon: {
    color: "#ea580c",
    fontSize: 18,
    fontWeight: "700",
  },
  addText: {
    color: "#ea580c",
    fontSize: 14,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerText: {
    color: "#ffffff",
  },
  list: {
    gap: 16,
    marginBottom: 24,
  },
});
