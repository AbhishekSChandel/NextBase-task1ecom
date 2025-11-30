import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/home/Header';
import { SearchBar } from '../components/home/SearchBar';
import { AdCarousel } from '../components/home/AdCarousel';
import { HorizontalProductCard } from '../components/products/HorizontalProductCard';
import { Icon } from '../components/common/Icon';
import { fetchProducts, Product } from '../services/productService';
import { RootStackParamList } from '../navigation/types';
import { getFontSizes, getSpacing } from '../utils/responsive';
import { typography } from '../theme/typography';
import { seedInventory, checkInventoryCollection } from '../services/seedInventory';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface HomeScreenProps extends Props {
  user: any; // Firebase User or null
  onSignOut: () => void;
  isGuestMode?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user: userProp,
  onSignOut,
  isGuestMode = false,
  navigation,
}) => {
  const { theme } = useTheme();
  const { addToCart, cartCount } = useCart();
  const { showToast } = useToast();
  const { user: authUser } = useAuth();
  
  // Use auth context user if available, otherwise fall back to prop
  const user = authUser || userProp;
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fontSizes = getFontSizes();
  const spacing = getSpacing();
  const [resetting, setResetting] = useState(false);

  const getInitial = () => {
    // Get name from Firebase user object
    const displayName = user?.displayName;
    const email = user?.email;
    
    // Priority: displayName > email
    const name = displayName || email || 'U';
    return name.charAt(0).toUpperCase();
  };

  // Priority products to show first on the home screen (by imageKey)
  const PRIORITY_PRODUCTS = ['mango', 'strawberry', 'chicken', 'bread', 'avocadoPremium'];
  
  // Initial load: Show priority products first
  const INITIAL_LOAD_COUNT = PRIORITY_PRODUCTS.length;
  const LOAD_MORE_COUNT = 5; // Load 5 more products when scrolling

  useEffect(() => {
    // Check if inventory collection exists, if not, seed products
    const initializeInventory = async () => {
      try {
        const checkResult = await checkInventoryCollection();
        console.log('📦 Inventory collection check:', checkResult);
        
        if (checkResult.count === 0) {
          // No products exist, seed inventory collection
          console.log('🌱 No products found in inventory. Seeding products...');
          const seedResult = await seedInventory();
          console.log('✅ Inventory seeding complete:', seedResult.summary);
        } else {
          console.log(`✅ Found ${checkResult.count} existing products in inventory`);
        }
      } catch (error) {
        console.error('❌ Error initializing inventory:', error);
      }
    };
    
    initializeInventory();
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await fetchProducts();

      // Sort products: priority products first, then others
      const sortedProducts = sortProductsByPriority(fetchedProducts);
      setAllProducts(sortedProducts);

      // Initially show only priority products
      setDisplayedProducts(sortedProducts.slice(0, INITIAL_LOAD_COUNT));
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const sortProductsByPriority = (products: Product[]): Product[] => {
    const priorityProducts: Product[] = [];
    const otherProducts: Product[] = [];

    // First, add priority products in order (match by imageKey)
    PRIORITY_PRODUCTS.forEach((priorityImageKey) => {
      const product = products.find((p) => p.imageKey === priorityImageKey);
      if (product) {
        priorityProducts.push(product);
      }
    });

    // Then add remaining products
    products.forEach((product) => {
      if (!PRIORITY_PRODUCTS.includes(product.imageKey || '')) {
        otherProducts.push(product);
      }
    });

    return [...priorityProducts, ...otherProducts];
  };

  const handleLoadMore = () => {
    if (loadingMore || displayedProducts.length >= allProducts.length) {
      return;
    }

    setLoadingMore(true);

    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const nextProducts = allProducts.slice(0, currentLength + LOAD_MORE_COUNT);
      setDisplayedProducts(nextProducts);
      setLoadingMore(false);
    }, 500); // Simulate loading delay
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 100;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (isCloseToBottom) {
      handleLoadMore();
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      showToast(`${product.name} is out of stock`, { type: 'error' });
      return;
    }
    addToCart(product, 1);
    showToast(`${product.name} added to your cart`, { type: 'success' });
  };

  const handleResetStock = async () => {
    try {
      setResetting(true);
      // Reload products from inventory collection
      await loadProducts();
      showToast('Products refreshed', { type: 'success' });
    } catch (error) {
      console.error('Error refreshing products:', error);
      showToast('Failed to refresh products', { type: 'error' });
    } finally {
      setResetting(false);
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      color: theme.textSecondary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      backgroundColor: theme.background,
    },
    errorEmoji: {
      marginBottom: 16,
      fontSize: 36,
    },
    errorTitle: {
      marginBottom: 8,
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'Poppins_600SemiBold',
      color: theme.heading,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Inter_400Regular',
      color: theme.textSecondary,
    },
    loadingMoreContainer: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    loadingMoreText: {
      marginTop: 8,
      fontSize: fontSizes.bodySmall,
      fontFamily: 'Inter_400Regular',
      color: theme.textSecondary,
    },
    endMessage: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    endMessageText: {
      textAlign: 'center',
      fontSize: fontSizes.bodySmall,
      fontFamily: 'Inter_400Regular',
      color: theme.textSecondary,
    },
    refreshButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 4,
    },
    refreshIcon: {
      marginRight: 6,
    },
    refreshText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 16, // Made bigger (was fontSizes.caption which is 12)
      color: theme.textSecondary,
    },
    spacer: {
      height: 32,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😔</Text>
        <Text style={styles.errorTitle}>{error}</Text>
        <Text style={styles.errorText}>Please check your connection and try again</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {/* Header */}
          <Header
            user={user}
            cartItemCount={cartCount}
            onLogout={onSignOut}
            onCartPress={() => navigation.navigate('Cart')}
          />

          {/* Greeting - Matching Figma */}
          <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.sm }}>
            <Text style={[typography.h1, { color: theme.heading }]}>
              Hey {isGuestMode ? 'Guest' : getInitial()} 👋
            </Text>
            <Text style={[typography.bodySecondary, { marginTop: spacing.xs, color: theme.textSecondary }]}>
              Find fresh groceries you want
            </Text>
          </View>

          {/* Search Bar */}
          <SearchBar
            onSearchPress={() => navigation.navigate('Search')}
            onScanPress={() => showToast('Scanner coming soon', { type: 'neutral' })}
          />

          {/* Advertisement Carousel */}
          <AdCarousel />

          {/* Products Section - Matching Figma */}
          <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
            <Text style={[typography.h2, { marginBottom: spacing.md, color: theme.heading }]}>
              Popular
            </Text>

            <View style={{ alignItems: 'flex-start', marginBottom: spacing.sm }}>
              <TouchableOpacity
                onPress={handleResetStock}
                disabled={resetting}
                activeOpacity={0.7}
                style={styles.refreshButton}
              >
                <View style={styles.refreshIcon}>
                  <Icon
                    name="refresh"
                    library="ionicons"
                    size={16}
                    color={theme.textSecondary}
                    style={{ opacity: resetting ? 0.6 : 1 }}
                  />
                </View>
                <Text
                  style={[
                    styles.refreshText,
                    { opacity: resetting ? 0.6 : 1 },
                  ]}
                >
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>

            {/* Product List - Lazy Loaded */}
            {displayedProducts.map((product) => (
              <HorizontalProductCard
                key={product.id}
                product={product}
                onPress={() => navigation.navigate('ProductDetail', { product })}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}

            {/* Loading More Indicator */}
            {loadingMore && (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={styles.loadingMoreText}>Loading more products...</Text>
              </View>
            )}

            {/* End of List Message */}
            {!loadingMore &&
              displayedProducts.length >= allProducts.length &&
              allProducts.length > INITIAL_LOAD_COUNT && (
                <View style={styles.endMessage}>
                  <Text style={styles.endMessageText}>✨ You've seen all products! ✨</Text>
                </View>
              )}
          </View>

          {/* Spacer at bottom */}
          <View style={styles.spacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
