import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useWishlistService } from '../../util/movie/wishlist';
import { Movie } from '../../models/types';
import styles from './MovieGrid.module.css';

interface MovieGridProps {
  fetchUrl: string;
  title?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({ fetchUrl }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(5);
  const [moviesPerPage, setMoviesPerPage] = useState(20);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [wishlistTimer, setWishlistTimer] = useState<number | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Use the wishlist service hook
  const { wishlist, toggleWishlist, isInWishlist } = useWishlistService();

  useEffect(() => {
    fetchMovies();
    calculateLayout();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      calculateLayout();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (wishlistTimer) {
        clearTimeout(wishlistTimer);
      }
    };
  }, [fetchUrl]);

  const fetchMovies = async () => {
    try {
      const totalMoviesNeeded = 120;
      const numberOfPages = Math.ceil(totalMoviesNeeded / 20);
      let allMovies: Movie[] = [];

      for (let page = 1; page <= numberOfPages; page++) {
        const response = await axios.get(fetchUrl, {
          params: {
            page,
            per_page: moviesPerPage,
          },
        });
        allMovies = [...allMovies, ...response.data.results];
      }

      setMovies(allMovies.slice(0, totalMoviesNeeded));
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const getImageUrl = (path: string) => `https://image.tmdb.org/t/p/w300${path}`;

  const visibleMovieGroups = (): Movie[][] => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const paginatedMovies = movies.slice(startIndex, endIndex);

    return paginatedMovies.reduce<Movie[][]>((resultArray, item, index) => {
      const groupIndex = Math.floor(index / rowSize);
      if (!resultArray[groupIndex]) resultArray[groupIndex] = [];
      resultArray[groupIndex].push(item);
      return resultArray;
    }, []);
  };

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const calculateLayout = () => {
    if (gridContainerRef.current) {
      const containerWidth = gridContainerRef.current.offsetWidth;
      const containerHeight = window.innerHeight - gridContainerRef.current.offsetTop;
      const movieCardWidth = isMobile ? 90 : 200;
      const movieCardHeight = isMobile ? 150 : 220;
      const horizontalGap = isMobile ? 10 : 15;
      const verticalGap = -10;

      setRowSize(Math.floor(containerWidth / (movieCardWidth + horizontalGap)));
      const maxRows = Math.floor(containerHeight / (movieCardHeight + verticalGap));
      setMoviesPerPage(rowSize * maxRows);
    }
  };

  return (
    <div className={styles.movieGrid} ref={gridContainerRef}>
      <div className={`${styles.gridContainer} ${isMobile ? styles.mobile : styles.desktop}`}>
        {visibleMovieGroups().map((movieGroup, i) => (
          <div key={i} className={`${styles.movieRow} ${movieGroup.length === rowSize ? 'full' : ''}`}>
            {movieGroup.map((movie) => (
              <div
                key={movie.id}
                className={styles.movieCard}
                onMouseUp={() => toggleWishlist(movie)}
              >
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                <div className={styles.movieTitle}>{movie.title}</div>
                {isInWishlist(movie.id) && <div className={styles.wishlistIndicator}>👍</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button onClick={prevPage} disabled={currentPage === 1}>
            &lt; 이전
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            다음 &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
