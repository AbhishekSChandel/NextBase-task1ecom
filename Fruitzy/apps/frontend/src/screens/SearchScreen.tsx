import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { HorizontalProductCard } from '../components/products/HorizontalProductCard';
import { fetchProducts, Product } from '../services/productService';
import { RootStackParamList } from '../navigation/types';
import { BackIcon, SearchIcon, CartIcon } from '../components/common/Icon';
import { useToast } from '../context/ToastContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

// Search tags that filter products - matching Figma design
const SEARCH_TAGS = [
  { label: 'Sweet Fruits', filter: (p: Product) => true }, // Show all products
  { label: 'Mango', filter: (p: Product) => p.name === 'Mango' },
  { label: 'Strawberry', filter: (p: Product) => p.name === 'Strawberry' },
  { label: 'Chicken', filter: (p: Product) => p.name === 'Chicken' },
  { label: 'Bread', filter: (p: Product) => p.name === 'Bread' },
  { label: 'Avocado Premium', filter: (p: Product) => p.name === 'Avocado Premium' },
  { label: 'Fresh Vegetables', filter: (p: Product) => ['Avocado', 'Avocado Premium'].includes(p.name) },
  { label: 'Exotic Fruits', filter: (p: Product) => ['Durian', 'Fig', 'Pomegranate'].includes(p.name) },
];

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const { addToCart, cartCount } = useCart();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, allProducts]);

  const loadProducts = async () => {
    try {
      const products = await fetchProducts();
      setAllProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleTagPress = (tag: typeof SEARCH_TAGS[0]) => {
    const filtered = allProducts.filter(tag.filter);
    setFilteredProducts(filtered);
    setSearchQuery(tag.label);
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredProducts([]);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    showToast(`${product.name} added to your cart`, { type: 'success' });
  };

  const handleRemoveTags = () => {
    setSearchQuery('');
    setFilteredProducts([]);
  };

  const showTags = !searchQuery.trim() && filteredProducts.length === 0;

  // Styles matching Figma design exactly
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    safeArea: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 12,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      marginRight: 12,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: '#F5F5F5',
      marginRight: 12,
    },
    cartButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      position: 'relative',
    },
    cartBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: '#E63946',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    cartBadgeText: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 10,
      color: '#FFFFFF',
    },
    searchIconContainer: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      color: '#1A1A1A',
      padding: 0,
      margin: 0,
    },
    tagsContainer: {
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    tagsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    tagsTitle: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: '#1E5128', // Dark green matching Figma
      letterSpacing: 0.1,
    },
    removeButton: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: '#E63946', // Red matching Figma
      letterSpacing: 0.1,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    tag: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: '#F5F5F5', // Light grey matching Figma
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      color: '#1A1A1A',
      letterSpacing: 0.1,
    },
    resultsScrollView: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    loadingContainer: {
      paddingVertical: 32,
      alignItems: 'center',
    },
    resultsHeader: {
      marginBottom: 16,
      marginTop: 4,
    },
    resultsTitle: {
      fontFamily: 'Inter_500Medium',
      color: '#1E5128',
      fontSize: 16,
      letterSpacing: 0.1,
    },
    noResultsContainer: {
      paddingVertical: 48,
      alignItems: 'center',
    },
    noResultsEmoji: {
      fontSize: 48,
      marginBottom: 16,
    },
    noResultsTitle: {
      fontFamily: 'Inter_500Medium',
      textAlign: 'center',
      color: '#1A1A1A',
      fontSize: 16,
      marginBottom: 8,
    },
    noResultsText: {
      fontFamily: 'Inter_400Regular',
      textAlign: 'center',
      color: '#666666',
      fontSize: 14,
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with Back and Search - Matching Figma exactly */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {/* Back Button - Black arrow on white circular background */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <BackIcon size={20} color="#000000" />
            </TouchableOpacity>

            {/* Search Input - Green icon on left, light grey background */}
            <View style={styles.searchContainer}>
              <View style={styles.searchIconContainer}>
                <SearchIcon size={20} color="#1E5128" />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search fresh groceries"
                placeholderTextColor="#999999"
                value={searchQuery}
                onChangeText={handleSearchChange}
                autoFocus
                returnKeyType="search"
              />
            </View>

            {/* Cart Button - Top right with badge */}
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
              activeOpacity={0.7}
            >
              <CartIcon size={20} color="#1A1A1A" />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Tags - Matching Figma design */}
        {showTags && (
          <View style={styles.tagsContainer}>
            <View style={styles.tagsHeader}>
              <Text style={styles.tagsTitle}>Title</Text>
              <TouchableOpacity onPress={handleRemoveTags} activeOpacity={0.7}>
                <Text style={styles.removeButton}>remove</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tagsRow}>
              {SEARCH_TAGS.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => handleTagPress(tag)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tagText}>{tag.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Search Results */}
        {(searchQuery.trim() || filteredProducts.length > 0) && (
          <ScrollView 
            style={styles.resultsScrollView} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E5128" />
              </View>
            ) : filteredProducts.length > 0 ? (
              <>
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsTitle}>
                    Found {filteredProducts.length} Result
                    {filteredProducts.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                {filteredProducts.map((product) => (
                  <HorizontalProductCard
                    key={product.id}
                    product={product}
                    onPress={() => navigation.navigate('ProductDetail', { product })}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </>
            ) : searchQuery.trim() ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsEmoji}>🔍</Text>
                <Text style={styles.noResultsTitle}>No products found</Text>
                <Text style={styles.noResultsText}>Try searching for something else</Text>
              </View>
            ) : null}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};
