import { api } from './axios' // ✅ TMDB 전용 ax 대신 백엔드 전용 api 사용

/**
 * AI API 서비스: 백엔드 AI 엔드포인트와 통신
 */
export const AI = {
  /**
   * 챗봇 메시지 전송 및 추천 받기
   */
  chat: (text) => api.post('/chat', { text }),
}
