// src/components/SignIn.tsx
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

  const navigate = useNavigate();

  // remember me
  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPassword = localStorage.getItem('rememberedPassword');
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const isLoginFormValid = email && password;
  const isRegisterFormValid = registerEmail && registerPassword && confirmPassword === registerPassword && acceptTerms;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.tryLogin(email, password);
      if(rememberMe){
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      }else{
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
      alert('Login successful');
      navigate('/');
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleRegister = async () => {
    try {
      await AuthService.tryRegister(registerEmail, registerPassword);
      alert('Registration successful');
      toggleCard();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };
  

  // const toggleCard = () => setIsLoginVisible(!isLoginVisible);
  const toggleCard = () => {
    console.log("Toggling card visibility");
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
                <div className={`input ${email ? 'active' : ''}`}>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className={`input ${password ? 'active' : ''}`}>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <label className="read-text" htmlFor="remember">Remember me</label>
                </span>
                <span className="checkbox forgot">
                  <a href="javascript:void(0)">Forgot Password?</a>
                </span>
                <button className="signin-button" disabled={!isLoginFormValid}>Login</button>

              </form>
              <a href="javascript:void(0)" className="account-check" onClick={toggleCard}>
                Already have an account? <b>Sign in</b>
              </a>
            </div>

            <div className={`card ${isLoginVisible ? 'hidden' : ''}`} id="register">
              <form onSubmit={handleRegister}>
                <h1>Sign up</h1>
                <div className={`input ${registerEmail ? 'active' : ''}`}>
                  <input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                  <label htmlFor="register-email">Email</label>
                </div>
                <div className={`input ${registerPassword ? 'active' : ''}`}>
                  <input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <label htmlFor="register-password">Password</label>
                </div>
                <div className={`input ${confirmPassword ? 'active' : ''}`}>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <label className="read-text" htmlFor="terms">I have read <b>Terms and Conditions</b></label>
                </span>
                <button className="signin-button" disabled={!isRegisterFormValid}>Register</button>
              </form>
              <a href="javascript:void(0)" id="gotologin" className="account-check" onClick={toggleCard}>
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