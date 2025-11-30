import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { getProductImageSource } from '../services/productService';
import { RootStackParamList } from '../navigation/types';
import {
  BackIcon,
  CartIcon,
  HeartIcon,
  TruckIcon,
  StarIcon,
  MinusIcon,
  AddIcon,
} from '../components/common/Icon';
import { getFontSizes } from '../utils/responsive';
import { useToast } from '../context/ToastContext';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params;
  const { theme } = useTheme();
  const { addToCart, getCartItem, cartCount } = useCart();
  const { showToast } = useToast();
  const fontSizes = getFontSizes();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const cartItem = getCartItem(product.id);
  const currentCartQuantity = cartItem?.quantity || 0;

  const handleAddToBag = () => {
    if (quantity + currentCartQuantity > product.stock) {
      showToast(
        `Only ${product.stock} items available. You already have ${currentCartQuantity} in cart.`,
        { type: 'error' }
      );
      return;
    }

    addToCart(product, quantity);
    showToast(`${quantity} x ${product.name} added to your cart`, {
      type: 'success',
    });
  };

  const incrementQuantity = () => {
    if (quantity + currentCartQuantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      showToast(`Only ${product.stock} items available`, { type: 'error' });
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 16,
    },
    backButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundCard,
    },
    cartButton: {
      width: 64,
      height: 64,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: theme.backgroundCard,
    },
    badge: {
      position: 'absolute',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      backgroundColor: theme.accentRed,
    },
    badgeText: {
      color: '#FFFFFF',
      fontFamily: 'Poppins_700Bold',
      fontSize: fontSizes.caption,
    },
    imageContainer: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    productImage: {
      width: 300,
      height: 300,
    },
    favoriteButton: {
      position: 'absolute',
      bottom: 48,
      right: 48,
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isFavorite ? theme.accentRed : theme.backgroundCard,
    },
    infoContainer: {
      paddingHorizontal: 24,
    },
    shippingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    shippingText: {
      fontFamily: 'Poppins_500Medium',
      marginLeft: 8,
      color: theme.primary,
      fontSize: fontSizes.body,
    },
    productName: {
      fontFamily: 'Poppins_700Bold',
      marginBottom: 16,
      color: theme.heading,
      fontSize: fontSizes.h2,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 25,
      marginRight: 12,
      backgroundColor: theme.backgroundCard,
    },
    ratingText: {
      fontFamily: 'Poppins_600SemiBold',
      marginLeft: 4,
      color: theme.text,
      fontSize: fontSizes.body,
    },
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 25,
      backgroundColor: theme.backgroundMint,
    },
    categoryText: {
      fontFamily: 'Poppins_500Medium',
      color: theme.heading,
      fontSize: fontSizes.body,
    },
    priceContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    stockWarning: {
      marginBottom: 16,
    },
    quantityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 32,
    },
    quantitySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    quantityButton: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundCard,
    },
    quantityText: {
      fontSize: 24,
      fontFamily: 'Poppins_700Bold',
      marginHorizontal: 24,
      color: theme.heading,
    },
    addButton: {
      flex: 1,
      paddingVertical: 20,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontFamily: 'Poppins_600SemiBold',
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <BackIcon size={24} color={theme.text} />
            </TouchableOpacity>

            {/* Cart Icon with Badge */}
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <CartIcon size={26} color={theme.textSecondary} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image
              source={getProductImageSource(product)}
              style={styles.productImage}
              contentFit="contain"
              transition={300}
              cachePolicy="memory-disk"
            />

            {/* Favorite Button */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => setIsFavorite(!isFavorite)}
              activeOpacity={0.8}
            >
              <HeartIcon
                size={28}
                color={isFavorite ? '#FFFFFF' : theme.accentRed}
                filled={isFavorite}
              />
            </TouchableOpacity>
          </View>

          {/* Product Info */}
          <View style={styles.infoContainer}>
            {/* Free Shipping Badge */}
            <View style={styles.shippingBadge}>
              <TruckIcon size={22} color={theme.primary} />
              <Text style={styles.shippingText}>Free shipping</Text>
            </View>

            {/* Product Name */}
            <Text style={styles.productName}>{product.name}</Text>

            {/* Rating and Category */}
            <View style={styles.ratingRow}>
              {/* Rating */}
              <View style={styles.ratingBadge}>
                <StarIcon size={16} color="#FFB800" filled />
                <Text style={styles.ratingText}>4.7</Text>
              </View>

              {/* Category */}
              <View style={styles.categoryBadge}>
                <Text style={{ fontSize: fontSizes.body }}>🥭</Text>
                <Text style={styles.categoryText}>Fruits</Text>
              </View>

              {/* Price */}
              <View style={styles.priceContainer}>
                <View style={styles.priceRow}>
                  <Text style={typography.price}>
                    $ {product.price.toFixed(1)}
                  </Text>
                  <Text style={[typography.priceUnit, { marginLeft: 4, color: theme.textSecondary }]}>
                    /kg
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text style={[typography.h3, { marginBottom: 12, color: theme.text }]}>
              Description
            </Text>
            <Text style={[typography.bodySecondary, { marginBottom: 24, lineHeight: 24, color: theme.textSecondary }]}>
              {product.description}
            </Text>

            {/* Stock Info */}
            {product.stock < 10 && (
              <View style={styles.stockWarning}>
                <Text style={[typography.bodySmall, { color: theme.accentOrange }]}>
                  ⚠️ Only {product.stock} left in stock!
                </Text>
              </View>
            )}

            {/* Quantity and Add to Bag */}
            <View style={styles.quantityRow}>
              {/* Quantity Selector */}
              <View style={styles.quantitySelector}>
                {/* Minus Button */}
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <MinusIcon
                    size={24}
                    color={quantity <= 1 ? theme.textLight : theme.text}
                  />
                </TouchableOpacity>

                {/* Quantity Display */}
                <Text style={styles.quantityText}>{quantity}</Text>

                {/* Plus Button */}
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={incrementQuantity}
                >
                  <AddIcon size={24} color={theme.primary} />
                </TouchableOpacity>
              </View>

              {/* Add to Bag Button */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddToBag}
                activeOpacity={0.8}
              >
                <Text style={styles.addButtonText}>Add to bag</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
