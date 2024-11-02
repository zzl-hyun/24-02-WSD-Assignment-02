import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/sign-in/sign-in';
import ProtectedRoute from './guards/ProtectedRoute';
import Home from './pages/home';
import HomeMain from './components/home/main/HomeMain';
// import HomePopular from './components/home/popular/HomePopular';
// import HomeWishlist from './components/home/wishlist/HomeWishlist';
// import HomeSearch from './components/search/HomeSearch';

const App: React.FC = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        {/* 메인 홈 라우트 */}
        <Route path="/" element={
          <ProtectedRoute>
          <Home />
          </ProtectedRoute>}>
          { <Route index element={<HomeMain />} />
            // <Route path="popular" element={<HomePopular />} />
            // <Route path="wishlist" element={<HomeWishlist />} />
            // <Route path="search" element={<HomeSearch />} /> 
          }
        </Route>
        
        {/* 로그인 페이지 */}
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default App;
