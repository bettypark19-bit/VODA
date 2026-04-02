CLAUDE.md와 .claude/skills/voda-vibe 안에 있는 md 파일들을 읽어줘.
오늘 DirectorCard 컴포넌트 작업을 시작한다.

---

# Task: src/components/DirectorCard.jsx 구현

## 피그마 기준 (노드 368:7840 — Focus 섹션의 감독 기획전 카드)
## Figma 컴포넌트명: Background+Border (Focus 내부 카드)
## components.md 매핑: 해당 없음 → 신규 컴포넌트

---

## 디자인 명세 (피그마 정확 수치)

### 전체 카드 래퍼
- `bg-[#19191f] border border-white/5 rounded-[36px] p-[49.5px]`
- `relative overflow-hidden flex flex-col justify-center w-full`
- 피그마 실제 크기: 945×408px 기준

---

### 레이어 구조 (뒤 → 앞 순서)

**① 배경 노이즈 패턴 (opacity-5)**
- 전체 inset 절대 배치 / `opacity-5`
- 피그마 에셋 SVG 패턴 이미지

**② 우측 영화 카메라 이미지 (우측 절대 배치)**
- `absolute right-0 top-0 bottom-0 w-1/2`
- 배경: `bg-zinc-500` / 카메라 이미지: `opacity-20 object-cover`
- 전체 opacity-40, rounded-bl-[36px] rounded-tl-[36px]

**③ 텍스트 컨텐츠 (relative, 좌측 절대 배치)**
- 전체: `flex flex-col items-start w-full`

**라벨 "DIRECTOR INSIGHT"**
- `text-[#ff67ad]` / Pretendard Bold / text-lg(18px) / tracking-[1.6px] / uppercase

**제목**
- Pretendard Medium / text-6xl(60px) / text-white / leading-[60px]

**설명 텍스트**
- Pretendard Medium / text-2xl(24px) / `text-[#acaab1]` / leading-[36px]
- max-w 672px / whitespace-pre-wrap / py-6

**CTA 버튼 "기획전 보기"**
- `bg-white text-black rounded-full px-12 py-[18px]`
- Pretendard Medium / text-2xl / text-center

---

## Props 설계

\`\`\`jsx
<DirectorCard
  label='Director Insight'     // 상단 라벨 (기본값)
  title='박찬욱의 미장센'        // 기획전 제목
  desc='대칭의 미학, 폭력의 시적 표현. 한국 영화를 세계로 알린 거장의 발자취를 따라가 봅니다.'
  btnText='기획전 보기'          // CTA 버튼 텍스트
  to='/find?curator=parkwook'  // 버튼 클릭 시 이동 경로 (Link)
/>
\`\`\`

## 작성 형식 (CLAUDE.md 컨벤션)

\`\`\`jsx
import { Link } from 'react-router'

// 피그마 에셋 (배경 패턴 + 카메라 이미지)
const imgPattern = 'https://www.figma.com/api/mcp/asset/7da6e699-02b8-4793-b830-9377eb7c49d7'
const imgCamera  = 'https://www.figma.com/api/mcp/asset/9937d1f4-37ae-41f2-8172-de36814010a8'

const DirectorCard = ({
  label = 'Director Insight',
  title,
  desc,
  btnText = '기획전 보기',
  to = '/find',
}) => {
  return (
    <div className='relative overflow-hidden bg-[#19191f] border border-white/5 rounded-[36px] p-12 flex flex-col justify-center w-full'>

      {/* ① 배경 노이즈 패턴 (opacity-5) */}
      <div className='absolute inset-0 opacity-5 pointer-events-none'>
        <img src={imgPattern} alt='' className='size-full object-cover' />
      </div>

      {/* ② 우측 카메라 이미지 */}
      <div className='absolute right-0 top-0 bottom-0 w-1/2 opacity-40 rounded-bl-[36px] rounded-tl-[36px] overflow-hidden'>
        <div className='relative size-full bg-zinc-500'>
          <img src={imgCamera} alt='' className='absolute size-full object-cover opacity-20' />
        </div>
      </div>

      {/* ③ 텍스트 컨텐츠 */}
      <div className='relative flex flex-col items-start'>
        {/* 라벨 */}
        <p className='font-bold text-lg text-[#ff67ad] tracking-[1.6px] uppercase leading-6'>
          {label}
        </p>

        {/* 제목 */}
        <h3 className='font-medium text-6xl text-white leading-[60px] py-3'>
          {title}
        </h3>

        {/* 설명 */}
        <p className='font-medium text-2xl text-[#acaab1] leading-9 max-w-xl py-6 whitespace-pre-wrap'>
          {desc}
        </p>

        {/* CTA 버튼 */}
        <Link
          to={to}
          className='bg-white text-black font-medium text-2xl text-center rounded-full px-12 py-[18px] leading-9'
        >
          {btnText}
        </Link>
      </div>
    </div>
  )
}

export default DirectorCard
\`\`\`

## 사용 예시

\`\`\`jsx
// PersonPage.jsx 또는 AboutPage.jsx 의 Focus 섹션에서
import DirectorCard from '../components/DirectorCard'

<DirectorCard
  label='Director Insight'
  title='박찬욱의 미장센'
  desc='대칭의 미학, 폭력의 시적 표현. 한국 영화를 세계로 알린 거장의 발자취를 따라가 봅니다.'
  btnText='기획전 보기'
  to='/find?curator=parkwook'
/>
\`\`\`

## 요구사항
1. 카드 전체 `overflow-hidden` 필수 — 카메라 이미지가 카드 밖으로 나가지 않도록
2. 우측 카메라 영역: `w-1/2` 고정, opacity-40, bg-zinc-500 위에 카메라 이미지 opacity-20 겹침
3. 배경 패턴: `opacity-5` absolute 전체 inset 배치
4. 라벨 색상 `text-[#ff67ad]` — @theme에 없으면 `secondary-300` 또는 @theme에 직접 정의
5. 설명 텍스트 색상 `text-[#acaab1]` — @theme에 없으면 zinc-400 근사값 사용 또는 @theme 정의
6. CTA 버튼은 `<Link>` 사용 (react-router) — 외부 href가 아님
7. 인라인 스타일 style={{}} 절대 금지
8. Tailwind 임의값 [px값] 하드코딩 금지 — 표준 유틸리티 클래스 우선, 없으면 @theme 토큰 정의
9. 컴포넌트 내부에 다른 컴포넌트 인라인 정의 금지
10. 피그마 에셋 URL은 7일 후 만료됨 — public/ 폴더에 복사하거나 임시 사용 명시

## 공통 규칙 (매 작업마다 준수)
- 새 패키지 설치하지 마
- 기존 패키지 버전 변경하지 마
- BrowserRouter / Routes / Route 절대 사용 금지
- loader / action 함수 작성 금지
- 데이터 로딩은 useFetch 훅으로만 처리
- Layout이 GNB/Footer 처리하므로 페이지에서 렌더하지 않음
- 완결된 코드로 제공해줘