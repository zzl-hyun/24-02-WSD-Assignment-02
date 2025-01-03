// src/components/search/HomeSearch.tsx
import React, { useState, useEffect } from 'react';
import MovieSearch from '../../views/search/MovieSearch';
import MovieInfiniteScroll from '../../views/views/MovieInfiniteScroll';
import { SearchOptions } from '../../models/types';
import styles from './HomeSearch.module.css';
import { setCache, getCache } from '../../util/cache/movieCache';

const HomeSearch: React.FC = () => {
  // const apiKey = localStorage.getItem('TMDb-Key') || '';
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  const [genreId, setGenreId] = useState('0');
  const [ageId, setAgeId] = useState(-1);
  const [sortId, setSortId] = useState('all');

  const genreCode: Record<string, string> = {
    '장르 (전체)': '0',
    Action: '28',
    Adventure: '12',
    Comedy: '35',
    Crime: '80',
    Family: '10751',
    Animation: '16',
    Documentary: '99',
    Drama: '18',
    Fantasy: '14',
    History: '36',
    Horror: '27',
    Music: '10402',
    Mystery: '9648',
    Romance: '10749',
    ScienceFiction: '878',
    TVMovie: '10770',
    Thriller: '53',
    War: '10752',
    Western: '37',
  };
  
  const voteCode: Record<string, number> = {
    '평점 (전체)': -1,
    '9~10': 9,
    '8~9': 8,
    '7~8': 7,
    '6~7': 6,
    '5~6': 5,
    '4~5': 4,
    '4점 이하': -2,
  };
  
  const sortingCode: Record<string, string> = {
    '언어 (전체)': 'all',
    영어: 'en',
    한국어: 'ko',
  };

  const changeOptions = (options: SearchOptions) => {
    const newGenreId = genreCode[options.genre] || '0';
    const newAgeId = voteCode[options.vote_average] || -1;
    const newSortId = sortingCode[options.originalLanguage];
  
    setGenreId(newGenreId);
    setAgeId(newAgeId);
    setSortId(newSortId);
    console.log("genre age sort", genreId, ageId, sortId);
  };

  useEffect(() => {
    setCache('genreCode', genreId, 3600000); // Cache for 1 hour
    setCache('voteCode', ageId, 3600000); // Cache for 1 hour
    setCache('sortingCode', sortId, 3600000); // Cache for 1 hour
  }, [genreId, ageId, sortId]);
  
  useEffect(() => {
    const cachedGenreCode = getCache('genreCode');
    const cachedvoteCode = getCache('voteCode');
    const cachedSortingCode = getCache('sortingCode');

    if (cachedGenreCode) setGenreId(cachedGenreCode);
    if (cachedvoteCode) setAgeId(cachedvoteCode);
    if (cachedSortingCode) setSortId(cachedSortingCode);
  }, []);



  return (
    <div className={styles.containerSearch}>
      <div className={styles.containerSearchBar}>
        <MovieSearch onChangeOptions={changeOptions} />
      </div>
      <div className={styles.contentSearch}>
        <MovieInfiniteScroll
          apiKey={apiKey}
          genreCode={genreId}
          sortingOrder={sortId}
          voteEverage={ageId}
        />
      </div>
    </div>
  );
};

export default HomeSearch;