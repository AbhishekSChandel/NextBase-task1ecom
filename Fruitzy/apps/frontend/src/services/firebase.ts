import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Firebase configuration from environment variables
// Uses EXPO_PUBLIC_ prefixed variables (same as auth module) with fallback for backward compatibility
// Priority: process.env.EXPO_PUBLIC_* > Constants.expoConfig.extra.EXPO_PUBLIC_* > Constants.expoConfig.extra (old format)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_API_KEY || Constants.expoConfig?.extra?.firebaseApiKey || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || Constants.expoConfig?.extra?.firebaseAuthDomain || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECT_ID || Constants.expoConfig?.extra?.firebaseProjectId || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || Constants.expoConfig?.extra?.firebaseStorageBucket || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || Constants.expoConfig?.extra?.firebaseMessagingSenderId || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || Constants.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APP_ID || Constants.expoConfig?.extra?.firebaseAppId || '',
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId,
};

// Initialize Firebase only once
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  // Initialize auth with AsyncStorage persistence for native, browser persistence for web
  // Note: initializeAuth automatically uses AsyncStorage in React Native, but we can specify it explicitly
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    // For React Native, initializeAuth uses AsyncStorage by default
    // We import getReactNativePersistence dynamically to avoid type errors
    try {
      const { getReactNativePersistence } = require('firebase/auth');
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      // Fallback: initializeAuth without explicit persistence (uses AsyncStorage by default in RN)
      auth = initializeAuth(app);
    }
  }
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  app = getApps()[0];
  try {
    auth = getAuth(app);
  } catch {
    // If auth not initialized, initialize it now
    if (Platform.OS === 'web') {
      auth = getAuth(app);
    } else {
      try {
        const { getReactNativePersistence } = require('firebase/auth');
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
      } catch {
        auth = initializeAuth(app);
      }
    }
  }
  db = getFirestore(app);
  storage = getStorage(app);
}

// Firestore automatically enables network on initialization
// Only call enableNetwork() explicitly if you've disabled it and need to re-enable

// Export app for reuse in auth module
export { app, auth, db, storage };
