export type AllergenTag = 'nuts' | 'dairy' | 'gluten' | 'eggs' | 'soy' | 'shellfish';

export type VerifiedBadge = 'Health Permit' | 'Inspected Kitchen' | 'Food Handler';

export interface ModifierOption {
  label: string;
  priceAdjustment: number;
}

export interface MenuModifier {
  id: string;
  name: string;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  allergens: AllergenTag[];
  isVeg: boolean;
  modifiers?: MenuModifier[];
}

export interface Review {
  id: string;
  chefId: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
}

export interface PlannedMeal {
  id: string;
  chefId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  date: string;
  timeSlot: 'lunch' | 'dinner';
  maxOrders: number;
  currentOrders: number;
  allergens: AllergenTag[];
  isVegetarian: boolean;
  isLimitedDrop: boolean;
  dropExpiresAt?: string;
}

export interface WeeklyPlan {
  id: string;
  chefId: string;
  mealsPerWeek: 3 | 5 | 7;
  pricePerMeal: number;
  description: string;
  dietaryOptions: string[];
}

export interface Chef {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  distanceKm: number;
  priceLevel: 1 | 2 | 3;
  verifiedBadges: VerifiedBadge[];
  isOnline: boolean;
  defaultPrepWindowHours: 4 | 8;
  dailyCapacity: number;
  imageUrl: string;
  menuItems: MenuItem[];
  reviews?: Review[];
  plannedMeals?: PlannedMeal[];
  weeklyPlan?: WeeklyPlan;
}

export interface CartItem {
  menuItem: MenuItem;
  chefId: string;
  quantity: number;
  isPreOrder?: boolean;
  selectedModifiers?: { modifierId: string; optionLabel: string; priceAdjustment: number }[];
}

export type OrderStatus = 'placed' | 'accepted' | 'cooking' | 'ready' | 'declined';

export interface Order {
  id: string;
  chefId: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  pickupSlot: string;
  status: OrderStatus;
  createdAt: Date;
}

export interface PickupSlot {
  label: string;
  startHour: number;
  endHour: number;
}

export type UserRole = 'customer' | 'chef';

export interface UserProfile {
  name: string;
  phone: string;
  role: UserRole;
  dietaryPreferences?: string[];
  cuisineType?: string;
  kitchenDescription?: string;
}
