import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import URLService from '../../../util/movie/URL';
// import {useWishlistService} from '../../../util/movie/wishlist';
import Banner from '../../../views/home-main/Banner';
import MovieRow from '../../../views/home-main/MovieRow';
import './HomeMain.css';

const HomeMain: React.FC = () => {
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [popularMoviesUrl, setPopularMoviesUrl] = useState('');
  const [newReleasesUrl, setNewReleasesUrl] = useState('');
  const [actionMoviesUrl, setActionMoviesUrl] = useState('');

  const apiKey = localStorage.getItem('TMDb-Key') || '';
  const urlService = new URLService();
  // const wishlistService = new WishlistService();
  
  useEffect(() => {
    // API URLs 설정
    setPopularMoviesUrl(urlService.getURL4PopularMovies(apiKey));
    setNewReleasesUrl(urlService.getURL4ReleaseMovies(apiKey));
    setActionMoviesUrl(urlService.getURL4GenreMovies(apiKey, '28'));

    // 주요 영화 데이터 로드
    const loadFeaturedMovie = async () => {
      const movie = await urlService.fetchFeaturedMovie(apiKey);
      setFeaturedMovie(movie);
    };
    loadFeaturedMovie();

    // 스크롤 이벤트 리스너 추가
    const handleScroll = () => {
      const header = document.querySelector('.app-header');
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [apiKey, urlService]);

  return (
    <div className="home">
      <Banner movie={featuredMovie} />

      {popularMoviesUrl && (
        <MovieRow title="인기 영화" fetchUrl={popularMoviesUrl} />
      )}
      {newReleasesUrl && (
        <MovieRow title="최신 영화" fetchUrl={newReleasesUrl}  />
      )}
      {actionMoviesUrl && (
        <MovieRow title="액션 영화" fetchUrl={actionMoviesUrl}  />
      )}

      <div className="icons">
        <FontAwesomeIcon icon={faSearch} />
        <FontAwesomeIcon icon={faUser} />
      </div>
    </div>
  );
};

export default HomeMain;
