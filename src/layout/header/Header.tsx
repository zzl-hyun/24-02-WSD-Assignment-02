import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTicket, faBars, faTimes, faRightFromBracket, faGlobe} from '@fortawesome/free-solid-svg-icons';
import AuthService from '../../util/auth/authService';
import {
  motion,
  useScroll,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import './Header.css';
import i18n from '../../locales/i18n';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const {t} = useTranslation();
  
  const logoVariants = {
    start: {
      pathLength: 0,
      fill: "rgba(229, 16, 19, 0)",
    },
    end: {
      pathLength: 1,
      fill: "rgba(229, 16, 19, 1)",
      transition: {
        default: { duration: 5, ease: "easeInOut" },
        fill: { duration: 3, ease: [1, 0, 0.8, 1] },
      },
    },
    hover: {
      scale: 0.9,
      transition: {
        yoyo: Infinity,
      },
    },
  };
  const handleChangeLang= () => {
    i18n.language === 'en' ? i18n.changeLanguage('ko') : i18n.changeLanguage('en');
    // window.location.reload();
    
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const logout = () => {
    AuthService.logout();
    navigate('/signin');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const user = localStorage.getItem('currentUser') || '';
  return (
    <div id="container">
      <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <div className="logo">
            <Link to="/">
              {/* <FontAwesomeIcon icon={faTicket} style={{ height: '100%', color: '#E50914' }} /> */}
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1024"
                  height="276.742"
                  viewBox="0 0 1024 276.742"
                  className="logo"
                  >
                  <motion.path
                    variants={logoVariants}
                    initial="start"
                    animate="end"
                    whileHover="hover"
                    style={{
                      stroke: "#e51013", // 빨간색
                      strokeWidth: "5px", // 두께
                    }}
                    d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
                    />
                </motion.svg>
            </Link>
          </div>
          {/* Show desktop navigation only if not on mobile */}
          {true && (
            <nav className="nav-links desktop-nav">
              <ul>
                <li><Link to="/">{t('header.home')}</Link></li>
                <li><Link to="/popular">{t('header.popular')}</Link></li>
                <li><Link to="/wishlist">{t('header.wishlist')}</Link></li>
                <li><Link to="/search">{t('header.search')}</Link></li>
              </ul>
            </nav>
          )}
        </div>

        <div className="header-right">
          {/* user */}
          <span><b>{user}  </b></span>
          
          {/* lang */}
          <button     onClick={handleChangeLang}>
          <span style={{backgroundImage:`url(public/language_button_en.svg)`}}>{i18n.language === 'ko'? 'ko':'en'}</span>
          </button>
                  {/* 언어 변경 드롭다운 */}
        {/* <select
          className="language-select"
          value={i18n.language}
          onChange={handleChangeLang}
          style={{backgroundImage:`url(public/language_button_en.svg)`}}
        >
          <option value="en">English</option>
          <option value="ko">한국어</option>
        </select> */}
          
          {/* logout */}
          <button className="icon-button" onClick={logout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
          
          {/* Show mobile menu button only if on mobile */}
          {true && (
            <button className="icon-button mobile-menu-button" onClick={toggleMobileMenu}>
              <FontAwesomeIcon icon={faBars} />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Navigation */}
      {true && (
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <button className="close-button" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <nav>
            <ul>
              <li><Link to="/" onClick={toggleMobileMenu}>{t('header.home')}</Link></li>
              <li><Link to="/popular" onClick={toggleMobileMenu}>{t('header.popular')}</Link></li>
              <li><Link to="/wishlist" onClick={toggleMobileMenu}>{t('header.wishlist')}</Link></li>
              <li><Link to="/search" onClick={toggleMobileMenu}>{t('header.search')}</Link></li>

            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;

