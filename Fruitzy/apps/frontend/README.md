# Fruitzy Frontend (Expo + React Native)

Mobile app for Fruitzy shopping experience built with Expo, TypeScript, NativeWind, and Firebase.

## Features Implemented

### ✅ Phase 1: Foundation

- NativeWind + Tailwind CSS configured with Figma color scheme
- Poppins + Inter fonts loaded
- Light/Dark theme toggle with ThemeContext
- Responsive UI components

### ✅ Phase 2: Authentication

- Email/Password Sign Up with email verification
- Email/Password Sign In
- Auth state persistence
- Sign Out functionality
- Protected routes (Home screen only accessible when authenticated)

## Prerequisites

- Node.js 18+
- npm
- Expo CLI
- Firebase project with Authentication enabled

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** → Email/Password provider
4. Enable **Firestore Database**
5. Go to Project Settings → Your Apps → Add Web App
6. Copy the Firebase config values

### 3. Create Environment File

```bash
# Copy the example env file
cp env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Running the App

### Start Development Server

```bash
npm start
```

This will open Expo DevTools. Then:

- Press `w` to open in **web browser** (easiest for testing)
- Press `a` to open in **Android emulator**
- Press `i` to open in **iOS simulator** (macOS only)
- Scan QR code with **Expo Go app** on your phone

## Testing Authentication

### Test Sign Up Flow

1. Run the app
2. You'll see the **Sign In screen**
3. Tap **"Sign up"** link at the bottom
4. Fill in:
   - Full Name: Test User
   - Email: test@example.com
   - Password: test123 (min 6 characters)
5. Tap **"Create Account"**
6. Check your email for verification link
7. Click the verification link
8. Return to app and sign in

### Test Sign In Flow

1. On **Sign In screen**, enter:
   - Email: test@example.com (verified email)
   - Password: test123
2. Tap **"Sign In with Email"**
3. You should see **Home screen** with:
   - "🎉 Authentication Working!" message
   - Your email and verification status
   - Theme toggle button
   - Sign Out button

### Test Sign Out

1. On Home screen, tap **"Sign Out"** button
2. You should return to Sign In screen

## Project Structure

```
apps/frontend/
├── src/
│   ├── components/
│   │   └── ThemeToggle.tsx       # Theme switcher component
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SignInScreen.tsx  # Sign in UI
│   │   │   └── SignUpScreen.tsx  # Sign up UI
│   │   └── HomeScreen.tsx        # Authenticated home screen
│   ├── services/
│   │   ├── firebase.ts           # Firebase initialization
│   │   └── productService.ts     # Firestore product queries
│   └── theme/
│       ├── colors.ts             # Light/dark color palettes
│       └── ThemeContext.tsx      # Theme provider & hook
├── App.tsx                       # Main app entry with auth routing
├── app.config.js                 # Expo config with env variables
├── tailwind.config.js            # Tailwind + NativeWind config
├── global.css                    # Tailwind imports
└── package.json
```

## Troubleshooting

### "Firebase not configured" error

- Check that `.env` file exists and contains valid Firebase credentials
- Restart the Expo dev server after changing `.env`
- Verify `app.config.js` is reading the environment variables

### Email verification not working

- Check spam/junk folder
- Verify Email/Password provider is enabled in Firebase Console
- Make sure you're using a real email address

### App not loading

- Clear Expo cache: `npx expo start -c`
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Next Steps

- [ ] Implement Google Sign In
- [ ] Implement Apple Sign In
- [ ] Build Home screen with product list
- [ ] Add Search screen
- [ ] Add Product Detail screen
- [ ] Add Cart functionality

## Scripts

- `npm start` - Start Expo dev server
- `npm run android` - Open on Android
- `npm run ios` - Open on iOS
- `npm run web` - Open in web browser
