## 중요 
ReviewCard.jsx를 만들어줘. author, content, rating, date를 props로 받아. bg-zinc-900/50 border border-white/5 rounded-2xl p-6. 상단 flex justify-between. 왼쪽 작성자 font-semibold text-zinc-50. 오른쪽 날짜 text-sm text-zinc-500. 중간 mt-3 별점 rating/2 기준 ★ 표시 text-primary-400 text-sm. 하단 mt-3 리뷰 text-zinc-300 text-sm line-clamp-3




# Gemini CLI 구현 프롬프트 — ReviewCard 컴포넌트

## 작업 정보
- **파일 경로**: `src/app/components/ReviewCard.jsx`
- **Figma URL**: https://www.figma.com/design/WuCbbYz4Djx6bxeAcXWEcg/VODA?node-id=40000040-7728&m=dev
- **참조 이미지**: `/src/imports/image.png` (기생충 리뷰 카드 예시)

---

## 컴포넌트 사양

### 파일명
`ReviewCard.jsx`

### Props
```javascript
{
  author: string,    // 작성자명 (예: "John Doe")
  content: string,   // 리뷰 본문 텍스트
  rating: number,    // 평점 (0~10, TMDB 기준)
  date: string       // 날짜 (예: "2024.03.15")
}
```

### 레이아웃 구조
```
┌─────────────────────────────────────────────┐
│  작성자명              날짜 (text-sm/zinc-500) │
│                                             │
│  ★★★★☆ (rating/2 별점, primary-400)          │
│                                             │
│  리뷰 내용 최대 3줄 (line-clamp-3)              │
│  zinc-300/text-sm                            │
└─────────────────────────────────────────────┘
```

### Tailwind 클래스 (Tailwind v4 기준)
```
외곽: bg-zinc-900/50 border border-white/5 rounded-2xl p-6
상단: flex justify-between items-center
  - 작성자: font-semibold text-zinc-50
  - 날짜: text-sm text-zinc-500
중간: mt-3 flex items-center gap-1
  - 별점: text-primary-400 text-sm
하단: mt-3 text-zinc-300 text-sm line-clamp-3
```

---

## 구현 예시 코드

```jsx
const ReviewCard = ({ author, content, rating, date }) => {
  // 별점 계산 (TMDB는 10점 만점이므로 2로 나눠 5점 만점으로 변환)
  const stars = Math.round(rating / 2)
  
  return (
    <div className='bg-zinc-900/50 border border-white/5 rounded-2xl p-6'>
      {/* 상단: 작성자와 날짜 */}
      <div className='flex justify-between items-center'>
        <h4 className='font-semibold text-zinc-50'>{author}</h4>
        <span className='text-sm text-zinc-500'>{date}</span>
      </div>
      
      {/* 중간: 별점 */}
      <div className='mt-3 flex items-center gap-1'>
        <span className='text-primary-400 text-sm'>
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </span>
      </div>
      
      {/* 하단: 리뷰 내용 */}
      <p className='mt-3 text-zinc-300 text-sm line-clamp-3'>
        {content}
      </p>
    </div>
  )
}

export default ReviewCard
```

---

## Gemini CLI 프롬프트

### 한국어 버전
```
CLAUDE.md를 읽어줘.
src/components/ReviewCard.jsx를 만들어줘.

- Figma 컴포넌트명: Review Card (Review_s + Review_f 통합)
- Figma URL: https://www.figma.com/design/WuCbbYz4Djx6bxeAcXWEcg/VODA?node-id=40000040-7728&m=dev
- props: { author, content, rating, date }
- Tailwind v4 + @theme 토큰 사용
- 완결된 코드로 제공해줘
- 새 패키지 설치하지 마

구조:
1. 외곽: bg-zinc-900/50 border border-white/5 rounded-2xl p-6
2. 상단 flex justify-between: 왼쪽 작성자 font-semibold text-zinc-50, 오른쪽 날짜 text-sm text-zinc-500
3. 중간 mt-3: 별점 표시 (rating/2 기준 ★ 5개 만점), text-primary-400 text-sm
4. 하단 mt-3: 리뷰 내용 text-zinc-300 text-sm line-clamp-3
```

### English Version
```
Read CLAUDE.md first.
Create src/components/ReviewCard.jsx.

- Figma component: Review Card (unified Review_s + Review_f)
- Figma URL: https://www.figma.com/design/WuCbbYz4Djx6bxeAcXWEcg/VODA?node-id=40000040-7728&m=dev
- Props: { author, content, rating, date }
- Use Tailwind v4 + @theme tokens
- Provide complete working code
- Do not install any new packages

Structure:
1. Container: bg-zinc-900/50 border border-white/5 rounded-2xl p-6
2. Top flex justify-between: author (font-semibold text-zinc-50) left, date (text-sm text-zinc-500) right
3. Middle mt-3: Star rating (rating/2 for 5-star scale), text-primary-400 text-sm
4. Bottom mt-3: Review content text-zinc-300 text-sm line-clamp-3
```

