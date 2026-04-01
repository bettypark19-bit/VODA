# 바이브 코딩 프롬프트 템플릿

## 목차
1. 공통 프롬프트 (전원 사용)
2. C 전용 (프론트 리드)
3. A 전용 (디자인 리드 — 검색/상세)
4. B 전용 (디자인 리드 — 인물/카드)

---

## 1. 공통 프롬프트

### 작업 시작

```
CLAUDE.md를 읽어줘.
오늘 [컴포넌트명/페이지명] 작업을 시작한다.

- 현재 파일 상태를 먼저 확인해줘
- 기존 코드가 있으면 어떤 상태인지 알려줘
- 새 패키지 설치하지 마
```

### 저장 전 확인

```
지금까지 만든 [파일명]을 검토해줘.

확인할 것:
1. import 경로가 맞는지
2. props가 빠진 게 없는지
3. Tailwind 클래스에 오타가 없는지
4. @theme 토큰을 사용했는지 (하드코딩 색상 금지)
5. 인라인 스타일이 없는지

새 패키지 설치하지 마.
```

### 에러 발생

```
이 에러를 해결해줘:
[에러 메시지 전체를 여기에 붙여넣기]

먼저 에러를 분류해줘:
1. 코드 에러 (오타, import, props)
2. 환경 에러 (node_modules, .env)
3. API 에러 (네트워크, 키, 응답)

분류 후에 해결해줘.
새 패키지 설치하지 마.
기존 패키지 버전 변경하지 마.
```

### Git 충돌

```
git pull 했더니 충돌이 났다.

충돌 파일: [파일명]
내 변경: [내가 뭘 했는지]
상대 변경: [상대가 뭘 했는지]

둘 다 살리는 방향으로 해결해줘.
package.json이나 package-lock.json은 건드리지 마.
```

### 되돌리기

```
방금 한 작업이 잘못됐다.
[파일명]을 마지막 커밋 상태로 되돌리고 싶다.

git checkout으로 되돌리는 명령어를 알려줘.
npm install은 하지 마.
```

---

## 2. C 전용 (프론트 리드)

### 컴포넌트 생성

```
CLAUDE.md를 읽어줘.
src/components/[컴포넌트명].jsx를 만들어줘.

- Figma 컴포넌트명: [Card_mv360, Feed_normal 등]
- props: { [props 나열] }
- Tailwind v4 + @theme 토큰 사용
- EP.img()로 TMDB 이미지 처리
- 완결된 코드로 제공해줘
- 새 패키지 설치하지 마
```

### API 레이어 작성

```
CLAUDE.md를 읽어줘.
src/api/tmdb.js를 만들어줘.

- src/api/axios.js의 인스턴스를 import
- EP 객체에 아래 함수 포함:
  img, bg, popular, trending, topRated,
  detail, search, discover, genres,
  person, personPopular, personTrending, season
- 새 패키지 설치하지 마
```

### 페이지 조립

```
CLAUDE.md를 읽어줘.
src/pages/[페이지명].jsx를 만들어줘.

- 이 페이지의 구조: [Hero + Feed(rank) + Feed(normal)×2 등]
- TMDB API: [EP.popular('movie') 등]
- useFetch 훅 사용
- Layout이 GNB/Footer 처리하므로 페이지에서 렌더하지 마
- 로딩 중: "로딩 중..." 텍스트만
- 새 패키지 설치하지 마
```

### Feed 컴포넌트 통합

```
CLAUDE.md를 읽어줘.
src/components/Feed.jsx를 만들어줘.

- Figma: Feed_normal + Feed_play + Feed_Rank → 1개 컴포넌트
- type prop: "normal" | "play" | "rank"
- normal: 제목 + 카드 가로 스크롤 (Card 사용)
- play: 제목 + 가로형 카드 스크롤 (HCard 사용)
- rank: 제목 + 랭킹 카드 스크롤 (RankCard 사용)
- title, link, items, mediaType props
- SectionTitle 기능 내장 (별도 컴포넌트 불필요)
- 새 패키지 설치하지 마
```

### Layout + 라우팅

```
CLAUDE.md를 읽어줘.
src/components/Layout.jsx와 src/App.jsx를 수정해줘.

Layout.jsx:
- GNB + <Outlet /> + Footer + ChatBtn 감싸기

App.jsx:
- BrowserRouter > Routes > Route path="/" element={<Layout>}
- 중첩 라우트로 모든 페이지 배치
- 라우트 목록: /, /movie, /tv, /person, /person/:id,
  /person/category, /find, /ask, /movie/:id, /tv/:id, /profile
- 새 패키지 설치하지 마
```

---

## 3. A 전용 (디자인 리드 — 검색/상세)

### GenreTab 제작

```
CLAUDE.md를 읽어줘.
src/components/GenreTab.jsx를 만들어줘.

- Figma: Bar_mv(20v) + Bar_tv(16v) + Bar_p → 단일 컴포넌트
- props: tabs[], active, onChange
- tabs 예시: [{ id: 28, name: '액션' }, { id: 35, name: '코미디' }]
- TMDB genres API에서 받은 데이터를 그대로 사용
- active 탭은 primary-400 배경, 나머지는 zinc-800 배경
- 가로 스크롤 (overflow-x-auto)
- 새 패키지 설치하지 마
```

