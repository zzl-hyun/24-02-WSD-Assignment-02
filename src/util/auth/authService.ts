// src/util/auth/authService.ts
import { rejects } from "assert";
import axios from "axios";
import { resolve } from "path";
export default class AuthService {

  static async tryLogin(email: string, password: string, saveToken = true): Promise<any> {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((user: any) => user.email === email && user.password === password);
  
      if (user) {
        sessionStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', email);
        resolve(user);
      } else {
        console.error("Authentication failed for email:", email); // Debug log
        reject(new Error('Login failed'));
      }
    });
  };
  
  static setRememberUser(email: string, password: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('rememberUser', JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem('rememberUser');
    }
  };

  static async tryRegister(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some((existingUser: any) => existingUser.email === email);

        if (userExists) {
          reject(new Error('User already exists'));
          return;
        }
        const newUser = { email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };
  
  static async logout(): Promise<void> {
    const accessToken = localStorage.getItem("kakao_access_token");

    if (accessToken) {
      try {
        // 카카오 API에 로그아웃 요청
        const response = await axios.post(
          "https://kapi.kakao.com/v1/user/logout",
          {},
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Kakao logout successful:", response.data);
            // URL 정리
        const newUrl = window.location.origin + '/signin';
        window.history.replaceState({}, document.title, newUrl);
      } catch (error) {
        console.error("Kakao logout failed:", error);
      }
    }

    // 클라이언트 측 로컬스토리지 정리
    localStorage.removeItem("TMDb-Key");
    // localStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("kakao_access_token");
    sessionStorage.clear();
  };

  static async fetchKakaoToken(code: string): Promise<string> {
    try {
      const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.REACT_APP_KAKAO_CLIENT_ID,
          redirect_uri: process.env.REACT_APP_REDIRECT_URL,
          code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data.access_token; // 성공 시 access_token 반환
    } catch (err) {
      throw err; // 에러 발생 시 호출자에게 전달
    }
  }
  
  static async fetchKakaoUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(JSON.stringify(response.data));
      return response.data; // 사용자 정보 반환
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user info');
    }
  };

  static async handleKakaoRedirect(): Promise<void> {
    const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URL;
    const state = 'signin';
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&scope=profile_image,friends`;
    window.location.href = kakaoAuthUrl;
  };
}

