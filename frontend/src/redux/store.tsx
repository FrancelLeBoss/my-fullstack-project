import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import WishlistReducer from './WishlistSlice'; 
import orderReducer from './orderSlice'; 

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    wishlist: WishlistReducer, // Ajout de la liste de souhaits
    order: orderReducer, // Ajout du reducer de commandes
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;