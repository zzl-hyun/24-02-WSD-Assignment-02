// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import AuthService from '../../util/auth/authService';
import axios from 'axios';
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
  kakaoAccessToken: string | null;
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
  kakaoAccessToken: null,
};


export const tryLogin = createAsyncThunk(
  'auth/tryLogin',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await AuthService.tryLogin(email, password); // AuthService에서 처리
      return { email };
    } catch (error: any) {
      return rejectWithValue(error.message || 'password missmatch');
    }
  }
);

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

export const fetchKakaoAccessToken = createAsyncThunk(
  'auth/fetchKakaoAccessToken',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.REACT_APP_KAKAO_CLIENT_ID, // Kakao App 키
          redirect_uri: process.env.REACT_APP_REDIRECT_URL,
          code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const { access_token } = response.data;
      localStorage.setItem('kakao_access_token', access_token);

      return access_token;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Kakao login failed');
    }
  }
);

export const handleKakaoLogin = createAsyncThunk('auth/handleKakaoLogin', async () => {
  const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_REDIRECT_URL;
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  window.location.href = kakaoAuthUrl;
});

export const setRememberUser = createAsyncThunk(
  'auth/setRememberMe',
  async ({ email, password, rememberMe }: { email: string; password: string; rememberMe: boolean }) => {
    AuthService.setRememberUser(email, password, rememberMe);
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await AuthService.tryRegister(email, password); // AuthService에서 처리
      return { email };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
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
      .addCase(tryLogin.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loginSuccess = true;
        state.errorMessage = null;
      })
      .addCase(tryLogin.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginSuccess = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.errorMessage = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(fetchKakaoAccessToken.fulfilled, (state, action: PayloadAction<string>) => {
        state.isAuthenticated = true;
        state.kakaoAccessToken = action.payload;
        state.errorMessage = null;
      })
      .addCase(fetchKakaoAccessToken.rejected, (state, action) => {
        state.isAuthenticated = false;
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
