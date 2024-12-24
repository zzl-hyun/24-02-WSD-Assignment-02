import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// 상태를 세션 스토리지에 저장
const saveToSessionStorage = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem('authState', serializedState);
  } catch (error) {
    console.error('Failed to save state to session storage:', error);
  }
};

// 세션 스토리지에서 상태 복원
const loadFromSessionStorage = () => {
  try {
    const serializedState = sessionStorage.getItem('authState');
    if (serializedState === null) return undefined; // 초기 상태 반환
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Failed to load state from session storage:', error);
    return undefined;
  }
};

// 세션 스토리지에서 복원된 상태를 preloadedState로 전달
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: loadFromSessionStorage(), // 세션 스토리지에서 auth 상태 복원
  },
});

// 상태가 변경될 때마다 세션 스토리지에 저장
store.subscribe(() => {
  saveToSessionStorage(store.getState().auth);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
