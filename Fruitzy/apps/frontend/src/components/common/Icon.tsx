/**
 * Optimized Icon Component
 *
 * Centralized icon system matching Figma design exactly
 * Uses @expo/vector-icons for performance and consistency
 */

import React from 'react';
import {
  Ionicons,
  MaterialIcons,
  Feather,
  AntDesign,
  FontAwesome,
} from '@expo/vector-icons';
import { ViewStyle } from 'react-native';

type IconLibrary = 'ionicons' | 'material' | 'feather' | 'antdesign' | 'fontawesome';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  library?: IconLibrary;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000',
  library = 'ionicons',
  style,
}) => {
  const iconProps = { name: name as any, size, color, style };

  switch (library) {
    case 'material':
      return <MaterialIcons {...iconProps} />;
    case 'feather':
      return <Feather {...iconProps} />;
    case 'antdesign':
      return <AntDesign {...iconProps} />;
    case 'fontawesome':
      return <FontAwesome {...iconProps} />;
    case 'ionicons':
    default:
      return <Ionicons {...iconProps} />;
  }
};

/**
 * Pre-configured icons matching Figma design
 */
export const AppIcons = {
  // Navigation
  back: { name: 'arrow-back', library: 'ionicons' as const },
  close: { name: 'close', library: 'ionicons' as const },

  // Actions
  search: { name: 'search', library: 'feather' as const },
  scan: { name: 'scan', library: 'ionicons' as const },
  add: { name: 'plus', library: 'feather' as const },
  minus: { name: 'minus', library: 'feather' as const },
  remove: { name: 'trash-2', library: 'feather' as const },

  // Shopping
  cart: { name: 'shopping-bag', library: 'feather' as const },
  bag: { name: 'bag-handle-outline', library: 'ionicons' as const },

  // Social
  heart: { name: 'heart', library: 'ionicons' as const },
  heartOutline: { name: 'heart-outline', library: 'ionicons' as const },
  share: { name: 'share-outline', library: 'ionicons' as const },

  // Information
  star: { name: 'star', library: 'ionicons' as const },
  starOutline: { name: 'star-outline', library: 'ionicons' as const },
  info: { name: 'information-circle-outline', library: 'ionicons' as const },

  // Delivery & Shipping
  truck: { name: 'truck', library: 'feather' as const },
  package: { name: 'package', library: 'feather' as const },

  // User
  user: { name: 'person-outline', library: 'ionicons' as const },
  settings: { name: 'settings-outline', library: 'ionicons' as const },

  // Arrows & Directions
  arrowRight: { name: 'arrow-forward', library: 'ionicons' as const },
  arrowLeft: { name: 'arrow-back', library: 'ionicons' as const },
  arrowDown: { name: 'chevron-down', library: 'ionicons' as const },
  arrowUp: { name: 'chevron-up', library: 'ionicons' as const },

  // Status
  checkmark: { name: 'checkmark-circle', library: 'ionicons' as const },
  alert: { name: 'alert-circle-outline', library: 'ionicons' as const },

  // Categories
  category: { name: 'grid-outline', library: 'ionicons' as const },
  filter: { name: 'filter', library: 'feather' as const },
};

/**
 * Quick access icon components
 */
export const SearchIcon: React.FC<Omit<IconProps, 'name' | 'library'>> = (props) => (
  <Icon {...AppIcons.search} {...props} />
);

export const CartIcon: React.FC<Omit<IconProps, 'name' | 'library'>> = (props) => (
  <Icon {...AppIcons.cart} {...props} />
);

export const HeartIcon: React.FC<
  Omit<IconProps, 'name' | 'library'> & { filled?: boolean }
> = ({ filled, ...props }) => (
  <Icon {...(filled ? AppIcons.heart : AppIcons.heartOutline)} {...props} />
);

export const StarIcon: React.FC<
  Omit<IconProps, 'name' | 'library'> & { filled?: boolean }
> = ({ filled, ...props }) => (
  <Icon {...(filled ? AppIcons.star : AppIcons.starOutline)} {...props} />
);

export const BackIcon: React.FC<Omit<IconProps, 'name' | 'library'>> = (props) => (
  <Icon {...AppIcons.back} {...props} />
);

export const AddIcon: React.FC<Omit<IconProps, 'name' | 'library'>> = (props) => (
  <Icon {...AppIcons.add} {...props} />
);

export const MinusIcon: React.FC<Omit<IconProps, 'name' | 'library'>> = (props) => (
  <Icon {...AppIcons.minus} {...props} />
);

export const TruckIcon: React.FC<Omit<IconProps, 'name' | 'library'>> = (props) => (
  <Icon {...AppIcons.truck} {...props} />
);

export const ScanIcon: React.FC<Omit<IconProps, 'name' | 'library'>> = (props) => (
  <Icon {...AppIcons.scan} {...props} />
);
