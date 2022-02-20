import { Action, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "@src/store/store";

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown, // or some ThunkExtraArgument interface
  Action<string>
>;

export type ThunkProps<
  T extends { [K in keyof T]: (...a: unknown[]) => AppThunk<void> }
> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => void;
};
