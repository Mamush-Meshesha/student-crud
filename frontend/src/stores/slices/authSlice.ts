/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  justRegistered: boolean;
}

const token = localStorage.getItem('token');

const initialState: AuthState = {
  token: token,
  user: null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
  justRegistered: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state, action: PayloadAction<{ email: string; password: string }>) {
      state.isLoading = true;
      state.error = null;
      state.justRegistered = false;
    },
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      localStorage.setItem('token', action.payload.token);
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    loginFailure(state, action: PayloadAction<string>) {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    registerStart(state, action: PayloadAction<{ firstName: string; lastName: string; email: string; password: string }>) {
      state.isLoading = true;
      state.error = null;
      state.justRegistered = false;
    },
    registerSuccess(state) {
      state.isLoading = false;
      state.justRegistered = true;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearJustRegistered(state) {
      state.justRegistered = false;
    },
    // Logout action
    logout(state) {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearJustRegistered,
} = authSlice.actions;

export default authSlice.reducer;