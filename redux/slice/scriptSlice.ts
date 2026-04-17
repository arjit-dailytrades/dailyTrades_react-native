import { apiRequest } from "@/apiInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchScripts = createAsyncThunk(
  "trade/fetchScripts",
  async (
    {
      page,
      type,
      segment,
      freePaid,
      advisorId,
    }: {
      page?: number;
      type?: string;
      segment?: string;
      freePaid?: string;
      advisorId?: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      let param: any = { limit: 12, page: page || 1 };
      if (type) param.scriptType = type;
      if (segment) param.scriptSegment = segment;
      if (freePaid) param.scriptPriceType = freePaid;
      if (advisorId) param.advisorId = advisorId;

      const queryString = new URLSearchParams(param).toString();
      const endpoint = `/script/list?${queryString}`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Something went wrong");
    }
  },
);
// script can open
export const fetchCanOpenScript = createAsyncThunk(
  "script/fetchCanOpenScript",
  async ({ scriptId }: { scriptId: string }, { rejectWithValue }) => {
    try {
      const endpoint = `/script/can-open?scriptId=${scriptId}`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Something went wrong");
    }
  },
);

export const fetchScriptStats = createAsyncThunk(
  "script/fetchScriptStats",
  async (
    {
      type,
      segment,
      freePaid,
      advisorId,
    }: {
      type?: string;
      segment?: string;
      freePaid?: string;
      advisorId?: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      const params: any = {};

      if (type) params.scriptType = type;
      if (segment) params.scriptSegment = segment;
      if (freePaid) params.scriptPriceType = freePaid;
      if (advisorId) params.advisorId = advisorId;

      const queryString = new URLSearchParams(params).toString();
      console.log("queryString:", queryString);

      const endpoint = `/script/trade-stats?${queryString}`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });
      // console.log("stats:==", data);

      return data;
    } catch (error: any) {
      // console.log("error:==", error);

      return rejectWithValue(error?.message || "Something went wrong");
    }
  },
);

interface ScriptState {
  loading: boolean;
  error: string | null;
  scripts: any[];
  canOpenScript: any | null;
  canOpenLoading: boolean;
  statsCount: any | null;
  statsLoading: boolean;
  totalPages: number;
}

const initialState: ScriptState = {
  loading: false,
  error: null,
  scripts: [],
  canOpenScript: null,
  canOpenLoading: false,
  statsCount: null,
  statsLoading: false,
  totalPages: 0,
};

const scriptSlice = createSlice({
  name: "script",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScripts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScripts.fulfilled, (state, action) => {
        state.loading = false;
        state.scripts = action.payload?.records || [];
        state.totalPages = action.payload?.pages;
      })
      .addCase(fetchScripts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      /* fetchCanOpenScript */
      .addCase(fetchCanOpenScript.pending, (state) => {
        state.canOpenLoading = true;
      })
      .addCase(fetchCanOpenScript.fulfilled, (state, action) => {
        state.canOpenLoading = false;
        state.canOpenScript = action.payload;
      })
      .addCase(fetchCanOpenScript.rejected, (state) => {
        state.canOpenLoading = false;
      })
      // fetchScriptStats
      .addCase(fetchScriptStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchScriptStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.statsCount = action.payload;
      })
      .addCase(fetchScriptStats.rejected, (state) => {
        state.statsLoading = false;
      });
  },
});
export default scriptSlice.reducer;
