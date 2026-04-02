# VODA OTT - Gemini CLI 구현 프롬프트

## 🎯 이 프롬프트로 할 수 있는 것

첨부된 이미지("사람을 보다" 히어로 섹션)와 Figma 디자인을 기반으로 VODA 프로젝트의 페이지 및 컴포넌트를 구현합니다.

**Figma 디자인**: https://www.figma.com/design/WuCbbYz4Djx6bxeAcXWEcg/VODA?node-id=40000308-7883&m=dev

---

## 📸 참조 이미지 분석

### "사람을 보다 (PersonPage)" 히어로 섹션

**시각적 구조:**
```
┌─────────────────────────────────────────┐
│                                         │
│        ETHEREAL PROFILES                │  <- 작은 텍스트 (보라색, uppercase)
│                                         │
│           사람을 보다                    │  <- 메인 타이틀 (흰색, 크고 굵게)
│                                         │
│    [설명 텍스트 여러 줄]                 │  <- 설명 (연한 회색)
│                                         │
└─────────────────────────────────────────┘
    배경: 블러 처리된 그레이/보라 톤
```

**디자인 요소:**
- 배경: 흐릿한 backdrop 이미지 + 어두운 오버레이
- 레이아웃: 중앙 정렬, 세로 방향 스택
- 타이포그래피: 계층 구조 (소제목 > 메인 > 설명)
- 색상: 보라색(primary) + 흰색 + 회색 조합
- 여백: 넉넉한 padding (상하 80-120px)

---

## 🚀 구현 순서

### STEP 1: 프로젝트 기본 구조 확인

먼저 다음을 확인해주세요:

```bash
cd frontend
ls -la src/api/     # axios.js가 있는지 확인
ls -la .env         # VITE_TMDB_API_KEY가 설정되었는지 확인
```

**없으면 생성:**

```bash
# .env 파일 생성
echo "VITE_TMDB_API_KEY=여기에_발급받은_키" > .env
```

---

### STEP 2: API 레이어 생성

#### 2-1. src/api/axios.js 생성 (없는 경우만)

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

#### 2-2. src/api/tmdb.js 생성

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

#### 2-3. src/hooks/useFetch.js 생성

```javascript
import { useState, useEffect } from 'react'

export default function useFetch(fn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let alive = true
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

---

### STEP 3: 라우터 구조 생성 (React Router v7 Data Mode)

#### 3-1. src/router/index.jsx 생성

```javascript
import { createBrowserRouter } from 'react-router'
import Layout from '../App'
import HomePage from '../pages/HomePage'
import MoviePage from '../pages/MoviePage'
import TvPage from '../pages/TvPage'
import PersonPage from '../pages/PersonPage'
import PersonProfilePage from '../pages/PersonProfilePage'
import FindPage from '../pages/FindPage'
import AskPage from '../pages/AskPage'
import AboutPage from '../pages/AboutPage'
import ProfilePage from '../pages/ProfilePage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/movie', element: <MoviePage /> },
      { path: '/tv', element: <TvPage /> },
      { path: '/person', element: <PersonPage /> },
      { path: '/person/:id', element: <PersonProfilePage /> },
      { path: '/find', element: <FindPage /> },
      { path: '/ask', element: <AskPage /> },
      { path: '/movie/:id', element: <AboutPage /> },
      { path: '/tv/:id', element: <AboutPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
])

export default router
```

#### 3-2. src/App.jsx 수정 (Layout 전용)

```javascript
import { Outlet } from 'react-router'
import GNB from './components/GNB'
import Footer from './components/Footer'

