# GharKaChef - Verified Home Chefs Marketplace (Demo)

A lightweight React Native (Expo) demo app — a marketplace for verified home chefs in Canada, tailored to Indian customers and cuisines.

**This is a demo app with mock data only. No backend, no database.**

## Quick Start

```bash
npm install
npx expo start
```

Then press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code with Expo Go on your phone.

## Tech Stack

- **React Native** (Expo SDK 54)
- **TypeScript**
- **React Navigation** (Bottom Tabs + Native Stack)
- **expo-linear-gradient** (gradient backgrounds)
- **expo-blur** (glassmorphism cards)
- **@expo/vector-icons** (Ionicons)
- **React Context + useReducer** (state management)

No heavy libraries. No backend. No databases.

## 2-Minute Demo Script

### 1. Browse Chefs (Order Food tab)
- Notice the "Demo only — mock data" banner at top
- Scroll through 10 chef cards with Indian cuisines (Telugu, Tamil, Kerala, Punjabi, etc.)
- Try the **search bar** — type "Punjabi" or "Anjali"
- Tap **"Online"** chip to filter to online chefs only
- Tap **"Verified"** chip to show only fully-verified chefs
- Tap **"4h Prep"** to filter by prep window

### 2. View Chef Details & Menu
- Tap on **"Harsha Singh"** (Punjabi cuisine)
- See the hero image, badges, rating, distance
- Toggle the **Prep Window** between 4h and 8h — watch pickup slots change
- See the menu with veg/non-veg indicators and allergen tags
- Tap **"+"** on Chole Bhature, Paneer Butter Masala, and Rajma Chawal
- Notice the sticky footer showing item count and total
- Tap **"Go to Cart"**

### 3. Place an Order
- Adjust quantities with +/- buttons
- Select a **pickup window** (e.g., the second slot)
- Enter your **Name** and **Phone**
- Tap **"Place Order"**
- See the confirmation modal with Order ID, status, and pickup time
- Tap **"Done"**

### 4. Chef Mode — Accept & Process Orders
- Switch to the **"Chef Mode"** tab
- Tap the chef picker dropdown and select **"Harsha Singh"**
- See the order you just placed in the incoming list
- Toggle the **Online/Offline** switch — notice the offline banner
- Toggle back Online
- Adjust **capacity** with the stepper
- On the order card: tap **"Accept"** → status changes to Accepted
- Tap **"Start Cooking"** → status changes to Cooking
- Tap **"Mark Ready"** → shows "Ready for customer pickup!"

### 5. Try Edge Cases
- Go back to Browse, find an offline chef (Kavya Patel or Suman Agarwal)
- Open their details — notice the "This chef is currently offline" banner
- In Chef Mode, toggle a chef offline, then try to order from them — you'll get an alert

## Project Structure

```
GharKaChef/
├── App.tsx                    # Entry point with navigation
├── src/
│   ├── theme.ts               # Colors, spacing, radius, typography
│   ├── types.ts               # TypeScript interfaces
│   ├── utils.ts               # Pickup slot generation, formatting
│   ├── data/
│   │   └── mock.ts            # 10 chefs with 6-8 menu items each
│   ├── context/
│   │   └── AppContext.tsx      # React Context + useReducer
│   ├── components/
│   │   └── GlassCard.tsx      # Reusable glassmorphism card
│   └── screens/
│       ├── BrowseScreen.tsx    # Chef listing with search & filters
│       ├── ChefDetailsScreen.tsx # Chef profile, menu, add to cart
│       ├── CartScreen.tsx      # Cart, pickup slot, place order
│       └── ChefModeScreen.tsx  # Chef dashboard with order management
```

## Features

- 10 Indian chefs with diverse cuisines
- Glassmorphism UI with gradient backgrounds
- Search and filter (prep time, verified, online)
- Dynamic pickup slot generation based on prep window
- Full order flow: browse → add to cart → place order
- Chef mode: online/offline toggle, capacity management, order acceptance workflow
- Allergen tags on all menu items
- Veg/Non-veg indicators
