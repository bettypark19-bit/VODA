# VODA 프로젝트 AI 코딩 컨텍스트

> 이 문서는 VODA 프로젝트의 현재 상태, Figma→React 매핑, 바이브 코딩 프롬프트를 정리한 것이다.
> Gemini CLI, Claude, 또는 다른 AI 코딩 도구에 이 문서를 컨텍스트로 제공하면 프로젝트를 즉시 이해하고 작업할 수 있다.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | VODA — 풀사이클 생성형 AI OTT 미디어 서비스 |
| 저장소 | https://github.com/bettypark19-bit/VODA |
| 기간 | 2026.03.24 ~ 04.03 (9일) |
| 팀 | A·B: 디자인 리드 / C: 프론트엔드 리드 / D: 백엔드·AI 리드 |
| 해상도 | 데스크탑 1920px 고정 (반응형 없음) |

---

## 2. 기술 스택

| 기술 | 버전 | 용도 |
|---|---|---|
| React | 19 | UI |
| Vite | 8 | 빌드 |
| Tailwind CSS | v4 (@theme 사용, tailwind.config.js 금지) | 스타일 |
| React Router | v7 (Data Mode, createBrowserRouter) | 라우팅 |
| Axios | latest | HTTP |
| FontAwesome | v7 | 아이콘 |
| tailwind-merge | latest | 조건부 클래스 |
| Swiper | 12 | 슬라이드 |
| Python FastAPI | latest | 백엔드 |
| TMDB API | v3 | 영화·TV 데이터 |
| HuggingFace Qwen2.5-72B | - | AI 챗봇 |

---

## 3. 프로젝트 구조

```
voda/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js          # Axios 인스턴스 (수정 금지)
│   │   │   └── tmdb.js           # EP 객체 (모든 API 호출은 여기서)
│   │   ├── components/
│   │   │   ├── Card.jsx          # ✅ 완료 (size=sm/md, badge 8종)
│   │   │   ├── Footer.jsx        # ✅ 완료
│   │   │   ├── GNB.jsx           # ⚠️ 수정 필요 (5탭→6탭)
│   │   │   ├── GenreTab.jsx      # ✅ 완료
│   │   │   ├── Hero.jsx          # ⚠️ 수정 필요 (type prop 분기)
│   │   │   ├── MovieCard.jsx     # ❌ 껍데기 (사용하지 않음, Card.jsx 사용)
│   │   │   └── SectionTitle.jsx  # ❌ 껍데기 → 실제 구현 필요
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # ⚠️ 수정 필요 (MovieCard→Card 교체)
│   │   │   ├── MoviePage.jsx     # ❌ TODO
│   │   │   ├── TVPage.jsx        # ❌ TODO
│   │   │   ├── AskPage.jsx       # ❌ TODO
│   │   │   ├── SearchPage.jsx    # ❌ 삭제 예정 (FindPage로 대체)
│   │   │   └── ProfilePage.jsx   # ❌ TODO
│   │   ├── hooks/                # 비어있음 (useFetch.js 필요)
│   │   ├── router/
│   │   │   └── index.jsx         # ⚠️ 수정 필요 (누락 경로 다수)
│   │   ├── App.jsx               # ✅ 완료 (Layout)
│   │   ├── main.jsx              # ✅ 완료
│   │   └── index.css             # ✅ 완료 (@theme 토큰 정의됨)
│   └── package.json
├── backend/
│   ├── main.py                   # ✅ FastAPI + /chat 엔드포인트
│   └── requirements.txt
└── CLAUDE.md
```

---

## 4. 현재 코드 문제점 (작업 전 필수 확인)

1. **GNB 6탭 누락**: NAV_LINKS에 '찾아보다'(/find) 탭 없음. 5개→6개 필요
2. **라우터 미완성**: /person, /person/:id, /find, /movie/:id, /tv/:id, /profile 경로 미등록
3. **HomePage 오류**: 존재하지 않는 MovieCard 컴포넌트에 의존. Card.jsx로 교체 필요
4. **useFetch 훅 없음**: hooks/useFetch.js 미구현
5. **대부분 페이지 TODO**: MoviePage, TVPage, AskPage, ProfilePage 전부 껍데기
6. **누락 파일**: AboutPage, FindPage, PersonProfilePage, PersonCategoryPage 파일 없음
7. **SectionTitle 껍데기**: div만 있고 props 처리 없음

