// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import AuthService from '../../util/auth/authService';

interface AuthState {
  email: string;
  password: string;
  registerEmail: string;
  registerPassword: string;
  confirmPassword: string;
  rememberMe: boolean;
  acceptTerms: boolean;
  isAuthenticated: boolean;
  loginSuccess: boolean;
  errorMessage: string | null;
}

const initialState: AuthState = {
  email: '',
  password: '',
  registerEmail: '',
  registerPassword: '',
  confirmPassword: '',
  rememberMe: false,
  acceptTerms: false,
  isAuthenticated: false,
  loginSuccess: false,
  errorMessage: null,
};

// Async thunk for registering a user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await AuthService.tryRegister(email, password);
      return { email };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);


export const tryLogin = createAsyncThunk(
    'auth/tryLogin',
    async ({ email, password }: { email: string; password: string }, { dispatch, rejectWithValue }) => {
      try {
        console.log("Attempting login..."); // Debug log
        await AuthService.tryLogin(email, password);
        console.log("Login successful, dispatching setLoginSuccess(true)"); // Debug log
        dispatch(setLoginSuccess(true)); // Ensure this is executed
        return { email };
      } catch (error: any) {
        console.error("Login failed:", error.message); // Debug log for error
        return rejectWithValue(error.message || 'Login failed');
      }
    }
  );
  


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setRegisterEmail: (state, action: PayloadAction<string>) => {
      state.registerEmail = action.payload;
    },
    setRegisterPassword: (state, action: PayloadAction<string>) => {
      state.registerPassword = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
    setAcceptTerms: (state, action: PayloadAction<boolean>) => {
      state.acceptTerms = action.payload;
    },
    setLoginSuccess: (state, action: PayloadAction<boolean>) => {
        state.loginSuccess = action.payload;
        console.log("loginSuccess value authSlice:", state.loginSuccess);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = '';
      state.password = '';
      AuthService.logout(); // Clear local storage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.errorMessage = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(tryLogin.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loginSuccess = true;
        state.errorMessage = null;
      })
      .addCase(tryLogin.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginSuccess = false;
        state.errorMessage = action.payload as string;
      });
  },
});

export const {
    setEmail,
    setPassword,
    setRegisterEmail,
    setRegisterPassword,
    setConfirmPassword,
    setRememberMe,
    setAcceptTerms,
    setLoginSuccess,
    logout,
  } = authSlice.actions;

export default authSlice.reducer;
