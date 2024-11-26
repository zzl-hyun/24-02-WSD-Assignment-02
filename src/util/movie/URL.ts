import axios from 'axios';
import i18n from './../../locales/i18n'; // i18n 모듈 임포트

class URLService {
  
  fetchFeaturedMovie = async (apiKey: string): Promise<any | undefined> => {
    try {
      const language = i18n.language; // 동적으로 언어 설정
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}`);
      // console.log(response.data.results[0]);
      return response.data.results[0];
    } catch (error) {
      console.error('Error fetching featured movie:', error);
      return undefined;
    }
  };
  getURL4ReleaseMovies = (apiKey: string, page: number = 2): string => {
    const language = i18n.language;
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}&page=${page}`;
  };
  getURL4PopularMovies = (apiKey: string, page: number = 1): string => {
    const language = i18n.language;
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}&page=${page}`;
  };
  getURL4TopRatedMovies = (apiKey: string, page: number = 2): string => {
    const language = i18n.language;
    return `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=${language}&page=${page}`;
  };

  getURL4GenreMovies = (apiKey: string, genre: string, page: number = 1): string => {
    const language = i18n.language;
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=${language}&page=${page}`;
  };

  getURL4SearchMovies = (apiKey: string, query: string): string => {
    const language = i18n.language;
    return `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=${language}`;
  };
  getVideos = async (apiKey: string, movieId: number): Promise<any[]> => {
    const language = i18n.language;
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=${language}`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  };
  
}

export default URLService;
