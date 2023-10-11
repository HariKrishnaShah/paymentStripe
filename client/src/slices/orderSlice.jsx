import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { create } from "../services/orders";

const initialState = {
  orders: [],
  order: {},
  total: 0,
  currentPage: 1,
  loading: false,
  error: "",
};

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (payload) => {
    const res = await create(payload);
    return res.data;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [action.payload.data];
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { setCurrentPage } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
