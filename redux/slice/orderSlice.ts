import { apiRequest } from "@/apiInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getOrderList = createAsyncThunk(
  "support/getOrderList",
  async ({ page = 1 }: { page?: number }, { rejectWithValue }) => {
    try {
      const endpoint = `/orders?page=${page}&limit=10`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });
      console.log(data, "=========orderdata");

      return {
        records: data.data,
        total: data.total,
        page: data.page,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch orders");
    }
  },
);
type OrderState = {
  orders: any[];
  loading: boolean;
  totalCount: number;
};

const initialState: OrderState = {
  orders: [],
  loading: false,
  totalCount: 0,
};
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getOrderList.pending, (state) => {
        state.loading = true;
      })

      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        const { records, total, page } = action.payload;

        if (page === 1) {
          state.orders = records;
        } else {
          // load more
          state.orders = [...state.orders, ...records];
        }

        state.totalCount = total;
      })

      .addCase(getOrderList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
