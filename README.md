# 24-02-WSD-Assignment-02
## 프로젝트 기본 정보
React.js 또는 Vue.js를 활용해 Single Page Application (SPA)를 개발하고, 이를 Github pages를 활용하여 정적 웹사이트 배포

## 기술 스택

## 기술 스택
![Node.js](https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-v18.3.1-blue?style=for-the-badge&logo=react)
![React DOM](https://img.shields.io/badge/react--dom-v18.3.1-blue?style=for-the-badge&logo=react)
![React Router DOM](https://img.shields.io/badge/react--router--dom-v6.27.0-red?style=for-the-badge&logo=react-router)
![Redux](https://img.shields.io/badge/redux-v5.0.1-purple?style=for-the-badge&logo=redux)
![TypeScript](https://img.shields.io/badge/typescript-v4.9.5-blue?style=for-the-badge&logo=typescript)
![Axios](https://img.shields.io/badge/axios-v1.7.7-lightgrey?style=for-the-badge&logo=axios)
![Framer Motion](https://img.shields.io/badge/framer--motion-v11.11.17-pink?style=for-the-badge&logo=framer)
![i18next](https://img.shields.io/badge/i18next-v23.16.8-orange?style=for-the-badge&logo=i18next)
![React Font Awesome](https://img.shields.io/badge/react--fontawesome-v0.2.2-blue?style=for-the-badge&logo=font-awesome)
![React Player](https://img.shields.io/badge/react--player-v2.16.0-red?style=for-the-badge&logo=youtube)



## 주요 기능
1. 영화 데이터 검색: The Movie Database API를 활용한 영화 검색 및 필터링.
2. Infinite Scroll 구현: 영화 목록의 무한 스크롤 기능.
3. 다국어 지원: locales 디렉토리를 활용한 언어별 번역 관리.
4. Redux를 활용한 상태 관리: 앱 상태 및 사용자 데이터를 효율적으로 관리.

## 설치 및 실행 가이드
1. 레포지토리 클론
~~~
git clone https://github.com/username/repo-name.git
~~~
2. 의존성 설치
~~~
npm install
~~~
3. 실행
~~~
npm start
~~~

## 폴더 구조
~~~
src/
├── components/         # Reusable UI components
├── guards/             # Route guards and authentication utilities
├── layout/             # Application layouts (e.g., header, footer)
├── locales/            # Internationalization and localization files
├── models/             # TypeScript type definitions and interfaces
├── pages/              # Page-level components
├── redux/              # State management logic
├── util/               # Utility and helper functions
├── views/              # Feature-specific views
├── App.tsx             # Main application component
├── index.tsx           # Entry point

~~~


### Git Flow 브랜치 전략 적용
- main: 제품 출시 브랜치
- dev: 기능 개발 통합 브랜치
- feature: 개별 기능 개발 브랜치
- release: 출시 전 테스트 및 수정 브랜치
- gh-pages: 배포를 위한 정적 사이트 브랜치

## 참고 문서
API 문서
- <a href="https://developer.themoviedb.org/docs/getting-started">The Movie Database API</a>

관련 프로젝트 링크
- <a href="http://clinic.jbnu.ac.kr:3000/24-02-WSD-Assignment-02-Demo/#/">Demo Page</a>
- <a href="https://github.com/JBNU-Teaching/24-02-WAS-assignment-02-angular">Angular.js Code</a>
