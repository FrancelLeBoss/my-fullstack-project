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
      state.id = action.payload.id;
      state.total_price = action.payload.total_price;
      state.status = action.payload.status;
      state.created_at = action.payload.created_at;
      state.updated_at = action.payload.updated_at;
      state.is_paid = action.payload.is_paid;
    },
  },
});



export const {
  
} = orderSlice.actions;

export default orderSlice.reducer;