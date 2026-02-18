# GharKaChef — Project Document

**Version:** 2.0 (Demo/MVP)
**Date:** February 2026
**Platform:** iOS, Android, Web (React Native / Expo)
**Live Demo:** https://gharkachef.vercel.app
**GitHub:** https://github.com/brundala-labs/GharKaChef

---

## 1. Executive Summary

GharKaChef is a two-sided marketplace connecting **verified home chefs** with **customers** seeking authentic, home-cooked Indian meals in Canada. Think of it as "Uber for home-cooked food" — chefs toggle online/offline like Uber drivers, but instead of instant delivery, customers place orders with a **4-hour or 8-hour prep window** and choose a **pickup time slot**.

The platform focuses on the Indian diaspora in Canada, offering regional cuisines (Telugu, Tamil, Kerala, Punjabi, Gujarati, Hyderabadi, Bengali, Indo-Chinese, Chaat) from verified local kitchens.

The app supports two ordering modes:
- **Order Now** — Browse available chefs and order with a 4-8 hour prep window
- **Pre-Order** — Plan ahead with Limited Drops, Upcoming Meals, and Weekly Meal Plans

---

## 2. Problem Statement

| Pain Point | Who | Details |
|---|---|---|
| Lack of authentic home-cooked food | Indian customers in Canada | Restaurant food doesn't match ghar ka khana (home taste) |
| No platform for home chefs | Home chefs | Talented cooks have no easy way to monetize their skills |
| Trust & safety concerns | Both sides | Customers worry about food safety; chefs need verified credibility |
| Rigid restaurant model | Market | Restaurants require heavy investment; home chefs need flexibility |
| No meal planning options | Customers | Can't plan ahead for special meals or subscribe to weekly plans |

---

## 3. Solution — The GharKaChef Model

### 3.1 Uber-Like Flexibility for Chefs

| Uber Driver | GharKaChef Chef |
|---|---|
| Toggle online/offline anytime | Toggle online/offline anytime |
| Accept/decline ride requests | Accept/decline food orders |
| Set availability hours | Set prep window (4h or 8h) |
| Surge pricing | Set daily capacity limit |
| Driver rating | Chef rating + verified badges |
| — | Plan meals for future dates |
| — | Create limited drops with max orders |
| — | Offer weekly meal plan subscriptions |

### 3.2 Key Difference from Uber

- **NOT instant delivery.** Customers place orders in advance.
- **Prep windows:** 4 hours (quick meals) or 8 hours (elaborate dishes like biryani, haleem).
- **Pickup model:** Customer picks up from the chef's kitchen (no delivery logistics in MVP).
- **Scheduled slots:** Customers choose a 1-hour pickup window.
- **Pre-ordering:** Customers can pre-order planned meals days in advance.

---

## 4. Target Audience

### 4.1 Customers
- Indian families and professionals living in Canadian cities (Toronto, Vancouver, Calgary, Ottawa, Edmonton)
- Age: 25–55
- Looking for authentic regional Indian food (not generic "Indian restaurant" food)
- Value home-cooked quality, specific regional cuisines, and dietary transparency

### 4.2 Chefs
- Indian home cooks (primarily homemakers, retirees, part-time workers)
- Skilled in specific regional cuisines
- Want flexible income without restaurant overhead
- Willing to get food safety certifications

---

## 5. Feature Breakdown

### 5.1 Customer Features

