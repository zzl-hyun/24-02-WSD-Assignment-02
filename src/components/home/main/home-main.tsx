import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import URLService from '../../../util/movie/URL';
import Banner from '../../../views/home-main/Banner';
import MovieRow from '../../../views/home-main/MovieRow';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { setLoginSuccess } from '../../../redux/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './home-main.css';

const HomeMain: React.FC = () => {
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [popularMoviesUrl, setPopularMoviesUrl] = useState('');
  const [newReleasesUrl, setNewReleasesUrl] = useState('');
  const [actionMoviesUrl, setActionMoviesUrl] = useState('');

  const apiKey = localStorage.getItem('TMDb-Key') || '';
  const urlService = useMemo(() => new URLService(), []);
  // const wishlistService = new WishlistService();
  
  const dispatch = useDispatch();
  const loginSuccess = useSelector((state: RootState) => state.auth.loginSuccess);
  useEffect(() => {
    console.log("loginSuccess value homemain:", loginSuccess);
    if (loginSuccess) {
      toast.success('Login successful');
      // console.log('Login successful');
      // alert('Login successful');
      dispatch(setLoginSuccess(false)); // Reset login success to prevent repeated toasts
    }
  }, [loginSuccess, dispatch]);


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
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar />

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
