// src/views/search/MovieSearch.tsx

import React, { useState } from 'react';
import { SearchOptions } from '../../models/types';
import styles from './MovieSearch.module.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowDown19, faSortDown } from '@fortawesome/free-solid-svg-icons';
interface MovieSearchProps {
  onChangeOptions: (options: SearchOptions) => void;
}

const MovieSearch: React.FC<MovieSearchProps> = ({ onChangeOptions }) => {
  const DEFAULT_OPTIONS: SearchOptions = {
    genre: '장르 (전체)',
    vote_average: '평점 (전체)',
    originalLanguage: '언어 (전체)',
  };
  const {t} = useTranslation();
  const dropdowns = {
    genre: ['장르 (전체)', 'Action', 'Adventure', 'Comedy', 'Crime', 'Family', 'Animation', 'Documentary', 'Drama', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'],
    vote_average: ['평점 (전체)', '9~10', '8~9', '7~8', '6~7', '5~6', '4~5', '4점 이하'],
    originalLanguage: ['언어 (전체)', '영어', '한국어'],
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
      {Object.entries(dropdowns).map(([key, options]) => (
        <div key={key} className={styles.customSelect}>
          <div
            className={styles.selectSelected}
            onClick={() => toggleDropdown(key)}
          >
            {selectedOptions[key as keyof SearchOptions]} <FontAwesomeIcon icon={faSortDown}/>
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
      <button className={styles.clearOptions} onClick={clearOptions}>{t('button.reset')}
      </button>
    </div>
  );
};

export default MovieSearch;
