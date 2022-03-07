import { AuthData, User, UserCredentials } from "@course/common";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "@src/services/AuthService";
const rootActionName = "auth";
export const loginWithEmailAndPassword = createAsyncThunk<
  { user: User; token: string },
  UserCredentials
>(
  `${rootActionName}/login`,

  async (credentials, thunkApi) => {
    try {
      const data = await AuthService.login(credentials);
      return { user: data.data.user, token: data.data.accessToken };
    } catch (e) {
      return thunkApi.rejectWithValue({ errorMessage: e.message });
    }
  }
);

export const logout = createAsyncThunk<boolean>(
  `${rootActionName}/logout`,

  async (_, thunkApi) => {
    try {
      await AuthService.logout();
      return true;
    } catch (e) {
      return thunkApi.rejectWithValue({ errorMessage: e.message });
    }
  }
);

export const registerNewUser = createAsyncThunk<AuthData, UserCredentials>(
  `${rootActionName}/registerNewUser`,

  async (credentials, thunkApi) => {
    try {
      const data = await AuthService.registration(credentials);
      return data.data;
    } catch (e) {
      return thunkApi.rejectWithValue({ errorMessage: e.message });
    }
  }
);

export interface AuthStateType {
  user?: User;
  isAuth: boolean;
}

const initialState = {
  isAuth: false,
} as AuthStateType;

const authSlice = createSlice({
  name: rootActionName,
  initialState,

  extraReducers: (builder) => {
    builder.addCase(loginWithEmailAndPassword.pending, (state) => {
      state.isAuth = false;
      state.user = null;
    });
    builder.addCase(loginWithEmailAndPassword.rejected, (state) => {
      state.isAuth = false;
    });
    builder.addCase(loginWithEmailAndPassword.fulfilled, (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.isAuth = true;
      localStorage.setItem("token", token);
    });

    builder.addCase(registerNewUser.pending, (state) => {
      state.isAuth = false;
      state.user = null;
    });
    builder.addCase(registerNewUser.rejected, (state) => {
      state.isAuth = false;
    });
    builder.addCase(registerNewUser.fulfilled, (state, action) => {
      const { accessToken } = action.payload;
      state.isAuth = true;
      localStorage.setItem("token", accessToken);
    });
    builder.addCase(logout.pending, (state) => {
      state.isAuth = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.isAuth = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuth = false;
      state.user = null;
      localStorage.removeItem("token");
    });
  },

  reducers: {},
});

export const { reducer: AuthReducer, actions } = authSlice;
