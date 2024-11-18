// src/components/search/HomeSearch.tsx

import React, { useState, useEffect } from 'react';
import MovieSearch from '../../views/search/MovieSearch';
import MovieInfiniteScroll from '../../views/views/MovieInfiniteScroll';
import { SearchOptions } from '../../models/types';
import styles from './HomeSearch.module.css';
import { setCache, getCache } from '../../util/cache/movieCache';

const HomeSearch: React.FC = () => {
  const apiKey = localStorage.getItem('TMDb-Key') || '';
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
  };
  
  const ageCode: Record<string, number> = {
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
    const newGenreId = genreCode[options.originalLanguage] || '0';
    const newAgeId = ageCode[options.translationLanguage] || -1;
    const newSortId = sortingCode[options.sorting] || 'all';
  
    setGenreId(newGenreId);
    setAgeId(newAgeId);
    setSortId(newSortId);
    console.log("Sorting:", sortingCode[options.sorting]);
  };

  useEffect(() => {
    const cachedGenreCode = getCache('genreCode');
    const cachedAgeCode = getCache('ageCode');
    const cachedSortingCode = getCache('sortingCode');

    if (cachedGenreCode) setGenreId(cachedGenreCode);
    if (cachedAgeCode) setAgeId(cachedAgeCode);
    if (cachedSortingCode) setSortId(cachedSortingCode);
  }, []);

  useEffect(() => {
    setCache('genreCode', genreId, 3600000); // Cache for 1 hour
    setCache('ageCode', ageId, 3600000); // Cache for 1 hour
    setCache('sortingCode', sortId, 3600000); // Cache for 1 hour
  }, [genreId, ageId, sortId]);

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