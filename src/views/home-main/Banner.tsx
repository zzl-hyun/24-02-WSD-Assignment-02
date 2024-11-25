// src/views/home-main/Banner.tsx
import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import URLService from '../../util/movie/URL';
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
  const [timeLeft, setTimeLeft] = useState(5); // 초기 남은 시간 (3초)
  const playerRef = useRef<ReactPlayer>(null);
  const urlService = new URLService();

  useEffect(() => {
    const fetchTeaser = async () => {
      if (movie) {
        try {
          const videos = await urlService.getVideos(localStorage.getItem('TMDb-Key') || '', movie.id);
          // console.log('Fetched Videos:', videos); // 모든 비디오 출력
          const teaser = videos.find((video: any) => video.type === 'Trailer' && video.site.toLowerCase() === 'youtube');
          if (teaser) {
            console.log('Teaser Found:', teaser, teaser.key); // 선택된 Teaser 출력
            setTeaserKey(teaser.key);
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
      const volumeSlider = document.querySelector('.ytp-volume-area');
      // 현재 볼륨 값 변경
      if (volumeSlider) {
        const volumePanel = volumeSlider.closest('.ytp-volume-panel'); // 패널 전체 가져오기
    
        // aria-valuenow를 업데이트
        if (volumePanel) {
          volumePanel.setAttribute('aria-valuenow', '50'); // 볼륨 50으로 설정
          volumePanel.setAttribute('aria-valuetext', '50% 볼륨');
        }
      }
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
                  width: `${((5 - timeLeft) / 5) * 100}%`, // 진행 상태를 백분율로 계산
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
          controls
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
