import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { reducer } from "./authSlice";

export const AppReducer = combineReducers({
  auth: reducer,
});

export const store = configureStore({
  reducer: AppReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
