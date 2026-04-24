import { apiRequest } from "@/apiInstance";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// get broker
export const getBroker = createAsyncThunk(
  "broker/getBroker",
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = `/auth/broker-config`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });
      console.log(data, "=======broker");

      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Something went wrong");
    }
  },
);

// get broker cred
export const getBrokerCredential = createAsyncThunk(
  "broker/getBrokerCredential",
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = `/auth/user-broker-credential`;

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

interface BrokerTypes {
  openLinkBrokerModal: boolean;
  brokerList: any;
  isLoadingBroker: boolean;
  brokerCredential: any;
  isLoadingBrokerCred: boolean;
}

const initialState: BrokerTypes = {
  openLinkBrokerModal: false,
  brokerList: [],
  isLoadingBroker: false,
  brokerCredential: [],
  isLoadingBrokerCred: false,
};

const brokerSlice = createSlice({
  name: "broker",
  initialState,
  reducers: {
    setOpenLinkBrokerModal: (state, action: PayloadAction<boolean>) => {
      state.openLinkBrokerModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // brokers
      .addCase(getBroker.pending, (state) => {
        state.isLoadingBroker = true;
      })

      .addCase(getBroker.fulfilled, (state, action) => {
        state.isLoadingBroker = false;
        state.brokerList = action.payload;
      })
      .addCase(getBroker.rejected, (state) => {
        state.isLoadingBroker = false;
      })

      // broker cred
      .addCase(getBrokerCredential.pending, (state) => {
        state.isLoadingBrokerCred = true;
      })

      .addCase(getBrokerCredential.fulfilled, (state, action) => {
        state.isLoadingBrokerCred = false;
        state.brokerCredential = action.payload;
      })

      .addCase(getBrokerCredential.rejected, (state) => {
        state.isLoadingBrokerCred = false;
      });
  },
});

export const { setOpenLinkBrokerModal } = brokerSlice.actions;
export default brokerSlice.reducer;
