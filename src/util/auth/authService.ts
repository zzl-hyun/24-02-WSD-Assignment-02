// src/util/auth/authService.ts
import axios from "axios";
export default class AuthService {

  static async tryLogin(email: string, password: string, saveToken = true): Promise<any> {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((user: any) => user.email === email && user.password === password);
  
      if (user) {
        if (saveToken) {
          localStorage.setItem('TMDb-Key', password);
        } else {
          sessionStorage.setItem('TMDb-Key', password);
        }
        console.log("User authenticated:", user); // Debug log
        localStorage.setItem('isAuthenticated', 'true');
        // sessionStorage.setItem('isAuthenticated', 'true');
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
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("kakao_access_token");
    sessionStorage.clear();
  };

  
}

