import { apiRequest } from "@/apiInstance";
import { showSuccess } from "@/utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const fetchExpert = createAsyncThunk(
  "advisor/fetchAdvisors",
  async (params: any, { rejectWithValue }) => {
    try {
      let query: any = {
        page: params.page,
        limit: 12,
      };

      if (params?.debouncedSearch) query.q = params.debouncedSearch;
      if (params?.type) query.advisorType = params.type;
      if (params?.follow !== undefined) query.follow = params.follow;
      if (params?.favorite !== undefined) query.favorite = params.favorite;

      const queryString = new URLSearchParams(query).toString();

      const endpoint = `/advisor/list?${queryString}`;
      console.log("endPoint:", endpoint);

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch advisors");
    }
  },
);

// favorite advisor
export const toggleFavoriteAdvisor = createAsyncThunk(
  "expert/toggleFavoriteAdvisor",
  async (
    { id, isFavorite }: { id: string; isFavorite: boolean },
    { rejectWithValue },
  ) => {
    try {
      const endpoint = isFavorite
        ? `/advisor/mask-as-not-favorite`
        : `/advisor/mask-as-favorite`;

      const response = await apiRequest(endpoint, {
        method: "POST",
        auth: true,
        body: { id },
      });
      showSuccess(isFavorite ? "Removed from favorites" : "Added to favorites");
      if (!response) throw new Error("Failed to update favorite");

      return { id, isFavorite: !isFavorite };
    } catch (err: any) {
      return rejectWithValue(err?.message || "Something went wrong");
    }
  },
);

// follow advisor
export const toggleFollowAdvisor = createAsyncThunk(
  "expert/toggleFollowAdvisor",
  async (
    { id, isFollow }: { id: string; isFollow: boolean },
    { rejectWithValue },
  ) => {
    try {
      const endpoint = isFollow ? `/advisor/un-follow` : `/advisor/follow`;

      const response = await apiRequest(endpoint, {
        method: "POST",
        auth: true,
        body: { id },
      });
      showSuccess(isFollow ? "Removed from follow" : "Added to follow");
      if (!response) throw new Error("Failed to update follow");

      return { id, isFollow: !isFollow };
    } catch (err: any) {
      return rejectWithValue(err?.message || "Something went wrong");
    }
  },
);

export const fetchExpertDetail = createAsyncThunk(
  "advisor/fetchAdvisorDetail",
  async (
    { subscriptionId }: { subscriptionId: string },
    { rejectWithValue },
  ) => {
    try {
      const endpoint = `/subscriptions?subscriptionId=${subscriptionId}`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });
      console.log("expert details: ", data);

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch subscription details",
      );
    }
  },
);

export const fetchSubscriptionPlans = createAsyncThunk(
  "advisor/fetchSubscriptionPlans",
  async ({ advisorId }: { advisorId: string }, { rejectWithValue }) => {
    try {
      const endpoint = `/advisor/subscription-details/${advisorId}`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch subscription details",
      );
    }
  },
);

export const fetchExpertPerformance = createAsyncThunk(
  "advisor/fetchExpertPerformance",
  async (params: any, { rejectWithValue }) => {
    let query: any = {
      page: params.page,
      limit: 10,
    };

    if (params?.debouncedSearch) query.q = params.debouncedSearch;
    if (params?.segment) query.scriptSegment = params.segment;
    if (params?.type) query.scriptType = params.type;
    if (params?.freePaid) query.scriptPriceType = params.freePaid;
    if (params?.selected) query.periodFilter = params.selected;

    const queryString = new URLSearchParams(query).toString();
    try {
      const endpoint = `/script/past-performance/${params.advisorId}/?${queryString}`;

      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch subscription details",
      );
    }
  },
);

