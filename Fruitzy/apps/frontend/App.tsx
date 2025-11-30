import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { configureGoogleSignIn } from './src/services/AuthService';
import { signOut } from './src/services/AuthService';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LandingSignInScreen } from './src/screens/auth/LandingSignInScreen';
import { SignInScreen } from './src/screens/auth/SignInScreen';
import { LandingSignUpScreen } from './src/screens/auth/LandingSignUpScreen';
import { SignUpScreen } from './src/screens/auth/SignUpScreen';

type AuthView = 'landing-signin' | 'email-signin' | 'landing-signup' | 'email-signup';

function AppContent() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const { isAuthenticated, loading: authLoading, user: firebaseUser } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('landing-signin');
  const [skipAuth, setSkipAuth] = useState(false);

  // Initialize Google Sign-In configuration
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  if (!fontsLoaded || authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await signOut();
      // Reset local state
      setSkipAuth(false);
      setAuthView('landing-signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderAuthScreen = () => {
    switch (authView) {
      case 'landing-signin':
        return (
          <LandingSignInScreen
            onEmailSignIn={() => setAuthView('email-signin')}
            onSwitchToSignUp={() => setAuthView('landing-signup')}
            onSkipAuth={() => setSkipAuth(true)}
          />
        );
      case 'email-signin':
        return (
          <SignInScreen
            onSignInSuccess={() => {
              /* Firebase auth state will update automatically via AuthContext */
            }}
            onSwitchToSignUp={() => setAuthView('landing-signup')}
            onBack={() => setAuthView('landing-signin')}
          />
        );
      case 'landing-signup':
        return (
          <LandingSignUpScreen
            onEmailSignUp={() => setAuthView('email-signup')}
            onSwitchToSignIn={() => setAuthView('landing-signin')}
          />
        );
      case 'email-signup':
        return (
          <SignUpScreen
            onSignUpSuccess={() => setAuthView('email-signin')}
            onSwitchToSignIn={() => setAuthView('landing-signin')}
            onBack={() => setAuthView('landing-signup')}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          {isAuthenticated || skipAuth ? (
            <NavigationContainer>
              <AppNavigator
                user={firebaseUser}
                onSignOut={handleSignOut}
                isGuestMode={skipAuth && !isAuthenticated}
              />
            </NavigationContainer>
          ) : (
            renderAuthScreen()
          )}
          <StatusBar style="auto" />
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
