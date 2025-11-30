import React, { useState, useRef } from 'react';
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
import { useTheme } from '../../theme/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { signInWithEmail } from '../../services/AuthService';

interface SignInScreenProps {
  onSignInSuccess: () => void;
  onSwitchToSignUp: () => void;
  onBack: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onSignInSuccess,
  onSwitchToSignUp,
  onBack,
}) => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<TextInput>(null);

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleEmailSignIn = async () => {
    // Validation
    if (!email || !password) {
      showToast('Please enter email and password', { type: 'error' });
      return;
    }

    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address', { type: 'error' });
      return;
    }

    setLoading(true);

    try {
      await signInWithEmail(email.trim().toLowerCase(), password);
      showToast('Signed in successfully', { type: 'success' });
      onSignInSuccess();
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      
      let errorMessage = 'Invalid email or password';
      let isUserNotFound = false;

      // Check if user doesn't exist
      if (error.code === 'auth/user-not-found' || error.message?.toLowerCase().includes('sign up')) {
        isUserNotFound = true;
        errorMessage = 'Please signup first';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, { type: isUserNotFound ? 'neutral' : 'error' });
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      backgroundColor: theme.backgroundCard,
    },
    backButtonText: {
      fontSize: 20,
      color: theme.text,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 32,
    },
    title: {
      fontSize: 30,
      fontFamily: 'Poppins_700Bold',
      marginBottom: 8,
      color: theme.heading,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      marginBottom: 32,
      color: theme.textSecondary,
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontFamily: 'Poppins_500Medium',
      marginBottom: 8,
      color: theme.text,
    },
    passwordInputContainer: {
      marginBottom: 24,
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      fontFamily: 'Inter_400Regular',
      backgroundColor: theme.backgroundCard,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    passwordToggle: {
      position: 'absolute',
      right: 16,
      top: 16,
    },
    signInButton: {
      width: '100%',
      paddingVertical: 16,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      backgroundColor: theme.primary,
    },
    signInButtonText: {
      fontSize: 16,
      fontFamily: 'Poppins_600SemiBold',
      color: '#FFFFFF',
    },
    linkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    linkText: {
      fontSize: 16,
      fontFamily: 'Inter_400Regular',
      color: theme.textSecondary,
    },
    linkButtonText: {
      fontSize: 16,
      fontFamily: 'Poppins_600SemiBold',
      color: theme.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Welcome Text */}
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              editable={!loading}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Password Input */}
          <View style={styles.passwordInputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={passwordInputRef}
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleEmailSignIn}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={{ color: theme.textSecondary }}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleEmailSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onSwitchToSignUp}>
              <Text style={styles.linkButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