export const downloadResearchReport = createAsyncThunk(
  "advisor/downloadResearchReport",
  async (
    { id, advisor, record }: { id: string; advisor: any; record: any },
    { rejectWithValue },
  ) => {
    try {
      const token = await AsyncStorage.getItem("t");

      const fileName = `${advisor?.fName}-${advisor?.lName}-${record?.title}-report-${id}.pdf`;

      const file = new FileSystem.File(FileSystem.Paths.document, fileName);

      await FileSystem.File.downloadFileAsync(
        `${process.env.API_BASE}/script/${id}/report`,
        file,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      }
      console.log("file:", file);

      return file.uri;
    } catch (error: any) {
      console.log("error", error);

      return rejectWithValue(error?.message || "Failed to download report");
    }
  },
);
// types
interface AdvisorState {
  experts: any;
  isExpertLoading: boolean;
  expertDetail: any | null;
  isExpertDetailLoading: boolean;
  advisorId: string | null;
  error: string | null;
  subscriptionPlan: any;
  isLoadingPlan: boolean;
  expertPastPerformance: any;
  isLoadingPast: boolean;
  isDownloading: boolean;
  fileUri: string;
  isFollowLoading: boolean;
  isFavoriteLoading: boolean;
}

const initialState: AdvisorState = {
  experts: [],
  isExpertLoading: false,
  expertDetail: null,
  isExpertDetailLoading: false,
  advisorId: null,
  error: null,
  subscriptionPlan: {},
  isLoadingPlan: false,
  expertPastPerformance: [],
  isLoadingPast: false,
  isDownloading: false,
  fileUri: "",
  isFollowLoading: false,
  isFavoriteLoading: false,
};

const advisorSlice = createSlice({
  name: "advisor",
  initialState,
  reducers: {
    resetAdvisorDetail: (state) => {
      state.expertDetail = null;
      state.advisorId = null;
    },
  },

  extraReducers: (builder) => {
    builder
      //  fetch Expert
      .addCase(fetchExpert.pending, (state) => {
        state.isExpertLoading = true;
        state.error = null;
      })
      .addCase(fetchExpert.fulfilled, (state, action) => {
        state.isExpertLoading = false;
        state.experts = action.payload;
      })
      .addCase(fetchExpert.rejected, (state, action: any) => {
        state.isExpertLoading = false;
        state.error = action.payload;
      })

      // fetch expert details
      .addCase(fetchExpertDetail.pending, (state) => {
        state.isExpertDetailLoading = true;
        state.error = null;
      })
      .addCase(fetchExpertDetail.fulfilled, (state, action) => {
        state.isExpertDetailLoading = false;
        state.expertDetail = action.payload;
        state.advisorId = action.payload?.traderSubscription?.advisorId || null;
      })
      .addCase(fetchExpertDetail.rejected, (state, action: any) => {
        state.isExpertDetailLoading = false;
        state.error = action.payload;
      })
      // fetch subscription plans
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.isLoadingPlan = true;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.isLoadingPlan = false;
        state.subscriptionPlan = action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action: any) => {
        state.isLoadingPlan = false;
      })
      // fetch past performance
      .addCase(fetchExpertPerformance.pending, (state) => {
        state.isLoadingPast = true;
      })
      .addCase(fetchExpertPerformance.fulfilled, (state, action) => {
        state.isLoadingPast = false;
        state.expertPastPerformance = action.payload;
      })
      .addCase(fetchExpertPerformance.rejected, (state, action: any) => {
        state.isLoadingPast = false;
      })
      // download research report

      .addCase(downloadResearchReport.pending, (state) => {
        state.isDownloading = true;
        state.error = null;
      })
      .addCase(downloadResearchReport.fulfilled, (state, action) => {
        state.isDownloading = false;
        state.fileUri = action.payload;
      })
      .addCase(downloadResearchReport.rejected, (state, action: any) => {
        state.isDownloading = false;
        state.error = action.payload;
      })
      // favorite
      .addCase(toggleFavoriteAdvisor.pending, (state) => {
        state.isFavoriteLoading = true;
        state.error = null;
      })
      .addCase(toggleFavoriteAdvisor.fulfilled, (state, action) => {
        state.isFavoriteLoading = false;
      })
      .addCase(toggleFavoriteAdvisor.rejected, (state, action: any) => {
        state.isFavoriteLoading = false;
        state.error = action.payload;
      })
      // follow
      .addCase(toggleFollowAdvisor.pending, (state) => {
        state.isFollowLoading = true;
        state.error = null;
      })
      .addCase(toggleFollowAdvisor.fulfilled, (state, action) => {
        state.isFollowLoading = false;
      })
      .addCase(toggleFollowAdvisor.rejected, (state, action: any) => {
        state.isFollowLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAdvisorDetail } = advisorSlice.actions;

export default advisorSlice.reducer;