| # | Feature | Description | Status |
|---|---|---|---|
| C1 | Role-Based Signup | Customer signup with name, phone, dietary preferences | Done |
| C2 | Browse Chefs | View all available chefs with cuisine, rating, distance, price level | Done |
| C3 | Search | Text search by chef name, cuisine type, or meal name | Done |
| C4 | Quick Filters | Filter by prep window (4h/8h), verified status, online status | Done |
| C5 | Chef Profile | View chef details: image, badges, rating, reviews, distance | Done |
| C6 | Menu with Modifiers | View menu with spice level, portion size, add-on modifiers | Done |
| C7 | Prep Window Selection | Choose 4-hour or 8-hour prep window | Done |
| C8 | Pickup Slot Selection | Choose from auto-generated 1-hour pickup windows | Done |
| C9 | Add to Cart | Add menu items with modifiers and quantity control | Done |
| C10 | Cart Management | View cart, adjust quantities, see running total | Done |
| C11 | Place Order | Submit order with pickup slot selection | Done |
| C12 | Order Confirmation | View order ID, status, pickup time, total | Done |
| C13 | Pre-Order: Limited Drops | Time-limited meals with countdown and max orders | Done |
| C14 | Pre-Order: Upcoming Meals | Browse planned meals from all chefs | Done |
| C15 | Pre-Order: Weekly Plans | Subscribe to weekly meal plans | Done |
| C16 | Order History | View past orders | Done |
| C17 | Allergen Awareness | Allergen tags on every menu item | Done |
| C18 | Veg/Non-Veg Indicators | Green/red dot on each item | Done |
| C19 | Chef Reviews | Read ratings and reviews for each chef | Done |
| C20 | Persistent Sessions | State survives page refresh (localStorage) | Done |
| C21 | Delivery Option | Request delivery instead of pickup | Future |
| C22 | Push Notifications | Order status updates | Future |

### 5.2 Chef Features

| # | Feature | Description | Status |
|---|---|---|---|
| K1 | Chef Signup | Register with name, phone, cuisine type, kitchen description | Done |
| K2 | Online/Offline Toggle | Go online to accept orders, offline to stop | Done |
| K3 | Prep Window Setting | Set default prep window (4 hours or 8 hours) | Done |
| K4 | Capacity Management | Set daily order capacity (stepper control) | Done |
| K5 | Incoming Orders | View new orders with customer details, items, pickup slot | Done |
| K6 | Accept/Decline Orders | Accept or decline incoming orders | Done |
| K7 | Order Status Workflow | Advance orders: Placed → Accepted → Cooking → Ready | Done |
| K8 | Plan a Meal | Create planned meals for future dates with pricing | Done |
| K9 | Limited Drops | Mark meals as limited-edition with max order count | Done |
| K10 | Verified Badges | Display: Health Permit, Inspected Kitchen, Food Handler | Done |
| K11 | Chef Identity | Dashboard shows logged-in chef's name and cuisine | Done |
| K12 | Menu Management | Add/edit/remove menu items | Future |
| K13 | Earnings Dashboard | View daily/weekly earnings | Future |

### 5.3 Platform Features

| # | Feature | Description | Status |
|---|---|---|---|
| P1 | Glassmorphism UI | Frosted glass cards with backdrop-filter blur | Done |
| P2 | Mobile-First Web | 480px container with dark surround on desktop | Done |
| P3 | Emoji Icons | Cross-platform icons without font dependencies | Done |
| P4 | Reset Demo Data | Clear localStorage from Welcome screen | Done |
| P5 | SVG Logo | Custom brand logo (house + chef hat + flame) via react-native-svg | Done |
| P6 | Back Navigation | Floating back buttons on ChefDetails and Cart screens | Done |
| P7 | Payment Processing | Stripe integration | Future |
| P8 | Real Backend | Node.js/Next.js API with PostgreSQL | Future |
| P9 | Geolocation | Show chefs by proximity | Future |

---

## 6. User Flows

### 6.1 Authentication Flow

```
┌──────────────┐
│ Welcome Screen│
│              │
│ [Order Food] │──────▶ Customer Signup ──────▶ Customer Tabs
│              │        (Name, Phone,          (Home, Pre-Order,
│ [I'm a Chef] │         Dietary Pref)          My Orders, Profile)
│              │
│ [Reset Demo] │──────▶ Chef Signup ──────────▶ Chef Tabs
└──────────────┘        (Name, Phone,          (Dashboard, Profile)
                         Cuisine, Kitchen)
```

### 6.2 Customer Flow — Order Now

