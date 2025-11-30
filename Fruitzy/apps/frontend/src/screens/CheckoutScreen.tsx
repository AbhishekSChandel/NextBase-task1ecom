import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { RootStackParamList } from '../navigation/types';
import { updateDoc, doc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { BackIcon } from '../components/common/Icon';
import { getFontSizes } from '../utils/responsive';
import { useToast } from '../context/ToastContext';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user: firebaseUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const { showToast } = useToast();
  const fontSizes = getFontSizes();

  const handlePlaceOrder = async () => {
    setProcessing(true);

    try {
      // First, create order document in Firestore (do this first to avoid inventory update if order fails)
      const ordersCollection = collection(db, 'orders');
      const userId = firebaseUser?.uid || 'guest';
      const orderData = {
        userId: userId,
        items: cartItems.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalPrice: cartTotal,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log('Creating order with data:', orderData);
      const orderDocRef = await addDoc(ordersCollection, orderData);
      const orderId = orderDocRef.id;
      console.log('Order created successfully:', orderId);

      // Then update inventory in Firestore for each product
      try {
        const updatePromises = cartItems.map(async (item) => {
          const productRef = doc(db, 'inventory', item.product.id);
          await updateDoc(productRef, {
            stock: increment(-item.quantity),
          });
        });
        await Promise.all(updatePromises);
        console.log('Inventory updated successfully');
      } catch (inventoryError: any) {
        console.warn('Inventory update failed (non-critical):', inventoryError);
        // Don't fail the order if inventory update fails
      }

      // Clear cart
      clearCart();

      // Navigate to success screen
      navigation.replace('OrderConfirmed', { orderId });
    } catch (error: any) {
      console.error('Error placing order:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'permission-denied') {
        showToast('Permission denied. Please check Firestore rules are published.', { type: 'error' });
      } else {
        showToast(`Order failed: ${error.message}`, { type: 'error' });
      }
    } finally {
      setProcessing(false);
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
      paddingHorizontal: 24,
      paddingTop: 16,
      marginBottom: 24,
    },
    backButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      backgroundColor: theme.backgroundCard,
    },
    title: {
      fontFamily: 'Poppins_700Bold',
      color: theme.heading,
      fontSize: fontSizes.h2,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 24,
    },
    orderSummary: {
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
      backgroundColor: theme.backgroundCard,
    },
    orderSummaryTitle: {
      fontFamily: 'Poppins_700Bold',
      marginBottom: 16,
      color: theme.heading,
      fontSize: fontSizes.h3,
    },
    orderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    orderItemName: {
      flex: 1,
      fontFamily: 'Inter_400Regular',
      color: theme.text,
      fontSize: fontSizes.body,
    },
    orderItemPrice: {
      fontFamily: 'Poppins_600SemiBold',
      marginLeft: 16,
      color: theme.primary,
      fontSize: fontSizes.body,
    },
    totalDivider: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    totalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    totalLabel: {
      fontFamily: 'Poppins_700Bold',
      color: theme.heading,
      fontSize: fontSizes.h4,
    },
    totalPrice: {
      fontFamily: 'Poppins_700Bold',
      color: theme.primary,
      fontSize: fontSizes.priceSmall,
    },
    deliveryInfo: {
      borderRadius: 24,
      padding: 24,
      marginBottom: 24,
      backgroundColor: theme.backgroundCard,
    },
    deliveryTitle: {
      fontFamily: 'Poppins_700Bold',
      marginBottom: 12,
      color: theme.heading,
      fontSize: fontSizes.h3,
    },
    deliveryText: {
      fontFamily: 'Inter_400Regular',
      color: theme.textSecondary,
      fontSize: fontSizes.body,
    },
    deliveryTextMargin: {
      fontFamily: 'Inter_400Regular',
      marginTop: 4,
      color: theme.textSecondary,
      fontSize: fontSizes.body,
    },
    bottomSpacer: {
      height: 96,
    },
    bottomSection: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      paddingTop: 16,
    },
    placeOrderButton: {
      paddingVertical: 20,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: processing ? theme.textLight : theme.primary,
    },
    placeOrderText: {
      color: '#FFFFFF',
      fontFamily: 'Poppins_600SemiBold',
      fontSize: fontSizes.button,
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={processing}
          >
            <BackIcon size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Checkout</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View style={styles.orderSummary}>
            <Text style={styles.orderSummaryTitle}>Order Summary</Text>

            {cartItems.map((item) => (
              <View key={item.product.id} style={styles.orderItem}>
                <Text
                  style={styles.orderItemName}
                  numberOfLines={1}
                >
                  {item.product.name} × {item.quantity}
                </Text>
                <Text style={styles.orderItemPrice}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.totalDivider}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>
                  ${cartTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Delivery Info Placeholder */}
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryTitle}>Delivery Information</Text>
            <Text style={styles.deliveryText}>
              📍 Standard delivery (2-3 days)
            </Text>
            <Text style={styles.deliveryTextMargin}>
              🚚 Free shipping on all orders
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Place Order Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
            disabled={processing}
            activeOpacity={0.8}
          >
            {processing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.placeOrderText}>Place Order</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
