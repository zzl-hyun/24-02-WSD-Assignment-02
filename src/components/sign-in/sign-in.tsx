// src/components/SignIn.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import {
  motion,
  useScroll,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import { logoVariants, logoAnimationSequence } from './animationVariants';
// import AuthService from '../../util/auth/authService'; authSlice로 대체
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './sign-in.css';

const SignIn: React.FC = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const logoControls = useAnimation();
  const boxControls = useAnimation();
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
 
  const isLoginFormValid = email && password;
  const isRegisterFormValid = registerEmail && registerPassword && acceptTerms;

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



  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!isLoginFormValid) {
      return toast.warn("Please enter a valid email and password");
    }
  
    setIsLoading(true);
  
    try {
      const result = await dispatch(tryLogin({ email, password }));
  
      if (tryLogin.fulfilled.match(result)) {
        dispatch(setRememberUser({ email, password, rememberMe }));
  
        // 애니메이션 실행
        await logoAnimationSequence(logoControls, boxControls, setIsLoginVisible);
  
        // 애니메이션 종료 후 페이지 이동
        navigate("/");
      } else if (tryLogin.rejected.match(result)) {
        toast.error(result.payload as string);
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };
  

  


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 유효성 검사
    if (!acceptTerms) {
      return toast.warn('Please accept the terms and conditions');
    }
    if (!registerEmail.trim()) {
      return toast.error('Email cannot be empty');
    }
    if (!registerPassword.trim()) {
      return toast.error('Password cannot be empty');
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
  

  const toggleCard = async () => {
    if (isLoginVisible) {
      await boxControls.start({
        rotateY: 180,
        scale: 0.8,
        transition: { duration: 0.5 },
      });
      setIsLoginVisible(false);
      await boxControls.start({
        rotateY: 0,
        scale: 1,
        transition: { duration: 0.5 },
      });
    } else {
      await boxControls.start({
        rotateY: 180,
        scale: 0.8,
        transition: { duration: 0.5 },
      });
      setIsLoginVisible(true);
      await boxControls.start({
        rotateY: 0,
        scale: 1,
        transition: { duration: 0.5 },
      });
    }
  };

  // useEffect(()=>{
  //   logoAnimationSequence(logoControls, boxControls);
  // }, [logoControls, boxControls]);

  return (
    <div>
      <div className="bg-image"></div>
      <div className="container">
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
        <Link to="/">
          <motion.div
            className="logo-container"
            initial={{
              opacity: 0.4,
              scale: 0.8,
              x: "-50%",
              y: "-50%",
            }}
            animate={logoControls}
            exit={{opacity: 0.0,
              scale: 0.8,}}
            style={{
              position: "absolute",
              // top: "50%",
              // left: "50%",
              // transform: "translate(-50%, -50%)", // 초기에는 화면 중앙
            }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 276.742" // 비율 유지
              style={{
                width: "80%", // 부모 컨테이너 기준 크기 설정
                height: "auto", // 비율 유지
                maxWidth: "400px", // 최대 크기 제한
                marginBottom: "20px",
              }}
            >
              <motion.path
                variants={logoVariants}
                initial="start"
                animate="end"
                style={{
                  stroke: "#e51013",
                  strokeWidth: "5px",
                }}
                d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
              />
            </motion.svg>
          </motion.div>
        </Link>
        <AnimatePresence>
        <motion.div
          // id="phone"
          initial={{ opacity: 1, scale: 1 }}
          animate={boxControls}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
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
              {/* register form */}
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
                  <button className="signin-button" disabled={!isRegisterFormValid}>
                    Register
                  </button>
                </form>
                <a href="javascript:void(0)" id="gotologin" className="account-check" onClick={toggleCard}>
                  Don't have an account? <b>Sign up</b>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
        </AnimatePresence>
        
      </div>
    </div>
  );
};

export default SignIn;
