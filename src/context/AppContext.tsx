import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Order, OrderStatus, Chef, PlannedMeal, Review } from '../types';
import { chefs as initialChefs } from '../data/mock';

interface AppState {
  cart: CartItem[];
  cartChefId: string | null;
  orders: Order[];
  chefs: Chef[];
}

type Action =
  | { type: 'ADD_TO_CART'; payload: { menuItem: CartItem['menuItem']; chefId: string; isPreOrder?: boolean; selectedModifiers?: CartItem['selectedModifiers'] } }
  | { type: 'REMOVE_FROM_CART'; payload: { menuItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: string; delta: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'PLACE_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'TOGGLE_CHEF_ONLINE'; payload: { chefId: string } }
  | { type: 'SET_CHEF_PREP_WINDOW'; payload: { chefId: string; hours: 4 | 8 } }
  | { type: 'SET_CHEF_CAPACITY'; payload: { chefId: string; capacity: number } }
  | { type: 'CREATE_PLANNED_MEAL'; payload: { chefId: string; meal: PlannedMeal } }
  | { type: 'PREORDER_MEAL'; payload: { mealId: string; chefId: string } }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'SUBSCRIBE_WEEKLY'; payload: { chefId: string } };

const initialState: AppState = {
  cart: [],
  cartChefId: null,
  orders: [],
  chefs: initialChefs,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { menuItem, chefId, isPreOrder, selectedModifiers } = action.payload;
      if (state.cartChefId && state.cartChefId !== chefId) {
        return {
          ...state,
          cart: [{ menuItem, chefId, quantity: 1, isPreOrder, selectedModifiers }],
          cartChefId: chefId,
        };
      }
      const existing = state.cart.find((c) => c.menuItem.id === menuItem.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((c) =>
            c.menuItem.id === menuItem.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
          cartChefId: chefId,
        };
      }
      return {
        ...state,
        cart: [...state.cart, { menuItem, chefId, quantity: 1, isPreOrder, selectedModifiers }],
        cartChefId: chefId,
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((c) => c.menuItem.id !== action.payload.menuItemId),
        cartChefId: state.cart.length <= 1 ? null : state.cartChefId,
      };
    case 'UPDATE_QUANTITY': {
      const { menuItemId, delta } = action.payload;
      const updated = state.cart
        .map((c) =>
          c.menuItem.id === menuItemId ? { ...c, quantity: c.quantity + delta } : c
        )
        .filter((c) => c.quantity > 0);
      return {
        ...state,
        cart: updated,
        cartChefId: updated.length === 0 ? null : state.cartChefId,
      };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [], cartChefId: null };
    case 'PLACE_ORDER': {
      const order = action.payload;
      const updatedChefs = state.chefs.map((c) =>
        c.id === order.chefId ? { ...c, dailyCapacity: Math.max(0, c.dailyCapacity - 1) } : c
      );
      return {
        ...state,
        orders: [...state.orders, order],
        cart: [],
        cartChefId: null,
        chefs: updatedChefs,
      };
    }
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.orderId ? { ...o, status: action.payload.status } : o
        ),
      };
    case 'TOGGLE_CHEF_ONLINE':
      return {
        ...state,
        chefs: state.chefs.map((c) =>
          c.id === action.payload.chefId ? { ...c, isOnline: !c.isOnline } : c
        ),
      };
    case 'SET_CHEF_PREP_WINDOW':
      return {
        ...state,
        chefs: state.chefs.map((c) =>
          c.id === action.payload.chefId
            ? { ...c, defaultPrepWindowHours: action.payload.hours }
            : c
        ),
      };
    case 'SET_CHEF_CAPACITY':
      return {
        ...state,
        chefs: state.chefs.map((c) =>
          c.id === action.payload.chefId
            ? { ...c, dailyCapacity: Math.max(0, action.payload.capacity) }
            : c
        ),
      };
    case 'CREATE_PLANNED_MEAL':
      return {
        ...state,
        chefs: state.chefs.map((c) =>
          c.id === action.payload.chefId
            ? { ...c, plannedMeals: [...(c.plannedMeals || []), action.payload.meal] }
            : c
        ),
      };
    case 'PREORDER_MEAL': {
      const { mealId, chefId } = action.payload;
      return {
        ...state,
        chefs: state.chefs.map((c) =>
          c.id === chefId
            ? {
                ...c,
                plannedMeals: (c.plannedMeals || []).map((pm) =>
                  pm.id === mealId ? { ...pm, currentOrders: pm.currentOrders + 1 } : pm
                ),
              }
            : c
        ),
      };
    }
    case 'ADD_REVIEW':
      return {
        ...state,
        chefs: state.chefs.map((c) =>
          c.id === action.payload.chefId
            ? { ...c, reviews: [...(c.reviews || []), action.payload] }
            : c
        ),
      };
    case 'SUBSCRIBE_WEEKLY':
      // Demo: no-op, just triggers UI confirmation
      return state;
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
