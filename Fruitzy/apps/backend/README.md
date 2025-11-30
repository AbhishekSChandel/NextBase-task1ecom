# Fruitzy Backend (Firebase Functions)

Firebase Cloud Functions and Firestore backend for the Fruitzy shopping app.

## Setup

1. **Install Firebase CLI** (if not already installed):

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```bash
   firebase login
   ```

3. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication (Email/Password, Google, Apple)

4. **Update Firebase Project ID**:
   - Edit `.firebaserc` and replace `your-firebase-project-id` with your actual project ID

5. **Install Dependencies**:
   ```bash
   npm install
   ```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm run serve` - Start Firebase emulators locally
- `npm run deploy` - Deploy functions to Firebase

## Local Development

Start the Firebase emulators:

```bash
npm run serve
```

This will start:

- Functions emulator on port 5001
- Firestore emulator on port 8080
- Emulator UI on port 4000

## Environment Variables

Create a `.env` file with your Firebase service account credentials (for seed script):

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
```

## Project Structure

```
apps/backend/
├── src/
│   └── index.ts          # Cloud Functions entry point
├── lib/                  # Compiled JavaScript (gitignored)
├── firebase.json         # Firebase configuration
├── firestore.rules       # Firestore security rules
├── firestore.indexes.json # Firestore indexes
└── tsconfig.json         # TypeScript configuration
```
