/**
 * Responsive Utility Functions
 *
 * Makes the app adapt to different screen sizes and devices
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 12/13 Pro)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale size based on screen width
 */
export const scaleWidth = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scale size based on screen height
 */
export const scaleHeight = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Scale font size with PixelRatio
 */
export const scaleFontSize = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Moderate scale - less aggressive scaling
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scaleWidth(size) - size) * factor;
};

/**
 * Get responsive dimensions
 */
export const getDimensions = () => ({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isShortDevice: SCREEN_HEIGHT < 700,
});

/**
 * Get responsive spacing
 */
export const getSpacing = () => {
  const dims = getDimensions();

  return {
    xs: dims.isSmallDevice ? 4 : 6,
    sm: dims.isSmallDevice ? 8 : 12,
    md: dims.isSmallDevice ? 12 : 16,
    lg: dims.isSmallDevice ? 16 : 24,
    xl: dims.isSmallDevice ? 24 : 32,
    xxl: dims.isSmallDevice ? 32 : 48,
  };
};

/**
 * Get responsive font sizes matching Figma
 */
export const getFontSizes = () => {
  const dims = getDimensions();
  const scale = dims.isSmallDevice ? 0.9 : dims.isLargeDevice ? 1.05 : 1;

  return {
    // Headings
    h1: Math.round(40 * scale), // "Hey Yona" - Large heading
    h2: Math.round(32 * scale), // "My Bag", "Mango" (Product Detail)
    h3: Math.round(24 * scale), // Section titles
    h4: Math.round(20 * scale), // Card titles

    // Body
    body: Math.round(16 * scale), // Regular text
    bodySmall: Math.round(14 * scale), // Secondary text
    caption: Math.round(12 * scale), // Small labels

    // Special
    price: Math.round(28 * scale), // Large prices
    priceSmall: Math.round(20 * scale), // Smaller prices
    button: Math.round(18 * scale), // Button text
  };
};

/**
 * Get responsive sizes for UI elements
 */
export const getComponentSizes = () => {
  const dims = getDimensions();

  return {
    // Buttons
    buttonHeight: dims.isSmallDevice ? 48 : 56,
    buttonHeightSmall: dims.isSmallDevice ? 40 : 48,

    // Icons
    iconSmall: dims.isSmallDevice ? 18 : 20,
    iconMedium: dims.isSmallDevice ? 22 : 24,
    iconLarge: dims.isSmallDevice ? 26 : 28,

    // Product Cards
    productCardHeight: dims.isSmallDevice ? 120 : 140,
    productImageSize: dims.isSmallDevice ? 100 : 120,

    // Avatar
    avatarSize: dims.isSmallDevice ? 48 : 56,

    // Input
    inputHeight: dims.isSmallDevice ? 48 : 56,

    // Border Radius
    radiusSmall: 12,
    radiusMedium: 16,
    radiusLarge: 20,
    radiusXLarge: 24,
  };
};

export const responsive = {
  scaleWidth,
  scaleHeight,
  scaleFontSize,
  moderateScale,
  getDimensions,
  getSpacing,
  getFontSizes,
  getComponentSizes,
};
