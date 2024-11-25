import axios from 'axios';
import i18n from 'i18next'; // i18n 모듈 임포트

class URLService {
  private getLanguage = (): string => {
    return i18n.language || 'ko-KR'; // 현재 언어 가져오기 (기본값 'ko-KR')
  };

  fetchFeaturedMovie = async (apiKey: string): Promise<any | undefined> => {
    try {
      const language = this.getLanguage(); // 동적으로 언어 설정
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}`
      );
      return response.data.results[0];
    } catch (error) {
      console.error('Error fetching featured movie:', error);
      return undefined;
    }
  };

  getURL4PopularMovies = (apiKey: string, page: number = 1): string => {
    const language = this.getLanguage();
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=${language}&page=${page}`;
  };

  getURL4ReleaseMovies = (apiKey: string, page: number = 2): string => {
    const language = this.getLanguage();
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=${language}&page=${page}`;
  };

  getURL4GenreMovies = (apiKey: string, genre: string, page: number = 1): string => {
    const language = this.getLanguage();
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=${language}&page=${page}`;
  };

  getURL4SearchMovies = (apiKey: string, query: string): string => {
    const language = this.getLanguage();
    return `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=${language}`;
  };
}

export default URLService;
