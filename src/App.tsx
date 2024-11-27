import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import SignIn from './components/sign-in/sign-in';
import ProtectedRoute from './guards/ProtectedRoute';
import Home from './pages/home';
import HomeMain from './components/home/main/home-main';
import HomePopular from './components/home/popular/HomePopular';
import HomeWishlist from './components/home/wishlist/HomeWishlist';
import HomeSearch from './components/search/HomeSearch';
import { Provider } from 'react-redux';
import store from './redux/store';

const App: React.FC = () => {
  return (
    // <Router basename={process.env.PUBLIC_URL}>
    <Router> 
      <Routes>
        {/* Main Home Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Provider store={store}>
              <Home />
              </Provider>
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeMain />} />
          <Route path="popular" element={<HomePopular />} />
          <Route path="wishlist" element={<HomeWishlist />} /> 
          <Route path="search" element={<HomeSearch />} /> 
        </Route>

        {/* Sign-in Page */}
        <Route path="/signin" element={
          <Provider store={store}>
          <SignIn />
          </Provider>
          } />
      </Routes>
    </Router>
  );
};

export default App;
