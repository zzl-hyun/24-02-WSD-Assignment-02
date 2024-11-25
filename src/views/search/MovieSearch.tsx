// src/views/search/MovieSearch.tsx

import React, { useState } from 'react';
import { SearchOptions } from '../../models/types';
import styles from './MovieSearch.module.css';

interface MovieSearchProps {
  onChangeOptions: (options: SearchOptions) => void;
}

const MovieSearch: React.FC<MovieSearchProps> = ({ onChangeOptions }) => {
  const DEFAULT_OPTIONS: SearchOptions = {
    originalLanguage: '장르 (전체)',
    translationLanguage: '평점 (전체)',
    sorting: '언어 (전체)',
  };

  const dropdowns = {
    originalLanguage: ['장르 (전체)', 'Action', 'Adventure', 'Comedy', 'Crime', 'Family', 'Animation', 'Documentary', 'Drama', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'],
    translationLanguage: ['평점 (전체)', '9~10', '8~9', '7~8', '6~7', '5~6', '4~5', '4점 이하'],
    sorting: ['언어 (전체)', '영어', '한국어'],
  };

  const [selectedOptions, setSelectedOptions] = useState<SearchOptions>({ ...DEFAULT_OPTIONS });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  

  const toggleDropdown = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  // const handleSearch = async (query: string) => {
  //   const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=ko-KR`;
  //   const response = await fetch(url);
  //   const data = await response.json();
  //   setSearchResults(data.results);
  // };

  const selectOption = (key: string, option: string) => {
    const updatedOptions = { ...selectedOptions, [key]: option };
    setSelectedOptions(updatedOptions);
    setActiveDropdown(null);
    onChangeOptions(updatedOptions);
  };

  const clearOptions = () => {
    setSelectedOptions({ ...DEFAULT_OPTIONS });
    onChangeOptions({ ...DEFAULT_OPTIONS });
  };

  return (
    <div className={styles.dropdownContainer}>
      <label>선호하는 설정을 선택하세요</label>
      {Object.entries(dropdowns).map(([key, options]) => (
        <div key={key} className={styles.customSelect}>
          <div
            className={styles.selectSelected}
            onClick={() => toggleDropdown(key)}
          >
            {selectedOptions[key as keyof SearchOptions]}
          </div>
          {activeDropdown === key && (
            <div className={styles.selectItems}>
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => selectOption(key, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button className={styles.clearOptions} onClick={clearOptions}>
        초기화
      </button>
    </div>
  );
};

export default MovieSearch;
