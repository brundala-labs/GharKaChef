# GharKaChef — Project Document

**Version:** 1.0 (Demo/MVP)
**Date:** February 2026
**Platform:** iOS, Android, Web (React Native / Expo)
**Live Demo:** https://gharkachef.vercel.app

---

## 1. Executive Summary

GharKaChef is a two-sided marketplace connecting **verified home chefs** with **customers** seeking authentic, home-cooked Indian meals in Canada. Think of it as "Uber for home-cooked food" — chefs toggle online/offline like Uber drivers, but instead of instant delivery, customers place orders with a **4-hour or 8-hour prep window** and choose a **pickup time slot**.

The platform focuses on the Indian diaspora in Canada, offering regional cuisines (Telugu, Tamil, Kerala, Punjabi, Gujarati, Hyderabadi, Bengali, Indo-Chinese, Chaat) from verified local kitchens.

---

## 2. Problem Statement

| Pain Point | Who | Details |
|---|---|---|
| Lack of authentic home-cooked food | Indian customers in Canada | Restaurant food doesn't match ghar ka khana (home taste) |
| No platform for home chefs | Home chefs | Talented cooks have no easy way to monetize their skills |
| Trust & safety concerns | Both sides | Customers worry about food safety; chefs need verified credibility |
| Rigid restaurant model | Market | Restaurants require heavy investment; home chefs need flexibility |

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

### 3.2 Key Difference from Uber

- **NOT instant delivery.** Customers place orders in advance.
- **Prep windows:** 4 hours (quick meals) or 8 hours (elaborate dishes like biryani, haleem).
- **Pickup model:** Customer picks up from the chef's kitchen (no delivery logistics in MVP).
- **Scheduled slots:** Customers choose a 1-hour pickup window.

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

| # | Feature | Description | Priority |
|---|---|---|---|
| C1 | Browse Chefs | View all available chefs with cuisine, rating, distance, price level | P0 |
| C2 | Search | Text search by chef name or cuisine type | P0 |
| C3 | Quick Filters | Filter by prep window (4h/8h), verified status, online status | P0 |
| C4 | Chef Profile | View chef details: image, badges, rating, distance, cuisine, capacity | P0 |
| C5 | Menu Browsing | View menu items with descriptions, prices, veg/non-veg indicators, allergen tags | P0 |
| C6 | Prep Window Selection | Choose 4-hour or 8-hour prep window | P0 |
| C7 | Pickup Slot Selection | Choose from auto-generated 1-hour pickup windows based on prep time | P0 |
| C8 | Add to Cart | Add menu items to cart with quantity control | P0 |
| C9 | Cart Management | View cart, adjust quantities (+/-), remove items, see running total | P0 |
| C10 | Place Order | Submit order with customer name, phone, selected pickup slot | P0 |
| C11 | Order Confirmation | View order ID, status, pickup time, total after placing | P0 |
| C12 | Allergen Awareness | Clear allergen tags (nuts, dairy, gluten, eggs, soy, shellfish) on every item | P0 |
| C13 | Veg/Non-Veg Indicators | Green/red dot indicator on each menu item | P1 |
| C14 | Order History | View past orders and reorder | P2 |
| C15 | Delivery Option | Request delivery instead of pickup | P2 |
| C16 | Reviews & Photos | Leave reviews with food photos | P2 |
| C17 | Favorites | Save favorite chefs for quick access | P2 |
| C18 | Push Notifications | Order status updates (accepted, cooking, ready) | P2 |

### 5.2 Chef Features

| # | Feature | Description | Priority |
|---|---|---|---|
| K1 | Online/Offline Toggle | Go online to accept orders, offline to stop | P0 |
| K2 | Prep Window Setting | Set default prep window (4 hours or 8 hours) | P0 |
| K3 | Capacity Management | Set daily order capacity (stepper control) | P0 |
| K4 | Incoming Orders | View new orders with customer details, items, pickup slot | P0 |
| K5 | Accept/Decline Orders | Accept or decline incoming orders | P0 |
| K6 | Order Status Workflow | Advance orders: Placed → Accepted → Cooking → Ready | P0 |
| K7 | Chef Profile (Demo) | Demo account switcher to simulate different chefs | P0 |
| K8 | Verified Badges | Display: Health Permit, Inspected Kitchen, Food Handler | P0 |
| K9 | Menu Management | Add/edit/remove menu items with prices and allergens | P2 |
| K10 | Earnings Dashboard | View daily/weekly earnings and order history | P2 |
| K11 | Schedule Management | Set recurring availability (e.g., weekends only) | P2 |
| K12 | Customer Communication | In-app chat for order clarifications | P2 |