---

## 사용 예시

### AboutPage.jsx에서 사용
```jsx
import ReviewCard from '../components/ReviewCard'
import { EP } from '../api/tmdb'

const AboutPage = () => {
  const { data, loading } = useFetch(() => EP.detail('movie', 550), [])
  
  if (loading) return <p>로딩 중...</p>
  
  return (
    <>
      <Hero {...data} />
      <Synopsis {...data} />
      
      {/* 리뷰 섹션 */}
      <section className='px-20 py-12'>
        <h2 className='text-3xl font-bold text-zinc-50 mb-6'>리뷰</h2>
        <div className='grid grid-cols-2 gap-6'>
          {data.reviews.results.slice(0, 4).map(review => (
            <ReviewCard
              key={review.id}
              author={review.author}
              content={review.content}
              rating={review.author_details.rating || 0}
              date={review.created_at.slice(0, 10)}
            />
          ))}
        </div>
      </section>
    </>
  )
}
```

---

## 체크리스트

- [ ] 작성자와 날짜가 양쪽 끝에 정렬되어 있는가?
- [ ] 별점이 rating/2 기준으로 정확히 표시되는가?
- [ ] 리뷰 내용이 3줄 초과 시 생략되는가? (line-clamp-3)
- [ ] 배경이 bg-zinc-900/50이고 테두리가 border-white/5인가?
- [ ] Tailwind v4 @theme 토큰(primary-400, zinc-*)을 사용하는가?
- [ ] 인라인 스타일 style={{}}을 사용하지 않았는가?
- [ ] 임의값 [px값]을 사용하지 않았는가?
- [ ] 화살표 함수 + default export 형식인가?

---

## 관련 파일

- **CLAUDE.md**: 프로젝트 전체 컨벤션 및 규칙
- **components.md**: Figma→React 컴포넌트 매핑표
- **tmdb-api.md**: TMDB API 응답 구조 (reviews 필드)
- **rules.md**: 에러 분류 및 의존성 통제
- **SKILL.md**: 바이브 코딩 스킬 가이드
- **prompts.md**: 역할별 프롬프트 템플릿

---

## 디자인 토큰 참조 (index.css @theme)

```css
--color-primary-400: #A78BFA;
--color-zinc-50: #FAFAFA;
--color-zinc-300: #D4D4D8;
--color-zinc-500: #71717A;
--color-zinc-900: #18181B;
```

---

## TMDB API 응답 구조 (reviews)

```javascript
// EP.detail('movie', id) 응답의 reviews 필드
{
  reviews: {
    results: [
      {
        id: "abc123",
        author: "John Doe",
        content: "This movie is amazing! The cinematography...",
        created_at: "2024-03-15T10:30:00.000Z",
        author_details: {
          rating: 8,  // 10점 만점 (별 4개로 표시)
          username: "johndoe"
        }
      }
    ]
  }
}
```

---

## 최종 확인사항

1. **Figma 디자인 일치**: 참조 이미지(/src/imports/image.png)의 기생충 리뷰 카드와 시각적으로 일치하는가?
2. **props 누락 없음**: author, content, rating, date 4개 props 모두 사용되는가?
3. **Tailwind v4 준수**: 임의값 없이 표준 유틸리티 클래스만 사용하는가?
4. **코딩 컨벤션**: 2 spaces, 작은따옴표, 세미콜론 생략, 한국어 주석
5. **패키지 설치 안 함**: 기존 패키지만 사용 (FontAwesome 등)

---

## 추가 구현 (선택사항)

### variant prop 추가 (size 구분)
```jsx
const ReviewCard = ({ author, content, rating, date, size = 'sm' }) => {
  const stars = Math.round(rating / 2)
  const isLarge = size === 'lg'
  
  return (
    <div className={`bg-zinc-900/50 border border-white/5 rounded-2xl ${isLarge ? 'p-8' : 'p-6'}`}>
      {/* ... */}
    </div>
  )
}
```

### 더보기 버튼 (line-clamp 토글)
```jsx
const [expanded, setExpanded] = useState(false)

<p className={`mt-3 text-zinc-300 text-sm ${expanded ? '' : 'line-clamp-3'}`}>
  {content}
</p>
{content.length > 200 && (
  <button onClick={() => setExpanded(!expanded)} className='text-primary-400 text-xs mt-2'>
    {expanded ? '접기' : '더보기'}
  </button>
)}
```
