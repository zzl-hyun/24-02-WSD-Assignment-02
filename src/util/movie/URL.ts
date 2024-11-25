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
  getURL4ReleaseMovies = (apiKey: string, page: number = 2): string => {
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`;
  };
  getURL4PopularMovies = (apiKey: string, page: number = 1): string => {
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`;
  };
  getURL4TopRatedMovies = (apiKey: string, page: number = 2): string => {
    return `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=ko-KR&page=${page}`;
  };

  getURL4GenreMovies = (apiKey: string, genre: string, page: number = 1): string => {
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`;
  };
  getURL4SearchMovies = (apiKey: string, query: string): string => {
    return `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=ko-KR`;
  };
  getVideos = async (apiKey: string, movieId: number): Promise<any[]> => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=ko-KR`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  };
  
}

export default URLService;