### 5.3 Platform Features (Future)

| # | Feature | Description | Priority |
|---|---|---|---|
| P1 | Chef Verification | Admin workflow for verifying badges and certifications | P1 |
| P2 | Payment Processing | Stripe/payment integration with chef payouts | P1 |
| P3 | Admin Dashboard | Monitor chefs, orders, disputes, compliance | P1 |
| P4 | Geolocation | Show chefs by proximity, map view | P1 |
| P5 | Rating System | Post-order rating and review system | P1 |
| P6 | Referral Program | Customer/chef referral rewards | P2 |
| P7 | Multi-language | Hindi, Punjabi, Telugu, Tamil language support | P3 |

---

## 6. User Flows

### 6.1 Customer Flow — Ordering Food

```
┌─────────────────────────────────────────────────────────┐
│                    CUSTOMER JOURNEY                      │
└─────────────────────────────────────────────────────────┘

  ┌──────────┐     ┌──────────────┐     ┌─────────────┐
  │  Open App │────▶│ Browse Screen │────▶│ Search/Filter│
  └──────────┘     └──────┬───────┘     └──────┬──────┘
                          │                     │
                          ▼                     ▼
                   ┌──────────────┐     ┌──────────────┐
                   │  Chef Cards   │◀───│ Filtered List │
                   │ (scrollable)  │     └──────────────┘
                   └──────┬───────┘
                          │ Tap chef
                          ▼
                   ┌──────────────┐
                   │ Chef Details  │
                   │              │
                   │ • Hero image  │
                   │ • Badges      │
                   │ • Rating      │
                   │ • Distance    │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Select Prep   │
                   │ Window (4h/8h)│
                   └──────┬───────┘
                          │ Auto-generates
                          ▼
                   ┌──────────────┐
                   │ View Pickup   │
                   │ Slots         │
                   │ (3 x 1-hour)  │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Browse Menu   │
                   │              │
                   │ • Item name   │
                   │ • Price       │
                   │ • Description │
                   │ • Veg/NonVeg  │
                   │ • Allergens   │
                   │ • [+ Add]     │
                   └──────┬───────┘
                          │ Add items
                          ▼
                   ┌──────────────┐
                   │ Sticky Footer │
                   │ "3 items $42" │
                   │ [Go to Cart]  │
                   └──────┬───────┘
                          │ Tap
                          ▼
                   ┌──────────────┐
                   │  Cart Screen  │
                   │              │
                   │ • Items +/-   │
                   │ • Total       │
                   │ • Pickup slot │
                   │ • Name        │
                   │ • Phone       │
                   │ [Place Order] │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Confirmation  │
                   │   Modal       │
                   │              │
                   │ Order: GKC-XX │
                   │ Status: Placed│
                   │ Pickup: 5-6PM │
                   │ Total: $42.00 │
                   │    [Done]     │
                   └──────────────┘
```

### 6.2 Chef Flow — Managing Kitchen