const Layout = () => (
  <div className='min-h-screen flex flex-col bg-[#0e0e13]'>
    <GNB />
    <main className='flex-1'>
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default Layout
```

#### 3-3. src/main.jsx 수정 (RouterProvider 렌더)

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import router from './router'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
```

---

### STEP 4: 이미지 기반 Hero 컴포넌트 구현

참조 이미지의 "사람을 보다" 히어로 섹션을 구현합니다.

#### src/components/Hero.jsx

```javascript
import { EP } from '../api/tmdb'

const Hero = ({ 
  type = 'home', 
  subtitle = '',
  title = '', 
  description = '',
  backdrop = null,
  poster = null,
}) => {
  // PersonPage 전용 레이아웃
  if (type === 'person') {
    return (
      <section className='relative w-full h-[600px] flex items-center justify-center overflow-hidden'>
        {/* 배경 이미지 + 블러 오버레이 */}
        <div className='absolute inset-0'>
          {backdrop && (
            <img 
              src={EP.bg(backdrop)} 
              alt='' 
              className='w-full h-full object-cover'
            />
          )}
          <div className='absolute inset-0 bg-gradient-to-b from-zinc-900/80 via-zinc-900/60 to-zinc-900/80 backdrop-blur-sm' />
        </div>

        {/* 중앙 텍스트 컨텐츠 */}
        <div className='relative z-10 max-w-4xl mx-auto px-8 text-center'>
          {subtitle && (
            <p className='text-primary-400 text-sm font-semibold tracking-widest uppercase mb-4'>
              {subtitle}
            </p>
          )}
          <h1 className='text-6xl font-bold text-zinc-50 mb-6'>
            {title}
          </h1>
          {description && (
            <p className='text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto'>
              {description}
            </p>
          )}
        </div>
      </section>
    )
  }

  // HomePage 전용 레이아웃
  if (type === 'home') {
    return (
      <section className='relative w-full h-[700px] flex items-center overflow-hidden'>
        <div className='absolute inset-0'>
          {backdrop && (
            <img 
              src={EP.bg(backdrop)} 
              alt='' 
              className='w-full h-full object-cover'
            />
          )}
          <div className='absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/70 to-transparent' />
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-8 w-full flex items-center gap-12'>
          {poster && (
            <img 
              src={EP.img(poster)} 
              alt={title}
              className='w-[300px] h-[450px] object-cover rounded-2xl shadow-2xl flex-shrink-0'
            />
          )}
          <div className='flex-1'>
            {subtitle && (
              <p className='text-secondary-400 text-sm font-semibold tracking-wide uppercase mb-3'>
                {subtitle}
              </p>
            )}
            <h1 className='text-7xl font-bold text-zinc-50 mb-6 leading-tight'>
              {title}
            </h1>
            {description && (
              <p className='text-xl text-zinc-300 leading-relaxed mb-8 max-w-2xl'>
                {description}
              </p>
            )}
            <div className='flex gap-4'>
              <button className='px-8 py-3 bg-primary-400 text-white font-semibold rounded-lg hover:bg-primary-500 transition'>
                재생
              </button>
              <button className='px-8 py-3 bg-zinc-800 text-zinc-50 font-semibold rounded-lg hover:bg-zinc-700 transition'>
                상세 정보
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // AboutPage (상세 페이지) 전용 레이아웃
  return (
    <section className='relative w-full h-[800px] flex items-end overflow-hidden'>
      <div className='absolute inset-0'>
        {backdrop && (
          <img 
            src={EP.bg(backdrop)} 
            alt='' 
            className='w-full h-full object-cover'
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent' />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-8 pb-16 w-full flex items-end gap-12'>
        {poster && (
          <img 
            src={EP.img(poster)} 
            alt={title}
            className='w-[280px] h-[420px] object-cover rounded-2xl shadow-2xl flex-shrink-0'
          />
        )}
        <div className='flex-1 pb-4'>
          <h1 className='text-6xl font-bold text-zinc-50 mb-4'>
            {title}
          </h1>
          {subtitle && (
            <p className='text-xl text-zinc-300 mb-6'>
              {subtitle}
            </p>
          )}
          {description && (
            <p className='text-lg text-zinc-400 leading-relaxed mb-8 max-w-3xl'>
              {description}
            </p>
          )}
          <div className='flex gap-4'>
            <button className='px-8 py-3 bg-primary-400 text-white font-semibold rounded-lg'>
              재생
            </button>
            <button className='px-8 py-3 bg-zinc-800/80 backdrop-blur text-zinc-50 font-semibold rounded-lg'>
              내 리스트에 추가
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
```

---

### STEP 5: PersonPage 구현 (참조 이미지 기반)

#### src/pages/PersonPage.jsx

```javascript
import { useState, useEffect } from 'react'
import { EP } from '../api/tmdb'
import Hero from '../components/Hero'
import PersonCard from '../components/PersonCard'

const PersonPage = () => {
  const [trending, setTrending] = useState(null)
  const [popular, setPopular] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([
      EP.personTrending('day'),
      EP.personPopular(),
    ]).then(([trendRes, popRes]) => {
      if (alive) {
        setTrending(trendRes.data)
        setPopular(popRes.data)
      }
    }).catch(console.error)
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  if (loading) {
    return (
      <div className='min-h-screen bg-[#0e0e13] flex items-center justify-center'>
        <p className='text-zinc-400 text-xl'>로딩 중...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#0e0e13]'>
      {/* Hero 섹션 - 참조 이미지와 동일한 구조 */}
      <Hero
        type='person'
        subtitle='ETHEREAL PROFILES'
        title='사람을 보다'
        description='영화와 드라마를 빛낸 배우들과 감독들을 만나보세요. 그들의 작품 세계와 필모그래피를 탐험하며, 당신이 사랑하는 스타의 새로운 면모를 발견하세요.'
        backdrop={trending?.results[0]?.profile_path}
      />

      {/* 트렌딩 인물 섹션 */}
      <section className='max-w-7xl mx-auto px-8 py-16'>
        <h2 className='text-3xl font-bold text-zinc-50 mb-8'>오늘의 트렌딩</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'>
          {trending?.results.slice(0, 12).map(person => (
            <PersonCard
              key={person.id}
              id={person.id}
              name={person.name}
              role={person.known_for_department}
              photo={person.profile_path}
            />
          ))}
        </div>
      </section>

      {/* 인기 인물 섹션 */}
      <section className='max-w-7xl mx-auto px-8 py-16'>
        <h2 className='text-3xl font-bold text-zinc-50 mb-8'>인기 배우</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'>
          {popular?.results.slice(0, 12).map(person => (
            <PersonCard
              key={person.id}
              id={person.id}
              name={person.name}
              role={person.known_for_department}
              photo={person.profile_path}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default PersonPage
```

---

### STEP 6: PersonCard 컴포넌트 구현

#### src/components/PersonCard.jsx

```javascript
import { Link } from 'react-router'
import { EP } from '../api/tmdb'

const PersonCard = ({ id, name, role, photo }) => {
  return (
    <Link 
      to={`/person/${id}`}
      className='group cursor-pointer'
    >
      <div className='relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800 mb-3'>
        {photo ? (
          <img 
            src={EP.img(photo, 'w185')} 
            alt={name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center'>
            <span className='text-zinc-600 text-4xl'>👤</span>
          </div>
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
      </div>
      <h3 className='text-zinc-50 font-semibold truncate'>{name}</h3>
      {role && (
        <p className='text-sm text-zinc-400 truncate'>
          {role === 'Acting' ? '배우' : role === 'Directing' ? '감독' : role}
        </p>
      )}
    </Link>
  )
}

export default PersonCard
```

---

### STEP 7: GNB (글로벌 네비게이션 바) 구현

#### src/components/GNB.jsx

```javascript
import { Link, useLocation } from 'react-router'

const GNB = () => {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navItems = [
    { path: '/', label: '홈' },
    { path: '/movie', label: '영화보다' },
    { path: '/tv', label: 'TV보다' },
    { path: '/person', label: '사람을 보다' },
    { path: '/find', label: '찾아보다' },
    { path: '/ask', label: '물어보다' },
  ]

  return (
    <nav className='sticky top-0 z-50 bg-zinc-900/95 backdrop-blur border-b border-zinc-800'>
      <div className='max-w-7xl mx-auto px-8 py-4 flex items-center justify-between'>
        <Link to='/' className='text-2xl font-bold text-primary-400'>
          VODA
        </Link>
        
        <ul className='flex items-center gap-8'>
          {navItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-zinc-50'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link 
          to='/profile'
          className='w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition'
        >
          👤
        </Link>
      </div>
    </nav>
  )
}

export default GNB
```

---

### STEP 8: Footer 구현

#### src/components/Footer.jsx

```javascript
const Footer = () => {
  return (
    <footer className='bg-zinc-950 border-t border-zinc-800 mt-auto'>
      <div className='max-w-7xl mx-auto px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <h3 className='text-primary-400 font-bold text-xl mb-4'>VODA</h3>
            <p className='text-zinc-400 text-sm'>
              영화와 드라마를 탐험하는 새로운 방법
            </p>
          </div>
          
          <div>
            <h4 className='text-zinc-50 font-semibold mb-3'>서비스</h4>
            <ul className='space-y-2 text-sm text-zinc-400'>
              <li>영화보다</li>
              <li>TV보다</li>
              <li>사람을 보다</li>
            </ul>
          </div>
          
          <div>
            <h4 className='text-zinc-50 font-semibold mb-3'>정보</h4>
            <ul className='space-y-2 text-sm text-zinc-400'>
              <li>회사 소개</li>
              <li>이용약관</li>
              <li>개인정보처리방침</li>
            </ul>
          </div>
          
          <div>
            <h4 className='text-zinc-50 font-semibold mb-3'>고객지원</h4>
            <ul className='space-y-2 text-sm text-zinc-400'>
              <li>FAQ</li>
              <li>문의하기</li>
              <li>피드백</li>
            </ul>
          </div>
        </div>
        
        <div className='mt-8 pt-8 border-t border-zinc-800 text-center'>
          <p className='text-zinc-500 text-sm'>
            © 2026 VODA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
```

---

## 🎨 Tailwind CSS 스타일 설정

### src/index.css

```css
@import "tailwindcss";

@theme {
  /* Primary - 보라색 계열 */
  --color-primary-50: #faf5ff;
  --color-primary-100: #f3e8ff;
  --color-primary-200: #e9d5ff;
  --color-primary-300: #d8b4fe;
  --color-primary-400: #a78bfa;
  --color-primary-500: #8b5cf6;
  --color-primary-600: #7c3aed;
  --color-primary-700: #6d28d9;
  --color-primary-800: #5b21b6;
  --color-primary-900: #4c1d95;

  /* Secondary - 오렌지 계열 */
  --color-secondary-50: #fff7ed;
  --color-secondary-100: #ffedd5;
  --color-secondary-200: #fed7aa;
  --color-secondary-300: #fdba74;
  --color-secondary-400: #fb923c;
  --color-secondary-500: #f97316;
  --color-secondary-600: #ea580c;
  --color-secondary-700: #c2410c;
  --color-secondary-800: #9a3412;
  --color-secondary-900: #7c2d12;

  /* Zinc - 그레이스케일 */
  --color-zinc-50: #fafafa;
  --color-zinc-100: #f4f4f5;
  --color-zinc-200: #e4e4e7;
  --color-zinc-300: #d4d4d8;
  --color-zinc-400: #a1a1aa;
  --color-zinc-500: #71717a;
  --color-zinc-600: #52525b;
  --color-zinc-700: #3f3f46;
  --color-zinc-800: #27272a;
  --color-zinc-900: #18181b;
  --color-zinc-950: #0e0e13;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 스크롤바 스타일 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #18181b;
}

::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #52525b;
}
```

---

## 🎯 Gemini CLI 사용 예시

### 1️⃣ PersonPage 전체 생성

```
VODA 프로젝트에서 PersonPage를 구현해줘.

참조:
- Figma: https://www.figma.com/design/WuCbbYz4Djx6bxeAcXWEcg/VODA?node-id=40000308-7883&m=dev
- 첨부 이미지: "사람을 보다 (ETHEREAL PROFILES)" 히어로 섹션

요구사항:
1. Hero 컴포넌트 (type='person')
   - 배경: 블러 처리된 배경 이미지
   - 중앙 정렬 레이아웃
   - subtitle: "ETHEREAL PROFILES" (보라색, uppercase)
   - title: "사람을 보다" (흰색, 6xl, 굵게)
   - description: 설명 텍스트 (회색, 중앙 정렬)

2. 트렌딩 섹션
   - EP.personTrending('day') API 호출
   - PersonCard 컴포넌트로 그리드 렌더링
   - 6열 그리드 (lg), 4열 (md), 2열 (모바일)

3. 인기 배우 섹션
   - EP.personPopular() API 호출
   - 동일한 그리드 레이아웃

규칙:
- React Router v7 Data Mode 사용
- useFetch 훅으로 데이터 로딩
- Tailwind v4 + @theme 토큰
- 새 패키지 설치 금지
```

---

### 2️⃣ Hero 컴포넌트만 생성

```
VODA 프로젝트에서 Hero 컴포넌트를 구현해줘.

참조 이미지: "사람을 보다" 히어로 섹션

요구사항:
- props: type, subtitle, title, description, backdrop, poster
- type='person' 모드: 중앙 정렬, 블러 배경
- type='home' 모드: 좌측 정렬, 포스터 + 버튼
- type='detail' 모드: 하단 정렬, 상세 정보

스타일:
- 배경: 그라데이션 오버레이 + 블러 효과
- subtitle: text-primary-400, uppercase, tracking-widest
- title: text-6xl (person) / text-7xl (home), font-bold
- description: text-zinc-400, leading-relaxed

EP.img(), EP.bg() 헬퍼 사용
새 패키지 설치 금지
```

---

### 3️⃣ 에러 수정

```
VODA 프로젝트에서 이 에러를 해결해줘:

[에러 메시지 붙여넣기]

먼저 분류해줘:
1. 코드 에러 (오타, import, props)
2. 환경 에러 (node_modules, .env)
3. API 에러 (네트워크, 키, 응답)

분류 후 해결 방법을 알려줘.
새 패키지 설치하지 마.
기존 패키지 버전 변경하지 마.
```

---

## ⚠️ 핵심 규칙 요약

### ✅ 반드시 해야 할 것

1. **React Router v7 Data Mode** 사용 (3파일 구조)
2. **EP 객체**로만 TMDB API 호출
3. **useFetch 훅**으로 데이터 로딩
4. **Tailwind v4 + @theme** 토큰 사용
5. **Figma 디자인** 참조

### ❌ 절대 하지 말아야 할 것

1. **새 패키지 설치** (`npm install`)
2. **BrowserRouter / Routes / Route** 사용
3. **loader / action** 함수 사용
4. **인라인 스타일** (`style={{}}`)
5. **Tailwind 임의값** 하드코딩 (`[px값]`)
6. **tailwind.config.js** 생성

---

## 📦 프로젝트 구조

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.js       ✅ TMDB axios 인스턴스
│   │   └── tmdb.js        ✅ EP 객체 (API 함수들)
│   ├── hooks/
│   │   └── useFetch.js    ✅ 데이터 로딩 훅
│   ├── components/
│   │   ├── Hero.jsx       ✅ 히어로 섹션 (3가지 타입)
│   │   ├── PersonCard.jsx ✅ 인물 카드
│   │   ├── GNB.jsx        ✅ 네비게이션 바
│   │   └── Footer.jsx     ✅ 푸터
│   ├── pages/
│   │   ├── PersonPage.jsx ✅ 사람을 보다 페이지
│   │   └── ...
│   ├── router/
│   │   └── index.jsx      ✅ 라우터 설정 (Data Mode)
│   ├── App.jsx            ✅ Layout (GNB + Outlet + Footer)
│   ├── main.jsx           ✅ 진입점 (RouterProvider)
│   └── index.css          ✅ Tailwind + @theme
├── .env                   ✅ VITE_TMDB_API_KEY
└── package.json
```

---

## 🚀 실행 방법

```bash
# 1. 프론트엔드 디렉토리로 이동
cd frontend

# 2. 의존성 설치 (최초 1회만)
npm install

# 3. .env 파일 확인
cat .env
# VITE_TMDB_API_KEY=여기에_발급받은_키

# 4. 개발 서버 실행
npm run dev

# 5. 브라우저에서 열기
# http://localhost:5173/person
```

---

## 💡 다음 단계

이 프롬프트를 사용해 다음을 구현할 수 있습니다:

1. ✅ **PersonPage** - 사람을 보다 페이지
2. 📝 **HomePage** - 메인 홈 페이지
3. 📝 **MoviePage** - 영화보다 페이지
4. 📝 **TvPage** - TV보다 페이지
5. 📝 **AboutPage** - 영화/TV 상세 페이지
6. 📝 **FindPage** - 찾아보다 페이지
7. 📝 **AskPage** - 물어보다 (AI 챗봇) 페이지

각 페이지를 구현할 때 이 프롬프트의 STEP 1-8을 참고하고,
Figma 디자인과 첨부 이미지를 기반으로 동일한 패턴을 적용하세요.

---

**이 프롬프트를 Gemini CLI에 복사해서 사용하세요! 🚀**
