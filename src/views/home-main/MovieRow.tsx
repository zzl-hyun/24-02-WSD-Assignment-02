import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Movie, APIResponse } from '../../models/types';
import { useWishlistService } from '../../util/movie/wishlist';
import axios from 'axios';
import i18n from '../../locales/i18n';
import { useTranslation } from 'react-i18next';
import {setCache, getCache} from '../../util/cache/movieCache'
import './MovieRow.css';

interface MovieRowProps {
  title: string;
  fetchUrl: string;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderWindowRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const [hoveredMovieId, setHoveredMovieId] = useState<number | null>(null); // Hover 상태를 추적하는 state
  const { toggleWishlist, isInWishlist } = useWishlistService();
  const {t} = useTranslation();

// fetchUrl에서 장르 번호와 언어 값을 추출하는 함수
const extractParamsFromUrl = (url: string): { category: string; genre: string; language: string; page: string } => {
  const categoryMatch = url.match(/\/movie\/(popular|top_rated|upcoming)/); // 카테고리 추출
  const genreMatch = url.match(/with_genres=([^&]*)/); // 장르 추출
  const languageMatch = url.match(/language=([^&]*)/); // 언어 추출
  const pageMatch = url.match(/page=([^&]*)/); // 페이지 번호 추출
  return {
    category: categoryMatch ? categoryMatch[1] : 'discover', // 카테고리가 없으면 'discover'
    genre: genreMatch ? genreMatch[1] : 'all', // 장르가 없으면 'all'
    language: languageMatch ? languageMatch[1] : 'en', // 언어가 없으면 'en'
    page: pageMatch ? pageMatch[1] : '1', // 페이지가 없으면 '1'
  };
};

const { category, genre, language, page } = extractParamsFromUrl(fetchUrl);
const cacheKey = `movieRow_${category}_${genre}_${language}_page${page}`;

const fetchMovies = useCallback(async () => {

  // cache check
  // const cacheKey = `movieRow_${genre}_${language}`;
  const cachedMovies = getCache(cacheKey);
  if (cachedMovies) {
    setMovies(cachedMovies);
    // console.log("movieRow cache 발견")
    return;
  }

  // no cache
  try {
    const response = await axios.get<APIResponse>(fetchUrl);
    const fetchedMovies = response.data.results || [];
    console.log(fetchUrl)
    setMovies(fetchedMovies);
    setCache(cacheKey, fetchedMovies, 3600000); // 1시간 동안 캐시 유지

    console.log("movieRow fetch movies")
  } catch (error) {
    console.error('Error fetching movies:', error);
    setMovies([]);
  }
}, [fetchUrl, i18n.language]);

  useEffect(() => {
    fetchMovies();
  }, [fetchUrl, i18n.language]);
  
  const calculateMaxScroll = useCallback(() => {
    if (sliderRef.current && sliderWindowRef.current) {
      setMaxScroll(
        Math.max(0, sliderRef.current.scrollWidth - sliderWindowRef.current.clientWidth)
      );
    }
  }, []);

  useEffect(() => {
    calculateMaxScroll();
    const handleResize = () => calculateMaxScroll();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [movies, calculateMaxScroll]);

  useEffect(() => {
    const sliderContainer = sliderWindowRef.current;
    if (sliderContainer) {
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault(); // 기본 브라우저 스크롤 방지
        slide(event.deltaY > 0 ? 'right' : 'left');
      };
      sliderContainer.addEventListener('wheel', handleWheel);

      return () => {
        sliderContainer.removeEventListener('wheel', handleWheel);
      };
    }
  }, [maxScroll]);

  const slide = (direction: 'left' | 'right') => {
    const slideAmount = sliderWindowRef.current?.clientWidth ? sliderWindowRef.current.clientWidth * 0.8 : 0;
    setScrollAmount((prevScroll) => {
      return direction === 'left' ? Math.max(0, prevScroll - slideAmount) : Math.min(maxScroll, prevScroll + slideAmount);
    });
  };


  const handleTouchStart = (event: React.TouchEvent) => {
    const touchStartX = event.touches[0].clientX;
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touchEndX = moveEvent.touches[0].clientX;
      slide(touchStartX - touchEndX > 0 ? 'right' : 'left');
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const getImageUrl = (path: string) => `https://image.tmdb.org/t/p/w300${path}`;

  const renderMovieCard = (movie: Movie) => (
    <div
      key={movie.id}
      className="movie-card"
      onMouseEnter={() => setHoveredMovieId(movie.id)} // 호버 상태 설정
      onMouseLeave={() => setHoveredMovieId(null)} // 호버 상태 해제
      onClick={() => toggleWishlist(movie)}
    >
      <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
      <span>{movie.title}</span>
      <div>
        <span>{t('movies.releaseDate')}: {movie.release_date}</span>
        <span><br />{t('movies.rate')}:⭐{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
      </div>
      {isInWishlist(movie.id) && <div className="wishlist-indicator">❤️</div>}
      {/* 영화 설명 표시 */}
      {hoveredMovieId === movie.id && (
        <div className="movie-overview">
          <p>{movie.overview || "No description available."}</p>
        </div>
      )}
    </div>
  );



  return (
    <div
      className="movie-row"
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      <h2>{title}</h2>
      <div className="slider-container" onTouchStart={handleTouchStart}>
        <button
          className="slider-button left"
          onClick={() => slide('left')}
          style={{ opacity: showButtons && scrollAmount > 0 ? 1 : 0 }}
          disabled={scrollAmount <= 0}
        >
          &lt;
        </button>
        <div className="slider-window" ref={sliderWindowRef}>
          <div
            className="movie-slider"
            ref={sliderRef}
            style={{ transform: `translateX(-${scrollAmount}px)` }}
          >
            {movies.map(renderMovieCard)}


          </div>
        </div>
        <button
          className="slider-button right"
          onClick={() => slide('right')}
          style={{ opacity: showButtons && scrollAmount < maxScroll ? 1 : 0 }}
          disabled={scrollAmount >= maxScroll}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
