import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Movie } from '../../models/types';
import { useWishlistService } from '../../util/movie/wishlist';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  fetchUrl: string;
  title: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({ fetchUrl }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(4);
  const [moviesPerPage, setMoviesPerPage] = useState(20);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  // const wishlistService = new WishlistService();
  const { wishlist, toggleWishlist, isInWishlist} = useWishlistService();
  

  const fetchMovies = async () => {
    try {
      const totalMoviesNeeded = 120;
      const numberOfPages = Math.ceil(totalMoviesNeeded / 20);
      let allMovies: Movie[] = [];

      for (let page = 1; page <= numberOfPages; page++) {
        const response = await axios.get(fetchUrl, {
          params: {
            page,
            per_page: 20,
          },
        });
        allMovies = [...allMovies, ...response.data.results];
      }

      setMovies(allMovies.slice(0, totalMoviesNeeded));
      calculateLayout(); // Adjust layout after setting movies
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
    calculateLayout();
  }, []);

  const calculateLayout = useCallback(() => {
    if (gridContainerRef.current) {
      const container = gridContainerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = window.innerHeight - container.offsetTop;
      const movieCardWidth = isMobile ? 90 : 200;
      const movieCardHeight = isMobile ? 150 : 220;
      const horizontalGap = isMobile ? 10 : 15;
      const verticalGap = -10;

      const newRowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      const maxRows = Math.floor(containerHeight / (movieCardHeight + verticalGap));
      const newMoviesPerPage = newRowSize * maxRows;

      setRowSize(newRowSize);
      setMoviesPerPage(newMoviesPerPage);
    }
  }, [isMobile]);

  const visibleMovieGroups = useCallback(() => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const paginatedMovies = movies.slice(startIndex, endIndex);

    return paginatedMovies.reduce<Movie[][]>((resultArray, item, index) => {
      const groupIndex = Math.floor(index / rowSize);
      if (!resultArray[groupIndex]) {
        resultArray[groupIndex] = [];
      }
      resultArray[groupIndex].push(item);
      return resultArray;
    }, []);
  }, [currentPage, movies, moviesPerPage, rowSize]);

  const nextPage = () => {
    if (currentPage < Math.ceil(movies.length / moviesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles.movieGrid} ref={gridContainerRef}>
      <div className={styles.gridContainer}>
        {visibleMovieGroups().map((movieGroup, index) => (
          <div
            key={index}
            className={`${styles.movieRow} ${movieGroup.length === rowSize ? styles.movieRowFull : ''}`}
          >
            {movieGroup.map((movie) => (
              <div
                key={movie.id}
                className={styles.movieCard}
                onMouseUp={() => toggleWishlist(movie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className={styles.movieTitle}>{movie.title}</div>
                {isInWishlist(movie.id) && (
                  <div className={styles.wishlistIndicator}>👍</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>
          &lt; 이전
        </button>
        <span>
          {currentPage} / {Math.ceil(movies.length / moviesPerPage)}
        </span>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(movies.length / moviesPerPage)}>
          다음 &gt;
        </button>
      </div>
    </div>
  );
};

export default MovieGrid;
