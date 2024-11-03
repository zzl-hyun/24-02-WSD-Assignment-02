import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useWishlistService } from '../../util/movie/wishlist';
import { Movie, APIResponse } from '../../models/types';
import styles from './MovieInfiniteScroll.module.css';

interface MovieInfiniteScrollProps {
  genreCode: string;
  apiKey: string;
  sortingOrder?: string;
  voteEverage?: number;
}

const MovieInfiniteScroll: React.FC<MovieInfiniteScrollProps> = ({ genreCode = '0', apiKey, sortingOrder = 'all', voteEverage = -1 }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { toggleWishlist, isInWishlist } = useWishlistService();
  const loadingTriggerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  
  const [rowSize, setRowSize] = useState(4);
  const [showTopButton, setShowTopButton] = useState(true); // Ensure this state toggles correctly
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Intersection observer setup
  const setupIntersectionObserver = useCallback(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          fetchMovies();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (loadingTriggerRef.current) {
      observer.current.observe(loadingTriggerRef.current);
    }
  }, [isLoading, hasMore]);

  // Fetch movies with duplicate check
  // Updated fetchMovies to avoid duplicate appending after reset
  const fetchMovies = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
  
    try {
      const url = genreCode === "0" ? 'https://api.themoviedb.org/3/movie/popular' : 'https://api.themoviedb.org/3/discover/movie';
      const params = {
        api_key: apiKey,
        language: 'ko-KR',
        page: currentPage,
        ...(genreCode !== "0" && { with_genres: genreCode })
      };
  
      const response = await axios.get<APIResponse>(url, { params });
      let newMovies = response.data.results;
  
      if (sortingOrder !== 'all') {
        newMovies = newMovies.filter((movie) => movie.original_language === sortingOrder);
      }
  
      newMovies = newMovies.filter((movie) =>
        voteEverage === -1 ? true : voteEverage === -2 ? movie.vote_average <= 4 : movie.vote_average >= voteEverage && movie.vote_average < voteEverage + 1
      );
  
      // Filter out duplicate movies based on ID
      const uniqueNewMovies = newMovies.filter(
        (newMovie) => !movies.some((movie) => movie.id === newMovie.id)
      );
  
      // Directly update the movies array
      if (currentPage === 1) {
        setMovies(uniqueNewMovies); // Replace movies on reset
      } else {
        setMovies([...movies, ...uniqueNewMovies]); // Append new movies
      }
  
      setCurrentPage(currentPage + 1); // Update page count directly
      if (newMovies.length === 0) setHasMore(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  
  // Handle resize
  const handleResize = () => {
    const isMobile = window.innerWidth <= 768;
    const containerWidth = gridContainerRef.current ? gridContainerRef.current.offsetWidth : 0;
    const movieCardWidth = isMobile ? 100 : 300;
    const horizontalGap = isMobile ? 10 : 15;
    setRowSize(Math.floor(containerWidth / (movieCardWidth + horizontalGap)));
  };

  // Handle scroll
// Update the handleScroll function to set showTopButton more accurately
  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 300 && !showTopButton) {
      setShowTopButton(true);
    } else if (scrollTop <= 300 && showTopButton) {
      setShowTopButton(false);
    }
  };


  useEffect(() => {
    setupIntersectionObserver();
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (observer.current) observer.current.disconnect();
    };
  }, [setupIntersectionObserver]);

  // Scroll to top and reset movies
  const scrollToTopAndReset = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMovies([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchMovies();
  };

  useEffect(() => {
    scrollToTopAndReset(); // Call the reset function on filter changes
  }, [genreCode, sortingOrder, voteEverage]);

  const getImageUrl = (path: string) => (path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg');

  return (
    <div className={styles.movieGrid} ref={gridContainerRef}>
      <div className={`${styles.gridContainer}`}>
        {movies.reduce<Movie[][]>((groups, movie, i) => {
          const groupIndex = Math.floor(i / rowSize);
          if (!groups[groupIndex]) groups[groupIndex] = [];
          groups[groupIndex].push(movie);
          return groups;
        }, []).map((movieGroup, index) => (
          <div key={index} className={styles.movieRow}>
            {movieGroup.map((movie) => (
              <div key={movie.id} className={styles.movieCard} onMouseUp={() => toggleWishlist(movie)}>
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} loading="lazy" />
                <div className={styles.movieTitle}>{movie.title}</div>
                {isInWishlist(movie.id) && <div className={styles.wishlistIndicator}>👍</div>}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div ref={loadingTriggerRef} className={styles.loadingTrigger}>
        {isLoading && (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
            <span>Loading...</span>
          </div>
        )}
      </div>

      {showTopButton &&(
        <button onClick={scrollToTopAndReset} className={styles.topButton} aria-label="맨 위로 이동">
          Top
        </button>
      )}
    </div>
  );
};

export default MovieInfiniteScroll;
