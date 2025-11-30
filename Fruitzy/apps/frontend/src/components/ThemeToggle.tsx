import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
      backgroundColor: theme.backgroundCard,
    },
    toggleContainer: {
      width: 48,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 4,
      backgroundColor: theme.border,
    },
    toggleCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.primary,
      transform: [{ translateX: isDark ? 20 : 0 }],
    },
    text: {
      marginLeft: 12,
      fontSize: 16,
      fontFamily: 'Poppins_500Medium',
      color: theme.text,
    },
  });

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.container}>
      <View style={styles.toggleContainer}>
        <View style={styles.toggleCircle} />
      </View>
      <Text style={styles.text}>
        {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </Text>
    </TouchableOpacity>
  );
};
