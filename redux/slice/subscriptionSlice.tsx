import { apiRequest } from "@/apiInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getSubscriptionList = createAsyncThunk(
  "subscription/getSubscriptionList",
  async (
    { page = 1, limit }: { page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const endpoint = `/subscriptions/list?page=${page}&limit=${limit}`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });

      return {
        records: data.records,
        total: data.total,
        page: page,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch subscription");
    }
  },
);

interface SubscriptionState {
  subscription: any[];
  loading: boolean;
  totalCount: number;
}

const initialState: SubscriptionState = {
  subscription: [],
  loading: false,
  totalCount: 0,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptionList.pending, (state) => {
        state.loading = true;
      })

      .addCase(getSubscriptionList.fulfilled, (state, action) => {
        state.loading = false;

        const { records, total, page } = action.payload;

        if (page === 1) {
          state.subscription = records;
        } else {
          // ➕ append
          state.subscription = [...state.subscription, ...records];
        }

        state.totalCount = total;
      })

      .addCase(getSubscriptionList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default subscriptionSlice.reducer;
