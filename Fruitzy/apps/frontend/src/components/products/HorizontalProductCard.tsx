import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../theme/ThemeContext';
import { Product, getProductImageSource } from '../../services/productService';
import { HeartIcon, AddIcon } from '../common/Icon';
import { typography } from '../../theme/typography';

interface HorizontalProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
}

export const HorizontalProductCard: React.FC<HorizontalProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
}) => {
  const { theme } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);

  const isOutOfStock = product.stock === 0;

  const styles = StyleSheet.create({
    card: {
      overflow: 'hidden',
      flexDirection: 'row',
      marginBottom: 16,
      borderRadius: 24,
      backgroundColor: theme.cardHighlight,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      height: 140,
      opacity: isOutOfStock ? 0.6 : 1,
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 144,
      height: '100%',
      backgroundColor: theme.cardHighlight,
    },
    image: {
      width: 120,
      height: 120,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 16,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    productName: {
      flex: 1,
    },
    heartButton: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isFavorite ? theme.accentRed : 'transparent',
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    priceUnit: {
      marginLeft: 4,
    },
    addButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 56,
      height: 56,
      // Soft rounded square matching Figma design - all corners uniformly rounded
      borderRadius: 18, // Creates soft "squircle" effect matching Figma
      backgroundColor: '#2ECC71', // Green matching Figma design exactly
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Product Image - Left Side */}
      <View style={styles.imageContainer}>
        <Image
          source={getProductImageSource(product)}
          style={styles.image}
          contentFit="contain"
          transition={200}
          cachePolicy="memory-disk"
        />
      </View>

      {/* Product Info - Right Side */}
      <View style={styles.infoContainer}>
        {/* Top Row: Name and Heart */}
        <View style={styles.topRow}>
          <Text
            style={[typography.h4, styles.productName, { color: theme.text }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {/* Favorite Heart Icon */}
          <TouchableOpacity
            style={styles.heartButton}
            onPress={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            activeOpacity={0.8}
          >
            <HeartIcon
              size={20}
              color={isFavorite ? '#FFFFFF' : theme.accentRed}
              filled={isFavorite}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Row: Price and Add Button */}
        <View style={styles.bottomRow}>
          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={typography.price}>
              $ {product.price.toFixed(1)}
            </Text>
            <Text style={[typography.priceUnit, styles.priceUnit, { color: theme.textSecondary }]}>
              /kg
            </Text>
          </View>

          {/* Add to Cart / Out of Stock */}
          {product.stock === 0 ? (
            <Text style={[typography.caption, { color: theme.textSecondary }]}>
              Out of stock
            </Text>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={(e) => {
                e.stopPropagation();
                onAddToCart?.();
              }}
              activeOpacity={0.7}
            >
              <AddIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
