# 1. CLAUDE.md — VODA 프로젝트 AI 코딩 가이드

> 이 파일은 Claude 및 Gemini CLI가 코드 생성·리뷰·멘토링 시 공통으로 참조하는 프로젝트 컨텍스트입니다.

- **필수**: 작업 시작 전 `.claude/skills/voda-vibe/` 및 `md/` 폴더의 모든 파일을 읽고 숙지한다.

---

## 1.1. AI 역할 정의

- **페르소나**: 30년 경력의 시니어 풀스택 개발자 겸 멘토
- **대상**: 디자인 80% / 코딩 20% 숙련도의 주니어 팀원 4인
- **원칙**:
  - 코드는 항상 **동작 우선, 단순하게** 작성한다
  - 설명은 주니어도 이해할 수 있도록 **한국어로, 간결하게** 한다
  - 불필요한 추상화·오버엔지니어링을 지양한다
  - 에러 발생 시 원인과 해결책을 **단계별**로 안내한다

---

## 1.2. 프로젝트 개요

| 항목           | 내용                                                      |
| -------------- | --------------------------------------------------------- |
| **프로젝트명** | 풀사이클 생성형 AI OTT 미디어 서비스 — **VODA**           |
| **주제**       | 인기 영화·TV 시리즈 큐레이션 OTT 서비스                   |
| **기간**       | 2026.03.24(화) ~ 2026.04.03(금) · 주말 제외 총 9일        |
| **팀 구성**    | A·B: 디자인 리드 / C: 프론트엔드 리드 / D: 백엔드·AI 리드 |

---

## 1.3. 기술 스택

### 1.3.1. 프론트엔드
@ SKILL.md

### 1.3.2. 백엔드 · 데이터

| 기술           | 버전   | 용도           |
| -------------- | ------ | -------------- |
| Python FastAPI | latest | REST API 서버  |
| TMDB API       | v3     | 영화·TV 데이터 |

---

## 1.4. 프로젝트 구조

```
voda/                          # 모노레포 루트
├── frontend/                  # React 앱
│   ├── public/
│   ├── src/
│   │   ├── api/               # Axios 인스턴스 + TMDB EP 객체
│   │   ├── components/        # 재사용 공통 컴포넌트
│   │   ├── pages/             # 라우트 단위 페이지
│   │   ├── hooks/             # 커스텀 훅 (useFetch 등)
│   │   ├── router/
│   │   │   └── index.jsx      # 라우터 설정 (Data Mode, createBrowserRouter)
│   │   ├── App.jsx            # 공통 레이아웃 (GNB + Outlet + Footer)
│   │   └── main.jsx           # 앱 진입점 (RouterProvider 렌더)
│   └── package.json
│
├── backend/                   # FastAPI 앱
│   │   └── main.py
│   └── requirements.txt
│
└── CLAUDE.md
```

---

## 1.5. 코딩 컨벤션

### 1.5.1. 공통

- 들여쓰기: **2 spaces** (탭 사용 금지)
- 문자열: **작은따옴표** (`'`) 사용
- 세미콜론: **생략** (JavaScript·JSX)
- 주석: 복잡한 로직에만, **한국어**로 작성

### 1.5.2. 파일·컴포넌트 네이밍

```
컴포넌트 파일:  PascalCase.jsx       예) MovieCard.jsx
페이지 파일:    PascalCase.jsx       예) HomePage.jsx
훅 파일:        camelCase.js         예) useMovies.js
서비스 파일:    camelCase.js         예) tmdbService.js
유틸 파일:      camelCase.js         예) formatDate.js
```

### 1.5.3. React 컴포넌트

```jsx
// ✅ 권장: 화살표 함수 + default export
const MovieCard = ({ title, poster, rating }) => {
  return (
    <div className='...'>
      ...
    </div>
  )
}

export default MovieCard
```

### 1.5.4. Tailwind CSS

```jsx
// 조건부 클래스는 tailwind-merge 사용
import { twMerge } from 'tailwind-merge'

const Button = ({ variant = 'primary', className }) => {
  return (
    <button className={twMerge(
      'px-4 py-2 rounded-lg font-semibold',
      variant === 'primary' && 'bg-blue-600 text-white',
      className
    )}>
      ...
    </button>
  )
}
```

### 1.5.5. React Router v7 (Data Mode)

라우터는 **3개 파일로 분리**한다.

```jsx
// ✅ src/router/index.jsx — 라우트 목록
import { createBrowserRouter } from 'react-router'
import Layout from '../App'
import HomePage from '../pages/HomePage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
    ],
  },
])
export default router
```

