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

interface LandingSignUpScreenProps {
  onEmailSignUp: () => void;
  onSwitchToSignIn: () => void;
}

export const LandingSignUpScreen: React.FC<LandingSignUpScreenProps> = ({
  onEmailSignUp,
  onSwitchToSignIn,
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

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      showToast('Signed up with Google', { type: 'success' });
      // Auth state will update automatically via AuthContext
    } catch (error: any) {
      console.error('Google sign-up error:', error);
      showToast(error.message || 'Failed to sign up with Google', { type: 'error' });
    }
  };

  const handleAppleSignUp = () => {
    // Dummy button - Apple Sign-In not implemented
    showToast('Apple Sign-In is not available at this time', { type: 'neutral' });
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
      marginBottom: 48,
      color: theme.heading,
    },
    separator: {
      textAlign: 'center',
      fontFamily: 'Inter_400Regular',
      marginVertical: 8,
      fontSize: 14,
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
          <Text style={styles.title}>Let's Get Started!</Text>

          {/* Email Button */}
          <SocialButton
            label="Continue with Email"
            icon={<MaterialCommunityIcons name="email-outline" size={20} color="#666" />}
            backgroundColor="#F3F4F6"
            textColor="#1F2937"
            onPress={onEmailSignUp}
          />

          {/* Google Button */}
          <SocialButton
            label="Continue with Google"
            icon={<FontAwesome name="google" size={20} color="#DB4437" />}
            backgroundColor="#F3F4F6"
            textColor="#1F2937"
            onPress={handleGoogleSignUp}
          />

          {/* Or Separator */}
          <Text style={styles.separator}>or</Text>

          {/* Apple Button */}
          <SocialButton
            label="Continue with Apple"
            icon={<MaterialCommunityIcons name="apple" size={20} color="#FFFFFF" />}
            backgroundColor="#000000"
            textColor="#FFFFFF"
            onPress={handleAppleSignUp}
            style={{ marginBottom: 32 }}
          />

          {/* Sign In Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Already Have an Account? </Text>
            <TouchableOpacity onPress={onSwitchToSignIn}>
              <Text style={styles.linkButtonText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