```
┌─────────────────────────────────────────────────────────┐
│                      CHEF JOURNEY                        │
└─────────────────────────────────────────────────────────┘

  ┌──────────┐     ┌──────────────┐
  │  Open App │────▶│ Chef Mode Tab│
  └──────────┘     └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Select Chef   │  (Demo: pick from dropdown)
                   │ Identity      │  (Prod: logged-in chef)
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ Dashboard     │
                   │              │
                   │ [Online/Off]  │◀── Toggle availability
                   │ [Prep 4h/8h]  │◀── Set prep window
                   │ [Capacity ±]  │◀── Set daily limit
                   └──────┬───────┘
                          │
                          ▼
               ┌─────────────────────┐
               │  IF OFFLINE:         │
               │  "You're offline —   │
               │  not accepting       │
               │  new orders"         │
               └─────────────────────┘
                          │
                          ▼ (When online)
               ┌─────────────────────┐
               │  Incoming Orders     │
               │                     │
               │  ┌─────────────┐    │
               │  │ Order GKC-XX│    │
               │  │ Customer: X │    │
               │  │ Phone: XXX  │    │
               │  │ Pickup: 5PM │    │
               │  │ Items:      │    │
               │  │  2x Biryani │    │
               │  │  1x Gulab J │    │
               │  │ Total: $42  │    │
               │  │             │    │
               │  │[Decline][Accept]│ │
               │  └─────────────┘    │
               └──────────┬──────────┘
                          │
              ┌───────────┼───────────┐
              ▼                       ▼
       ┌──────────┐           ┌──────────┐
       │ Declined  │           │ Accepted │
       │ (closed)  │           └────┬─────┘
       └──────────┘                │
                                   ▼
                            ┌──────────┐
                            │[Start    │
                            │ Cooking] │
                            └────┬─────┘
                                 │
                                 ▼
                            ┌──────────┐
                            │ Cooking   │
                            │[Mark     │
                            │ Ready]   │
                            └────┬─────┘
                                 │
                                 ▼
                            ┌──────────────┐
                            │ ✓ Ready for  │
                            │   Pickup!    │
                            └──────────────┘
```

### 6.3 Order Lifecycle (Both Sides)

```
        CUSTOMER                    SYSTEM                      CHEF
        ────────                    ──────                      ────

    Places order ──────────▶  Create order record  ──────────▶  New order
    with items,               Status: PLACED                    notification
    pickup slot,              Decrease chef
    name, phone               capacity by 1

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

### 7.4 Verification Badges
| Badge | Meaning |
|---|---|
| Health Permit | Chef has a valid health permit from local authority |
| Inspected Kitchen | Chef's kitchen has passed a cleanliness inspection |
| Food Handler | Chef has completed food handler certification |
| "Fully Verified" | Chef has ALL three badges |

### 7.5 Filter Logic
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
  cuisine: string            // "Telugu", "Punjabi", etc.
  rating: number             // 1.0 – 5.0
  distanceKm: number
  priceLevel: 1 | 2 | 3     // $ / $$ / $$$
  verifiedBadges: VerifiedBadge[]
  isOnline: boolean
  defaultPrepWindowHours: 4 | 8
  dailyCapacity: number
  imageUrl: string
  menuItems: MenuItem[]
}
```

### 8.2 Menu Item
```typescript
{
  id: string
  name: string
  price: number              // CAD
  description: string
  allergens: AllergenTag[]   // nuts, dairy, gluten, eggs, soy, shellfish
  isVeg: boolean
}
```

### 8.3 Cart Item
```typescript
{
  menuItem: MenuItem
  chefId: string
  quantity: number
}
```

### 8.4 Order
```typescript
{
  id: string                 // "GKC-XXXXXX"
  chefId: string
  customerName: string
  customerPhone: string
  items: CartItem[]
  total: number
  pickupSlot: string         // "6 PM – 7 PM"
  status: 'placed' | 'accepted' | 'cooking' | 'ready' | 'declined'
  createdAt: Date
}
```

---

## 9. Screen Inventory

| # | Screen | Tab | Description |
|---|---|---|---|
| 1 | Browse | Order Food | Chef listing with search bar, filter chips, scrollable chef cards |
| 2 | Chef Details | Order Food | Chef profile, badges, prep window toggle, pickup slots, menu with add buttons, sticky cart footer |
| 3 | Cart | Order Food | Cart items with qty controls, pickup slot selector, customer details form, place order button, confirmation modal |
| 4 | Chef Mode | Chef Mode | Chef picker, online/offline toggle, prep window setting, capacity stepper, incoming orders with accept/decline/status workflow |

---

## 10. Tech Architecture