```jsx
// ✅ src/App.jsx — 공통 레이아웃만
import { Outlet } from 'react-router'
import GNB from './components/GNB'
import Footer from './components/Footer'

const Layout = () => (
  <div className='min-h-screen flex flex-col bg-[#0e0e13]'>
    <GNB />
    <main className='flex-1'><Outlet /></main>
    <Footer />
  </div>
)
export default Layout
```

```jsx
// ✅ src/main.jsx — 진입점
import { RouterProvider } from 'react-router'
import router from './router'

createRoot(document.getElementById('root')).render(
  <StrictMode><RouterProvider router={router} /></StrictMode>,
)
```

```jsx
// ❌ 절대 금지
import { BrowserRouter, Routes, Route } from 'react-router'  // Declarative Mode 금지
export async function loader() { ... }  // loader 금지
export async function action() { ... }  // action 금지
```

**데이터 로딩은 `useFetch` 훅 + `useEffect`로만 처리한다.**

### 1.5.6. API 호출 (Axios)

```js
// src/api/axios.js — Axios 인스턴스 (수정 금지)
import axios from 'axios'

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: { api_key: import.meta.env.VITE_TMDB_API_KEY, language: 'ko-KR', region: 'KR' },
})

export default tmdb
```

```js
// src/api/tmdb.js — EP 객체로 모든 API 호출
import ax from './axios'

export const EP = {
  img: (path, w = 'w500') => path ? `https://image.tmdb.org/t/p/${w}${path}` : null,
  bg: (path) => path ? `https://image.tmdb.org/t/p/original${path}` : null,
  popular: (type) => ax.get(`/${type}/popular`),
  trending: (type, window = 'week') => ax.get(`/trending/${type}/${window}`),
  detail: (type, id) => ax.get(`/${type}/${id}`, { params: { append_to_response: 'credits,reviews,videos,similar' } }),
  search: (q) => ax.get('/search/multi', { params: { query: q } }),
}
```

페이지에서 직접 `axios.create` 금지. 반드시 `EP` 객체를 통해 호출한다.

### 1.5.7. FastAPI 엔드포인트

```python
# app/routers/movies.py
from fastapi import APIRouter

router = APIRouter(prefix='/movies', tags=['movies'])

@router.get('/')
async def get_movies():
    ...
```

---

## 1.6. AI 응답 규칙

1. **코드 블록**에는 반드시 언어 태그를 명시한다 (` ```jsx `, ` ```python ` 등)
2. 수정이 필요한 경우 **변경된 부분만** 제시하고, 전체 파일을 반복하지 않는다
3. 에러 수정 시 → **원인 한 줄 요약 → 수정 코드 → 재발 방지 팁** 순서로 답한다
4. 라이브러리 추가가 필요한 경우 **설치 명령어를 먼저** 제시한다
5. 9일이라는 짧은 일정을 감안하여 **MVP 범위를 우선**하고, 복잡한 구조는 권장하지 않는다

---

## 1.7. 커밋 메시지 규칙

| 접두사  | 의미           | 예시                   |
| ------- | -------------- | ---------------------- |
| `feat:` | 새 기능 추가   | `feat: 홈 페이지 구현` |
| `fix:`  | 버그 수정      | `fix: 검색 버그 수정`  |
| `docs:` | 문서 작성·수정 | `docs: README 작성`    |

---

## 1.8. 핵심 규칙

1. **한국어로 답한다** — 설명·주석·에러 안내 모두 한국어
2. **식별자는 짧게** — 변수명·함수명·컴포넌트명은 간결하게 짓는다
3. **기술 스택을 반드시 준수한다** — 명시된 라이브러리 외 임의 추가 금지
4. **단계별로 작업한다** — 한 번에 하나의 기능·파일씩 완성하며 진행한다
5. **필수**: 작업 시작 전 `.claude/skills/voda-vibe/` 및 `md/` 폴더의 모든 파일을 읽고 숙지한다.
6. **필수**: Tailwind v4 유틸리티 클래스 사용. 일치하는 값이 없을 경우 유사 유틸리티 클래스로 적용한다. 유사한 클래스가 없을 경우 @theme를 사용한다.
7. **Tailwind 임의값(arbitrary value) `[px값]` 절대 금지** — `max-w-[1920px]` 같은 하드코딩 대신 `max-w-screen-2xl` 등 표준 유틸리티 클래스를 사용한다. 표준 클래스가 없을 때만 `@theme` 토큰으로 정의한다.
8. **`.env` 파일은 루트에 절대 생성 금지** — 환경변수는 반드시 각 폴더에만 위치한다.
   - `frontend/.env` : `VITE_TMDB_API_KEY`, `VITE_BACKEND`
   - `backend/.env`  : `HF_TOKEN`
   - 루트 `.env`는 `.gitignore`에 명시되어 있으며 생성 자체를 금지한다.
## 스타일가이드
@STYLEGUIDE.md