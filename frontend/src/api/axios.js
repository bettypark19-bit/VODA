import axios from 'axios'

// 1. TMDB API 인스턴스
const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'ko-KR',
    region: 'KR',
  },
})

// 2. VODA 백엔드 API 인스턴스 (AI 챗봇용)
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default tmdb
