import axios from 'axios';

class URLService {
  fetchFeaturedMovie = async (apiKey: string): Promise<any | undefined> => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`);
      // console.log(response.data.results[0]);
      return response.data.results[0];
    } catch (error) {
      console.error('Error fetching featured movie:', error);
      return undefined;
    }
  };

  getURL4PopularMovies = (apiKey: string, page: number = 1): string => {
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`;
  };

  getURL4ReleaseMovies = (apiKey: string, page: number = 2): string => {
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`;
  };

  getURL4GenreMovies = (apiKey: string, genre: string, page: number = 1): string => {
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`;
  };
}

export default URLService;
