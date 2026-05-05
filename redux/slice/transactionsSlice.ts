import { apiRequest } from "@/apiInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define params type (all optional)
interface TransactionParams {
  page?: number;
  limit?: number;
  sortType?: string;
  sortBy?: string;
  source?: string;
}

// Async thunk
export const getTransactionList = createAsyncThunk(
  "transaction/getTransactionList",
  async (params: TransactionParams = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortType = "desc",
        sortBy = "createdAt",
        source = "ALL",
      } = params;

      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortType,
        sortBy,
        source,
      }).toString();

      const endpoint = `/payments/history?${query}`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });

      return {
        records: data.records,
        total: data.total,
        page: data.page,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch transactions");
    }
  },
);

// State
interface OrderState {
  transaction: any[];
  loading: boolean;
  totalCount: number;
  error: string | null;
}

const initialState: OrderState = {
  transaction: [],
  loading: false,
  totalCount: 0,
  error: null,
};

// Slice
const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionList.fulfilled, (state, action) => {
        state.loading = false;

        const { records, total, page } = action.payload;

        if (page === 1) {
          // Refresh / first load
          state.transaction = records;
        } else {
          // Load more
          state.transaction = [...state.transaction, ...records];
        }

        state.totalCount = total;
      })

      .addCase(getTransactionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;