```
Customer Tabs → Home Tab
    │
    ▼
┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│ Browse Screen │────▶│ Chef Details  │────▶│ Cart Screen  │
│              │     │              │     │             │
│ • Search bar │     │ • Hero image │     │ • Items +/- │
│ • Cuisine    │     │ • Badges     │     │ • Total     │
│   chips      │     │ • Reviews    │     │ • Pickup    │
│ • Filters    │     │ • Menu +     │     │   slot      │
│   (4h/8h/    │     │   modifiers  │     │ • Name/Phone│
│    Verified/  │     │ • Allergens  │     │ [Place      │
│    Online)   │     │ [Go to Cart] │     │  Order]     │
│ • Chef cards │     └──────────────┘     └──────┬──────┘
└──────────────┘                                  │
                                                  ▼
                                           ┌──────────────┐
                                           │ Confirmation  │
                                           │ Order: GKC-XX │
                                           │ Status: Placed│
                                           │    [Done]     │
                                           └──────────────┘
```

### 6.3 Customer Flow — Pre-Order

```
Customer Tabs → Pre-Order Tab
    │
    ▼
┌──────────────────────────────────────────┐
│ Pre-Order Screen                          │
│                                          │
│ • Search bar + Cuisine filter chips      │
│                                          │
│ ⚡ Limited Drops (with countdown timer)  │
│   ┌────────┐ ┌────────┐                 │
│   │ Sadya  │ │ Chole  │  [Pre-order]    │
│   │ 2 left │ │ 4 left │                 │
│   └────────┘ └────────┘                 │
│                                          │
│ 📅 Upcoming Meals                        │
│   ┌────────┐ ┌────────┐ ┌────────┐     │
│   │ Biryani│ │ Thali  │ │ Brunch │     │
│   │ Tmrw   │ │ Wed    │ │ Sat    │     │
│   │ $22.99 │ │ $18.99 │ │ $16.99 │     │
│   └────────┘ └────────┘ └────────┘     │
│                                          │
│ 🔄 Weekly Meal Plans                     │
│   ┌──────────────────────┐              │
│   │ Anjali's Telugu Thali│              │
│   │ 5 meals/week $13.99  │              │
│   │ [Subscribe]          │              │
│   └──────────────────────┘              │
└──────────────────────────────────────────┘
```

### 6.4 Chef Flow — Dashboard

```
Chef Tabs → Dashboard Tab
    │
    ▼
┌──────────────────────────────────────────┐
│ Chef Dashboard                            │
│                                          │
│ Chef: Anjali Reddy (Telugu)              │
│ ⭐ 4.9 · 3 reviews                      │
│                                          │
│ [Online ●]  Prep: [4h] [8h]             │
│ Capacity: [−] 8 [+]                     │
│                                          │
│ ── Orders ──                             │
│ ┌────────────────────────┐              │
│ │ GKC-A1B2C3  ● New      │              │
│ │ Customer: Rajesh        │              │
│ │ 2x Biryani, 1x Gulab J │              │
│ │ Pickup: 6-7 PM          │              │
│ │ [Decline] [Accept]      │              │
│ └────────────────────────┘              │
│                                          │
│ ── Planned Meals ──                      │
│ [+ Plan a Meal]                          │
│ • Sunday Biryani Feast (9/15 orders)     │
│ • Telugu Thali Special (3/10 orders)     │
│                                          │
│ ── Reviews ──                            │
│ ⭐⭐⭐⭐⭐ "Best biryani in Brampton!"  │
└──────────────────────────────────────────┘
```

### 6.5 Order Lifecycle

```
    CUSTOMER                    SYSTEM                      CHEF
    ────────                    ──────                      ────

Places order ──────────▶  Create order record  ──────────▶  New order
with items,               Status: PLACED                    notification
pickup slot               Decrease chef
                          capacity by 1

Sees "Order                                                 Reviews order
Placed"                                                     details
confirmation
                                                     ┌──────┴──────┐
                                                     ▼             ▼
                                                  ACCEPT        DECLINE
                                                     │             │
                          Status: ACCEPTED ◀─────────┘             │
                          Status: DECLINED ◀───────────────────────┘

                          (If accepted)

Could see                 Status: COOKING  ◀──── Chef taps
"Cooking"                                        "Start Cooking"
status

Could see                 Status: READY    ◀──── Chef taps
"Ready for                                       "Mark Ready"
Pickup"
status

Picks up food ────────────────────────────────── Hands over food
```

