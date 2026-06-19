/* eslint-disable react-hooks/exhaustive-deps */
import { LucideIcon } from "lucide-react-native";
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
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
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Toast.show({
        type: "publisherAlert",
        text1: message,
        position: "top",
        topOffset: insets.top + 12,
        visibilityTime: duration,
        autoHide: true,
        props: {
          icon: IconComponent,
          iconColor,
          onClose: handleClose,
        },
        onHide: onClose,
      });
    } else {
      Toast.hide();
    }
  }, [visible, message]);

  const handleClose = () => {
    Toast.hide();
    onClose();
  };

  return null;
};
