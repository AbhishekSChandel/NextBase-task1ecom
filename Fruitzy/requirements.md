# Build a small shopping app (React Native) connected to Firebase.

The app should use the provided Figma UI as the design reference and Firebase as backend (Auth + Firestore).
Take reference from the figma design files.

---

## 1. Project Setup

- Create a new mobile app project (React Native / Expo preferred).
- Integrate Firebase SDK:
  - Firebase Authentication
  - Cloud Firestore

- Add environment/config file for Firebase credentials (don’t hard-code keys in the code).

---

## 2. Authentication Flow

Objective: Implement full authentication using Firebase.

- Configure Firebase Authentication providers:
  - Email & Password
  - Google Sign-In
  - Apple Sign-In (for iOS)

- Implement screens (based on Figma UI):
  - Sign Up screen
    - Fields: email, password, full name, username (or as shown in Figma).
    - Option to sign up with Google and Apple.

  - Login screen
    - Email/password login
    - Google login
    - Apple login

- Email Verification
  - After creating an account with email/password:
    - Send email verification.
    - Show a message telling the user to verify their email.
    - Prevent access to the main app until the email is verified.

- Handle basic error states:
  - Wrong password
  - Email already in use
  - Network issues

---

## 3. Firestore Setup & Seed Data

Objective: Store and fetch products from Firestore.

- In Firestore, create a products collection.
- Add at least 10 product items with fields like: ( I have already added the product data in the second tab.Use that data and add it into Firebase Firestore.)
  - id
  - name
  - description
  - price
  - imageUrl
  - stock (for inventory)

- Implement a function in the app that:
  - Fetches all products from Firestore.
  - Maps them into the app’s product model/state.
  - Handles loading and error states gracefully.

---

## 4. Home Screen

Objective: Show user header, ads carousel, and product list.

- Implement Home screen UI to match the Figma design:
  - Header
    - Left: circular avatar using the first letter of user’s first name (e.g., “M” for “Meet”).
    - Center: show the user’s username.
    - Right: Cart icon (navigates to Cart screen).

  - Advertisement Carousel
    - Add 3 advertisement cards in a horizontal carousel.
    - Use the design/content from the Figma file (images/text as close as possible).
    - Auto-swipe or manual swipe is fine.

  - Product List
    - Display products fetched from Firestore.
    - Show name, price, image, and any UI elements from Figma.
    - On tap of a product → navigate to Product Details screen.

---

## 5. Search Screen

Objective: Allow user to search products.

- Implement a Search screen (UI as per Figma).
- Features:
  - Search input at the top.
  - Filter products by name (basic text search on the client side).
  - Show list of matching products.
  - Clicking a product opens the Product Details screen.

---

## 6. Product Details Screen

Objective: Show full product info and allow adding to cart.

- Implement Product Details screen according to Figma:
  - Show product image, name, price, description, and any other fields.
  - Show current available stock (from Firestore).
  - Add “Add to Cart” button.

- Behavior:
  - When user taps “Add to Cart”:
    - Add/update product in the local cart state (or Firestore cart collection if you prefer).
    - Validate inventory (don’t allow quantity > stock).
    - Optionally show a success toast/snackbar.

---

## 7. Cart Screen

Objective: Show items added to cart and support basic cart operations.

- Implement Cart screen as per Figma UI:
  - List all items in the cart with:
    - Product name, image, price, quantity.

  - Show cart total price.
  - Allow:
    - Increase/decrease quantity.
    - Remove item from cart.

- Optional: Add a “Checkout” button (no payment needed; just a placeholder or success message).

---

## 8. Inventory Management (Firestore)

Objective: Keep inventory in sync with user actions.

- Store stock for each product in Firestore.
- When user adds to cart or changes quantity, handle inventory in one of these ways:
  - Simple approach (acceptable for this task):
    - Check product stock from Firestore before allowing “Add to Cart”.
    - If stock is 0 → disable Add to Cart / show “Out of stock”.

  - Slightly advanced (bonus):
    - On “Checkout”, reduce the stock value in Firestore for each purchased product.

- Make sure UI updates when stock is low or out.

---

## 9. General Requirements

- Follow the provided Figma design as closely as possible:
  - Colors, spacing, font sizes, button styles, etc.

- Write clean, organized code:
  - Separate UI components, hooks, and services (e.g., firebaseService, authService).

- Handle loading and error states:
  - Loading spinners when fetching products or signing in.
  - User-friendly error messages.

---

## 10. Deliverables for the Interview

- Git repository URL with:
  - Source code
  - README with:
    - Setup steps (how to run the app)
    - Firebase configuration instructions
    - Any assumptions or limitations

- Short note (or section in README) explaining:
  - How authentication works.
  - How Firestore data is structured (collections/fields).
  - How inventory updates are handled.

Primary Font Likely: Poppins

Secondary/Body Font Likely: Inter

Alternative possibilities: Montserrat, Roboto
