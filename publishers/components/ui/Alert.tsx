/* eslint-disable react-hooks/exhaustive-deps */
import { MaterialIcons } from "@expo/vector-icons";
import { LucideIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AlertProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number; // Auto-dismiss duration in ms (default: 5000)
  icon?: LucideIcon; // Lucide icon component
  iconColor?: string; // Icon color (default: #000000)
}

export const Alert: React.FC<AlertProps> = ({
  message,
  visible,
  onClose,
  duration = 5000,
  icon: IconComponent,
  iconColor = "#000000",
}) => {
  const [slideAnim] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();

      // Auto-dismiss timer
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      onClose();
    });
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 0],
  });

  const opacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          top: insets.top + 12,
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.alertBox}>
        {IconComponent && (
          <View style={styles.iconContainer}>
            <IconComponent size={24} color={iconColor} />
          </View>
        )}
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#000000" />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    pointerEvents: "box-none",
  },
  alertBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
    marginRight: 12,
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
});
