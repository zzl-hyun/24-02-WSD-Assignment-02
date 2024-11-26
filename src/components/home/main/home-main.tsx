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
import Footer from '../../../layout/footer/Footer'
import 'react-toastify/dist/ReactToastify.css';
import './home-main.css';
import { useTranslation } from 'react-i18next';
import i18n from '../../../locales/i18n';


const HomeMain: React.FC = () => {
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [popularMoviesUrl, setPopularMoviesUrl] = useState('');
  const [newReleasesUrl, setNewReleasesUrl] = useState('');
  const [actionMoviesUrl, setActionMoviesUrl] = useState('');
  const [topRatedMovieUrl, setTopRatedUrl] = useState('');
  const [comedyMoviesUrl, setComedyMoviesUrl] = useState('')
  const [familyMoviesUrl, setFamilyMoviesUrl] = useState('')
  const [animationUrl, setAnimationUrl] = useState('')
  const [documentaryUrl, setDocumentaryUrl] = useState('')
  const [dramaUrl, setDramaUrl] = useState('')
  const apiKey = localStorage.getItem('TMDb-Key') || '';
  const urlService = useMemo(() => new URLService(), []);
  // const wishlistService = new WishlistService();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loginSuccess = useSelector((state: RootState) => state.auth.loginSuccess);

  useEffect(() => {
    if (loginSuccess) {
      toast.success('Login successful');
      dispatch(setLoginSuccess(false)); // Reset login success to prevent repeated toasts
    }
  }, [loginSuccess, dispatch]);


  useEffect(() => {
    // API URLs 설정
    setPopularMoviesUrl(urlService.getURL4PopularMovies(apiKey));
    setNewReleasesUrl(urlService.getURL4ReleaseMovies(apiKey));
    setTopRatedUrl(urlService.getURL4TopRatedMovies(apiKey));
    setActionMoviesUrl(urlService.getURL4GenreMovies(apiKey, '28'));
    setComedyMoviesUrl(urlService.getURL4GenreMovies(apiKey, '35'));
    setFamilyMoviesUrl(urlService.getURL4GenreMovies(apiKey, '10751'));
    setAnimationUrl(urlService.getURL4GenreMovies(apiKey, '16'));
    setDocumentaryUrl(urlService.getURL4GenreMovies(apiKey, '99'));
    setDramaUrl(urlService.getURL4GenreMovies(apiKey, '18'));
    // setFeaturedMovie(urlService.fetchFeaturedMovie(apiKey));

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
  }, [apiKey, urlService, i18n.language]);

  return (
    <div className="home">
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar />

      <Banner movie={featuredMovie} />

      {popularMoviesUrl && (
        <MovieRow title= {t('movies.popularMovie')} fetchUrl={popularMoviesUrl} />
      )}
      {newReleasesUrl && (
        <MovieRow title={t('movies.newMovie')} fetchUrl={newReleasesUrl}  />
      )}
      {topRatedMovieUrl && (
        <MovieRow title={t('movies.topRateMovie')} fetchUrl={topRatedMovieUrl}  />
      )}
      {actionMoviesUrl && (
        <MovieRow title={t('movies.actionMovie')}  fetchUrl={actionMoviesUrl}  />
      )}
      {comedyMoviesUrl && (
        <MovieRow title={t('movies.comedyMovie')}  fetchUrl={comedyMoviesUrl}  />
      )}
      {familyMoviesUrl && (
        <MovieRow title={t('movies.familyMovie')}  fetchUrl={familyMoviesUrl}  />
      )}
      {animationUrl && (
        <MovieRow title={t('movies.animation')}  fetchUrl={animationUrl}  />
      )}
      {documentaryUrl && (
        <MovieRow title={t('movies.documentary')}  fetchUrl={documentaryUrl}  />
      )}
      {dramaUrl && (
        <MovieRow title={t('movies.drama')}  fetchUrl={dramaUrl}  />
      )}
      <Footer/>
    </div>
    
  );
};

export default HomeMain;
