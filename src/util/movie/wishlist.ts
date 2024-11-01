// src/util/movie/WishlistService.ts
import { useState, useEffect } from 'react';
import { Movie } from '../../models/types';

class WishlistService {
  private wishlist: Movie[] = [];

  constructor() {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    const storedWishlist = localStorage.getItem('movieWishlist');
    if (storedWishlist) {
      this.wishlist = JSON.parse(storedWishlist);
    }
  }

  private saveWishlist(): void {
    localStorage.setItem('movieWishlist', JSON.stringify(this.wishlist));
  }

  toggleWishlist(movie: Movie): void {
    const index = this.wishlist.findIndex(item => item.id === movie.id);
    if (index === -1) {
      // 영화가 위시리스트에 없으면 추가
      this.wishlist.push(movie);
    } else {
      // 영화가 이미 위시리스트에 있으면 제거
      this.wishlist = this.wishlist.filter(item => item.id !== movie.id);
    }
    this.saveWishlist();
  }

  isInWishlist(movieId: number): boolean {
    return this.wishlist.some(item => item.id === movieId);
  }

  getCurrentWishlist(): Movie[] {
    return this.wishlist;
  }
}

// React 커스텀 훅으로 위시리스트 서비스 사용
export const useWishlistService = () => {
  const [wishlist, setWishlist] = useState<Movie[]>(new WishlistService().getCurrentWishlist());
  const wishlistService = new WishlistService();

  const toggleWishlist = (movie: Movie) => {
    wishlistService.toggleWishlist(movie);
    setWishlist([...wishlistService.getCurrentWishlist()]);
  };

  const isInWishlist = (movieId: number): boolean => {
    return wishlistService.isInWishlist(movieId);
  };

  return { wishlist, toggleWishlist, isInWishlist };
};

export default WishlistService;