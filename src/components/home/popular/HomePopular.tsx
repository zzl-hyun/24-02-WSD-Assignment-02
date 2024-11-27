// src/components/home/HomePopular.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGrip } from '@fortawesome/free-solid-svg-icons';
import MovieGrid from '../../../views/views/MovieGrid';
import MovieInfiniteScroll from '../../../views/views/MovieInfiniteScroll';
import URLService from '../../../util/movie/URL';
import './HomePopular.css';

const HomePopular: React.FC = () => {
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const apiKey = localStorage.getItem('TMDb-Key') || '';
  const urlService = new URLService();

  // useEffect(() => {
  //   if (currentView === 'grid') {
  //     disableScroll();
  //   } else {
  //     enableScroll();
  //   }

  //   // Clean up scroll setting on unmount
  //   return () => enableScroll();
  // }, [currentView]);

  const disableScroll = () => {
    console.log(currentView);
    // setCurrentView('grid');
    document.documentElement.style.overflow = 'hidden';
    console.log('disableScroll');
    // document.body.classList.add('no-scroll');
  };

  const enableScroll = () => {
    console.log(currentView);
    // setCurrentView('list');
    document.documentElement.style.overflow = 'auto';
    // document.body.classList.remove('no-scroll');
    // console.log(document.body.style.overflow);
    console.log('enableScroll');
  };

  useEffect(() => {
    if (currentView === 'grid') {
      
      disableScroll();
    } else {
      
      enableScroll();
    }
    return () => enableScroll(); // 컴포넌트 언마운트 시 스크롤 복구
  }, [currentView]);
  
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
          <FontAwesomeIcon icon={faGrip} />
        </button>
        <button
          onClick={() => setCurrentView('list')}
          className={currentView === 'list' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {currentView === 'grid' ? (
        <MovieGrid title="인기 영화" fetchUrl={fetchPopularMoviesUrl()}  />
        

      ) : (
        // <MovieGrid title="인기 영화" fetchUrl={fetchPopularMoviesUrl()} />
        <MovieInfiniteScroll apiKey={apiKey} genreCode="0" sortingOrder="all" voteEverage={-1} />
      )}
    </div>
  );
};

export default HomePopular;
