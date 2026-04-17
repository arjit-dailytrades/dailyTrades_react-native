import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import advisorReducer from "./slice/expertSlice";
import brokerReducer from "./slice/linkBrokerSlice";
import scriptReducer from "./slice/scriptSlice";
import supportReducer from "./slice/supportSlice";
import themeReducer from "./slice/themeSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    script: scriptReducer,
    expert: advisorReducer,
    broker: brokerReducer,
    support: supportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
