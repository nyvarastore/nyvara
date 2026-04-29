'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import type { CartItem, CartState, Product } from '@/types';

// ─── Actions ──────────────────────────────────────────────────────────────────

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; state: CartState };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.id === action.product.id);
      const items = existing
        ? state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { product: action.product, quantity: 1 }];
      return buildState(items);
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.product.id !== action.productId);
      return buildState(items);
    }
    case 'UPDATE_QUANTITY': {
      const items =
        action.quantity <= 0
          ? state.items.filter(i => i.product.id !== action.productId)
          : state.items.map(i =>
              i.product.id === action.productId
                ? { ...i, quantity: action.quantity }
                : i
            );
      return buildState(items);
    }
    case 'CLEAR_CART':
      return buildState([]);
    case 'SET_CART':
      return action.state;
    default:
      return state;
  }
}

function buildState(items: CartItem[]): CartState {
  const total = items.reduce(
    (sum, i) => sum + (i.product.price ?? 0) * i.quantity,
    0
  );
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return { items, total, itemCount };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue extends CartState {
  addItem:        (product: Product) => void;
  removeItem:     (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart:      () => void;
  isInCart:       (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 });

  // ─── Persistence Logic ───────────────

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nyvara_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'SET_CART', state: parsed });
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    // Skip saving empty initial state before hydration if possible, 
    // but here we just save whenever it changes.
    localStorage.setItem('nyvara_cart', JSON.stringify(state));
  }, [state]);

  const addItem        = useCallback((product: Product) => dispatch({ type: 'ADD_ITEM', product }), []);
  const removeItem     = useCallback((productId: string) => dispatch({ type: 'REMOVE_ITEM', productId }), []);
  const updateQuantity = useCallback((productId: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', productId, quantity }), []);
  const clearCart      = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const isInCart       = useCallback((productId: string) => state.items.some(i => i.product.id === productId), [state.items]);

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
