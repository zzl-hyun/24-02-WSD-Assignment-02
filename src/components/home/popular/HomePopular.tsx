// src/components/home/HomePopular.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBars } from '@fortawesome/free-solid-svg-icons';
import MovieGrid from '../../../views/views/MovieGrid';
// import MovieInfiniteScroll from '../../views/MovieInfiniteScroll';
import URLService from '../../../util/movie/URL';
import './HomePopular.css';

const HomePopular: React.FC = () => {
  const [currentView, setCurrentView] = useState('grid');
  const apiKey = localStorage.getItem('TMDb-Key') || '';
  const urlService = new URLService();

  useEffect(() => {
    if (currentView === 'grid') {
      disableScroll();
    } else {
      enableScroll();
    }

    // Clean up scroll setting on unmount
    return () => enableScroll();
  }, [currentView]);

  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const enableScroll = () => {
    document.body.style.overflow = 'auto';
  };

  const fetchPopularMoviesUrl = () => {
    return urlService.getURL4PopularMovies(apiKey);
  };

  return (
    <div className="popular-container">
      <div className="view-toggle">
        <button
          onClick={() => setCurrentView('grid')}
          className={currentView === 'grid' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faTh} />
        </button>
        <button
          onClick={() => setCurrentView('list')}
          className={currentView === 'list' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {currentView === 'grid' ? (
        <MovieGrid title="인기 영화" fetchUrl={fetchPopularMoviesUrl()} />
      ) : (
        <MovieGrid title="인기 영화" fetchUrl={fetchPopularMoviesUrl()} />
        // <MovieInfiniteScroll apiKey={apiKey} genreCode="28" sortingOrder="all" voteEverage={-1} />
      )}
    </div>
  );
};

export default HomePopular;
