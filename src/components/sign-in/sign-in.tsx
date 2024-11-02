import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../util/auth/authService';
import './sign-in.css';

const SignIn: React.FC = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isRegisterEmailFocused, setIsRegisterEmailFocused] = useState(false);
  const [isRegisterPasswordFocused, setIsRegisterPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const navigate = useNavigate();

  // 유효성 검사
  const isLoginFormValid = email && password;
  const isRegisterFormValid =
    registerEmail &&
    registerPassword &&
    confirmPassword &&
    registerPassword === confirmPassword &&
    acceptTerms;

  // 로그인 성공 시 메인 페이지로 이동
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (user: any) => user.email === email && user.password === password
    );

    if (user) {
      if (rememberMe) {
        localStorage.setItem('TMDb-Key', password);
      }
      sessionStorage.setItem('isAuthenticated', 'true'); // Set session flag for authenticated state
      alert('Login successful');
      navigate('/');
    } else {
      alert('Login failed');
    }
  };

  // 회원가입 성공 시 로그인 페이지로 전환
  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((user: any) => user.email === registerEmail);

    if (userExists) {
      alert('User already exists');
    } else {
      const newUser = { email: registerEmail, password: registerPassword };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful');
      toggleCard();
    }
  };

  const toggleCard = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  return (
    <div>
      <div className="bg-image"></div>
      <div className="container">
        <div id="phone">
          <div id="content-wrapper">
            <div className={`card ${!isLoginVisible ? 'hidden' : ''}`} id="login">
              <form onSubmit={handleLogin}>
                <h1>Sign in</h1>
                <div className={`input ${isEmailFocused || email ? 'active' : ''}`}>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                  <label htmlFor="email">Username or Email</label>
                </div>
                <div className={`input ${isPasswordFocused || password ? 'active' : ''}`}>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <span className="checkbox remember">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember" className="read-text">Remember me</label>
                </span>
                <span className="checkbox forgot">
                  <a href="#">Forgot Password?</a>
                </span>
                <button disabled={!isLoginFormValid}>Login</button>
              </form>
              <a href="#" className="account-check" onClick={toggleCard}>
                Already have an account? <b>Sign in</b>
              </a>
              {/* <button onClick={toggleCard}>
              Already have an account? <b>Sign in</b>
              </button> */}
            </div>

            <div className={`card ${isLoginVisible ? 'hidden' : ''}`} id="register">
              <form onSubmit={handleRegister}>
                <h1>Sign up</h1>
                <div className={`input ${isRegisterEmailFocused || registerEmail ? 'active' : ''}`}>
                  <input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    onFocus={() => setIsRegisterEmailFocused(true)}
                    onBlur={() => setIsRegisterEmailFocused(false)}
                  />
                  <label htmlFor="register-email">Email</label>
                </div>
                <div className={`input ${isRegisterPasswordFocused || registerPassword ? 'active' : ''}`}>
                  <input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    onFocus={() => setIsRegisterPasswordFocused(true)}
                    onBlur={() => setIsRegisterPasswordFocused(false)}
                  />
                  <label htmlFor="register-password">Password</label>
                </div>
                <div className={`input ${isConfirmPasswordFocused || confirmPassword ? 'active' : ''}`}>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                  />
                  <label htmlFor="confirm-password">Confirm Password</label>
                </div>
                <span className="checkbox remember">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={() => setAcceptTerms(!acceptTerms)}
                  />
                  <label htmlFor="terms" className="read-text">I have read <b>Terms and Conditions</b></label>
                </span>
                <button disabled={!isRegisterFormValid}>Register</button>
              </form>
              <a href="#" id="gotologin" className="account-check" onClick={toggleCard}>
                Don't have an account? <b>Sign up</b>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
