import { apiRequest } from "@/apiInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAgreementList = createAsyncThunk(
  "agreement/getAgreementList",
  async ({ page = 1 }: { page?: number }, { rejectWithValue }) => {
    try {
      const endpoint = `/agreement/list?page=${page}&limit=10`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });
      console.log(data, "=============data");

      return {
        records: data.records,
        total: data.total,
        page: data.page,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch supports");
    }
  },
);

// Create support

type AgreementState = {
  agreement: any[];
  loading: boolean;
  totalCount: number;
};

const initialState: AgreementState = {
  agreement: [],
  loading: false,
  totalCount: 0,
};

const agreementSlice = createSlice({
  name: "agreement",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getAgreementList.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAgreementList.fulfilled, (state, action) => {
        state.loading = false;

        const { records, total, page } = action.payload;

        if (page === 1) {
          // refresh / first load
          state.agreement = records;
        } else {
          // load more
          state.agreement = [...state.agreement, ...records];
        }

        state.totalCount = total;
      })

      .addCase(getAgreementList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default agreementSlice.reducer;
