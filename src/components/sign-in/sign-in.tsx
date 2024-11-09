// src/components/SignIn.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import {
  setEmail,
  setPassword,
  setRegisterEmail,
  setRegisterPassword,
  setConfirmPassword,
  setRememberMe,
  setRememberUser,
  setAcceptTerms,
  registerUser,
  tryLogin
} from '../../redux/slices/authSlice';
// import AuthService from '../../util/auth/authService'; authSlice로 대체
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './sign-in.css';

const SignIn: React.FC = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Select Redux state
  const {
    email,
    password,
    registerEmail,
    registerPassword,
    confirmPassword,
    rememberMe,
    acceptTerms,
  } = useSelector((state: RootState) => state.auth);

  // Load stored email and password
  useEffect(() => {
    const storedUser = localStorage.getItem('rememberUser');
    if(storedUser) {
      const { email, password } = JSON.parse(storedUser);
      dispatch(setEmail(email));
      dispatch(setPassword(password));
      dispatch(setRememberMe(true));
    }else {
      dispatch(setEmail(''));
      dispatch(setPassword(''));    
    }
  }, [dispatch]);

  const isLoginFormValid = email && password;
  // const isRegisterFormValid = registerEmail && registerPassword && confirmPassword === registerPassword && acceptTerms;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(tryLogin({ email, password }));
      
      if(tryLogin.fulfilled.match(result)) {
        dispatch(setRememberUser({ email, password, rememberMe }));
        navigate('/');
      }else if(tryLogin.rejected.match(result)) {
        toast.error(result.payload as string || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed');
    }
  };


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 유효성 검사
    if (!acceptTerms) {
      return toast.warn('Please accept the terms and conditions');
    }
    if (registerPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
  
    try {
      // 회원가입 요청
      const result = await dispatch(registerUser({ email: registerEmail, password: registerPassword }));
  
      if (registerUser.fulfilled.match(result)) {
        toast.success('Registration successful');
        toggleCard(); // 카드 전환
      } else {
        const errorMessage = result.payload === 'User already exists' 
          ? '이미 존재하는 사용자입니다.'
          : '회원가입에 실패하였습니다.';
        toast.error(errorMessage);
      }
    } catch {
      toast.error('회원가입에 실패하였습니다.');
    }
  };
  

  const toggleCard = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  return (
    <div>
      <div className="bg-image"></div>
      <div className="container">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <div id="phone">
          <div id="content-wrapper">
            {/* Login Form */}
            <div className={`card ${!isLoginVisible ? 'hidden' : ''}`} id="login">
              <form onSubmit={handleLogin}>
                <h1>Sign in</h1>
                <div className={`input ${email ? 'active' : ''}`}>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className={`input ${password ? 'active' : ''}`}>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => dispatch(setPassword(e.target.value))}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <span className="checkbox remember">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => dispatch(setRememberMe(!rememberMe))}
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

            {/* Register Form */}
            <div className={`card ${isLoginVisible ? 'hidden' : ''}`} id="register">
              <form onSubmit={handleRegister}>
                <h1>Sign up</h1>
                <div className={`input ${registerEmail ? 'active' : ''}`}>
                  <input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => dispatch(setRegisterEmail(e.target.value))}
                  />
                  <label htmlFor="register-email">Email</label>
                </div>
                <div className={`input ${registerPassword ? 'active' : ''}`}>
                  <input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => dispatch(setRegisterPassword(e.target.value))}
                  />
                  <label htmlFor="register-password">Password</label>
                </div>
                <div className={`input ${confirmPassword ? 'active' : ''}`}>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
                  />
                  <label htmlFor="confirm-password">Confirm Password</label>
                </div>
                <span className="checkbox remember">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={() => dispatch(setAcceptTerms(!acceptTerms))}
                  />
                  <label className="read-text" htmlFor="terms">I have read <b>Terms and Conditions</b></label>
                </span>
                <button className="signin-button" >
                  Register
                </button>
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
