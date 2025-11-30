import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ViewStyle,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { signInWithGoogle } from '../../services/AuthService';

interface LandingSignInScreenProps {
  onEmailSignIn: () => void;
  onSwitchToSignUp: () => void;
  onSkipAuth?: () => void;
}

export const LandingSignInScreen: React.FC<LandingSignInScreenProps> = ({
  onEmailSignIn,
  onSwitchToSignUp,
  onSkipAuth,
}) => {
  const { theme } = useTheme();
  const { showToast } = useToast();

  const SocialButton = ({
    label,
    icon,
    backgroundColor,
    textColor,
    iconColor,
    onPress,
    borderColor,
    disabled,
    isLoading,
    style,
  }: {
    label: string;
    icon: any;
    backgroundColor: string;
    textColor: string;
    iconColor?: string;
    borderColor?: string;
    onPress: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    style?: ViewStyle;
  }) => {
    const buttonStyles = StyleSheet.create({
      button: {
        width: '100%',
        borderRadius: 25,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        borderWidth: borderColor ? 1 : 0,
        borderColor: borderColor ?? 'transparent',
        paddingVertical: 16,
        ...(style || {}),
      },
      iconContainer: {
        width: 24,
        alignItems: 'center',
        marginRight: 12,
      },
      buttonText: {
        fontFamily: 'Poppins_500Medium',
        color: textColor,
        fontSize: 16,
      },
    });

    return (
      <TouchableOpacity
        style={[buttonStyles.button, style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View style={buttonStyles.iconContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color={textColor} />
          ) : (
            icon
          )}
        </View>
        <Text style={buttonStyles.buttonText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showToast('Signed in with Google', { type: 'success' });
      // Auth state will update automatically via AuthContext
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      showToast(error.message || 'Failed to sign in with Google', { type: 'error' });
    }
  };

  const handleAppleSignIn = () => {
    // Dummy button - Apple Sign-In not implemented
    showToast('Apple Sign-In available on iOS devices only', { type: 'neutral' });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    content: {
      alignItems: 'center',
      paddingVertical: 48,
    },
    title: {
      fontSize: 30,
      fontFamily: 'Poppins_700Bold',
      textAlign: 'center',
      marginBottom: 8,
      color: theme.heading,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      textAlign: 'center',
      marginBottom: 48,
      color: theme.textSecondary,
    },
    separator: {
      textAlign: 'center',
      fontFamily: 'Inter_400Regular',
      marginVertical: 8,
      fontSize: 14,
      color: theme.textSecondary,
    },
    skipButton: {
      marginBottom: 16,
    },
    skipText: {
      textAlign: 'center',
      fontSize: 16,
      fontFamily: 'Poppins_500Medium',
      color: theme.textSecondary,
    },
    linkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    linkText: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      color: theme.textSecondary,
    },
    linkButtonText: {
      fontSize: 16,
      fontFamily: 'Poppins_600SemiBold',
      color: '#2ECC71',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Welcome Text */}
          <Text style={styles.title}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>Great to see you again, You've been missed!</Text>

          {/* Email Button */}
          <SocialButton
            label="Continue with Email"
            icon={<MaterialCommunityIcons name="email-outline" size={20} color="#666" />}
            backgroundColor="#F3F4F6"
            textColor="#1F2937"
            onPress={onEmailSignIn}
          />

          {/* Google Button */}
          <SocialButton
            label="Continue with Google"
            icon={<FontAwesome name="google" size={20} color="#DB4437" />}
            backgroundColor="#F3F4F6"
            textColor="#1F2937"
            onPress={handleGoogleSignIn}
          />

          {/* Or Separator */}
          <Text style={styles.separator}>or</Text>

          {/* Apple Button */}
          <SocialButton
            label="Continue with Apple"
            icon={<MaterialCommunityIcons name="apple" size={20} color="#FFFFFF" />}
            backgroundColor="#000000"
            textColor="#FFFFFF"
            onPress={handleAppleSignIn}
            style={{ marginBottom: 32 }}
          />

          {/* Continue Without Login */}
          {onSkipAuth && (
            <TouchableOpacity onPress={onSkipAuth} style={styles.skipButton}>
              <Text style={styles.skipText}>Continue without login →</Text>
            </TouchableOpacity>
          )}

          {/* Sign Up Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Don't Have an Account? </Text>
            <TouchableOpacity onPress={onSwitchToSignUp}>
              <Text style={styles.linkButtonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
