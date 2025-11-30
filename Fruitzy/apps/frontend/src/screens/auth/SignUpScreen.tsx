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
import { signUpWithEmail } from '../../services/AuthService';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onSwitchToSignIn: () => void;
  onBack: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUpSuccess,
  onSwitchToSignIn,
  onBack,
}) => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  // Email validation helper
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Password strength validation
  const isStrongPassword = (password: string) => {
    return password.length >= 8;
  };

  const handleEmailSignUp = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      showToast('Please fill in all fields', { type: 'error' });
      return;
    }

    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address', { type: 'error' });
      return;
    }

    if (!isStrongPassword(password)) {
      showToast('Password must be at least 8 characters', { type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords don't match", { type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Firebase auth module automatically sends verification email on signup
      await signUpWithEmail(email.trim().toLowerCase(), password, null, null);
      showToast('Account created! Please check your email to verify your account.', { type: 'success' });
      // After successful signup, redirect to sign in
      onSignUpSuccess();
    } catch (error: any) {
      console.error('Sign up error:', error);
      let errorMessage = 'Failed to create account';
      
      if (error.code === 'auth/email-already-in-use' || error.message?.toLowerCase().includes('already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, { type: 'error' });
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
      marginBottom: 16,
    },
    lastInputContainer: {
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
    signUpButton: {
      width: '100%',
      paddingVertical: 16,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      backgroundColor: theme.primary,
    },
    signUpButtonText: {
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

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
          <View style={styles.inputContainer}>
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
                autoComplete="password-new"
                textContentType="newPassword"
                editable={!loading}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                blurOnSubmit={false}
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

          {/* Confirm Password Input */}
          <View style={styles.lastInputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={confirmPasswordInputRef}
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={theme.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={handleEmailSignUp}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={{ color: theme.textSecondary }}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleEmailSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <TouchableOpacity onPress={onSwitchToSignIn}>
              <Text style={styles.linkButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
