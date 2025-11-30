import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { SearchIcon, ScanIcon } from '../common/Icon';

interface SearchBarProps {
  onSearchPress?: () => void;
  onScanPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchPress, onScanPress }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      marginTop: 16,
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 16,
      marginRight: 12,
      backgroundColor: theme.backgroundCard,
    },
    searchText: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      marginLeft: 12,
      color: theme.textLight,
    },
    scanButton: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Search Input */}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <SearchIcon size={22} color={theme.primary} />
          <Text style={styles.searchText}>Search fresh groceries</Text>
        </TouchableOpacity>

        {/* Scan Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={onScanPress}
          activeOpacity={0.7}
        >
          <ScanIcon size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
