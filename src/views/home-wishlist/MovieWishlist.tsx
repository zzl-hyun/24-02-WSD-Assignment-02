// src/views/home-wishlist/MovieWishlist.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useWishlistService } from '../../util/movie/wishlist';
import { Movie } from '../../models/types';
import styles from './MovieWishlist.module.css';

const MovieWishlist: React.FC = () => {
  const { wishlist, toggleWishlist, isInWishlist } = useWishlistService();
  const [visibleWishlistMovies, setVisibleWishlistMovies] = useState<Movie[][]>([]);
  const [rowSize, setRowSize] = useState(4);
  const [moviesPerPage, setMoviesPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up responsive layout and initial visible movies
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    updateVisibleMovies();
  }, [wishlist, currentPage, rowSize, moviesPerPage]);

  const getImageUrl = (path: string) => (path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg');

  const calculateLayout = () => {
    if (gridContainerRef.current) {
      const containerWidth = gridContainerRef.current.offsetWidth;
      const movieCardWidth = isMobile ? 90 : 220;
      const horizontalGap = isMobile ? 10 : 15;

      setRowSize(Math.floor(containerWidth / (movieCardWidth + horizontalGap)));
      setMoviesPerPage(rowSize * Math.floor(window.innerHeight / 330));
    }
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    calculateLayout();
  };

  const updateVisibleMovies = () => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const paginatedMovies = wishlist.slice(startIndex, endIndex);

    setVisibleWishlistMovies(
      paginatedMovies.reduce((resultArray: Movie[][], item, index) => {
        const groupIndex = Math.floor(index / rowSize);
        if (!resultArray[groupIndex]) resultArray[groupIndex] = [];
        resultArray[groupIndex].push(item);
        return resultArray;
      }, [])
    );
  };

  const totalPages = Math.ceil(wishlist.length / moviesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={styles.movieGrid} ref={gridContainerRef}>
      <div className={`${styles.gridContainer} ${isMobile ? styles.mobile : styles.desktop}`}>
        {visibleWishlistMovies.map((movieGroup, i) => (
          <div key={i} className={`${styles.movieRow} ${movieGroup.length === rowSize ? styles.full : ''}`}>
            {movieGroup.map((movie) => (
              <div key={movie.id} className={styles.movieCard} onClick={() => toggleWishlist(movie)}>
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                <div className={styles.movieTitle}>{movie.title}</div>
                {isInWishlist(movie.id) && <div className={styles.wishlistIndicator}>👍</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      {wishlist.length === 0 && <div className={styles.emptyWishlist}>위시리스트가 비어 있습니다.</div>}
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

export default MovieWishlist;