### SearchBar 제작

```
CLAUDE.md를 읽어줘.
src/components/SearchBar.jsx를 만들어줘.

- Figma: Search Bar Short (2v: AI/normal)
- props: mode("ai"|"normal"), value, onChange, onSubmit
- mode=ai: 보라색 전송 버튼 + AI 아이콘
- mode=normal: 검색 아이콘 + 입력 필드
- 둥근 모서리, backdrop-blur, bg-white/5
- 새 패키지 설치하지 마
```

### FindPage (찾아보다)

```
CLAUDE.md를 읽어줘.
src/pages/FindPage.jsx를 만들어줘.

- Find 10개 변형 = 이 1페이지 + 쿼리파라미터
- URL 예시: /find?genre=28&year=2024&country=KR
- useSearchParams로 필터 값 읽기
- EP.discover(type, params)로 필터 결과 조회
- 구조: SearchBar + FilterChips + Feed(normal) 반복
- 새 패키지 설치하지 마
```

### AboutPage (영화/TV 상세)

```
CLAUDE.md를 읽어줘.
src/pages/AboutPage.jsx를 만들어줘.

- /movie/:id와 /tv/:id 공용 페이지
- useParams에서 id, useLocation에서 type 판별
- EP.detail(type, id)로 상세 데이터 로딩
- 구조: Hero(detail) + Synopsis + CastSection + ReviewCard + ScoreSummary + Feed(similar)
- TV일 때만 EpisodeSection 추가
- 새 패키지 설치하지 마
```

### Hero 리팩터

```
CLAUDE.md를 읽어줘.
src/components/Hero.jsx를 수정해줘.

현재 문제:
- 오펜하이머가 하드코딩되어 있음
- SVG 경로가 컴포넌트 안에 직접 삽입됨

수정 방향:
- props로 title, backdrop, poster, rating, year, runtime, overview 받기
- type prop: "home" | "detail" | "person"
- EP.bg(backdrop)로 배경 이미지
- EP.img(poster)로 포스터 이미지
- SVG 아이콘은 FontAwesome으로 교체 (faPlay, faPlus, faFilm)
- 새 패키지 설치하지 마
```

---

## 4. B 전용 (디자인 리드 — 인물/카드)

### PersonCard 분리

```
CLAUDE.md를 읽어줘.
src/components/PersonCard.jsx를 만들어줘.

현재 문제:
- PersonPage.jsx와 PersonCategoryPage.jsx에서
  ActorCard를 각각 인라인으로 정의 → 중복

수정 방향:
- 두 파일의 ActorCard를 하나로 통합
- props: id, name, role, photo, movies[]
- EP.img(photo, 'w185')로 프로필 이미지
- Link to={`/person/${id}`}
- 두 페이지에서 import하여 사용
- 새 패키지 설치하지 마
```

### EpisodeCard 분리

```
CLAUDE.md를 읽어줘.
src/components/EpisodeCard.jsx를 만들어줘.

현재 문제:
- PersonProfilePage.jsx 안에 EpisodeCard가 인라인 정의

수정 방향:
- props: ep, title, duration, thumb, progress
- EP.img(thumb, 'w300')로 썸네일
- 진행도 바 (progress 0~100)
- hover 시 재생 버튼 표시
- 새 패키지 설치하지 마
```

### PersonPage 리팩터

```
CLAUDE.md를 읽어줘.
src/pages/PersonPage.jsx를 수정해줘.

현재 문제:
- 더미 데이터 사용
- ActorCard 인라인 정의

수정 방향:
- EP.personTrending('day')로 트렌딩 인물 데이터
- EP.personPopular()로 인기 인물 데이터
- PersonCard 컴포넌트 import하여 사용
- GenreTab으로 필터 (전체/오늘 트렌딩/이번주 트렌딩/인기 배우/인기 감독)
- Layout이 GNB/Footer 처리하므로 제거
- 새 패키지 설치하지 마
```

### PersonProfilePage 리팩터

```
CLAUDE.md를 읽어줘.
src/pages/PersonProfilePage.jsx를 수정해줘.

현재 문제:
- 더미 데이터 하드코딩
- EpisodeCard 인라인 정의

수정 방향:
- useParams에서 id 가져오기
- EP.person(id)로 인물 상세 + combined_credits
- Hero type="person"으로 상단 영역
- combined_credits.cast에서 출연 영화/TV 분리
- Card 컴포넌트로 출연작 표시
- EpisodeCard 컴포넌트 import
- 새 패키지 설치하지 마
```

### ReviewCard + ScoreSummary

```
CLAUDE.md를 읽어줘.
src/components/ReviewCard.jsx와 ScoreSummary.jsx를 만들어줘.

ReviewCard:
- Figma: Review_s(1120×244) + Review_f(1760×208) → 1개
- props: author, content, rating, size("sm"|"lg")
- 별점 표시 (rating / 2 → 5점 만점)

ScoreSummary:
- Figma: Score Summary (576×348)
- props: avg, count
- avg를 5점 만점으로 표시 (TMDB는 10점 만점)
- 별 아이콘 (FontAwesome faStar)
- 새 패키지 설치하지 마
```
