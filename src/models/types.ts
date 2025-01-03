export interface SearchOptions {
    [key: string]: string;  // 인덱스 시그니처 추가
    genre: string;
    // translationLanguage: string;
    vote_average:string;
    originalLanguage: string;
  }
  
  export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path?: string;
    overview?: string;
    original_language: string;
    vote_average: number;
    release_date: string;
  }
  
  export interface APIResponse {
    results: Movie[];
    page: number;
    total_pages: number;
    total_results: number;
  }
  