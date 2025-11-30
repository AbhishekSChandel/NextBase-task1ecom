import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useCart, CartItem } from '../context/CartContext';
import { getProductImageSource } from '../services/productService';
import { RootStackParamList } from '../navigation/types';
import { BackIcon, HeartIcon, MinusIcon, AddIcon, Icon } from '../components/common/Icon';
import { getFontSizes } from '../utils/responsive';
import { useToast } from '../context/ToastContext';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const fontSizes = getFontSizes();

  const handleIncrement = (item: CartItem) => {
    if (item.quantity < item.product.stock) {
      updateQuantity(item.product.id, item.quantity + 1);
    } else {
      showToast(`Only ${item.product.stock} items available`, { type: 'error' });
    }
  };

  const handleDecrement = (item: CartItem) => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      removeFromCart(item.product.id);
      showToast(`${item.product.name} removed from cart`, { type: 'neutral' });
    }
  };

  const handleRemove = (item: CartItem) => {
    removeFromCart(item.product.id);
    showToast(`${item.product.name} removed from cart`, { type: 'neutral' });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty', { type: 'error' });
      return;
    }
    navigation.navigate('Checkout');
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
      paddingHorizontal: 24,
      marginTop: 8,
      marginBottom: 24,
    },
    headerWithItems: {
      paddingHorizontal: 24,
      paddingTop: 16,
      marginBottom: 16,
    },
    backButton: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.backgroundCard,
    },
    title: {
      
      fontSize: 36,
      fontFamily: 'Poppins_700Bold',
      color: theme.heading,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleWithItems: {
      fontFamily: 'Poppins_700Bold',
      color: theme.heading,
      fontSize: fontSizes.h2,
    },
    itemCount: {
      fontFamily: 'Poppins_500Medium',
      color: theme.textSecondary,
      fontSize: fontSizes.body,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal:32,
    },
    emptyEmoji: {
      marginBottom:32,
      fontSize: 80,
    },
    emptyTitle: {
      marginBottom: 12,
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Poppins_700Bold',
      color: theme.heading,
    },
    emptyText: {
      marginBottom: 32,
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Inter_400Regular',
      color: theme.textSecondary,
    },
    startShoppingButton: {
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 25,
      backgroundColor: theme.primary,
    },
    startShoppingText: {
      fontSize: 16,
      color: '#FFFFFF',
      fontFamily: 'Poppins_600SemiBold',
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 24,
    },
    cartItem: {
      flexDirection: 'row',
      padding: 16,
      marginBottom: 16,
      borderRadius: 24,
      backgroundColor: theme.backgroundCard,
    },
    itemImageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      width: 96,
      height: 96,
      borderRadius: 16,
      backgroundColor: theme.backgroundMint,
    },
    itemImage: {
      width: 80,
      height: 80,
    },
    itemInfo: {
      flex: 1,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    itemName: {
      flex: 1,
      fontFamily: 'Poppins_600SemiBold',
      color: theme.heading,
      fontSize: fontSizes.h4,
    },
    deleteButton: {
      marginLeft: 8,
    },
    deleteText: {
      fontSize: 16,
    },
    itemQuantity: {
      marginBottom: 8,
      fontFamily: 'Inter_400Regular',
      color: theme.textSecondary,
      fontSize: fontSizes.caption,
    },
    itemBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemPrice: {
      fontFamily: 'Poppins_700Bold',
      color: theme.primary,
      fontSize: fontSizes.priceSmall,
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.background,
    },
    quantityText: {
      marginHorizontal: 16,
      fontFamily: 'Poppins_600SemiBold',
      color: theme.heading,
      fontSize: fontSizes.h4,
    },
    spacer: {
      height: 16,
    },
    bottomSection: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
      backgroundColor: theme.background,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    totalLabel: {
      fontFamily: 'Poppins_600SemiBold',
      color: theme.heading,
      fontSize: fontSizes.h3,
    },
    totalPrice: {
      fontFamily: 'Poppins_700Bold',
      color: theme.primary,
      fontSize: fontSizes.price,
    },
    checkoutButton: {
      marginBottom: 25,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      borderRadius: 25,
      backgroundColor: theme.primary,
    },
    checkoutButtonText: {
      color: '#FFFFFF',
      fontFamily: 'Poppins_600SemiBold',
      fontSize: fontSizes.button,
    },
  });

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <BackIcon size={24} color={theme.text} />
            </TouchableOpacity>

            <Text style={styles.title}>My Bag</Text>
          </View>

          {/* Empty State */}
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🛍️</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Add some delicious items to get started!
            </Text>
            <TouchableOpacity
              style={styles.startShoppingButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.startShoppingText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerWithItems}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon size={24} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.headerRow}>
            <Text style={styles.titleWithItems}>My Bag</Text>
            <Text style={styles.itemCount}>
              {cartCount} item{cartCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Cart Items */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {cartItems.map((item) => (
            <View key={item.product.id} style={styles.cartItem}>
              {/* Product Image */}
              <View style={styles.itemImageContainer}>
                <Image
                  source={getProductImageSource(item.product)}
                  style={styles.itemImage}
                  contentFit="contain"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </View>

              {/* Product Info */}
              <View style={styles.itemInfo}>
                {/* Name and Delete */}
                <View style={styles.itemHeader}>
                  <Text
                    style={styles.itemName}
                    numberOfLines={1}
                  >
                    {item.product.name}
                  </Text>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemove(item)}>
                    <Text style={styles.deleteText}>❌</Text>
                  </TouchableOpacity>
                </View>

                {/* Quantity and Price */}
                <Text style={styles.itemQuantity}>
                  {item.quantity} kg
                </Text>

                <View style={styles.itemBottomRow}>
                  {/* Price */}
                  <Text style={styles.itemPrice}>
                    $ {(item.product.price * item.quantity).toFixed(1)}
                  </Text>

                  {/* Quantity Controls */}
                  <View style={styles.quantityControls}>
                    {/* Minus */}
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleDecrement(item)}
                    >
                      <MinusIcon size={20} color={theme.text} />
                    </TouchableOpacity>

                    {/* Quantity */}
                    <Text style={styles.quantityText}>
                      {item.quantity}
                    </Text>

                    {/* Plus */}
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleIncrement(item)}
                    >
                      <AddIcon size={20} color={theme.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.spacer} />
        </ScrollView>

        {/* Bottom Section: Total and Checkout */}
        <View style={styles.bottomSection}>
          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>
              $ {cartTotal.toFixed(1)}
            </Text>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            activeOpacity={0.8}
          >
            <Text style={styles.checkoutButtonText}>
              Proceed To Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
