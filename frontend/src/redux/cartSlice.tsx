// src/redux/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types/Product";

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

/**
 * Elle recalcule les totaux dès qu'un changement survient dans 'items'.
 */
const recalculateTotals = (state: CartState) => {
  // Calcul du nombre d'articles (quantité totale des items cochés)
  state.totalAmount = state.items.reduce(
    (total, item) => total + (item.checked !== false ? item.quantity : 0),
    0
  );

  // Calcul du prix total (uniquement pour les items cochés)
  const rawPrice = state.items.reduce((total, item) => {
    const price = item.variant?.price || 0;
    // Si checked est undefined (ex: chargement initial), on considère true par défaut
    const isSelected = item.checked !== false; 
    return total + (isSelected ? price * item.quantity : 0);
  }, 0);

  state.totalPrice = Number(rawPrice.toFixed(2));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // --- ACTIONS DE MODIFICATION ---
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        // On s'assure que checked est true par défaut à l'ajout
        state.items.push({ ...product, checked: product.checked ?? true });
      }
      recalculateTotals(state);
    },

    updateCartItem: (
      state,
      action: PayloadAction<{ id: number; quantity: number; checked?: boolean }>
    ) => {
      const { id, quantity, checked } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity = quantity;
        if (checked !== undefined) existingItem.checked = checked;
      }
      recalculateTotals(state);
    },

    updateCartItemChecked: (
      state,
      action: PayloadAction<{ id: number; checked: boolean }>
    ) => {
      const { id, checked } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.checked = checked;
      }
      recalculateTotals(state);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      recalculateTotals(state);
    },

    // --- ACTIONS DE SYNCHRONISATION ET NETTOYAGE ---
    updateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      recalculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalPrice = 0;
    },

    // Réinitialise tout le state (Utile lors de la déconnexion)
    reset: (state) => {
      state.items = initialState.items;
      state.totalAmount = initialState.totalAmount;
      state.totalPrice = initialState.totalPrice;
      state.loading = initialState.loading;
      state.error = initialState.error;
    },
  },
});



export const {
  addToCart,
  updateCartItem,
  updateCartItemChecked,
  removeFromCart,
  clearCart,
  updateCart,
  setLoading,
  reset, // Réintégré ici
} = cartSlice.actions;

export default cartSlice.reducer;