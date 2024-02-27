import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface CartItem {
  id: string;
  price: number;
  images: { id: string; url: string; productId: string; }[];
  name: string;
  categories: string[];
  quantity: number;
}

interface CartState extends Array<CartItem> {}

const cartFromCookies = Cookies.get('cart');
const parsedCart = cartFromCookies ? JSON.parse(cartFromCookies) : [];


const initialState: CartState = parsedCart;

const cartSlice = createSlice({
 name: 'cart',
 initialState,
 reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const itemExists = state.find((item) => item.id === action.payload.id);
      if (itemExists) {
        itemExists.quantity++;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
      Cookies.set("cart", JSON.stringify(state))
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.find((item) => item.id === action.payload);
      item?.quantity && item.quantity++
      Cookies.set("cart", JSON.stringify(state))
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.find((item) => item.id === action.payload);
      if (item?.quantity === 1) {
        const index = state.findIndex((item) => item.id === action.payload);
        state.splice(index, 1);
      } else {
        item?.quantity && item.quantity--
      }
      Cookies.set("cart", JSON.stringify(state))
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((item) => item.id === action.payload);
      state.splice(index, 1);
      Cookies.set("cart", JSON.stringify(state))
    },
    clearCart: (state) => {
      state.length =  0;
      Cookies.remove('cart');
    },
 },
});

export const {
 addToCart,
 incrementQuantity,
 decrementQuantity,
 removeFromCart,
 clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;