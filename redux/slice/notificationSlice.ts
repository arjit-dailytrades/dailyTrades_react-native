import { apiRequest } from "@/apiInstance";
import { Notification } from "@/types/notification";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getNotificationList = createAsyncThunk(
  "notification/getNotificationList",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const endpoint = `/notification?page=${page}&limit=${limit}`;
      const data = await apiRequest(endpoint, {
        method: "GET",
        auth: true,
      });

      return {
        records: data.results as Notification[],
        total: data.totalResults as number,
        page,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch notifications");
    }
  },
);

interface NotificationState {
  notification: Notification[];
  loading: boolean;
  totalCount: number;
  error: string | null;
}

const initialState: NotificationState = {
  notification: [],
  loading: false,
  totalCount: 0,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Mark a single notification as read locally (optimistic update)
    markAsRead(state, action: { payload: string }) {
      const item = state.notification.find((n) => n._id === action.payload);
      if (item) {
        item.isRead = true;
        item.readAt = new Date().toISOString();
      }
    },

    // Mark all notifications as read locally
    markAllAsRead(state) {
      const now = new Date().toISOString();
      state.notification.forEach((n) => {
        n.isRead = true;
        n.readAt = n.readAt ?? now;
      });
    },

    // Clear error
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getNotificationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getNotificationList.fulfilled, (state, action) => {
        state.loading = false;

        const { records, total, page } = action.payload;

        if (page === 1) {
          // Fresh load or refresh — replace the list
          state.notification = records;
        } else {
          // Pagination — append only non-duplicate records
          const existingIds = new Set(state.notification.map((n) => n._id));
          const newRecords = records.filter((n) => !existingIds.has(n._id));
          state.notification = [...state.notification, ...newRecords];
        }

        state.totalCount = total;
      })

      .addCase(getNotificationList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Something went wrong";
      });
  },
});

export const { markAsRead, markAllAsRead, clearError } =
  notificationSlice.actions;

export default notificationSlice.reducer;
