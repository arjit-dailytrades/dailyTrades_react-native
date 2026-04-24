import { apiRequest } from "@/apiInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getOrderList = createAsyncThunk(
  "support/getOrderList",
  async ({ page = 1 }: { page?: number }, { rejectWithValue }) => {
    try {
      const endpoint = `/order?page=${page}&limit=10`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });
      console.log(data, "=========orderdata");

      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch orders");
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getOrderList.pending, (state) => {
        state.loading = true;
      })

      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(getOrderList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
