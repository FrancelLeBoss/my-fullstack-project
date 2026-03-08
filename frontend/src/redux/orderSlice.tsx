import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types/Product";
import { get } from "axios";

interface OrderState {
  id: number;
  total_price: number;
  status: string;   
  created_at: string;
  updated_at: string;
  is_paid: boolean;
}

const initialState: OrderState = {
  id: 0,
  total_price: 0,
  status: "",
  created_at: "",
  updated_at: "",
  is_paid: false,
};  


const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    getOrder: (state, action: PayloadAction<OrderState>) => {
      return action.payload;
    },

   
  },
});



export const {
  
} = orderSlice.actions;

export default orderSlice.reducer;