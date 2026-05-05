import { apiRequest } from "@/apiInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
interface ProfileState {
  profile: any;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Thunk
export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`/auth/profile`, {
        method: "GET",
        auth: true,
      });
      console.log(data, "=============data");

      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Something went wrong");
    }
  },
);

// Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload;
      })

      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
