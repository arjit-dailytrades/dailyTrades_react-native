import { showError, showSuccess } from "@/utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { encode } from "base-64";
import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.EXPO_PUBLIC_S_TO_S_API_BASE;

/* SEND OTP */

export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (
    {
      mobile,
      v3Token,
      v2Token,
    }: {
      mobile: string;
      v3Token?: string;
      v2Token?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      console.log("mobile:", mobile);
      console.log("v3Token:", v3Token);
      console.log("v2Token:", v2Token);

      const response = await fetch(`${BASE_URL}/auth/request-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile,
          ...(v3Token && { v3Token }),
          ...(v2Token && { v2Token }),
        }),
      });

      const data = await response.json();
      console.log("user:", data);

      if (!response.ok) {
        return rejectWithValue({
          message: data?.message || "Failed to send OTP",
          fallbackToV2: data?.fallbackToV2 || false,
        });
      }

      showSuccess("Otp Send Successfully!");
      return data;
    } catch (error: any) {
      showError("Error", error?.message || error);

      return rejectWithValue({
        message: error?.message || error,
        fallbackToV2: false,
      });
    }
  },
);

/* VERIFY OTP */

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    { mobile, otp }: { mobile: string; otp: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login-with-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "OTP verification failed");
      }

      if (data.tokens) {
        const accessToken = data.tokens.access.token;
        const refreshToken = data.tokens.refresh.token;

        await AsyncStorage.setItem("t", accessToken);
        await AsyncStorage.setItem("r", refreshToken);

        const decoded: any = jwtDecode(accessToken);
        await AsyncStorage.setItem("u", encode(JSON.stringify(decoded.user)));
      }

      showSuccess("OTP Verified successfully!");
      return data;
    } catch (error: any) {
      showError("Error", error?.message || error);
      return rejectWithValue(error?.message || error);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    verifyLoading: false,
    error: null as string | null,
    success: false,
    token: null as string | null,
    user: null as any,
  },

  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      /* SEND OTP */

      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
      })

      .addCase(requestOtp.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* VERIFY OTP */

      .addCase(verifyOtp.pending, (state) => {
        state.verifyLoading = true;
      })

      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.verifyLoading = false;
      })

      .addCase(verifyOtp.rejected, (state, action) => {
        state.verifyLoading = false;
        state.error = action.payload as string;
      });
  },
});
export const { setUser } = authSlice.actions;

export default authSlice.reducer;
