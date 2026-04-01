# VODA 팀 업무 분배

> 팀원 알파벳을 입력하면 해당 팀원의 담당 업무를 바로 확인할 수 있다.

---

## 팀원 A — 공통 기반 + 홈

**역할**: 전체 공통 컴포넌트 담당. GNB, Footer, 공통 카드가 완성돼야 나머지 3명이 작업 시작 가능하므로 최우선 완성 대상이다.

### 담당 파일

```
pages/
  HomePage.jsx

components/
  GNB.jsx               ← 전 페이지 공통, 최우선
  Footer.jsx            ← 전 페이지 공통
  HeroSection.jsx       ← 홈 + 영화/TV 상세 공용
  MovieCard.jsx         ← 전 페이지 공용 카드
  SectionTitle.jsx      ← 섹션 타이틀 + 더보기 버튼 공용
  AIchatButton.jsx      ← AI 챗봇 플로팅 버튼 (전 페이지 공통)
```

### 우선순위
1. GNB.jsx
2. Footer.jsx
3. MovieCard.jsx
4. HeroSection.jsx
5. HomePage.jsx

---

## 팀원 B — 영화 + TV 페이지

**역할**: 영화/TV 목록 및 상세 페이지 담당. 구조가 유사해 한 명이 패턴 파악 후 빠르게 처리 가능하다.

### 담당 파일

```
pages/
  MoviePage.jsx         ← 영화보다 (장르 필터 + 카드 목록)
  MovieDetailPage.jsx   ← 영화 상세 (About/Movie)
  TvPage.jsx            ← TV보다 (장르 필터 + 카드 목록)
  TvDetailPage.jsx      ← TV 상세 (About/Tv, 시즌/에피소드 포함)

components/
  GenreBar.jsx          ← 장르 필터 버튼
  EpisodeCard.jsx       ← TV 에피소드 카드
  SeasonSelector.jsx    ← 시즌 선택 버튼
  ReviewSection.jsx     ← 평점 + 리뷰 섹션
```

### 우선순위
1. GenreBar.jsx
2. MoviePage.jsx
3. TvPage.jsx
4. MovieDetailPage.jsx
5. TvDetailPage.jsx

---

## 팀원 C — 검색 + AI 챗봇 페이지

**역할**: 검색 및 AI 챗봇 페이지 + 서비스 레이어 담당. API 연동이 핵심이라 서비스 모듈까지 함께 담당한다.

### 담당 파일

```
pages/
  SearchPage.jsx        ← 찾아보다 (검색 + 필터)
  AskPage.jsx           ← 물어보다 (AI 챗봇)

components/
  SearchBar.jsx
  FilterChip.jsx        ← 장르/국가/연도/평점 필터 칩
  KeywordButton.jsx     ← 키워드 검색 버튼
  ChatBubble.jsx        ← AI 채팅 말풍선

services/
  tmdbService.js        ← TMDB API 모듈 (전체 공용, 최우선)
  aiService.js          ← AI API 호출 모듈
```

### 우선순위
1. tmdbService.js      ← 전체 팀 공용이므로 Day 1에 완성 후 공유
2. SearchBar.jsx
3. SearchPage.jsx
4. ChatBubble.jsx
5. AskPage.jsx

---

## 팀원 D — 인물 + 프로필 + 라우터

**역할**: 인물/프로필 페이지 및 전체 라우터 초기 세팅 담당. 인물 페이지는 독립 구조라 별도 담당자가 맡기 적합하다.

### 담당 파일

```
pages/
  PersonPage.jsx        ← 사람을보다 (인물 목록)
  PersonDetailPage.jsx  ← 인물 상세 (수상, 협업자 등)
  ProfilePage.jsx       ← 마이페이지

components/
  ActorCard.jsx         ← 배우/감독 카드
  AwardSection.jsx      ← 수상 섹션
  CollaboratorSection.jsx ← 협업자 섹션

App.jsx                 ← React Router 전체 라우팅 초기 세팅 (최우선)
```

### 우선순위
1. App.jsx             ← Day 1에 라우터 구조 잡고 팀 전체 공유
2. ActorCard.jsx
3. PersonPage.jsx
4. PersonDetailPage.jsx
5. ProfilePage.jsx

---

## 전체 일정

| 기간 | 내용 |
|------|------|
| Day 1 | A: GNB·Footer·MovieCard 완성 / C: tmdbService.js 완성 / D: App.jsx 라우터 세팅 |
| Day 2~3 | 전원 담당 페이지 레이아웃 구조 잡기 |
| Day 4~6 | 전원 담당 페이지 기능 구현 + API 연결 |
| Day 7~8 | 통합 테스트 + 버그 수정 |
| Day 9 | 최종 점검 + 배포 |

---

## 공유 규칙

- A의 GNB, Footer, MovieCard 완성 전까지 나머지는 목업 데이터로 작업한다.
- C의 `tmdbService.js` 완성 즉시 팀 전체에 공유한다.
- D가 `App.jsx` 라우터 구조를 먼저 잡고, 각자 자기 페이지 라우트를 추가한다.
- 담당 파일 외 수정 시 반드시 팀원에게 먼저 공유한다.
