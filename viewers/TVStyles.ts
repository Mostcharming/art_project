/**
 * Android TV Styles
 * Optimized for TV remote navigation and large screens
 */

import { StyleSheet } from 'react-native';

export const TVColors = {
  colorPrimary: '#ff6b35',
  colorSecondary: '#004e89',
  colorBackground: '#0a0a0a',
  colorSurface: '#1a1a1a',
  colorText: '#ffffff',
  colorTextSecondary: '#cccccc',
};

export const TVStyles = StyleSheet.create({
  // Focus management
  focusable: {
    outlineWidth: 3,
    outlineColor: '#ff6b35',
  },

  // Safe areas for TV overscan
  safeArea: {
    marginHorizontal: 48,
    marginVertical: 27,
  },

  // Text sizes optimized for distance viewing
  textLarge: {
    fontSize: 36,
    fontWeight: '600',
  },

  textMedium: {
    fontSize: 24,
    fontWeight: '500',
  },

  textSmall: {
    fontSize: 16,
    fontWeight: '400',
  },

  // Touch target sizes (minimum 48dp for TV)
  touchTarget: {
    minWidth: 48,
    minHeight: 48,
  },
});

export default TVStyles;