---

## 7. Business Rules & Logic

### 7.1 Order Eligibility
| Rule | Logic |
|---|---|
| Chef must be online | Customer cannot place order if chef is offline |
| Capacity not exceeded | Customer cannot place order if chef's daily capacity = 0 |
| Single chef per cart | Adding items from a different chef clears the cart |
| Pre-order availability | Planned meals have max order limits; sold out = no more orders |

### 7.2 Pickup Slot Generation
```
Earliest Ready Time = Current Time + Prep Window (4h or 8h)
Round up to next full hour

Generate 3 slots:
  Slot 1: [Earliest] to [Earliest + 1h]
  Slot 2: [Earliest + 1h] to [Earliest + 2h]
  Slot 3: [Earliest + 2h] to [Earliest + 3h]

Example (current time 1:30 PM, prep = 4h):
  Ready at: 5:30 PM → round to 6 PM
  Slot 1: 6 PM – 7 PM
  Slot 2: 7 PM – 8 PM
  Slot 3: 8 PM – 9 PM
```

### 7.3 Capacity Management
- Capacity decreases by 1 when an order is **placed** (not when accepted)
- Chef can manually adjust capacity via stepper
- When capacity reaches 0, new orders are blocked

### 7.4 Planned Meals
| Type | Description |
|---|---|
| Upcoming Meal | Regular planned meal for a future date (lunch or dinner) |
| Limited Drop | Time-limited meal with countdown timer and max orders |
| Weekly Plan | Recurring subscription (X meals/week at Y price/meal) |

### 7.5 Verification Badges
| Badge | Meaning |
|---|---|
| Health Permit | Chef has a valid health permit from local authority |
| Inspected Kitchen | Chef's kitchen has passed a cleanliness inspection |
| Food Handler | Chef has completed food handler certification |
| "Fully Verified" | Chef has ALL three badges |

### 7.6 Menu Modifiers
| Modifier Type | Example Options |
|---|---|
| Spice Level | Mild, Medium, Hot |
| Portion Size | Regular, Family (4 servings) (+$12-18) |
| Add Protein | No protein, Add Chicken (+$3.99), Add Paneer (+$2.99) |
| Add-on | Extra Naan (+$3.99), Extra Rice (+$2.99), Raita (+$1.99) |

### 7.7 Filter Logic
| Filter | Behavior |
|---|---|
| "4h Prep" | Show only chefs with `defaultPrepWindowHours === 4` |
| "8h Prep" | Show only chefs with `defaultPrepWindowHours === 8` |
| "Verified" | Show only chefs with all 3 badges |
| "Online" | Show only chefs with `isOnline === true` |
| Search | Filter by chef name OR cuisine (case-insensitive) |

---

## 8. Data Model

### 8.1 Chef
```typescript
{
  id: string
  name: string
  cuisine: string              // "Telugu", "Punjabi", etc.
  rating: number               // 1.0 – 5.0
  distanceKm: number
  priceLevel: 1 | 2 | 3       // $ / $$ / $$$
  verifiedBadges: VerifiedBadge[]
  isOnline: boolean
  defaultPrepWindowHours: 4 | 8
  dailyCapacity: number
  imageUrl: string
  menuItems: MenuItem[]
  plannedMeals?: PlannedMeal[]
  reviews?: Review[]
  weeklyPlan?: WeeklyPlan
}
```

### 8.2 Menu Item
```typescript
{
  id: string
  name: string
  price: number                // CAD
  description: string
  allergens: AllergenTag[]     // nuts, dairy, gluten, eggs, soy, shellfish
  isVeg: boolean
  modifiers?: MenuModifier[]   // spice level, portion size, add-ons
}
```

