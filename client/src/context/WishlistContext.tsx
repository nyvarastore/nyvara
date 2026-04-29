'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import type { Product, WishlistState } from '@/types';

// ─── Actions ──────────────────────────────────────────────────────────────────

type WishlistAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'CLEAR' };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM':
      if (state.items.some(p => p.id === action.product.id)) return state;
      return { items: [...state.items, action.product] };
    case 'REMOVE_ITEM':
      return { items: state.items.filter(p => p.id !== action.productId) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface WishlistContextValue extends WishlistState {
  addToWishlist:      (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist:      () => void;
  isWishlisted:       (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  const addToWishlist      = useCallback((product: Product) => dispatch({ type: 'ADD_ITEM', product }), []);
  const removeFromWishlist = useCallback((productId: string) => dispatch({ type: 'REMOVE_ITEM', productId }), []);
  const clearWishlist      = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const isWishlisted       = useCallback((productId: string) => state.items.some(p => p.id === productId), [state.items]);

  return (
    <WishlistContext.Provider value={{ ...state, addToWishlist, removeFromWishlist, clearWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>');
  return ctx;
}
