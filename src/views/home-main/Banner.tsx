// src/views/home-main/Banner.tsx
import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import URLService from '../../util/movie/URL';
import { setCache, getCache } from '../../util/cache/movieCache'; // 캐시 유틸리티 추가
import i18n from '../../locales/i18n';
import './Banner.css';

interface BannerProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    teaserKey?: string;
  } | null;
}

const Banner: React.FC<BannerProps> = ({ movie }) => {
  const [teaserKey, setTeaserKey] = useState<string | null>(null); // teaser key 상태
  const [showImage, setShowImage] = useState(true); // 이미지 배너 상태
  const [isPlaying, setIsPlaying] = useState(false); // 티저 재생 상태
  const [timeLeft, setTimeLeft] = useState(10); // 초기 남은 시간 
  const playerRef = useRef<ReactPlayer>(null);
  const urlService = new URLService();

  useEffect(() => {
    const fetchTeaser = async () => {
      if (movie) {
        const cacheKey = `teaserKey_${i18n.language}_${movie.id}`; // movie.id를 기반으로 캐시 키 생성
        const cachedTeaserKey = getCache(cacheKey);
        const apiKey = process.env.REACT_APP_TMDB_API_KEY;

        if (cachedTeaserKey) {
          // 캐시된 데이터가 있으면 바로 사용
          // console.log(`Using cached teaserKey for movie ${movie.id}:`, cachedTeaserKey);
          setTeaserKey(cachedTeaserKey);
          return;
        }

        try {
          const videos = await urlService.getVideos(apiKey, movie.id);
          // console.log('Fetched Videos:', videos); // 모든 비디오 출력
          const teaser = videos.find((video: any) => video.type === 'Trailer' && video.site.toLowerCase() === 'youtube');
          if (teaser) {
            setTeaserKey(teaser.key);
            setCache(cacheKey, teaser.key, 3600000); // 1시간 캐시 유지
            console.log(`Set cached teaserKey for movie ${movie.id}:`, cachedTeaserKey);

          }
        } catch (error) {
          console.error('Error fetching teaser video:', error);
        }
      }
    };
  
    fetchTeaser();
  }, [movie, urlService]);


  useEffect(() => {
    if (teaserKey && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1); // 1초 감소
      }, 1000);

      return () => clearTimeout(timer); // 클린업
    }

    if (timeLeft === 0) {
      setShowImage(false);
      setIsPlaying(true);
    }
  }, [teaserKey, timeLeft]);


  if (!movie) return null;
  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;



  return (
    <div className="banner">
      <div className={`banner-image ${!showImage ? 'hidden' : ''}`} style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="banner-content">
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <button className="play-btn title-btn" onClick={()=>{setIsPlaying(true);setShowImage(false);}}>
              <div
                className="progress-bar"
                style={{
                  width: `${((10 - timeLeft) / 10) * 100}%`, // 진행 상태를 백분율로 계산
                }}
              ></div>
              <span >
                {timeLeft > 0 ? `재생 ${timeLeft}초 남음` : '재생 중...'}
              </span>
            </button>
          <button className="info-btn title-btn">상세 정보</button>

        </div>
      </div>
      <div className={`video-wrapper ${!showImage ? 'visible' : ''}`}>
        <ReactPlayer
          ref={playerRef}
          url={`https://www.youtube.com/watch?v=${teaserKey}`}
          playing={isPlaying}
          // controls
          volume={1}
          muted={true} // 소리 활성화
          className="react-player"
          width="100%"
          height="100%"
          loop={true}
          stopOnUnmount={true}
          style={{objectFit:"cover"}}
        />
      </div>
    </div>
  );
};

export default Banner;
