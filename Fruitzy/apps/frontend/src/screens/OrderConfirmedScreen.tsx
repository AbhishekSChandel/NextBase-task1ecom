import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderConfirmed'>;

export const OrderConfirmedScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { theme } = useTheme();

  const handleBrowseHome = () => {
    navigation.navigate('Home');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    safeArea: {
      flex: 1,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    iconOuter: {
      width: 128,
      height: 128,
      borderRadius: 64,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
      backgroundColor: theme.backgroundMint,
    },
    iconInner: {
      width: 96,
      height: 96,
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
    },
    iconText: {
      fontSize: 36,
      color: '#FFFFFF',
    },
    title: {
      fontSize: 36,
      fontFamily: 'Poppins_700Bold',
      marginBottom: 16,
      color: theme.heading,
    },
    message: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      textAlign: 'center',
      marginBottom: 8,
      color: theme.textSecondary,
    },
    orderId: {
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      textAlign: 'center',
      marginBottom: 48,
      color: theme.textLight,
    },
    button: {
      width: '100%',
      paddingVertical: 20,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontFamily: 'Poppins_600SemiBold',
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <Text style={styles.iconText}>✓</Text>
            </View>
          </View>

          {/* Success Title */}
          <Text style={styles.title}>Success!</Text>

          {/* Success Message */}
          <Text style={styles.message}>
            You have successfully created your order.
          </Text>

          {/* Order ID */}
          <Text style={styles.orderId}>Order ID: {orderId}</Text>

          {/* Browse Home Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleBrowseHome}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Browse Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