### 8.3 Menu Modifier
```typescript
{
  id: string
  name: string                 // "Spice Level", "Portion Size"
  options: {
    label: string              // "Mild", "Family (4 servings)"
    priceAdjustment: number    // 0, 12.00, etc.
  }[]
}
```

### 8.4 Planned Meal
```typescript
{
  id: string
  chefId: string
  name: string
  description: string
  image: string
  price: number
  date: string                 // "2026-02-19"
  timeSlot: 'lunch' | 'dinner'
  maxOrders: number
  currentOrders: number
  allergens: string[]
  isVegetarian: boolean
  isLimitedDrop: boolean
  dropExpiresAt?: string       // ISO datetime for countdown
}
```

### 8.5 Review
```typescript
{
  id: string
  chefId: string
  customerName: string
  rating: number               // 1-5
  text: string
  date: string
}
```

### 8.6 Weekly Plan
```typescript
{
  id: string
  chefId: string
  mealsPerWeek: number
  pricePerMeal: number
  description: string
  dietaryOptions: string[]     // "Vegetarian", "Non-Vegetarian", "Jain"
}
```

### 8.7 Cart Item
```typescript
{
  menuItem: MenuItem
  chefId: string
  quantity: number
  isPreOrder?: boolean
  selectedModifiers?: { modifierId: string; optionLabel: string; priceAdjustment: number }[]
}
```

### 8.8 Order
```typescript
{
  id: string                   // "GKC-XXXXXX"
  chefId: string
  customerName: string
  customerPhone: string
  items: CartItem[]
  total: number
  pickupSlot: string           // "6 PM – 7 PM"
  status: 'placed' | 'accepted' | 'cooking' | 'ready' | 'declined'
  createdAt: Date
}
```

### 8.9 User Profile
```typescript
{
  name: string
  phone: string
  role: 'customer' | 'chef'
  dietaryPreference?: string   // customer only
  cuisineType?: string         // chef only
  kitchenDescription?: string  // chef only
}
```

### 8.10 App State
```typescript
{
  cart: CartItem[]
  cartChefId: string | null
  orders: Order[]
  chefs: Chef[]                // 10 mock chefs with menus, planned meals, reviews
  userProfile: UserProfile | null
}
```

State is managed via React Context + useReducer with 15 action types. On web, state is persisted to localStorage and restored on page load.

---

## 9. Screen Inventory

| # | Screen | Location | Description |
|---|---|---|---|
| 1 | Welcome | Auth | Logo + role selection: "Order Food" or "I'm a Chef" + Reset Demo Data |
| 2 | Customer Signup | Auth | Name, phone, dietary preference |
| 3 | Chef Signup | Auth | Name, phone, cuisine picker, kitchen description |
| 4 | Browse | Customer > Home | Logo mark, chef listing with search, cuisine chips, filter chips |
| 5 | Chef Details | Customer > Home | Back button, chef profile, badges, reviews, menu with modifiers, cart footer |
| 6 | Cart | Customer > Home | Back button, cart items, pickup slot selector, place order, confirmation modal |
| 7 | Pre-Order | Customer Tab | Limited Drops (countdown), Upcoming Meals, Weekly Plans |
| 8 | Order History | Customer Tab | List of past orders with status |
| 9 | Profile | Customer/Chef Tab | User info + logout |
| 10 | Chef Dashboard | Chef Tab | Chef identity banner, online toggle, prep/capacity settings, orders, plan meals, reviews |

---

## 10. Navigation Architecture

```
AppProvider (React Context)
└── NavigationContainer
    └── RootStack.Navigator
        ├── [No profile] Auth Screens
        │   ├── Welcome
        │   ├── CustomerSignup
        │   └── ChefSignup
        │
        ├── [Customer] CustomerTabs (Bottom Tab Navigator)
        │   ├── Home → OrderFoodStack (Native Stack)
        │   │   ├── Browse (BrowseScreen)
        │   │   ├── ChefDetails (ChefDetailsScreen)
        │   │   └── Cart (CartScreen)
        │   ├── Pre-Order (PreOrderScreen)
        │   ├── My Orders (OrderHistoryScreen)
        │   └── Profile (ProfileScreen)
        │
        └── [Chef] ChefTabs (Bottom Tab Navigator)
            ├── Dashboard (ChefModeScreen)
            └── Profile (ProfileScreen)
```

