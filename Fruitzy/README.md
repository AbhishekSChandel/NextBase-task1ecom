# Fruitzzy Monorepo

Expo + Firebase shopping experience referenced from the provided Figma files.  
We follow **Rule 1**: build and verify one component/feature at a time.

# Techstack

- Expo (React Native) with TypeScript for a cross‑platform app
- Firebase Firestore, Auth, and Functions for data, auth, backend tasks
- NativeWind for styling; @expo/vector-icons and expo-image for assets
- Monorepo with npm workspaces and shared `@fruitzy/config` package
- Prettier formatting, React Navigation, and safe‑area layout utilities
-

# Features

- Home screen with priority products, search bar, and ad carousel
- Small “refresh” button under Popular to reset stock to original
- Out‑of‑stock UX: disabled add, slight gray, tiny label under name
- Cart with quantity controls, remove items, total, and checkout navigation
- Authentication with email/password and Google sign‑in; guest greeting
-

## Structure

- `apps/frontend` – Expo (TypeScript) client using NativeWind.
- `apps/backend` – Firebase Cloud Functions + Firestore seed helpers.
- `packages/config` – Shared typed Firebase configuration utilities.

## Prerequisites

- Node.js 18+
- npm (workspace-aware)
- Firebase CLI (`npm install -g firebase-tools`)

## Workspace Scripts

| Command                | Description                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev:frontend` | Starts the Expo app (runs frontend workspace `start` script).    |
| `npm run dev:backend`  | Runs the Firebase Functions emulator (`npm run dev` in backend). |
| `npm run format`       | Checks formatting with Prettier.                                 |
| `npm run format:write` | Applies Prettier formatting across the repo.                     |

Each workspace exposes additional scripts documented in its own README once created.

## Environment Configuration

1. Duplicate `.env.example` (to be added) into `.env` files under each workspace.
2. Supply Firebase project credentials (API key, auth domain, project ID, etc.).
3. Never commit real secrets.

## Setup Steps

- Install dependencies: `npm install`
- Configure environment files:
  - Copy `apps/frontend/env.example` to `apps/frontend/.env`
  - Copy `apps/backend/env.example` to `apps/backend/.env`
- Start frontend: `npm run dev:frontend`
- Start backend emulators (optional): `npm run dev:backend`
- Open the Expo dev tools and run on web (`w`) or device.

## Firebase Configuration Instructions

- Frontend reads config from Expo `extra` via environment variables set in `apps/frontend/app.config.js` (apps/frontend/app.config.js:25).
- Firebase is initialized in `apps/frontend/src/services/firebase.ts` (apps/frontend/src/services/firebase.ts:6) using these values.
- Example variables: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, `FIREBASE_MEASUREMENT_ID`.
- Backend scripts load `.env` using `dotenv` in `apps/backend/src/seed-products.ts` (apps/backend/src/seed-products.ts:4).

## Assumptions & Limitations

- Authentication uses Firebase Web SDK; Google sign-in uses popup flow on web.
- Email verification is designed but may be relaxed for local testing.
- Inventory checkout reduction is a future enhancement; stock checks are enforced before adding to cart.
- Design images are bundled locally under `apps/frontend/assets/` for performance.
- if google auth fails , please use email sign-in /signup. it is fully operational and tested.
- the homescreen conatins a small logout button in the top right corner. it logs out the user and redirects to the sign-in screen.

## How Authentication Works

- Email/Password sign-in uses `signInWithEmailAndPassword` in `SignInScreen` (apps/frontend/src/screens/auth/SignInScreen.tsx:32).
- Google Sign-In uses Firebase `GoogleAuthProvider` and popup flow in `googleAuth.ts` (apps/frontend/src/services/googleAuth.ts:89).
- Firebase app and services are initialized in `firebase.ts` (apps/frontend/src/services/firebase.ts:6).

## Firestore Data Structure

- Collections are standardized via `COLLECTIONS` in `@fruitzy/config` (packages/config/src/firebase-config.ts:64).
- Product fields include `id`, `name`, `description`, `price`, `imageUrl`, `stock` as shown in the backend seed script (apps/backend/src/seed-products.ts:11).
- Frontend product fetching and image resolution are handled in `productService.ts` (apps/frontend/src/services/productService.ts:1).

## Inventory Updates

- Simple approach: check `stock` before allowing add-to-cart; UI should prevent quantities exceeding available stock.
- Advanced approach (planned): on checkout, decrement `stock` per purchased item in Firestore with a transactional update.

## Development Workflow

1. Pick the next agreed feature/file.
2. Implement changes in small increments.
3. Run relevant workspace scripts/tests.
4. Share for review/testing before continuing.

## Upcoming Features

- Expo + NativeWind bootstrap with theme toggle.
- Firebase Functions scaffold with Firestore seed utilities referencing `firebasedata.md`.
- Shared config package for consistent Firebase initialization.
