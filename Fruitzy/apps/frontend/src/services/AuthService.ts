import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  User,
  UserCredential,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { auth } from '../config/firebaseService';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { AuthError, UserData } from '../types/auth';

// Complete the Google auth session (for web fallback)
WebBrowser.maybeCompleteAuthSession();

// Dynamically import GoogleSignin to handle cases where native module isn't available (Expo managed workflow)
let GoogleSignin: any = null;
let statusCodes: any = null;
let isGoogleSignInAvailable = false;

try {
  if (Platform.OS !== 'web') {
    const googleSignInModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleSignInModule.GoogleSignin;
    statusCodes = googleSignInModule.statusCodes;
    isGoogleSignInAvailable = true;
  }
} catch (error) {
  // Native module not available (Expo managed workflow without custom dev build)
  console.warn('Google Sign-In native module not available. Using web fallback for mobile.');
  isGoogleSignInAvailable = false;
}

/**
 * Configure Google Sign-In
 * This should be called once when the app starts
 * Only configures if native module is available
 */
export const configureGoogleSignIn = (): void => {
  if (Platform.OS !== 'web' && isGoogleSignInAvailable && GoogleSignin) {
    try {
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      
      if (!webClientId || webClientId.includes('YOUR_') || webClientId.includes('your-')) {
        console.warn('⚠️ Google Sign-In: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not configured. Google Sign-In will not work on Android/iOS.');
        isGoogleSignInAvailable = false;
        return;
      }

      GoogleSignin.configure({
        webClientId: webClientId, // Firebase Web Client ID (required for Android)
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // Optional: Only needed for iOS
        scopes: ['profile', 'email'],
        offlineAccess: true, // If you want to access Google API on behalf of the user FROM YOUR SERVER
        forceCodeForRefreshToken: true, // Force account picker to show on each sign-in
      });
      
      console.log('✅ Google Sign-In configured successfully');
      console.log('📋 Web Client ID (first 30 chars):', webClientId ? `${webClientId.substring(0, 30)}...` : 'NOT SET');
      console.log('📋 Web Client ID (full):', webClientId || 'NOT SET');
      console.log('📦 Package Name:', Platform.OS === 'android' ? 'com.fruitzy.app' : 'N/A');
      console.log('🔑 Environment variable loaded:', !!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
    } catch (error) {
      console.error('❌ Failed to configure Google Sign-In:', error);
      isGoogleSignInAvailable = false;
    }
  }
};

/**
 * AuthService - Handles all authentication operations
 */

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  fullName: string | null,
  username: string | null
): Promise<User> => {
  try {
    // Create user account
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user: User = userCredential.user;

    // Update user profile with display name
    if (fullName) {
      await updateProfile(user, {
        displayName: fullName,
      });
    }

    // Send email verification
    await sendEmailVerification(user);

    // Store additional user data in Firestore
    if (username || fullName) {
      const userData: UserData = {
        email: user.email || '',
        fullName: fullName || '',
        username: username || '',
        createdAt: new Date().toISOString(),
        emailVerified: false,
      };
      await setDoc(doc(db, 'users', user.uid), userData);
    }

    return user;
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
};

/**
 * Sign in with Google
 * Uses native Google Sign-In library for mobile (if available), Firebase popup for web
 * Falls back to web method on mobile if native module isn't available (Expo managed workflow)
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    // Use web popup method for web
    if (Platform.OS === 'web') {
      // Web implementation - use Firebase's built-in signInWithPopup
      const provider = new GoogleAuthProvider();
      const result: UserCredential = await signInWithPopup(auth, provider);
      
      // Store user data in Firestore if new user
      const user: User = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const userData: UserData = {
          email: user.email || '',
          fullName: user.displayName || '',
          username: '',
          createdAt: new Date().toISOString(),
          emailVerified: true, // Google accounts are pre-verified
        };
        await setDoc(doc(db, 'users', user.uid), userData);
      }
      
      return user;
    } else if (!isGoogleSignInAvailable || !GoogleSignin) {
      // Native module not available (Expo managed workflow without custom dev build)
      throw new Error('Google Sign-In requires a custom development build. Please use email/password sign-in or create a custom dev build with EAS Build.');
    } else {
      // Mobile implementation using native Google Sign-In library
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Sign out first to ensure account picker is shown
      // This allows users to choose which Google account to use
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        // Ignore if already signed out
      }
      
      // Get user info from Google Sign-In (will show account picker)
      console.log('🔵 Attempting Google Sign-In...');
      const userInfo = await GoogleSignin.signIn();
      console.log('🟢 Google Sign-In successful, received user info');
      
      // Extract idToken from the response
      // GoogleSignin.signIn() returns an object with idToken at the top level
      const idToken = (userInfo as any).idToken || (userInfo as any).data?.idToken;

      if (!idToken) {
        throw new Error('Google sign-in failed: missing id_token. Please check your SHA-1 fingerprint is registered in Firebase Console.');
      }

      // Create Firebase credential using the Google ID token
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential: UserCredential = await signInWithCredential(auth, googleCredential);
      
      // Store user data in Firestore if new user
      const user: User = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const userData: UserData = {
          email: user.email || '',
          fullName: user.displayName || '',
          username: '',
          createdAt: new Date().toISOString(),
          emailVerified: true, // Google accounts are pre-verified
        };
        await setDoc(doc(db, 'users', user.uid), userData);
      }
      
      return user;
    }
  } catch (error: any) {
    // Log the full error for debugging
    console.error('🔴 Google Sign-In Error Details:', {
      code: error.code,
      message: error.message,
      error: JSON.stringify(error, null, 2),
    });
    
    // Log the full error object to see all properties
    console.error('🔴 Full Error Object:', error);
    console.error('🔴 Error String:', error.toString());
    console.error('🔴 Error Code:', error.code);
    console.error('🔴 Error Message:', error.message);

    // Handle Google Sign-In specific errors
    if (statusCodes && error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('Google sign-in was cancelled');
    } else if (statusCodes && error.code === statusCodes.IN_PROGRESS) {
      throw new Error('Google sign-in is already in progress');
    } else if (statusCodes && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services is not available');
    } else if (error.code === '10' || error.message?.includes('DEVELOPER_ERROR')) {
      // Preserve original Google error message
      const originalError = error.message || error.toString();
      const detailedMessage = `DEVELOPER_ERROR: ${originalError}\n\nPlease check:\n1. SHA-1 fingerprint (7C:02:ED:E8:5B:A0:DC:6E:78:F0:4B:86:9D:47:9C:0A:2F:77:C7:A4) is registered in Firebase Console for package: com.fruitzy.app\n2. Android OAuth client ID is configured in Google Cloud Console with the same SHA-1\n3. webClientId matches your Firebase Web Client ID\n4. Package name in Firebase Console matches: com.fruitzy.app`;
      throw new Error(detailedMessage);
    } else if (error.message?.includes('popup') || error.message?.includes('pop-up')) {
      // Fallback error for web popup issues
      throw new Error('Google sign-in popup was blocked. Please allow popups and try again.');
    }
    
    // For other errors, preserve the original error message
    const errorMessage = error.message || error.toString() || 'Unknown Google Sign-In error';
    throw new Error(errorMessage);
  }
};

/**
 * Sign out current user
 * Also signs out from Google Sign-In to show account picker on next login
 */
export const signOut = async (): Promise<void> => {
  try {
    // Sign out from Firebase
    await firebaseSignOut(auth);
    
    // Sign out from Google Sign-In (if on mobile and native module is available)
    // This ensures the account picker is shown on next Google Sign-In
    if (Platform.OS !== 'web' && isGoogleSignInAvailable && GoogleSignin) {
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        // Ignore errors if user wasn't signed in with Google
        console.log('Google Sign-In sign out:', error);
      }
    }
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
};

/**
 * Resend email verification
 */
export const resendEmailVerification = async (): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    await sendEmailVerification(user);
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
};

/**
 * Handle and format authentication errors
 */
const handleAuthError = (error: AuthError): AuthError => {
  let message = 'An error occurred during authentication';

  switch (error.code) {
    case 'auth/email-already-in-use':
      message = 'This email is already registered. Please sign in instead.';
      break;
    case 'auth/invalid-email':
      message = 'Please enter a valid email address.';
      break;
    case 'auth/operation-not-allowed':
      message = 'This sign-in method is not enabled. Please contact support.';
      break;
    case 'auth/weak-password':
      message = 'Password is too weak. Please use at least 6 characters.';
      break;
    case 'auth/user-disabled':
      message = 'This account has been disabled. Please contact support.';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email. Please sign up first.';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password. Please try again.';
      break;
    case 'auth/too-many-requests':
      message = 'Too many failed attempts. Please try again later.';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your internet connection.';
      break;
    case 'auth/invalid-credential':
      message = 'Invalid credentials. Please check your email and password.';
      break;
    default:
      message = error.message || message;
  }

  const formattedError: AuthError = new Error(message) as AuthError;
  formattedError.code = error.code;
  return formattedError;
};