---

## 5. 디자인 토큰 (@theme) — index.css에 이미 정의됨

```css
@import "tailwindcss";

@theme {
  --color-primary-50: #F5F3FF;
  --color-primary-400: #A78BFA;
  --color-primary-500: #8B5CF6;
  --color-primary-600: #7C3AED;
  --color-primary-950: #2E1065;
  --color-secondary-400: #F472B6;
  --color-secondary-500: #EC4899;
  --color-neutral-50: #FAFAFA;
  --color-neutral-400: #A1A1AA;
  --color-neutral-800: #27272A;
  --color-neutral-900: #18181B;
  --color-neutral-950: #0A0A0A;
  --font-sans: 'Gmarket Sans TTF', system-ui, sans-serif;
  --font-serif: 'Pretendard', system-ui, sans-serif;
  --shadow-glow-purple: 0px 0px 60px 0px rgba(189, 157, 255, 0.1);
}
```

---

## 6. API 호출 규칙 — EP 객체 (src/api/tmdb.js)

모든 API 호출은 반드시 EP 객체를 통해 수행한다. axios.create를 직접 사용하지 않는다.

```js
import { EP } from '../api/tmdb'

// 이미지 URL
EP.img(path, w = 'w500')   // 포스터 등
EP.bg(path)                // 배경 (original 크기)

// 목록
EP.popular(type)           // type = 'movie' | 'tv'
EP.trending(type, window)  // window = 'day' | 'week'
EP.topRated(type)
EP.nowPlaying(type)

// 상세
EP.detail(type, id)        // append_to_response: credits,reviews,videos,similar

// 검색/필터
EP.search(q)               // /search/multi
EP.discover(type, params)  // /discover/{type}
EP.genres(type)            // /genre/{type}/list

// 인물
EP.person(id)              // append_to_response: combined_credits
EP.personPopular()
EP.personTrending(window)

// TV 시즌
EP.season(id, num)
```

---

## 7. 라우팅 구조 (목표 상태)

| 경로 | React 파일 | 설명 |
|---|---|---|
| `/` | HomePage.jsx | 메인 |
| `/movie` | MoviePage.jsx | 영화보다 |
| `/tv` | TvPage.jsx | TV보다 |
| `/person` | PersonPage.jsx | 사람을보다 |
| `/person/:id` | PersonProfilePage.jsx | 인물 상세 |
| `/person/category` | PersonCategoryPage.jsx | 인물 카테고리 |
| `/find` | FindPage.jsx | 찾아보다 (필터 1페이지) |
| `/ask` | AskPage.jsx | 물어보다 (AI 챗봇) |
| `/movie/:id` | AboutPage.jsx | 영화 상세 |
| `/tv/:id` | AboutPage.jsx | TV 상세 (같은 컴포넌트) |
| `/profile` | ProfilePage.jsx | 나를보다 |

---

## 8. Figma 주소

| 페이지 | Figma URL |
|---|---|
| 컴포넌트 | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=228-2188 |
| Home | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=77-2075 |
| Movie | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=117-1740 |
| Tv | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=355-7435 |
| Person | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=78-2118 |
| Person/profile | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=107-1555 |
| Person/category | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=403-9066 |
| Find | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=73-599 |
| Ask | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=78-2332 |
| About/Movie | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=82-676 |
| About/Tv | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=358-7139 |
| Profile | https://www.figma.com/design/1njHE0wh4wagalawjHyLSo/VODA?node-id=368-8135 |

---

## 9. Figma 레이어 → React 컴포넌트 매핑 + 생성 프롬프트

아래 표의 "생성 프롬프트"를 AI에 그대로 입력하면 해당 컴포넌트가 생성된다.

### 9-1. components/ (신규 + 수정)

