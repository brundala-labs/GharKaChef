export type AllergenTag = 'nuts' | 'dairy' | 'gluten' | 'eggs' | 'soy' | 'shellfish';

export type VerifiedBadge = 'Health Permit' | 'Inspected Kitchen' | 'Food Handler';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  allergens: AllergenTag[];
  isVeg: boolean;
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
}

export interface CartItem {
  menuItem: MenuItem;
  chefId: string;
  quantity: number;
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
