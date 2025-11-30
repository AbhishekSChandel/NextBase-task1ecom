// Firebase Configuration for Authentication
// Reuses the existing Firebase app instance and auth from services/firebase.ts
// to ensure compatibility with existing Firestore operations

import { auth } from '../services/firebase';

// Re-export auth for use in AuthService
// The auth instance is already initialized in services/firebase.ts with proper persistence
export { auth };

