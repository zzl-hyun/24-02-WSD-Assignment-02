import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Movie, APIResponse } from '../../models/types';
import { useWishlistService } from '../../util/movie/wishlist';
import axios from 'axios';
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
  const { toggleWishlist, isInWishlist } = useWishlistService();

  useEffect(() => {
    fetchMovies();
  }, [fetchUrl]);  // fetchUrl이 변경되면 새로운 데이터를 가져옵니다.

  const fetchMovies = useCallback(async () => {
    try {
      const response = await axios.get<APIResponse>(fetchUrl);
      setMovies(response.data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    }
  }, [fetchUrl]);

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

  const slide = (direction: 'left' | 'right') => {
    const slideAmount = sliderWindowRef.current?.clientWidth ? sliderWindowRef.current.clientWidth * 0.8 : 0;
    setScrollAmount((prevScroll) => {
      return direction === 'left' ? Math.max(0, prevScroll - slideAmount) : Math.min(maxScroll, prevScroll + slideAmount);
    });
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    slide(event.deltaY > 0 ? 'right' : 'left');
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
    <div key={movie.id} className="movie-card" onClick={() => toggleWishlist(movie)}>
      <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
      <span>{movie.title}</span>
      <div>
        <span>개봉일: {movie.release_date}</span>
        <span><br />평점:⭐{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
      </div>
      {isInWishlist(movie.id) && <div className="wishlist-indicator">👍</div>}
    </div>
  );

  return (
    <div
      className="movie-row"
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      <h2>{title}</h2>
      <div className="slider-container" onWheel={handleWheel} onTouchStart={handleTouchStart}>
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