| Figma 레이어명 | React 파일 | 상태 | 생성 프롬프트 |
|---|---|---|---|
| GNB (6 status variant) | GNB.jsx | 수정 | GNB.jsx의 NAV_LINKS 배열에 { label: '찾아보다', path: '/find' }를 추가해줘. 총 6개 탭이어야 해. 나머지 구조는 그대로 유지해 |
| AI Chatbot (속성1=normal) 64×64 | ChatBtn.jsx | 신규 | ChatBtn.jsx를 만들어줘. 우측 하단 고정(fixed bottom-8 right-8) 64×64 원형 버튼. bg-primary-500 text-white. FontAwesome faComment 아이콘. 클릭 시 navigate('/ask'). z-50. hover:bg-primary-400 transition |
| Search Bar Short (2v: AI/normal) | SearchBar.jsx | 신규 | SearchBar.jsx를 만들어줘. variant prop으로 'ai'와 'normal' 구분. 가운데 정렬 max-w-3xl mx-auto. backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-3. 왼쪽 FontAwesome faMagnifyingGlass, input은 bg-transparent outline-none text-white w-full placeholder-zinc-400. variant='ai'면 아이콘을 faStar로 바꾸고 placeholder를 'AI에게 물어보세요'로 변경. onSubmit prop으로 엔터 시 콜백 호출 |
| Movie Vertical Card/Ranking Item 232×348 | RankCard.jsx | 신규 | RankCard.jsx를 만들어줘. rank, id, type, title, poster, genre를 props로 받아. Link to={`/${type}/${id}`}로 감싸. w-58 flex-shrink-0. relative. 포스터는 EP.img(poster)로 aspect-[2/3] rounded-3xl overflow-hidden object-cover. 포스터 위에 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent 오버레이. rank 숫자는 absolute -left-6 bottom-14 text-8xl font-bold text-white/80 font-sans drop-shadow-lg. 하단에 제목 text-xl font-medium truncate와 장르 text-sm text-zinc-400 |
| Movie horizontal Card 440×380 | HCard.jsx | 신규 | HCard.jsx를 만들어줘. id, type, title, poster, progress를 props로 받아. Link to={`/${type}/${id}`}. w-110 flex-shrink-0. 상단 EP.img(poster,'w780') aspect-video rounded-2xl overflow-hidden object-cover. 하단 mt-3 제목 text-lg font-medium text-zinc-50 truncate. progress가 있으면 그 아래에 h-1 bg-zinc-700 rounded-full 안에 bg-primary-400 진행바 |
| 배우 프로필 카드 (3v: 위/아래/x) 324×738 | PersonCard.jsx | 신규 | PersonCard.jsx를 만들어줘. id, name, img, role을 props로 받아. Link to={`/person/${id}`}. w-80 flex-shrink-0. 인물 사진 EP.img(img) aspect-[3/4] rounded-3xl overflow-hidden object-cover. mt-4 이름 text-xl font-semibold text-zinc-50. 역할 text-sm text-zinc-400 |
| Actor 180×222 원형 | ActorThumb.jsx | 신규 | ActorThumb.jsx를 만들어줘. name, img, role을 props로 받아. w-44 flex-shrink-0 text-center. 프로필 EP.img(img,'w185') size-40 rounded-full object-cover mx-auto. 이미지 없으면 size-40 rounded-full bg-zinc-800 flex items-center justify-center에 FontAwesome faUser. mt-3 이름 text-sm font-medium truncate. 역할 text-xs text-zinc-400 truncate |
| Episode (상태바=on/off) | EpisodeCard.jsx | 신규 | EpisodeCard.jsx를 만들어줘. ep, title, thumb, duration, overview를 props로 받아. flex gap-5 items-start. 왼쪽 썸네일 EP.img(thumb,'w300') w-64 aspect-video rounded-xl overflow-hidden object-cover flex-shrink-0. 오른쪽 flex-1. 에피소드 번호 text-sm text-zinc-500 font-semibold. 제목 text-lg font-medium text-zinc-50. 설명 text-sm text-zinc-400 line-clamp-2 mt-1. 재생시간 text-xs text-zinc-500 mt-2 |
| Review Card (Review_s+Review_f) | ReviewCard.jsx | 신규 | ReviewCard.jsx를 만들어줘. author, content, rating, date를 props로 받아. bg-zinc-900/50 border border-white/5 rounded-2xl p-6. 상단 flex justify-between. 왼쪽 작성자 font-semibold text-zinc-50. 오른쪽 날짜 text-sm text-zinc-500. 중간 mt-3 별점 rating/2 기준 ★ 표시 text-primary-400 text-sm. 하단 mt-3 리뷰 text-zinc-300 text-sm line-clamp-3 |
| keyword card (4v) | KeywordCard.jsx | 신규 | KeywordCard.jsx를 만들어줘. title, desc, img를 props로 받아. relative w-110 h-56 rounded-3xl overflow-hidden flex-shrink-0. 배경 img absolute inset-0 object-cover. bg-gradient-to-t from-black/80 to-transparent absolute inset-0. 하단 absolute bottom-6 left-6. 제목 text-2xl font-bold text-white. desc가 있으면 text-sm text-zinc-300 mt-1 |
| Section/Section-Ranking/Section이어보다 → Feed 1개 통합 | Feed.jsx | 신규 | Feed.jsx를 만들어줘. type, title, link, items, children을 props로 받아. type은 'normal','rank','play'. 상단 flex justify-between items-center mb-6. 왼쪽 title text-3xl font-bold text-zinc-50 font-sans. 오른쪽 link가 있으면 Link to={link} 'See All' text-sm text-zinc-400 hover:text-zinc-200. 하단 flex gap-6 overflow-x-auto scrollbar-hide pb-4. children이 있으면 children 렌더. 없으면 items를 map해서 type='normal'이면 Card, type='rank'면 RankCard, type='play'면 HCard를 렌더. py-6 |
| Bar buttons (on/off × 장르) | ChipBtn.jsx | 신규 | ChipBtn.jsx를 만들어줘. label, active, onClick을 props로 받아. button. rounded-full font-serif text-base font-semibold whitespace-nowrap transition-colors cursor-pointer. active일 때 bg-primary-400 text-primary-950 px-5 py-2. 비활성 bg-zinc-800 border border-zinc-600 text-zinc-400 px-5 py-2 |
| title/프로그램 상세 (기본/내부/소제목) | SectionTitle.jsx | 수정 | SectionTitle.jsx를 수정해줘. title, subtitle, link를 props로 받아. title은 text-3xl font-bold text-zinc-50 font-sans. subtitle이 있으면 mt-1 text-sm text-zinc-400. link가 있으면 우측 Link to={link} 'See All >' text-sm text-zinc-400. flex justify-between items-end. mb-6 |
| Card Detail Button (6v) | DetailBtn.jsx | 신규 | DetailBtn.jsx를 만들어줘. label, icon, variant, onClick을 props로 받아. variant='primary' bg-primary-500 hover:bg-primary-400 text-white. variant='secondary' bg-white/10 hover:bg-white/20 border border-white/20 text-white. 공통 flex items-center gap-2 rounded-full font-semibold px-6 py-3 transition-colors cursor-pointer |
| Container (시놉시스) | Synopsis.jsx | 신규 | Synopsis.jsx를 만들어줘. text, genres, date, runtime을 props로 받아. 좌우 flex gap-12. 왼쪽 flex-1: '시놉시스' text-xl font-bold mb-4. 줄거리 text-zinc-300 leading-relaxed. 3줄 초과 시 line-clamp-3 + '더보기' 버튼(useState 토글). 오른쪽 w-140 bg-zinc-900/50 rounded-2xl p-8: 장르/출시일/러닝타임 grid grid-cols-2 gap-y-4 gap-x-8 |
| Cast Section | CastSection.jsx | 신규 | CastSection.jsx를 만들어줘. casts 배열 props. '출연진' text-xl font-bold mb-4. flex gap-6 overflow-x-auto scrollbar-hide pb-4. casts.slice(0,10).map으로 ActorThumb 렌더. px-20 |
| Episodes Section | EpisodeSection.jsx | 신규 | EpisodeSection.jsx를 만들어줘. episodes 배열, showTitle props. 상단 '에피소드' text-xl font-bold. 하단 flex flex-col gap-6. episodes.map으로 EpisodeCard 렌더. px-20 py-8 |
| Score Summary 576×348 | ScoreSummary.jsx | 신규 | ScoreSummary.jsx를 만들어줘. score, count props. w-144 bg-zinc-900/50 border border-white/5 rounded-2xl p-8 text-center. score text-6xl font-bold text-primary-400. '/10' text-xl text-zinc-500. ★ 별 5개 score/2 기준. count text-sm text-zinc-500 |
| Section-Search Suggestions (Bento) | MoodGrid.jsx | 신규 | MoodGrid.jsx를 만들어줘. moods [{title,desc,img}]. 'Explore by Mood' text-3xl font-bold mb-6. grid grid-cols-4 grid-rows-2 gap-6 h-150. 첫번째 col-span-2 row-span-2. 나머지 분배. 각 셀 relative rounded-3xl overflow-hidden. 배경이미지+그라데이션 |
| Filter Chips:margin | FilterChips.jsx | 신규 | FilterChips.jsx를 만들어줘. filters [{id,label}], active, onChange props. flex flex-wrap gap-3 justify-center py-6. filters.map으로 ChipBtn 렌더 |
| Bubble + AI 답변 | ChatBubble.jsx | 신규 | ChatBubble.jsx를 만들어줘. msg, isAi props. isAi면 flex gap-3. 왼쪽 AI 아바타 size-8 rounded-full bg-primary-500 text-white 'AI'. 말풍선 bg-zinc-800 rounded-2xl px-5 py-3. 사용자면 flex justify-end. 말풍선 bg-primary-500/20 border border-primary-400/30 |

