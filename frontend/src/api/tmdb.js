import ax from './axios'

const IMG = 'https://image.tmdb.org/t/p'

export const EP = {
  // 이미지 URL 헬퍼
  img: (path, w = 'w500') => path ? `${IMG}/${w}${path}` : null,
  bg: (path) => path ? `${IMG}/original${path}` : null,

  // 인기/트렌딩
  popular: (type) => ax.get(`/${type}/popular`),
  nowPlaying: (type) => ax.get(`/${type}/now_playing`),
  trending: (type, window = 'week') => ax.get(`/trending/${type}/${window}`),
  topRated: (type) => ax.get(`/${type}/top_rated`),

  // 상세
  detail: (type, id) => ax.get(`/${type}/${id}`, {
    params: { append_to_response: 'credits,reviews,videos,similar' }
  }),
  reviews: (type, id, lang = 'en-US') => ax.get(`/${type}/${id}/reviews`, { params: { language: lang } }),

  // 검색/필터
  search: (q) => ax.get('/search/multi', { params: { query: q } }),
  discover: (type, params) => ax.get(`/discover/${type}`, { params }),
  genres: (type) => ax.get(`/genre/${type}/list`),

  // 비디오 (언어별 탐색용)
  videos: (type, id, lang) => ax.get(`/${type}/${id}/videos`, { params: { language: lang } }),

  // 인물
  person: (id) => ax.get(`/person/${id}`, {
    params: { append_to_response: 'combined_credits' }
  }),
  personPopular: () => ax.get('/person/popular'),
  personTrending: (window = 'day') => ax.get(`/trending/person/${window}`),

  // TV 시즌
  season: (id, num) => ax.get(`/tv/${id}/season/${num}`),

  // 전체보기 페이지용: 카테고리 + 페이지 번호
  browsePage: (mediaType, category, page = 1, extra = {}) => {
    if (category === 'discover') {
      return ax.get(`/discover/${mediaType}`, { params: { ...extra, page } })
    }
    return ax.get(`/${mediaType}/${category}`, { params: { ...extra, page } })
  },

  // 인물 전체보기용
  browsePerson: (category, page = 1) => {
    if (category === 'trending_day') return ax.get('/trending/person/day', { params: { page } })
    if (category === 'trending_week') return ax.get('/trending/person/week', { params: { page } })
    return ax.get('/person/popular', { params: { page } })
  },
}
