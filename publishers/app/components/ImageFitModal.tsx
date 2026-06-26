import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  PanResponder,
  Pressable,
  Image as RNImage,
  Text,
  useWindowDimensions,
  View,
  type GestureResponderEvent,
} from "react-native";
import Svg, { Rect, Image as SvgImage } from "react-native-svg";

const SVG_EXPORT_TIMEOUT_MS = 10000;
const CROP_EPSILON = 0.5;

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
  const [isExportSvgReady, setIsExportSvgReady] = useState(false);
  const offsetRef = useRef(offset);
  const zoomRef = useRef(zoom);
  const exportSvgRef = useRef<Svg | null>(null);
  const gestureStartOffsetRef = useRef(offset);
  const gestureStartZoomRef = useRef(zoom);
  const gestureStartCenterRef = useRef({ x: 0, y: 0 });
  const pinchStartDistanceRef = useRef<number | null>(null);
  const touchCountRef = useRef(0);

  useEffect(() => {
    if (visible) {
      setOffset({ x: 0, y: 0 });
      setZoom(1);
      setIsExportSvgReady(false);
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

  const minZoom = useMemo(() => {
    if (!image?.width || !image?.height) return 1;

    const coverScale = Math.max(
      frameWidth / image.width,
      frameHeight / image.height,
    );
    const containScale = Math.min(
      frameWidth / image.width,
      frameHeight / image.height,
    );

    return containScale / coverScale;
  }, [frameHeight, frameWidth, image?.height, image?.width]);

  const getTouchDistance = useCallback(
    (touches: { pageX: number; pageY: number }[]): number | null => {
      if (touches.length < 2) return null;

      const [firstTouch, secondTouch] = touches;
      return Math.hypot(
        secondTouch.pageX - firstTouch.pageX,
        secondTouch.pageY - firstTouch.pageY,
      );
    },
    [],
  );

  const getTouchCenter = useCallback(
    (touches: { pageX: number; pageY: number }[]) => {
      if (touches.length === 0) return gestureStartCenterRef.current;

      const totals = touches.reduce(
        (sum, touch) => ({
          x: sum.x + touch.pageX,
          y: sum.y + touch.pageY,
        }),
        { x: 0, y: 0 },
      );

      return {
        x: totals.x / touches.length,
        y: totals.y / touches.length,
      };
    },
    [],
  );

  const beginGesture = useCallback(
    (event: GestureResponderEvent) => {
      const touches = event.nativeEvent.touches;

      touchCountRef.current = touches.length;
      gestureStartOffsetRef.current = offsetRef.current;
      gestureStartZoomRef.current = zoomRef.current;
      gestureStartCenterRef.current = getTouchCenter(touches);
      pinchStartDistanceRef.current = getTouchDistance(touches);
    },
    [getTouchCenter, getTouchDistance],
  );

  const clampOffset = useCallback(
    (nextOffset: { x: number; y: number }, nextZoom = zoom) => {
      const renderedWidth = baseSize.width * nextZoom;
      const renderedHeight = baseSize.height * nextZoom;
      const maxX = Math.max(0, (renderedWidth - frameWidth) / 2);
      const maxY = Math.max(0, (renderedHeight - frameHeight) / 2);

      return {
        x: Math.min(maxX, Math.max(-maxX, nextOffset.x)),
        y: Math.min(maxY, Math.max(-maxY, nextOffset.y)),
      };
    },
    [baseSize.height, baseSize.width, frameHeight, frameWidth, zoom],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: beginGesture,
        onPanResponderMove: (event) => {
          const touches = event.nativeEvent.touches;
          const currentCenter = getTouchCenter(touches);

          if (touches.length !== touchCountRef.current) {
            beginGesture(event);
            return;
          }

          const nextOffset = {
            x:
              gestureStartOffsetRef.current.x +
              (currentCenter.x - gestureStartCenterRef.current.x),
            y:
              gestureStartOffsetRef.current.y +
              (currentCenter.y - gestureStartCenterRef.current.y),
          };

          const pinchDistance = getTouchDistance(touches);
          if (
            touches.length > 1 &&
            pinchDistance &&
            pinchStartDistanceRef.current
          ) {
            const nextZoom = Math.min(
              3,
              Math.max(
                minZoom,
                gestureStartZoomRef.current *
                  (pinchDistance / pinchStartDistanceRef.current),
              ),
            );

            setZoom(nextZoom);
            setOffset(clampOffset(nextOffset, nextZoom));
            return;
          }

          setOffset(clampOffset(nextOffset));
        },
        onPanResponderRelease: () => {
          offsetRef.current = offset;
          pinchStartDistanceRef.current = null;
          touchCountRef.current = 0;
        },
        onPanResponderTerminate: () => {
          pinchStartDistanceRef.current = null;
          touchCountRef.current = 0;
        },
      }),
    [beginGesture, clampOffset, getTouchCenter, getTouchDistance, minZoom, offset],
  );

  const changeZoom = (delta: number) => {
    const nextZoom = Math.min(3, Math.max(minZoom, zoom + delta));
    setZoom(nextZoom);
    setOffset((current) => clampOffset(current, nextZoom));
  };

  const getExportLayout = () => {
    const outputScaleX = minWidth / frameWidth;
    const outputScaleY = minHeight / frameHeight;
    const renderedWidth = baseSize.width * zoom;
    const renderedHeight = baseSize.height * zoom;

    return {
      x: ((frameWidth - renderedWidth) / 2 + offset.x) * outputScaleX,
      y: ((frameHeight - renderedHeight) / 2 + offset.y) * outputScaleY,
      width: renderedWidth * outputScaleX,
      height: renderedHeight * outputScaleY,
    };
  };

  const getSourceCrop = () => {
    if (!image?.width || !image.height) return null;

    const renderedWidth = baseSize.width * zoom;
    const renderedHeight = baseSize.height * zoom;
    const imageLeft = (frameWidth - renderedWidth) / 2 + offset.x;
    const imageTop = (frameHeight - renderedHeight) / 2 + offset.y;
    const scaleX = renderedWidth / image.width;
    const scaleY = renderedHeight / image.height;

    if (!scaleX || !scaleY) return null;

    const rawOriginX = -imageLeft / scaleX;
    const rawOriginY = -imageTop / scaleY;
    const rawWidth = frameWidth / scaleX;
    const rawHeight = frameHeight / scaleY;
    const hasPadding =
      rawOriginX < -CROP_EPSILON ||
      rawOriginY < -CROP_EPSILON ||
      rawOriginX + rawWidth > image.width + CROP_EPSILON ||
      rawOriginY + rawHeight > image.height + CROP_EPSILON;

    if (hasPadding) return null;

    const originX = Math.max(0, Math.round(rawOriginX));
    const originY = Math.max(0, Math.round(rawOriginY));

    return {
      originX,
      originY,
      width: Math.max(
        1,
        Math.min(image.width - originX, Math.round(rawWidth)),
      ),
      height: Math.max(
        1,
        Math.min(image.height - originY, Math.round(rawHeight)),
      ),
    };
  };

  const exportCroppedImage = async () => {
    if (!image?.uri) return null;

    const crop = getSourceCrop();
    if (!crop) return null;

    return ImageManipulator.manipulateAsync(
      image.uri,
      [
        { crop },
        { resize: { width: minWidth, height: minHeight } },
      ],
      {
        compress: 1,
        format: ImageManipulator.SaveFormat.PNG,
      },
    );
  };

  const exportSvgToFile = async () => {
    const svg = exportSvgRef.current;
    if (!svg || !FileSystem.cacheDirectory) {
      throw new Error("Image export is not available on this device.");
    }

    if (!isExportSvgReady) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("SVG export timed out."));
      }, SVG_EXPORT_TIMEOUT_MS);

      try {
        svg.toDataURL((data) => {
          clearTimeout(timeout);
          const [, encodedData = data] = data.split(",");

          if (!encodedData) {
            reject(new Error("SVG export returned empty data."));
            return;
          }

          resolve(encodedData);
        }, {
          width: minWidth,
          height: minHeight,
        });
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });

    const outputUri = `${FileSystem.cacheDirectory}carsl-fitted-${Date.now()}.png`;
    await FileSystem.writeAsStringAsync(outputUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return outputUri;
  };

  const handleConfirm = async () => {
    if (!image?.uri || !image.width || !image.height) return;

    setIsProcessing(true);
    try {
      let result: ImageManipulator.ImageResult | null = null;

      try {
        result = await exportCroppedImage();
      } catch (error) {
        console.warn("Native image crop failed, falling back to SVG:", error);
      }

      if (!result) {
        const exportedUri = await exportSvgToFile();
        result = await ImageManipulator.manipulateAsync(exportedUri, [], {
          compress: 1,
          format: ImageManipulator.SaveFormat.PNG,
        });
      }

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
            <RNImage
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

        {image && (
          <View
            pointerEvents="none"
            collapsable={false}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1,
              height: 1,
              opacity: 0.01,
              overflow: "hidden",
            }}
          >
            <Svg
              ref={exportSvgRef}
              collapsable={false}
              width={minWidth}
              height={minHeight}
            >
              <Rect width={minWidth} height={minHeight} fill="#000000" />
              <SvgImage
                href={{ uri: image.uri }}
                x={getExportLayout().x}
                y={getExportLayout().y}
                width={getExportLayout().width}
                height={getExportLayout().height}
                onLoad={() => setIsExportSvgReady(true)}
                preserveAspectRatio="none"
              />
            </Svg>
          </View>
        )}

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
