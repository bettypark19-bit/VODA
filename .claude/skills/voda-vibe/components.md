# VODA 컴포넌트 매핑

## 목차
1. Figma → React 매핑 표
2. 페이지 구성 패턴
3. 컴포넌트 작성 규칙
4. 주요 컴포넌트 props 상세

---

## 1. Figma → React 매핑 표

### 카드 계열

| Figma 컴포넌트 | variant 수 | React | props |
|---------------|-----------|-------|-------|
| Card_mv360 | 8 (free/new/Live/찜/기본/개봉예정/curator/voda only) | `<Card>` | `id, type, title, genre, poster, badge, size="sm"` |
| Card_mv410 | 8 (동일) | `<Card>` | 위와 동일, `size="md"` |
| Card_rk | 없음 (450×600) | `<RankCard>` | `rank, title, genre, poster, id, type` |
| Movie horizontal Card | 없음 (440×380) | `<HCard>` | `title, poster, progress, id, type` |
| Card_p | 3 (위/아래/x) | `<PersonCard>` | `name, role, photo, id` |
| Actor | 없음 (180×222) | `<ActorThumb>` | `name, photo, id` |
| Card_ep | 없음 | `<EpisodeCard>` | `ep, title, duration, thumb, progress` |
| Card_key | 4 (국가언어별/컬렉션/연도별/장르필터) | `<KeywordCard>` | `type, title, desc, bg` |

**핵심**: Card_mv360과 Card_mv410은 **한 컴포넌트**다. `size` prop만 다르다. 8개 badge variant는 `badge` prop으로 분기한다.

### 피드(섹션) 계열

| Figma 컴포넌트 | React | props |
|---------------|-------|-------|
| Feed_normal (1920×978) | `<Feed type="normal">` | `title, link, items[]` |
| Feed_play (1920×630) | `<Feed type="play">` | `title, link, items[]` |
| Feed_Rank (1920×900) | `<Feed type="rank">` | `title, link, items[]` |

Feed 안에 SectionTitle 기능이 포함된다. 별도 SectionTitle 컴포넌트 불필요.

### 탭/바 계열 — 전부 단일 컴포넌트

| Figma 컴포넌트 | variant 수 | React | props |
|---------------|-----------|-------|-------|
| Bar_mv | 20 | `<GenreTab>` | `tabs[], active, onChange` |
| Bar_tv | 16 | `<GenreTab>` | 위와 동일. 데이터만 다름 |
| Bar_p | 없음 | `<GenreTab>` | 위와 동일 |
| Bar buttons_Movie Genre | 40 (on/off×20) | `<ChipBtn>` | `label, active, onClick` |
| Bar buttons_TV Genre | 34 | `<ChipBtn>` | 위와 동일 |
| Bar buttons_People | 12 | `<ChipBtn>` | 위와 동일 |
| Search Button | 14 | `<ChipBtn>` | 위와 동일 |
| Keyword Button | 34+ | `<ChipBtn>` | 위와 동일 |

### 상세 페이지 계열

| Figma 컴포넌트 | React | props |
|---------------|-------|-------|
| Hero (3v) + Hero_p | `<Hero>` | `type, title, backdrop, poster, rating, year, runtime, overview` |
| Card Detail Button (6v) | `<DetailBtn>` | `label, icon, variant` |
| Container (시놉시스) | `<Synopsis>` | `text, genres, date, runtime, keywords` |
| Cast Section | `<CastSection>` | `cast[]` |
| Episodes Section + episode(3v) | `<EpisodeSection>` | `episodes[], seasonNum` |
| Review_s + Review_f | `<ReviewCard>` | `author, content, rating, size` |
| Score Summary | `<ScoreSummary>` | `avg, count, dist[]` |
| Banner | `<Banner>` | `title, desc, backdrop` |

### 검색/AI 계열

| Figma 컴포넌트 | React | props |
|---------------|-------|-------|
| Search Bar Short (2v: AI/normal) | `<SearchBar>` | `mode, value, onChange, onSubmit` |
| search tab Button (4v) + Filter Chips | `<FilterChips>` | `filters[], active, onChange` |
| Card_key (4v) | `<KeywordCard>` | `type, title, desc, bg` |
| Bubble + AI 답변 | `<ChatBubble>` | `type, text` (기존 소스 연결) |

### 공용 레이아웃

| React | 역할 |
|-------|------|
| `<Layout>` | `<GNB />` + `<Outlet />` + `<Footer />` + `<ChatBtn />` |
| `<GNB>` | 상단 네비 6탭 (홈/영화보다/TV보다/사람을보다/물어보다/찾아보다) |
| `<Footer>` | 하단 푸터 |
| `<ChatBtn>` | AI 챗봇 플로팅 버튼 → /ask로 이동 |

