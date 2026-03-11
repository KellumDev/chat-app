import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../app/api';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (data: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };
    const handleFulfilled = (state: AuthState, action: PayloadAction<{ user: User; access_token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      localStorage.setItem('token', action.payload.access_token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    };
    const handleRejected = (state: AuthState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(register.rejected, handleRejected)
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, handleFulfilled)
      .addCase(login.rejected, handleRejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
