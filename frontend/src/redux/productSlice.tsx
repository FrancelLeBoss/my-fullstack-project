import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product as ProductType, Product_with_Stars } from '../types/Product';

interface ProductState {
  products: ProductType[];
  topRatedProducts: Product_with_Stars[];
  currentProduct: ProductType | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  topRatedProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProducts: (state, action: PayloadAction<ProductType[]>) => {
      state.products = action.payload;
    },
    setTopRatedProducts: (state, action: PayloadAction<Product_with_Stars[]>) => {
      state.topRatedProducts = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<ProductType | null>) => {
      state.currentProduct = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setProducts,
  setTopRatedProducts,
  setCurrentProduct,
  setError,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;
