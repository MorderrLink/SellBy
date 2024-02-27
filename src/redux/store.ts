import { configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from "~/redux/slices/cartSlice"

export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
    reducer: {
        cart: cartSliceReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
})