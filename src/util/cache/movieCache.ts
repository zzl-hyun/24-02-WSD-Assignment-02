// src/util/cache/movieCache.ts

export const setCache = (key: string, data: any, ttl: number) => {
  const expiry = Date.now() + ttl;
  const cacheData = { data, expiry };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

export const getCache = (key: string) => {
  const cacheData = localStorage.getItem(key);
  if (!cacheData) return null;

  const { data, expiry } = JSON.parse(cacheData);
  if (Date.now() > expiry) {
    localStorage.removeItem(key); // 캐시 만료 시 제거
    return null;
  }
  return data;
};