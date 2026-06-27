import { UploadedArtwork } from "@/types";
import { Grip, Trash2 } from "lucide-react-native";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ArtworkCardProps {
  artwork: UploadedArtwork;
  index: number;
  onDelete: (index: number) => void;
  onDragEnd?: () => void;
  onDragMove?: (pageY: number) => void;
  onDragStart?: (index: number, pageY: number) => void;
  isDragLocked?: boolean;
  isDragging?: boolean;
}

export default function ArtworkCard({
  artwork,
  index,
  onDelete,
  onDragEnd,
  onDragMove,
  onDragStart,
  isDragLocked = false,
  isDragging = false,
}: ArtworkCardProps) {
  const dragProgress = useRef(new Animated.Value(isDragging ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(dragProgress, {
      toValue: isDragging ? 1 : 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  }, [dragProgress, isDragging]);

  const animatedCardStyle = {
    transform: [
      {
        translateY: dragProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
      {
        scale: dragProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.025],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.card,
        isDragging ? styles.cardDragging : styles.cardResting,
        animatedCardStyle,
      ]}
    >
      {/* Drag Handle Icon */}
      <View
        onMoveShouldSetResponder={() => true}
        onMoveShouldSetResponderCapture={() => true}
        onResponderGrant={(event) =>
          onDragStart?.(index, event.nativeEvent.pageY)
        }
        onResponderMove={(event) => onDragMove?.(event.nativeEvent.pageY)}
        onResponderRelease={onDragEnd}
        onResponderTerminate={onDragEnd}
        onResponderTerminationRequest={() => !isDragLocked}
        onStartShouldSetResponder={() => true}
        onStartShouldSetResponderCapture={() => true}
        style={[styles.dragHandle, isDragging && styles.dragHandleActive]}
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
        style={[styles.thumbnail, isDragging && styles.thumbnailDragging]}
        resizeMode="cover"
      />

      {/* Details - Stacked */}
      <View style={styles.details}>
        <Text style={styles.metaText}>
          {artwork.imageWidth}x{artwork.imageHeight}px
        </Text>
        <Text style={styles.titleText}>{artwork.title}</Text>
        <Text style={styles.artistText}>{artwork.artist}</Text>
      </View>

      {/* Delete Button */}
      <Pressable
        disabled={isDragging}
        onPress={() => onDelete(index)}
        style={styles.deleteButton}
      >
        <Trash2 size={20} color="red" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  artistText: {
    color: "#d1d5db",
    fontSize: 12,
  },
  card: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 16,
    padding: 16,
  },
  cardDragging: {
    backgroundColor: "rgba(234, 88, 12, 0.2)",
    borderColor: "#ea580c",
    elevation: 10,
    shadowColor: "#ea580c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  cardResting: {
    backgroundColor: "#262626",
    borderColor: "#404040",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  deleteButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  details: {
    flex: 1,
    gap: 4,
  },
  dragHandle: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    opacity: 0.6,
    width: 36,
  },
  dragHandleActive: {
    opacity: 1,
  },
  metaText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  thumbnail: {
    borderRadius: 8,
    height: 80,
    opacity: 1,
    width: 80,
  },
  thumbnailDragging: {
    opacity: 0.8,
  },
  titleText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
