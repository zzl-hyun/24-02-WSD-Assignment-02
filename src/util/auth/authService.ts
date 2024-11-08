// src/util/auth/authService.ts

export default class AuthService {
  static tryLogin(email: string, password: string, saveToken = true): Promise<any> {
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
        resolve(user);
      } else {
        console.error("Authentication failed for email:", email); // Debug log
        reject(new Error('Login failed'));
      }
    });
  }
  


  
  static tryRegister(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Fetch the latest users list from localStorage each time
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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  }
}
