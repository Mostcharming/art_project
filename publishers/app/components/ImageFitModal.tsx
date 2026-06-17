import * as ImageManipulator from "expo-image-manipulator";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Modal,
  PanResponder,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

export interface FittedImage {
  uri: string;
  width: number;
  height: number;
  fileSize: number;
}

interface SourceImage {
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
}

interface ImageFitModalProps {
  visible: boolean;
  image: SourceImage | null;
  minWidth: number;
  minHeight: number;
  onCancel: () => void;
  onConfirm: (image: FittedImage) => void;
  onError: (message: string) => void;
}

export default function ImageFitModal({
  visible,
  image,
  minWidth,
  minHeight,
  onCancel,
  onConfirm,
  onError,
}: ImageFitModalProps) {
  const { width: screenWidth } = useWindowDimensions();
  const frameWidth = Math.min(screenWidth - 40, 420);
  const frameHeight = frameWidth * (minHeight / minWidth);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const offsetRef = useRef(offset);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    if (visible) {
      setOffset({ x: 0, y: 0 });
      setZoom(1);
    }
  }, [visible, image?.uri]);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const baseSize = useMemo(() => {
    if (!image?.width || !image?.height) {
      return { width: frameWidth, height: frameHeight };
    }

    const scale = Math.max(
      frameWidth / image.width,
      frameHeight / image.height,
    );
    return {
      width: image.width * scale,
      height: image.height * scale,
    };
  }, [frameHeight, frameWidth, image?.height, image?.width]);

  const clampOffset = (
    nextOffset: { x: number; y: number },
    nextZoom = zoom,
  ) => {
    const renderedWidth = baseSize.width * nextZoom;
    const renderedHeight = baseSize.height * nextZoom;
    const maxX = Math.max(0, (renderedWidth - frameWidth) / 2);
    const maxY = Math.max(0, (renderedHeight - frameHeight) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, nextOffset.x)),
      y: Math.min(maxY, Math.max(-maxY, nextOffset.y)),
    };
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,
        onPanResponderMove: (_, gesture) => {
          setOffset(
            clampOffset({
              x: offsetRef.current.x + gesture.dx,
              y: offsetRef.current.y + gesture.dy,
            }),
          );
        },
        onPanResponderRelease: () => {
          offsetRef.current = offset;
        },
      }),
    [baseSize.width, baseSize.height, frameHeight, frameWidth, offset],
  );

  const changeZoom = (delta: number) => {
    const nextZoom = Math.min(3, Math.max(1, zoom + delta));
    setZoom(nextZoom);
    setOffset((current) => clampOffset(current, nextZoom));
  };

  const handleConfirm = async () => {
    if (!image?.uri || !image.width || !image.height) return;

    setIsProcessing(true);
    try {
      const renderedWidth = baseSize.width * zoom;
      const renderedHeight = baseSize.height * zoom;
      const scaleX = image.width / renderedWidth;
      const scaleY = image.height / renderedHeight;
      const visibleWidth = frameWidth * scaleX;
      const visibleHeight = frameHeight * scaleY;
      const originX = (renderedWidth - frameWidth) / 2 - offset.x;
      const originY = (renderedHeight - frameHeight) / 2 - offset.y;

      const crop = {
        originX: Math.max(
          0,
          Math.min(image.width - visibleWidth, originX * scaleX),
        ),
        originY: Math.max(
          0,
          Math.min(image.height - visibleHeight, originY * scaleY),
        ),
        width: Math.min(image.width, visibleWidth),
        height: Math.min(image.height, visibleHeight),
      };

      const result = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ crop }, { resize: { width: minWidth, height: minHeight } }],
        {
          compress: 0.95,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      onConfirm({
        uri: result.uri,
        width: result.width || minWidth,
        height: result.height || minHeight,
        fileSize: image.fileSize || 0,
      });
    } catch (error) {
      console.error("Image fit failed:", error);
      onError("Failed to prepare image. Please try another image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/90 justify-center px-5">
        <Text
          className="text-white text-lg mb-2"
          style={{ fontFamily: "BankGothicBold" }}
        >
          Fit artwork
        </Text>
        <Text className="text-gray-300 text-sm mb-4">
          Drag the image to fit inside the rectangle. Use zoom to fill the box
          before continuing.
        </Text>

        <View
          className="self-center overflow-hidden border-2 border-orange-600 bg-black"
          style={{ width: frameWidth, height: frameHeight }}
          {...panResponder.panHandlers}
        >
          {image && (
            <Image
              source={{ uri: image.uri }}
              style={{
                position: "absolute",
                width: baseSize.width * zoom,
                height: baseSize.height * zoom,
                left: (frameWidth - baseSize.width * zoom) / 2 + offset.x,
                top: (frameHeight - baseSize.height * zoom) / 2 + offset.y,
              }}
              resizeMode="cover"
            />
          )}
        </View>

        <View className="flex-row gap-3 mt-5">
          <Pressable
            className="flex-1 rounded-xl items-center justify-center border border-neutral-700"
            style={{ minHeight: 48 }}
            onPress={() => changeZoom(-0.1)}
          >
            <Text className="text-white text-base">Zoom out</Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-xl items-center justify-center border border-neutral-700"
            style={{ minHeight: 48 }}
            onPress={() => changeZoom(0.1)}
          >
            <Text className="text-white text-base">Zoom in</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-3 mt-4">
          <Pressable
            className="flex-1 rounded-xl items-center justify-center border-2 border-[#FFFFFF1A]"
            style={{ minHeight: 56 }}
            disabled={isProcessing}
            onPress={onCancel}
          >
            <Text className="text-orange-600 text-base">Cancel</Text>
          </Pressable>
          <Pressable
            className="flex-1 rounded-xl items-center justify-center bg-orange-600"
            style={{ minHeight: 56, opacity: isProcessing ? 0.6 : 1 }}
            disabled={isProcessing}
            onPress={handleConfirm}
          >
            <Text className="text-white text-base">
              {isProcessing ? "Preparing..." : "Use Image"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
