import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { AuthReducer } from "./slices/authSlice";
import { CourseReducer } from "./slices/courseSlice";

export const AppReducer = combineReducers({
  auth: AuthReducer,
  courses: CourseReducer,
});

export const store = configureStore({
  reducer: AppReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
