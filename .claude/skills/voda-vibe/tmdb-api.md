# TMDB API 레이어

## 목차
1. axios 인스턴스
2. EP 객체 (엔드포인트)
3. useFetch 훅
4. 페이지별 API 매핑
5. 이미지 URL 처리

---

## 1. axios 인스턴스

`src/api/axios.js` — 이미 저장소에 있음. 수정 금지.

```javascript
import axios from 'axios'

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'ko-KR',
    region: 'KR',
  },
})

export default tmdb
```

`.env` 파일에 `VITE_TMDB_API_KEY=발급받은키` 필수.

---

## 2. EP 객체

`src/api/tmdb.js` — 신규 생성. 전 페이지 공용.

```javascript
import ax from './axios'

const IMG = 'https://image.tmdb.org/t/p'

export const EP = {
  // 이미지 URL 헬퍼
  img: (path, w = 'w500') => path ? `${IMG}/${w}${path}` : null,
  bg: (path) => path ? `${IMG}/original${path}` : null,

  // 인기/트렌딩
  popular: (type) => ax.get(`/${type}/popular`),
  trending: (type, window = 'week') => ax.get(`/trending/${type}/${window}`),
  topRated: (type) => ax.get(`/${type}/top_rated`),

  // 상세
  detail: (type, id) => ax.get(`/${type}/${id}`, {
    params: { append_to_response: 'credits,reviews,videos,similar' }
  }),

  // 검색/필터
  search: (q) => ax.get('/search/multi', { params: { query: q } }),
  discover: (type, params) => ax.get(`/discover/${type}`, { params }),
  genres: (type) => ax.get(`/genre/${type}/list`),

  // 인물
  person: (id) => ax.get(`/person/${id}`, {
    params: { append_to_response: 'combined_credits' }
  }),
  personPopular: () => ax.get('/person/popular'),
  personTrending: (window = 'day') => ax.get(`/trending/person/${window}`),

  // TV 시즌
  season: (id, num) => ax.get(`/tv/${id}/season/${num}`),
}
```

---

## 3. useFetch 훅

`src/hooks/useFetch.js` — 신규 생성. 전 페이지 공용.

```javascript
import { useState, useEffect } from 'react'

export default function useFetch(fn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let alive = true          // 언마운트 후 setState 방지 (메모리 누수 방지)
    setLoading(true)
    setErr(null)
    fn()
      .then(res => { if (alive) setData(res.data) })
      .catch(e => { if (alive) { setErr(e); console.error(e) } })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, deps)

  return { data, loading, err }
}
```

### 사용법

```jsx
import useFetch from '../hooks/useFetch'
import { EP } from '../api/tmdb'

const HomePage = () => {
  const { data, loading } = useFetch(() => EP.popular('movie'), [])

  if (loading) return <p className='text-zinc-400 p-12'>로딩 중...</p>

  return (
    <>
      <Feed type='normal' title='인기 영화' items={data.results} />
    </>
  )
}
```

### 여러 API 동시 호출 (Promise.all)

```jsx
const HomePage = () => {
  const [sections, setSections] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([
      EP.popular('movie'),
      EP.trending('movie', 'week'),
      EP.topRated('movie'),
    ]).then(([pop, trend, top]) => {
      if (alive) setSections({ pop: pop.data, trend: trend.data, top: top.data })
    }).catch(console.error)
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  if (loading) return <p className='text-zinc-400 p-12'>로딩 중...</p>

  return (
    <>
      <Feed type='play' title='지금 뜨는 영화' items={sections.pop.results} />
      <Feed type='rank' title='트렌딩' items={sections.trend.results} />
      <Feed type='normal' title='평점 TOP' items={sections.top.results} />
    </>
  )
}
```

---

## 4. 페이지별 API 매핑

| 페이지 | API 호출 | 비고 |
|--------|---------|------|
| HomePage | `popular('movie')`, `trending('movie')`, `topRated('movie')` | Promise.all |
| MoviePage | `genres('movie')`, `discover('movie', { with_genres })` | 장르탭 변경 시 재호출 |
| TvPage | `genres('tv')`, `discover('tv', { with_genres })` | MoviePage와 동일 구조 |
| FindPage | `discover(type, { with_genres, year, with_origin_country })` | 쿼리파라미터 기반 |
| PersonPage | `personTrending('day')`, `personPopular()` | |
| PersonProfilePage | `person(id)` | combined_credits 포함 |
| AboutPage | `detail(type, id)` | credits, reviews, videos, similar 포함 |
| ProfilePage | localStorage | TMDB 호출 없음 |
| AskPage | 백엔드 `/chat` | TMDB 직접 호출 없음 |

---

## 5. 이미지 URL 처리

```jsx
// 포스터 (세로)
<img src={EP.img(movie.poster_path)} alt={movie.title} />

// 포스터 크기 지정
<img src={EP.img(movie.poster_path, 'w342')} />

// 배경 (가로, 고화질)
<div style={{ backgroundImage: `url(${EP.bg(movie.backdrop_path)})` }} />

// 프로필 사진
<img src={EP.img(person.profile_path, 'w185')} />

// 이미지 없을 때 폴백
<img src={EP.img(movie.poster_path) || '/placeholder.png'} />
```

### 사용 가능한 크기

| 용도 | 추천 크기 |
|------|----------|
| 포스터 (카드) | `w500` (기본값) |
| 포스터 (작은 카드) | `w342` |
| 배경 이미지 | `original` (EP.bg 사용) |
| 프로필 사진 | `w185` |
| 에피소드 썸네일 | `w300` |

---

## 6. TMDB 응답 구조 (자주 쓰는 필드)

### movie / tv 목록

```javascript
{
  results: [
    {
      id: 123,
      title: '영화 제목',        // tv는 name
      poster_path: '/abc.jpg',
      backdrop_path: '/def.jpg',
      genre_ids: [28, 12],
      vote_average: 7.5,
      release_date: '2024-01-01', // tv는 first_air_date
      overview: '줄거리...',
    }
  ]
}
```

### detail (append_to_response 포함)

```javascript
{
  id: 123,
  title: '영화 제목',
  runtime: 148,                    // tv는 episode_run_time
  genres: [{ id: 28, name: '액션' }],
  credits: {
    cast: [{ id: 1, name: '배우', character: '역할', profile_path: '/img.jpg' }],
    crew: [{ id: 2, name: '감독', job: 'Director' }],
  },
  reviews: {
    results: [{ author: '작성자', content: '리뷰 내용', author_details: { rating: 8 } }]
  },
  videos: {
    results: [{ key: 'youtube_id', type: 'Trailer', site: 'YouTube' }]
  },
  similar: {
    results: [{ id: 456, title: '비슷한 영화', poster_path: '/ghi.jpg' }]
  },
}
```

### person (combined_credits 포함)

```javascript
{
  id: 1,
  name: '배우 이름',
  biography: '약력...',
  birthday: '1984-07-04',
  profile_path: '/img.jpg',
  known_for_department: 'Acting',
  combined_credits: {
    cast: [{ id: 123, title: '출연작', media_type: 'movie', poster_path: '/abc.jpg' }],
  },
}
```
