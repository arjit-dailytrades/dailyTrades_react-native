import { apiRequest } from "@/apiInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getSubscriptionList = createAsyncThunk(
  "support/getSubscriptionList",
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

      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch subscription");
    }
  },
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscription: [],
    loading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getSubscriptionList.pending, (state) => {
        state.loading = true;
      })

      .addCase(getSubscriptionList.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.records;
      })

      .addCase(getSubscriptionList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default subscriptionSlice.reducer;
