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
  kakaoUserInfo: {
    id: number | null;
    nickname: string | null;
    profileImage: string | null;
  } | null;
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
  kakaoUserInfo: null,
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

export const fetchKakaoAccessToken = createAsyncThunk('auth/fetchKakaoAccessToken', async (code: string, { rejectWithValue }) => {
    try {
      const access_token = await AuthService.fetchKakaoToken(code);

      // localStorage.setItem('kakao_access_token', access_token);
      sessionStorage.setItem('kakao_access_token', access_token);

            // Redirect 후 state 값 확인
      const urlParams = new URLSearchParams(window.location.search);
      const state = urlParams.get('state');
      if (state === 'signin') {
        window.location.href = `${process.env.REACT_APP_REDIRECT_URL}#/signin`; // 리다이렉트 처리
      }
      
      return access_token;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Kakao login failed');
    }
  }
);

export const handleKakaoLogin = createAsyncThunk('auth/handleKakaoLogin', async () => {
  AuthService.handleKakaoRedirect();
});

export const fetchKakaoUserInfo = createAsyncThunk('auth/fetchKakaoUserInfo', async (_, { rejectWithValue }) => {
    // const accessToken = state.auth.kakaoAccessToken;
    const accessToken = sessionStorage.getItem('kakao_access_token');

    if (!accessToken) {
      return rejectWithValue('Access token is missing');
    }

    try {
      const userInfo = await AuthService.fetchKakaoUserInfo(accessToken);
      return userInfo; // 사용자 정보 반환
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user info');
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
        state.errorMessage = null;
      })
      .addCase(fetchKakaoAccessToken.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.errorMessage = action.payload as string;
      })
      .addCase(fetchKakaoUserInfo.fulfilled, (state, action: PayloadAction<any>) => {
        state.kakaoUserInfo = {
          id: action.payload.id,
          nickname: action.payload.properties?.nickname || null,
          profileImage: action.payload.properties?.thumbnail_image || null,
        };
        state.errorMessage = null;
      })
      .addCase(fetchKakaoUserInfo.rejected, (state, action) => {
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