---

## 11. Tech Architecture

### 11.1 Current (Demo)
```
┌─────────────────────────────────────┐
│           Mobile App (Web)           │
│      React Native / Expo SDK 54     │
│                                     │
│  ┌─────────────┐  ┌──────────────┐ │
│  │ Navigation   │  │  11 Screens  │ │
│  │ (React Nav)  │  │  (Auth +     │ │
│  │ Tabs + Stack │  │   Customer + │ │
│  └─────────────┘  │   Chef)      │ │
│                    └──────────────┘ │
│  ┌─────────────┐  ┌──────────────┐ │
│  │  Context +   │  │  Mock Data   │ │
│  │ useReducer + │  │ 10 chefs    │ │
│  │ localStorage │  │ 70+ dishes  │ │
│  └─────────────┘  └──────────────┘ │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Glassmorphism Theme         │   │
│  │  backdrop-filter blur (web)  │   │
│  │  expo-blur (native)          │   │
│  │  expo-linear-gradient        │   │
│  │  Emoji icons (no font deps)  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
    Deployed: Vercel (static export)
    State: localStorage (web)
    No Backend. No Database.
```

### 11.2 Production Architecture (Future)
```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  Mobile   │────▶│   API Layer  │────▶│   Database   │
│  App      │◀────│  (Node/Next) │◀────│ (PostgreSQL) │
│ (Expo)    │     │              │     └──────────────┘
└──────────┘     │  • Auth       │
                 │  • Orders     │     ┌──────────────┐
┌──────────┐     │  • Chefs      │────▶│  File Storage│
│  Web App  │────▶│  • Payments   │     │  (S3/Cloud)  │
│ (Next.js) │◀────│  • Notifs     │     └──────────────┘
└──────────┘     └──────────────┘
                        │              ┌──────────────┐
                        └─────────────▶│   Stripe     │
                                       │  (Payments)  │
                                       └──────────────┘
```

