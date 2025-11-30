import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useTheme } from '../../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// 15% smaller: Original was SCREEN_WIDTH - 48, now 85% of that
const BANNER_WIDTH = (SCREEN_WIDTH - 48) * 0.85; // 15% smaller with uniform padding
const BANNER_HEIGHT = 140 * 0.85; // 15% smaller height
const BANNER_SPACING = 16; // Uniform spacing between banners
const SIDE_PADDING = 24; // Uniform side padding
const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds

const banners = [
  require('../../../assets/banners/Banner 40%.png'),
  require('../../../assets/banners/Banner 30%.png'),
  require('../../../assets/banners/Banner 20%.png'),
];

export const AdCarousel: React.FC = () => {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (BANNER_WIDTH + BANNER_SPACING));
    setActiveIndex(index);
  };

  const renderBanner = ({ item, index }: { item: any; index: number }) => (
    <View
      style={[
        styles.bannerContainer,
        {
          width: BANNER_WIDTH,
          height: BANNER_HEIGHT,
          marginRight: BANNER_SPACING,
          backgroundColor: theme.backgroundMint,
        },
      ]}
    >
      <ExpoImage
        source={item}
        style={styles.bannerImage}
        contentFit="cover"
        transition={300}
      />
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      marginTop: 16,
      marginBottom: 12,
    },
    bannerContainer: {
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },
    bannerImage: {
      width: '100%',
      height: '100%',
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 12,
    },
    dot: {
      height: 6,
      borderRadius: 3,
      marginHorizontal: 3,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(_, index) => `banner-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={BANNER_WIDTH + BANNER_SPACING}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: SIDE_PADDING,
          paddingRight: SIDE_PADDING,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollToIndexFailed={() => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: 0,
              animated: false,
            });
          }, 100);
        }}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.dot,
              {
                width: index === activeIndex ? 20 : 6,
                backgroundColor: index === activeIndex ? theme.primary : theme.border,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};