---

## 2. 페이지 구성 패턴

모든 페이지는 **Feed 컴포넌트를 쌓아서** 만든다.

```
HomePage     = Hero + Feed(play) + Feed(rank) + Feed(normal)×3
MoviePage    = Hero + GenreTab + Feed(normal) + Feed(rank) + Banner + Feed(normal)
TvPage       = Hero + GenreTab + Feed(normal) + Feed(rank) + Feed(normal)×2
PersonPage   = Hero(person) + GenreTab(people) + TrendPeople + Focus
FindPage     = SearchBar + FilterChips + Feed(normal) + MoodBento
AskPage      = KeywordTab + ChatBubble + AiReply + Feed(normal) + SearchBar
AboutPage    = Hero(detail) + Synopsis + CastSection + ReviewCard + Feed(similar)
AboutPage/TV = 위 + EpisodeSection 추가
ProfilePage  = Header + Feed(normal) + Feed(play) + ReviewSection
```

**Layout(GNB+Footer+ChatBtn)은 App.jsx에서 감싼다. 페이지에서 렌더하지 않는다.**

### 라우팅 구조

```
/               → HomePage
/movie          → MoviePage
/tv             → TvPage
/person         → PersonPage
/person/:id     → PersonProfilePage
/person/category → PersonCategoryPage
/find           → FindPage (Find 10개 변형 = 이 1페이지 + 쿼리파라미터)
/ask            → AskPage (챗봇)
/movie/:id      → AboutPage (type="movie")
/tv/:id         → AboutPage (type="tv")
/profile        → ProfilePage
```

---

## 3. 컴포넌트 작성 규칙

```jsx
// ✅ 올바른 패턴
const Card = ({ id, type = 'movie', title, poster, badge, size = 'sm' }) => {
  const w = size === 'sm' ? 'w-[360px]' : 'w-[410px]'
  return (
    <Link to={`/${type}/${id}`} className={`${w} flex-shrink-0`}>
      <div className='relative aspect-[2/3] rounded-2xl overflow-hidden'>
        <img src={EP.img(poster)} alt={title} className='size-full object-cover' />
        {badge && badge !== '기본' && (
          <span className='absolute top-4 left-4 bg-secondary-400 text-secondary-900 text-sm font-bold px-3 py-1 rounded-full'>
            {badge}
          </span>
        )}
      </div>
      <h3 className='text-zinc-50 text-xl font-medium mt-3 truncate'>{title}</h3>
    </Link>
  )
}
export default Card
```

**금지 패턴:**

```jsx
// ❌ 인라인 스타일
<div style={{ width: '360px' }}>

// ❌ 하드코딩 색상 (토큰 사용)
<div className='bg-[#a78bfa]'>  // ❌
<div className='bg-primary-400'>  // ✅

// ❌ 컴포넌트 안에서 다른 컴포넌트 인라인 정의
const Page = () => {
  const InnerCard = ({ name }) => <div>{name}</div>  // ❌ 분리해야 함
}

// ❌ 페이지에서 GNB/Footer 직접 렌더
import GNB from '../components/GNB'  // ❌ Layout이 처리함
```

---

## 4. 주요 컴포넌트 props 상세

### Card

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `id` | number | 필수 | TMDB ID |
| `type` | `'movie'` \| `'tv'` | `'movie'` | 상세 페이지 라우팅용 |
| `title` | string | 필수 | 영화/TV 제목 |
| `poster` | string | null | TMDB poster_path |
| `genre` | string | '' | 장르 텍스트 |
| `badge` | string | '기본' | free/new/live/찜/개봉예정/curator/voda_only |
| `size` | `'sm'` \| `'md'` | `'sm'` | sm=360px, md=410px |

### Feed

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `type` | `'normal'` \| `'play'` \| `'rank'` | `'normal'` | 레이아웃 타입 |
| `title` | string | 필수 | 섹션 제목 |
| `link` | string | null | "전체보기" 링크 |
| `items` | array | [] | TMDB results 배열 |
| `mediaType` | `'movie'` \| `'tv'` | `'movie'` | Card에 전달할 type |

### Hero

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `type` | `'home'` \| `'detail'` \| `'person'` | `'home'` | 레이아웃 분기 |
| `title` | string | 필수 | 메인 타이틀 |
| `backdrop` | string | null | TMDB backdrop_path |
| `poster` | string | null | TMDB poster_path |
| `rating` | number | 0 | 평점 (0~10) |
| `year` | string | '' | 개봉년도 |
| `runtime` | number | 0 | 상영시간(분) |
| `overview` | string | '' | 줄거리 |
