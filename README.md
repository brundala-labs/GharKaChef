# GharKaChef - Verified Home Chefs Marketplace (Demo)

A React Native (Expo) marketplace for verified home chefs in Canada, tailored to Indian customers and cuisines. Features glassmorphism UI, role-based auth, pre-order meal planning, and a full chef dashboard.

**Live Demo:** [gharkachef.vercel.app](https://gharkachef.vercel.app)

**This is a demo app with mock data. No backend, no database. State persists via localStorage.**

## Quick Start

```bash
npm install
npx expo start
```

Press `w` for web, `i` for iOS Simulator, `a` for Android Emulator.

### Web Deployment

```bash
npx expo export --platform web
# Patch dist/index.html CSS (see dist/index.html for custom styles)
cd dist && vercel --prod
```

## Tech Stack

- **React Native** (Expo SDK 54)
- **TypeScript**
- **React Navigation** (Bottom Tabs + Native Stack)
- **expo-linear-gradient** (gradient backgrounds)
- **expo-blur** (glassmorphism on native)
- **Emoji icons** (no vector icon font dependency)
- **React Context + useReducer** (state management)
- **localStorage** (web state persistence)

No heavy libraries. No backend. No databases.

## App Flow

```
Welcome Screen
├── "Order Food" → Customer Signup → Customer Tabs
│   ├── Home (Browse Chefs → Chef Details → Cart)
│   ├── Pre-Order (Limited Drops, Upcoming Meals, Weekly Plans)
│   ├── My Orders (Order History)
│   └── Profile (Account + Logout)
│
└── "I'm a Chef" → Chef Signup → Chef Tabs
    ├── Dashboard (Orders, Settings, Plan a Meal)
    └── Profile (Account + Logout)
```

## 2-Minute Demo Script

### Act 1: Customer Orders (60 sec)
1. Open app → tap **"Order Food"** → sign up with name & phone
2. **Browse** chefs — search, filter by cuisine/prep time/verified/online
3. Tap a chef → view badges, menu with modifiers, allergen tags
4. Add items → **"Go to Cart"** → select pickup slot → **"Place Order"**
5. Switch to **Pre-Order** tab — see Limited Drops (countdown!), Upcoming Meals, Weekly Plans
6. Pre-order a meal or subscribe to a weekly plan

### Act 2: Chef Manages (60 sec)
1. Logout → tap **"I'm a Chef"** → sign up
2. See **Dashboard** — toggle online/offline, set prep window, adjust capacity
3. View incoming orders → **Accept** → **Start Cooking** → **Mark Ready**
4. Tap **"Plan a Meal"** → create tomorrow's meal with price and max orders
5. The planned meal appears in the customer's Pre-Order tab

## Project Structure

```
GharKaChef/
├── App.tsx                           # Navigation: RootStack → CustomerTabs / ChefTabs
├── src/
│   ├── theme.ts                      # Colors, spacing, radius, typography
│   ├── types.ts                      # TypeScript interfaces
│   ├── utils.ts                      # Pickup slots, formatting
│   ├── data/
│   │   └── mock.ts                   # 10 chefs, 70+ dishes, planned meals, reviews
│   ├── context/
│   │   └── AppContext.tsx             # Global state + localStorage persistence
│   ├── components/
│   │   └── GlassCard.tsx             # Glassmorphism card (blur on native, backdrop-filter on web)
│   └── screens/
│       ├── WelcomeScreen.tsx          # Role selection (Customer / Chef)
│       ├── CustomerSignupScreen.tsx   # Customer registration
│       ├── ChefSignupScreen.tsx       # Chef registration with cuisine picker
│       ├── BrowseScreen.tsx           # Chef listing with search & filters
│       ├── ChefDetailsScreen.tsx      # Chef profile, menu, modifiers, reviews
│       ├── CartScreen.tsx             # Cart, pickup slots, place order
│       ├── PreOrderScreen.tsx         # Limited Drops, Upcoming Meals, Weekly Plans
│       ├── ChefModeScreen.tsx         # Chef dashboard + order management + plan meals
│       ├── OrderHistoryScreen.tsx     # Past orders
│       └── ProfileScreen.tsx          # User profile + logout
├── docs/
│   └── PROJECT_DOCUMENT.md           # Full project document
└── dist/                             # Web build output (deployed to Vercel)
```

## Features

### Customer
- Role-based signup and login (persisted via localStorage)
- Browse 10 Indian chefs with diverse regional cuisines
- Search by name, cuisine, or meal
- Filter by prep time (4h/8h), verified status, online status
- Chef details with verified badges, star ratings, and reviews
- Menu with modifiers (spice level, portion size, add-ons)
- Allergen tags and veg/non-veg indicators on every item
- Cart with quantity controls and pickup slot selection
- **Pre-Order tab**: Limited Drops with countdown, Upcoming Meals, Weekly Plans
- Order history

### Chef
- Dashboard with online/offline toggle
- Prep window setting (4h / 8h)
- Daily capacity management
- Order workflow: Placed → Accepted → Cooking → Ready
- **Plan a Meal**: Create planned meals for future dates
- Toggle limited drops with max order limits

### UI / UX
- Glassmorphism cards with backdrop-filter blur on web
- Gradient backgrounds (peach → cream → lavender)
- Mobile-first layout (480px max-width on desktop with dark surround)
- Emoji icons (no font dependency, cross-platform)
- Bottom tab navigation with 4 customer tabs, 2 chef tabs
- Reset Demo Data button on Welcome screen

## Cuisines

Telugu, Tamil, Kerala, Punjabi, Gujarati, Hyderabadi, Bengali, Indo-Chinese, Chaat & Street Food, South Indian Fusion
