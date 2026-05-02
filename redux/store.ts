import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import advisorReducer from "./slice/expertSlice";
import brokerReducer from "./slice/linkBrokerSlice";
import orderReducer from "./slice/orderSlice";
import scriptReducer from "./slice/scriptSlice";
import subscriptionReducer from "./slice/subscriptionSlice";
import supportReducer from "./slice/supportSlice";
import themeReducer from "./slice/themeSlice";
import transactionReducer from "./slice/transactionsSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    script: scriptReducer,
    expert: advisorReducer,
    broker: brokerReducer,
    support: supportReducer,
    order: orderReducer,
    subscription: subscriptionReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