### 10.1 Current (Demo/MVP)
```
┌─────────────────────────────────┐
│           Mobile App            │
│      (React Native / Expo)      │
│                                 │
│  ┌───────────┐  ┌────────────┐ │
│  │ Navigation │  │   Screens  │ │
│  │ (React Nav)│  │ (4 screens)│ │
│  └───────────┘  └────────────┘ │
│                                 │
│  ┌───────────┐  ┌────────────┐ │
│  │  Context + │  │  Mock Data │ │
│  │ useReducer │  │ (mock.ts)  │ │
│  └───────────┘  └────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │  UI: Glassmorphism Theme  │ │
│  │  expo-blur, gradients     │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
        No Backend. No Database.
        Local state only.
```

### 10.2 Production Architecture (Future)
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
                        │              ┌──────────────┐
                        └─────────────▶│  Push Notifs │
                                       │  (Expo/FCM)  │
                                       └──────────────┘
```

### 10.3 Dependencies (Current)
| Package | Purpose | Size Impact |
|---|---|---|
| expo (SDK 54) | Runtime & build system | Core |
| react-native | UI framework | Core |
| expo-linear-gradient | Gradient backgrounds | Minimal |
| expo-blur | Glassmorphism blur effect | Minimal |
| @expo/vector-icons | Ionicons for UI icons | Included with Expo |
| @react-navigation/* | Tab + stack navigation | Moderate |
| react-native-screens | Native screen containers | Moderate |
| react-native-safe-area-context | Safe area handling | Minimal |

---

## 11. Comparison with Uber Model

```
                    UBER                          GHARKACHEF
                    ────                          ──────────

  Supply Side:      Drivers                       Home Chefs
  Demand Side:      Riders                        Hungry Customers

  Toggle:           Driver goes Online/Offline    Chef goes Online/Offline

  Request:          Rider requests ride NOW       Customer orders food
                                                  with 4h/8h prep window

  Matching:         Auto-match nearest driver     Customer browses and
                                                  chooses specific chef

  Acceptance:       Driver accepts/declines       Chef accepts/declines
                    ride request                  food order

  Tracking:         Real-time GPS tracking        Status updates:
                    Driver → Pickup → Dropoff     Placed → Accepted →
                                                  Cooking → Ready

  Completion:       Ride ends at destination      Customer picks up food

  Surge/Capacity:   Surge pricing                 Daily capacity limit

  Rating:           Rider rates driver            Customer rates chef
                    Driver rates rider            (Future)

  Verification:     Background check              Health Permit
                    Vehicle inspection            Inspected Kitchen
                    License verification          Food Handler cert

  Timing:           Instant (minutes)             Planned (4-8 hours)

  Delivery:         Driver delivers rider         Customer picks up
                                                  (delivery = future)