### 9-2. pages/ (신규 + 수정)

| Figma 시안 | React 파일 | 상태 | 생성 프롬프트 |
|---|---|---|---|
| Home | HomePage.jsx | 수정 | HomePage.jsx를 수정해줘. MovieCard 대신 Card import. useEffect로 EP.trending('movie','week'), EP.popular('movie'), EP.topRated('movie') 호출. Hero 아래 Feed 3개: Feed type='rank' title='현재 인기작', Feed type='normal' title='인기 영화', Feed type='normal' title='높은 평점'. ChatBtn 추가 |
| Movie | MoviePage.jsx | 신규 | MoviePage.jsx를 만들어줘. EP.genres('movie')로 장르 목록 로드. activeGenre state로 EP.discover('movie',{with_genres}) 호출. Hero 아래 GenreTab + Feed×3. ChatBtn 추가 |
| Tv | TvPage.jsx | 신규 | TvPage.jsx를 만들어줘. MoviePage와 동일 구조, type 전부 'tv'로 변경. title 대신 name, release_date 대신 first_air_date 사용 |
| Person | PersonPage.jsx | 신규 | PersonPage.jsx를 만들어줘. Hero type='person'. SearchBar variant='normal'. GenreTab 인물탭. EP.personTrending('day'), EP.personPopular() 호출. PersonCard로 배치. ChatBtn 추가 |
| Person/profile | PersonProfilePage.jsx | 리팩터 | PersonProfilePage.jsx를 리팩터해줘. useParams()로 id. EP.person(id) 호출. Hero type='person'. biography 표시. combined_credits.cast를 Feed type='normal'로. ChatBtn 추가 |
| Person/category | PersonCategoryPage.jsx | 리팩터 | PersonCategoryPage.jsx를 리팩터. 상단 뒤로가기 + 제목. EP.personPopular()로 PersonCard grid grid-cols-5 gap-6 배치 |
| Find/* | FindPage.jsx | 신규 | FindPage.jsx를 만들어줘. SearchBar + FilterChips(장르/연도/국가 3개). useSearchParams()로 쿼리 관리. EP.discover로 호출. 결과를 Feed type='rank'로 연도별 그룹핑 표시. 하단 MoodGrid. ChatBtn 추가 |
| Ask | AskPage.jsx | 신규 | AskPage.jsx를 만들어줘. messages useState 배열. AI 인사 섹션. messages.map으로 ChatBubble. 하단 고정 SearchBar variant='ai'. 입력 시 axios.post(VITE_API_URL+'/chat',{text}) 호출. 로딩 중 '...' 깜빡임. useRef로 자동 스크롤 |
| About/Movie + About/Tv | AboutPage.jsx | 신규 | AboutPage.jsx를 만들어줘. useParams()로 type, id. EP.detail(type,id) 호출. Hero + Synopsis + CastSection + ScoreSummary + ReviewCard. type='tv'면 EpisodeSection 추가(EP.season(id,1)). 최하단 Feed type='normal' title='비슷한 작품'. ChatBtn 추가 |
| Profile | ProfilePage.jsx | 신규 | ProfilePage.jsx를 만들어줘. '나를 보다' text-5xl font-bold. localStorage에서 찜목록 읽기. Feed type='normal' title='담아보다'. 없으면 안내 문구. ChatBtn 추가 |

### 9-3. hooks/ + router/

| 파일 | 상태 | 생성 프롬프트 |
|---|---|---|
| hooks/useFetch.js | 신규 | hooks/useFetch.js를 만들어줘. url 인자로 {data, loading, error} 반환. useEffect에서 fetch. AbortController cleanup |
| router/index.jsx | 수정 | router/index.jsx 수정. /person→PersonPage, /person/:id→PersonProfilePage, /person/category→PersonCategoryPage, /find→FindPage, /movie/:id→AboutPage, /tv/:id→AboutPage 추가. 404 * 경로 추가 |

---

## 10. 페이지별 조합 구조

모든 페이지는 Feed(type prop) 컴포넌트를 세로로 쌓아서 만든다.

| 경로 | 조합 구조 | API |
|---|---|---|
| `/` | Hero → Feed(rank) → Feed(normal)×2 | EP.trending, EP.popular, EP.topRated |
| `/movie` | Hero → GenreTab(20v) → Feed(normal)×3 | EP.genres("movie"), EP.discover, EP.popular |
| `/tv` | Hero → GenreTab(16v) → Feed(normal)×3 | EP.genres("tv"), EP.discover, EP.popular |
| `/person` | Hero(person) → SearchBar → GenreTab(6v) → PersonCard Grid | EP.personPopular, EP.personTrending |
| `/person/:id` | Hero(person) → Synopsis → Feed(출연작) | EP.person(id) |
| `/find` | SearchBar → FilterChips → Feed(rank)×3 → MoodGrid | EP.search, EP.discover |
| `/ask` | AI인사 → ChatBubble List → SearchBar(AI) | POST /chat |
| `/movie/:id` | Hero → Synopsis → Cast → Score → Review → Feed(similar) | EP.detail("movie",id) |
| `/tv/:id` | Hero → Synopsis → Cast → Episode → Score → Feed(similar) | EP.detail("tv",id), EP.season(id,1) |
| `/profile` | Header → Feed(찜) → Feed(이어보다) → 설정 | localStorage |

---

## 11. 코딩 컨벤션 (필수 준수)

- 들여쓰기: 2 spaces
- 문자열: 작은따옴표 `'`
- 세미콜론: 생략
- 컴포넌트: 화살표 함수 + default export
- 파일명: PascalCase.jsx (컴포넌트), camelCase.js (훅/유틸)
- 스타일: Tailwind v4 유틸리티만. 인라인 style={{}} 금지. tailwind.config.js 금지
- 임의값(arbitrary value) `[px값]` 금지: 표준 유틸리티 클래스 사용. 없으면 @theme 토큰 정의
- 라우터: createBrowserRouter (Data Mode). BrowserRouter/Routes/Route 금지. loader/action 금지
- 데이터: useFetch 훅 + useEffect로만. 페이지에서 직접 axios.create 금지. EP 객체 사용
- 주석: 한국어

## 12. 절대 금지

1. npm install (새 패키지) — 허용 목록 외 설치 금지
2. 루트에서 npm 명령 실행 — frontend/ 안에서만
3. 패키지 버전 변경
4. 인라인 스타일 style={{}}
5. tailwind.config.js 생성
6. 다른 팀원 담당 파일 직접 수정
7. 디버깅 중 AI가 제안하는 패키지 설치

## 13. 우선순위 커팅

- Find 필터 10개 → 3개 (장르/연도/국가)
- Banner → 후순위
- 반응형 → 제거 (1920px 고정)
- 시즌 드롭다운 → 시즌1 고정
- react-player → 후순위 (YouTube 링크 대체)
- Awards + Collaborators → 후순위