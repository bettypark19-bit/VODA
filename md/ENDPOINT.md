구글 문서의 최신 상세 내역과 `voda-vibe` 스킬의 기술 제약을 모두 결합한 **ENDPOINT.md** 최종본입니다. AI가 각 페이지(`.jsx`)별로 어떤 API를 호출해야 하는지 명확히 인지하도록 누락 없이 구성했습니다.

---

# ENDPOINT.md

이 문서는 VODA 프로젝트의 API 통신 규약 및 페이지별 엔드포인트 매핑 가이드입니다. AI는 코드를 작성할 때 이 명세를 절대적으로 준수하며, 임의로 구조를 변경하거나 내용을 삭제하지 마십시오.

## 1. 전역 설정 (src/api/axios.js)

* **Base URL**: `https://api.themoviedb.org/3/`
* **Default Params**: `api_key` (VITE_TMDB_API_KEY), `language: 'ko-KR'`, `region: 'KR'`
* **주의**: 이미지 호출 시에는 `EP.img` 또는 `EP.bg` 헬퍼를 사용하십시오.

---

## 2. EP 객체 명세 (src/api/tmdb.js)

AI는 모든 데이터 패칭 시 아래에 정의된 메서드만을 사용합니다.

```javascript
import ax from './axios'

const IMG = 'https://image.tmdb.org/t/p'

export const EP = {
  // 이미지 처리 (w500 기본, 배경은 original)
  img: (path, w = 'w500') => path ? `${IMG}/${w}${path}` : null,
  bg: (path) => path ? `${IMG}/original${path}` : null,

  // 목록 및 트렌드
  popular: (type) => ax.get(`/${type}/popular`),
  trending: (type, window = 'week') => ax.get(`/trending/${type}/${window}`),
  topRated: (type) => ax.get(`/${type}/top_rated`),
  nowPlaying: () => ax.get('/movie/now_playing'),
  upcoming: () => ax.get('/movie/upcoming'),

  // 상세 (중요: 모든 연관 데이터 일괄 호출)
  detail: (type, id) => ax.get(`/${type}/${id}`, {
    params: { append_to_response: 'credits,reviews,videos,similar,release_dates,content_ratings' }
  }),

  // 검색 및 필터
  search: (q) => ax.get('/search/multi', { params: { query: q } }),
  discover: (type, params) => ax.get(`/discover/${type}`, { params }),
  genres: (type) => ax.get(`/genre/${type}/list`),

  // 인물(Person)
  person: (id) => ax.get(`/person/${id}`, { params: { append_to_response: 'combined_credits' } }),
  personPopular: () => ax.get('/person/popular'),
  personTrending: (window = 'day') => ax.get(`/trending/person/${window}`),

  // TV 시즌
  season: (id, num) => ax.get(`/tv/${id}/season/${num}`),
}
```

---

## 3. 페이지별 엔드포인트 매핑 (*.jsx 필수 포함)

AI는 각 페이지 컴포넌트 구현 시 지정된 엔드포인트를 호출하여 데이터를 바인딩합니다.

### 메인 화면 (HomePage.jsx)
* **트렌딩 (일간/주간)**: `EP.trending('movie', 'day')`, `EP.trending('movie', 'week')`
* **지금 인기**: `EP.popular('movie')`
* **현재 상영 중**: `EP.nowPlaying()`
* **개봉 예정**: `EP.upcoming()`
* **AI 추천픽**: `EP.detail` 내 `similar` 데이터 또는 `movie/{id}/recommendations` 활용

### 영화 탐색 (MoviePage.jsx)
* **카테고리별 목록**: `EP.nowPlaying()`, `EP.popular('movie')`, `EP.topRated('movie')`, `EP.upcoming()`
* **글로벌 흥행**: `EP.discover('movie', { sort_by: 'revenue.desc' })`
* **장르별 탐색**: `EP.genres('movie')`로 목록 로드 후 `EP.discover('movie', { with_genres: id })` 호출

### TV 탐색 (TvPage.jsx)
* **방영 현황**: `EP.popular('tv')`, `EP.topRated('tv')`
* **오늘 방영/방영 중**: `EP.trending('tv', 'day')`
* **장르별 탐색**: `EP.genres('tv')` 호출 후 `EP.discover('tv', { with_genres: id })` 호출
* **시즌 상세**: `EP.season(id, season_number)` 호출

### 검색 및 필터 (FindPage.jsx)
* **통합 검색**: `EP.search(query)` (영화, TV, 인물 통합 검색)
* **복합 필터**: `EP.discover` 사용 (국가 `with_origin_country`, 연도 `primary_release_year` 등 조합)
* **컬렉션 검색**: `EP.search` 결과 중 `collection` 타입 필터링

### 인물 정보 (PersonPage.jsx / PersonProfilePage.jsx)
* **인기 인물 리스트**: `EP.personPopular()`, `EP.personTrending('day')`
* **인물 상세 정보**: `EP.person(id)` (출연 작품 `combined_credits` 포함)

### 상세 정보 (AboutPage.jsx)
* **통합 상세**: `EP.detail(type, id)` 호출
* **데이터 추출**:
    * 예고편: `res.data.videos.results` (type: 'Trailer')
    * 출연진: `res.data.credits.cast`
    * 리뷰: `res.data.reviews.results`

---

## 4. 핵심 데이터 필드 및 규칙

* **영화**: `title`, `release_date` 사용.
* **TV**: `name`, `first_air_date` 사용.
* **관람 등급**: `detail` 응답 중 `release_dates`(영화) 또는 `content_ratings`(TV)에서 `KR` 국가 코드 필터링.
* **D-DAY**: `release_date`와 현재 날짜를 비교하여 프론트엔드 로직으로 계산.
* **이미지**: 모든 이미지는 `EP.img(path)` 또는 `EP.bg(path)`를 거쳐야 하며, 없을 경우 `null` 처리에 따른 폴백 UI를 적용함.

---
**주의**: 이 명세에 없는 새 패키지(예: react-query 등)를 설치하지 말고, 제공된 `useFetch` 훅과 `EP` 객체만을 사용하여 구현하십시오.