import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import WishlistReducer from './WishlistSlice'; 
import orderReducer from './orderSlice'; 

const loggerMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  try {
    // eslint-disable-next-line no-console
    console.debug('[Redux action]', action);
  } catch (e) {
    // ignore
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    wishlist: WishlistReducer, // Ajout de la liste de souhaits
    order: orderReducer, // Ajout du reducer de commandes
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;