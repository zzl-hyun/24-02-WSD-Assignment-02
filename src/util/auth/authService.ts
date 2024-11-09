// src/util/auth/authService.ts

export default class AuthService {

  static async tryLogin(email: string, password: string, saveToken = true): Promise<any> {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((user: any) => user.email === email && user.password === password);
  
      if (user) {
        console.log("User authenticated:", user); // Debug log
        if (saveToken) {
          localStorage.setItem('TMDb-Key', password);
        } else {
          sessionStorage.setItem('TMDb-Key', password);
        }
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', email);
        resolve(user);
      } else {
        console.error("Authentication failed for email:", email); // Debug log
        reject(new Error('Login failed'));
      }
    });
  }
  
  static setRememberUser(email: string, password: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('rememberUser', JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem('rememberUser');
    }
  }

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
  }
  


  static logout(): void {
    localStorage.removeItem('TMDb-Key');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  }
  // static async socialLogin(provider: string, token: string): Promise<any> {
  //   // 소셜 로그인 API 호출 로직 구현
  //   return new Promise((resolve, reject) => {
  //     // 예시 코드 (실제 API 호출 대체)
  //     if (provider && token) {
  //       console.log(`Social login with ${provider}`);
  //       resolve({ email: "socialuser@example.com", token });
  //     } else {
  //       reject(new Error('Social login failed'));
  //     }
  //   });
  // }
}

