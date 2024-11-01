// src/views/home-main/MovieRow.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './MovieRow.css';

interface MovieRowProps {
  title: string;
  fetchUrl: string;
  wishlistService: any;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, fetchUrl, wishlistService }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderWindowRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    fetchMovies();
    const handleResize = () => calculateMaxScroll();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    calculateMaxScroll();
  }, [movies]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(fetchUrl);
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const calculateMaxScroll = () => {
    if (sliderRef.current && sliderWindowRef.current) {
      setMaxScroll(
        Math.max(0, sliderRef.current.scrollWidth - sliderWindowRef.current.clientWidth)
      );
    }
  };

  const slide = (direction: 'left' | 'right') => {
    const slideAmount = sliderWindowRef.current?.clientWidth ? sliderWindowRef.current.clientWidth * 0.8 : 0;
    setScrollAmount(prevScroll => {
      if (direction === 'left') {
        return Math.max(0, prevScroll - slideAmount);
      } else {
        return Math.min(maxScroll, prevScroll + slideAmount);
      }
    });
  };

  const handleMouseMove = () => setShowButtons(true);
  const handleMouseLeave = () => setShowButtons(false);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    slide(event.deltaY > 0 ? 'right' : 'left');
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    const touchStartX = event.touches[0].clientX;
    const handleTouchMove = (moveEvent: TouchEvent) => {
        const touchEndX = moveEvent.touches[0].clientX;
        const direction = touchStartX - touchEndX > 0 ? 'right' : 'left';
        slide(direction);
      };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const getImageUrl = (path: string) => `https://image.tmdb.org/t/p/w300${path}`;

  return (
    <div className="movie-row" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
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
            {movies.map(movie => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => wishlistService.toggleWishlist(movie)}
              >
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                {wishlistService.isInWishlist(movie.id) && <div className="wishlist-indicator">👍</div>}
              </div>
            ))}
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
