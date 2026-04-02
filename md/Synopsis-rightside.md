CLAUDE.md와 md/ 폴더의 모든 파일을 읽어줘.
오늘 CuratorNote 컴포넌트 작업을 시작한다.

---

# Task: src/components/CuratorNote.jsx 구현

## 피그마 기준 (노드 292:8993 — Right Side: Curator's Note & Quick Stats)

## 디자인 명세 (피그마 정확 수치)

### 전체 래퍼
- `flex flex-col gap-12 w-full`
- 우측 사이드 영역에 배치 (부모: flex gap-12, 좌측 Synopsis가 flex-1)

---

### 1. Curator's Note 카드 (상단)

**카드 래퍼**
- `bg-zinc-900 rounded-[36px] flex flex-col gap-9 px-12 pt-12 pb-12 w-full relative overflow-hidden`

**좌측 보라 세로 바**
- `absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500`
- 카드 왼쪽 가장자리에 full-height 세로 바

**인용문 텍스트**
- Pretendard Medium / text-3xl(30px) / text-white / leading-[40px]
- 큰따옴표로 시작/끝나는 여러 줄 인용문
- `whitespace-pre-wrap`

**출처 텍스트**
- `— THE ETHEREAL CURATOR`
- Pretendard SemiBold / text-xl(20px) / text-zinc-400 / tracking-[1.6px] / uppercase

---

### 2. Curator Rating 바 (하단)

**래퍼**
- `flex flex-col gap-6 px-3 w-full`

**라벨 + 점수 행**
- `flex items-center justify-between`
- 라벨 "Curator Rating": Pretendard Regular / text-xl(20px) / text-zinc-400
- 점수 "9.8/10": Pretendard Bold / text-3xl(30px) / text-secondary-500(#ec4899)

**프로그레스 바**
- 배경: `bg-[#25252d] h-1.5 rounded-full w-full overflow-hidden`
- 채움: `bg-secondary-500 h-full` — 너비는 `(rating / 10 * 100)%`

---

## Props 설계

\`\`\`jsx
<CuratorNote
  quote='"계급의 비극을 가장 현대적이고 세련된 미장센으로 풀어낸 마스터피스...'
  rating={9.8}    // 10점 만점 큐레이터 평점 (프로그레스 바 계산용)
/>
\`\`\`

## 작성 형식 (CLAUDE.md 컨벤션)

\`\`\`jsx
const CuratorNote = ({ quote, rating = 0 }) => {
  // 프로그레스 바 너비: rating/10 * 100 → 퍼센트
  const pct = Math.min((rating / 10) * 100, 100)

  return (
    <div className='flex flex-col gap-12 w-full'>

      {/* Curator's Note 카드 */}
      <div className='relative bg-zinc-900 rounded-[36px] flex flex-col gap-9 px-12 pt-12 pb-12 overflow-hidden'>
        {/* 좌측 보라 세로 바 */}
        <div className='absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500' />

        {/* 인용문 */}
        <p className='font-medium text-3xl text-white leading-[40px] whitespace-pre-wrap'>
          {quote}
        </p>

        {/* 출처 */}
        <p className='font-semibold text-xl text-zinc-400 tracking-[1.6px] uppercase'>
          — The Ethereal Curator
        </p>
      </div>

      {/* Curator Rating 바 */}
      <div className='flex flex-col gap-6 px-3 w-full'>
        <div className='flex items-center justify-between'>
          <span className='font-normal text-xl text-zinc-400'>Curator Rating</span>
          <span className='font-bold text-3xl text-secondary-500'>{rating}/10</span>
        </div>
        <div className='bg-[#25252d] h-1.5 rounded-full w-full overflow-hidden'>
          <div
            className='bg-secondary-500 h-full rounded-full'
            style={{ width: `${pct}%` }}  {/* ← 동적 너비는 인라인 스타일 예외 허용 */}
          />
        </div>
      </div>
    </div>
  )
}

export default CuratorNote
\`\`\`

## 사용 예시

\`\`\`jsx
// AboutPage.jsx 에서
import CuratorNote from '../components/CuratorNote'

// 피그마 기준 우측 사이드에 배치
<div className='flex gap-12 px-20 w-full'>
  <Synopsis ... />                  {/* 좌측 flex-1 */}
  <div className='w-144 shrink-0'> {/* 우측 고정폭 w-144(576px) */}
    <CuratorNote
      quote='"계급의 비극을 가장 현대적이고 세련된 미장센으로 풀어낸 마스터피스. 봉준호 감독의 카메라는 지하와 지상을 넘나들며 우리가 외면하고 싶었던 사회적 냄새를 집요하게 추적합니다."'
      rating={9.8}
    />
  </div>
</div>
\`\`\`

## 요구사항
1. quote prop은 큰따옴표 포함 문자열 그대로 렌더 (이스케이프 불필요)
2. rating 프로그레스 바 너비: `(rating / 10 * 100)%` — Math.min으로 100% 초과 방지
3. 프로그레스 바 동적 너비만 인라인 style 예외 허용 — 나머지 모두 Tailwind 토큰
4. 좌측 보라 세로 바: absolute 배치, top-0 bottom-0 left-0 w-1.5 bg-primary-500
5. 카드 overflow-hidden 필수 (세로 바가 카드 밖으로 나가지 않도록)
6. @theme 토큰 사용: primary-500, secondary-500, zinc-900, zinc-400
7. 하드코딩 색상값 금지 — 단, #25252d (바 배경)은 @theme에 없으면 @theme에 정의 후 사용

## 공통 규칙 (매 작업마다 준수)
- 새 패키지 설치하지 마
- 기존 패키지 버전 변경하지 마
- BrowserRouter / Routes / Route 절대 사용 금지
- loader / action 함수 작성 금지
- 데이터 로딩은 useFetch 훅으로만 처리
- Layout이 GNB/Footer 처리하므로 페이지에서 렌더하지 않음
- 완결된 코드로 제공해줘