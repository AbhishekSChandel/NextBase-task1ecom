import { User } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  initializing: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
}

// User Data Types
export interface UserData extends DocumentData {
  email: string;
  fullName: string;
  username: string;
  createdAt: string;
  emailVerified: boolean;
}

// Auth Service Types
export interface AuthError extends Error {
  code?: string;
  message: string;
}