### 11.3 Dependencies
| Package | Purpose | Size Impact |
|---|---|---|
| expo (SDK 54) | Runtime & build system | Core |
| react-native | UI framework | Core |
| expo-linear-gradient | Gradient backgrounds | Minimal |
| expo-blur | Glassmorphism blur (native only) | Minimal |
| @react-navigation/* | Tab + stack navigation | Moderate |
| react-native-screens | Native screen containers | Moderate |
| react-native-safe-area-context | Safe area handling | Minimal |
| react-native-svg | SVG logo rendering | Minimal |

**Removed:** `@expo/vector-icons` (replaced with emoji, reduced bundle size)

---

## 12. Web Deployment Notes

### Build & Deploy
```bash
npx expo export --platform web    # Generates dist/ folder
```

After build, `dist/index.html` must be patched with custom CSS for:
- Mobile-first 480px container with dark surround
- Flex layout cascade for React Native Web's nested divs
- Tab bar fix: `div:has(> [role="tablist"]) { flex: none }`
- Modal constraint: `[aria-modal="true"] > div { max-width: 480px }`

### Vercel Deployment
```bash
cd dist
rm -rf .vercel
vercel link --project gharkachef --yes
vercel --prod --yes
```

**Important:** Always re-link to `gharkachef` project before deploying — Vercel CLI sometimes creates a new "dist" project.

---

## 13. Allergen & Safety Framework

### 13.1 Allergen Tags
| Tag | Common In |
|---|---|
| Nuts | Biryani, sweets, gravies |
| Dairy | Paneer dishes, sweets, lassi |
| Gluten | Roti, bhature, noodles, halwa |
| Eggs | Chicken 65, manchurian |
| Soy | Indo-Chinese dishes |
| Shellfish | Kerala fish curry |

### 13.2 Dietary Indicators
| Indicator | Visual | Meaning |
|---|---|---|
| Green dot | 🟢 | Vegetarian |
| Red dot | 🔴 | Non-vegetarian |

### 13.3 Verification Badges
| Badge | What It Means |
|---|---|
| Health Permit | Local health authority permit |
| Inspected Kitchen | Kitchen passed cleanliness check |
| Food Handler | Completed food safety course |

---

## 14. Regional Cuisine Coverage

| Cuisine | Region | Sample Dishes | # Chefs |
|---|---|---|---|
| Telugu | Andhra Pradesh / Telangana | Biryani, Pulihora, Pesarattu, Chicken 65, Gongura | 1 |
| Tamil | Tamil Nadu | Dosa, Idli, Sambar, Chettinad Chicken, Filter Coffee | 1 |
| Kerala | Kerala | Fish Curry, Appam, Puttu, Beef Fry, Payasam | 1 |
| Punjabi | Punjab | Chole Bhature, Butter Chicken, Rajma, Dal Makhani | 1 |
| Gujarati | Gujarat | Undhiyu, Dhokla, Thepla, Khandvi, Shrikhand | 1 |
| Hyderabadi | Hyderabad | Mutton Biryani, Haleem, Mirchi Ka Salan, Lukhmi | 1 |
| Bengali | West Bengal | Kosha Mangsho, Shorshe Ilish, Mishti Doi, Sandesh | 1 |
| Indo-Chinese | Fusion | Manchurian, Hakka Noodles, Chilli Paneer, Fried Rice | 1 |
| Chaat & Street Food | North India | Pani Puri, Aloo Tikki, Samosa, Bhel Puri | 1 |
| South Indian Fusion | South India | Ghee Roast Dosa, Coconut Chicken, Malabar Parotta | 1 |

---

## 15. Demo Script (2 Minutes)

### Setup
- Open https://gharkachef.vercel.app on phone or desktop
- If returning, tap **"Reset Demo Data"** on the Welcome screen

### Act 1: Customer Orders (60 seconds)
1. **Sign Up** — Tap "Order Food" → enter name, phone → get started
2. **Browse** — Scroll through chef cards. Point out cuisines, ratings, online status.
3. **Search** — Type "Punjabi". Show filtered results.
4. **Filter** — Tap "Online" chip. Show only online chefs.
5. **Open Chef** — Tap "Harsha Singh" (Punjabi).
6. **View Menu** — Show allergen tags, veg/non-veg dots, modifiers.
7. **Add Items** — Add Chole Bhature, Paneer Butter Masala (select spice level!).
8. **Go to Cart** — Tap sticky footer.
9. **Place Order** — Select pickup slot, tap "Place Order".
10. **Pre-Order Tab** — Switch to Pre-Order. Show Limited Drops with countdown, Upcoming Meals, Weekly Plans.

### Act 2: Chef Manages (60 seconds)
1. **Logout** — Go to Profile → Logout.
2. **Sign Up as Chef** — Tap "I'm a Chef" → enter details → select cuisine.
3. **Dashboard** — Toggle online/offline. Set prep window. Adjust capacity.
4. **Manage Orders** — Accept → Start Cooking → Mark Ready.
5. **Plan a Meal** — Tap "+ Plan a Meal" → create tomorrow's dinner → save.
6. **Switch to Customer** — Logout → sign up as customer → Pre-Order tab shows the new meal.

### Closing
> "This demo shows a complete two-sided marketplace — customers order with advance prep time or pre-order planned meals, while chefs manage their kitchen like an Uber driver. Glassmorphism UI, 10 regional Indian cuisines, verified badges for trust."

---

## 16. Project Structure

```
GharKaChef/
├── App.tsx                           # Entry: RootStack → Auth | CustomerTabs | ChefTabs
├── src/
│   ├── theme.ts                      # Design tokens (colors, spacing, radius, typography)
│   ├── types.ts                      # TypeScript interfaces (15+ types)
│   ├── utils.ts                      # Pickup slot generation, formatting helpers
│   ├── data/
│   │   └── mock.ts                   # 10 chefs × 6-8 menu items, planned meals, reviews
│   ├── context/
│   │   └── AppContext.tsx             # State: 15 actions, localStorage persistence
│   ├── components/
│   │   ├── GlassCard.tsx             # Glassmorphism (backdrop-filter web, expo-blur native)
│   │   └── Logo.tsx                  # SVG logo (Logo + LogoMark) via react-native-svg
│   └── screens/
│       ├── WelcomeScreen.tsx          # Role selection + Logo + Reset Demo Data
│       ├── CustomerSignupScreen.tsx   # Customer registration
│       ├── ChefSignupScreen.tsx       # Chef registration + cuisine picker
│       ├── BrowseScreen.tsx           # Chef listing + search + filters + logo mark
│       ├── ChefDetailsScreen.tsx      # Chef profile + menu + modifiers + reviews + back button
│       ├── CartScreen.tsx             # Cart + pickup slot + place order + back button
│       ├── PreOrderScreen.tsx         # Limited Drops + Upcoming Meals + Weekly Plans + logo mark
│       ├── ChefModeScreen.tsx         # Chef dashboard + orders + plan meals (no chef picker)
│       ├── OrderHistoryScreen.tsx     # Past orders
│       └── ProfileScreen.tsx          # User profile + logout
├── docs/
│   ├── PROJECT_DOCUMENT.md           # This document
│   └── SOW.html                      # Statement of Work (shareable HTML with logo)
├── dist/                             # Web build (deployed to Vercel)
│   └── index.html                    # Custom CSS for mobile-first web layout
├── README.md                         # Quick start + demo script
├── package.json
├── tsconfig.json
└── app.json                          # Expo configuration
```

---

## 17. Roadmap

### Phase 1 — Demo (Current) ✅
- [x] Role-based auth (Customer / Chef signup)
- [x] 11 screens with full navigation
- [x] 10 mock chefs with menus, modifiers, reviews
- [x] Full order flow (browse → cart → order)
- [x] Chef mode (online/offline, accept, cook, ready)
- [x] Pre-Order: Limited Drops, Upcoming Meals, Weekly Plans
- [x] Chef: Plan a Meal with pricing and max orders
- [x] Glassmorphism UI with backdrop-filter blur
- [x] Emoji icons (no font dependencies)
- [x] SVG brand logo (house + chef hat + flame icon)
- [x] Back navigation buttons on stack screens
- [x] Web deployment (Vercel)
- [x] localStorage state persistence
- [x] Order history
- [x] Statement of Work (HTML) with logo

### Phase 2 — MVP (Next)
- [ ] Real backend (Node.js/Next.js API)
- [ ] Database (PostgreSQL)
- [ ] User authentication (JWT/OAuth)
- [ ] Image upload for chefs and menu items
- [ ] Push notifications (order status updates)
- [ ] Geolocation (show chefs by distance)
- [ ] Real payment processing (Stripe)

### Phase 3 — Growth
- [ ] Rating & review system (customer-submitted)
- [ ] Delivery option (integrate with local delivery services)
- [ ] Chef onboarding & verification workflow
- [ ] Admin dashboard
- [ ] Chef earnings dashboard

### Phase 4 — Scale
- [ ] Multi-city expansion
- [ ] Subscription billing for weekly plans
- [ ] Featured listings & advertising
- [ ] Analytics dashboard for chefs
- [ ] Multi-language support (Hindi, Punjabi, Telugu, Tamil)

---

## 18. Monetization Strategy (Future)

| Revenue Stream | Model | Details |
|---|---|---|
| Platform Commission | 15-20% per order | Deducted from chef's earnings |
| Featured Listing | Monthly fee | Chef appears at top of browse |
| Delivery Service | Delivery fee | When delivery is added |
| Subscription (Customer) | Monthly pass | Free delivery + priority orders |
| Subscription (Chef) | Pro tier | Lower commission, analytics, priority support |
| Weekly Plan Commission | 10% of subscription | For weekly meal plan subscriptions |

---

*Document prepared for GharKaChef demo — February 2026*
