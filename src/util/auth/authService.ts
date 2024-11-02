// src/util/auth/authService.ts

export default class AuthService {
  static tryLogin(email: string, password: string, saveToken = true): Promise<any> {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((user: any) => user.email === email && user.password === password);

      if (user) {
        if (saveToken) {
          localStorage.setItem('TMDb-Key', password);  // Remember Me가 체크된 경우 localStorage에 저장
        } else {
          sessionStorage.setItem('TMDb-Key', password); // 체크되지 않은 경우 sessionStorage에 저장
        }
        sessionStorage.setItem('isAuthenticated', 'true'); // 인증 상태 설정
        resolve(user);
      } else {
        reject(new Error('Login failed'));
      }
    });
  }

  static tryRegister(email: string, password: string): Promise<void> {
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

  static logout() {
    localStorage.removeItem('TMDb-Key');
    sessionStorage.removeItem('isAuthenticated');
  }
}