```

---

## 12. Allergen & Safety Framework

### 12.1 Allergen Tags (Displayed on Every Menu Item)
| Tag | Icon/Color | Common In |
|---|---|---|
| Nuts | Orange badge | Biryani, sweets, gravies |
| Dairy | Orange badge | Paneer dishes, sweets, lassi |
| Gluten | Orange badge | Roti, bhature, noodles, halwa |
| Eggs | Orange badge | Chicken 65, manchurian |
| Soy | Orange badge | Indo-Chinese dishes |
| Shellfish | Orange badge | Kerala fish curry |

### 12.2 Dietary Indicators
| Indicator | Visual | Meaning |
|---|---|---|
| Green dot | 🟢 | Vegetarian |
| Red dot | 🔴 | Non-vegetarian |

### 12.3 Verification Badges
| Badge | What It Means | How to Get It |
|---|---|---|
| Health Permit | Local health authority permit | Submit permit documentation |
| Inspected Kitchen | Kitchen passed cleanliness check | Schedule GharKaChef inspection |
| Food Handler | Completed food safety course | Upload certificate |

---

## 13. Monetization Strategy (Future)

| Revenue Stream | Model | Details |
|---|---|---|
| Platform Commission | 15-20% per order | Deducted from chef's earnings |
| Featured Listing | Monthly fee | Chef appears at top of browse |
| Delivery Service | Delivery fee | When delivery is added |
| Subscription (Customer) | Monthly pass | Free delivery + priority orders |
| Subscription (Chef) | Pro tier | Lower commission, analytics, priority support |

---

## 14. Regional Cuisine Coverage

| Cuisine | Region | Sample Dishes | # Chefs (Demo) |
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

### Act 1: Customer Orders (60 seconds)
1. **Browse** — Scroll through chef cards. Point out cuisines, ratings, online status.
2. **Search** — Type "Punjabi". Show filtered results.
3. **Filter** — Tap "Online" chip. Show only online chefs.
4. **Open Chef** — Tap "Harsha Singh" (Punjabi).
5. **View Menu** — Show allergen tags, veg/non-veg dots.
6. **Toggle Prep** — Switch between 4h and 8h. Note pickup slots change.
7. **Add Items** — Add Chole Bhature, Paneer Butter Masala, Rajma Chawal.
8. **Go to Cart** — Tap sticky footer.
9. **Place Order** — Select pickup slot, enter name/phone, tap "Place Order".
10. **Confirmation** — Show order ID and pickup time.

### Act 2: Chef Manages (60 seconds)
1. **Switch Tab** — Tap "Chef Mode" tab.
2. **Select Chef** — Pick "Harsha Singh" from dropdown.
3. **See Order** — The order just placed appears in the list.
4. **Toggle Offline** — Show the offline banner. Toggle back online.
5. **Accept Order** — Tap "Accept" on the order.
6. **Cook** — Tap "Start Cooking".
7. **Ready** — Tap "Mark Ready". Show "Ready for customer pickup!" message.
8. **Capacity** — Adjust capacity with stepper to show the control.

### Closing
> "This demo shows the complete two-sided flow — customer orders with advance prep time, chef manages their kitchen like an Uber driver manages their car. All with verified badges for trust and safety."

---

## 16. Project Structure

```
GharKaChef/
├── App.tsx                          # Entry point, navigation setup
├── src/
│   ├── theme.ts                     # Design tokens (colors, spacing, radius, typography)
│   ├── types.ts                     # TypeScript interfaces
│   ├── utils.ts                     # Pickup slot generation, formatting helpers
│   ├── data/
│   │   └── mock.ts                  # 10 chefs × 6-8 menu items = 70+ dishes
│   ├── context/
│   │   └── AppContext.tsx            # Global state (React Context + useReducer)
│   ├── components/
│   │   └── GlassCard.tsx            # Reusable glassmorphism card component
│   └── screens/
│       ├── BrowseScreen.tsx          # Customer: chef listing + search + filters
│       ├── ChefDetailsScreen.tsx     # Customer: chef profile + menu + add to cart
│       ├── CartScreen.tsx            # Customer: cart + place order + confirmation
│       └── ChefModeScreen.tsx        # Chef: dashboard + order management
├── docs/
│   └── PROJECT_DOCUMENT.md          # This document
├── README.md                        # Quick start + demo script
├── package.json
├── tsconfig.json
└── app.json                         # Expo configuration
```

---

## 17. Roadmap

### Phase 1 — Demo (Current) ✅
- [x] 4 core screens
- [x] 10 mock chefs with menus
- [x] Full order flow (browse → cart → order)
- [x] Chef mode (online/offline, accept, cook, ready)
- [x] Glassmorphism UI
- [x] Web deployment

### Phase 2 — MVP (Next)
- [ ] User authentication (customer + chef sign-up/login)
- [ ] Real backend (Node.js/Next.js API)
- [ ] Database (PostgreSQL)
- [ ] Image upload for chefs and menu items
- [ ] Push notifications (order status updates)
- [ ] Geolocation (show chefs by distance)

### Phase 3 — Growth
- [ ] Payment processing (Stripe)
- [ ] Rating & review system
- [ ] Delivery option (integrate with local delivery services)
- [ ] Chef onboarding & verification workflow
- [ ] Admin dashboard

### Phase 4 — Scale
- [ ] Multi-city expansion
- [ ] Subscription plans
- [ ] Featured listings & advertising
- [ ] Analytics dashboard for chefs
- [ ] Multi-language support

---

*Document prepared for GharKaChef demo — February 2026*
