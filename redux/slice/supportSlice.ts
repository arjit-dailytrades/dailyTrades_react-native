import { apiRequest } from "@/apiInstance";
import { showError, showSuccess } from "@/utils/toast";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getSupportList = createAsyncThunk(
  "support/getSupportList",
  async ({ page = 1 }: { page?: number }, { rejectWithValue }) => {
    try {
      const endpoint = `/support/list?page=${page}&limit=10`;

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
      return rejectWithValue(error?.message || "Failed to fetch supports");
    }
  },
);

// Create support

export const createSupport = createAsyncThunk(
  "support/createSupport",
  async ({ title, comment, file }: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("userComment", comment.trim());

      if (file) {
        formData.append("attachment", {
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
        } as any);
      }

      const data = await apiRequest("/support/create", {
        method: "POST",
        body: formData,
        auth: true,
      });
      showSuccess("Support created successfully!");
      return data;
    } catch (error: any) {
      showError("Failed to create support");
      return rejectWithValue(error?.message || "Failed to create support");
    }
  },
);

type SupportState = {
  supports: any[];
  loading: boolean;
  totalCount: number;
};

const initialState: SupportState = {
  supports: [],
  loading: false,
  totalCount: 0,
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getSupportList.pending, (state) => {
        state.loading = true;
      })

      .addCase(getSupportList.fulfilled, (state, action) => {
        state.loading = false;

        const { records, total, page } = action.payload;

        if (page === 1) {
          // refresh / first load
          state.supports = records;
        } else {
          // load more
          state.supports = [...state.supports, ...records];
        }

        state.totalCount = total;
      })

      .addCase(getSupportList.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createSupport.pending, (state) => {
        state.loading = true;
      })

      .addCase(createSupport.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(createSupport.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default supportSlice.reducer;
