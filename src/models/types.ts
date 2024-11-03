export interface SearchOptions {
    [key: string]: string;  // 인덱스 시그니처 추가
    originalLanguage: string;
    translationLanguage: string;
    sorting: string;
  }
  
  export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path?: string;
    overview?: string;
    original_language: string;
    vote_average: number;
  }
  
  export interface APIResponse {
    results: Movie[];
    page: number;
    total_pages: number;
    total_results: number;
  }
  