CLAUDE.md와 .claude/skills/voda-vibe 폴더의 md 파일을 읽어줘.
오늘 FocusCard 컴포넌트 작업을 시작한다.

---

# Task: src/components/FocusCard.jsx 구현

## 피그마 기준 (노드 368:7822 — Overlay+Border, Focus 섹션 카드)
## Figma 컴포넌트명: Overlay+Border
## 사용 위치: PersonPage > Focus 섹션

---

## 디자인 명세 (피그마 정확 수치)

### 전체 카드 래퍼
- `bg-primary-950 border border-[rgba(189,157,255,0.2)] rounded-[36px] p-[49.5px]`
- `flex flex-col items-start justify-between w-full h-full`
- 피그마 색상: bg `#2e1065` (primary-950), 테두리 `rgba(189,157,255,0.2)`

---

### 상단 텍스트 블록
- `flex flex-col w-full` / 상대 높이 216px

**제목**
- Pretendard Medium / text-4xl(36px) / text-white / leading-[48px]
- top-[84px] absolute 배치 (카드 내부 기준)

**설명 텍스트**
- Pretendard Medium / text-2xl(24px) / `text-[#acaab1]` / leading-[36px]
- top-[144px] absolute 배치
- 두 줄 고정 텍스트

---

### 하단 아바타 스택
- `flex items-start` / 아바타끼리 `-mr-[18px]` 겹침 효과
- 아바타 개수: 3개 실제 이미지 + 1개 "+N" 카운터

**개별 아바타**
- `size-[60px] rounded-full overflow-hidden`
- 테두리: `border-3 border-[#0e0e13]` (배경과 같은 색으로 분리감 표현)
- 내부 padding: `p-[3px]`
- 각 아바타는 `-mr-[18px]`로 겹침

**"+N" 카운터 아바타 (마지막)**
- `size-[60px] rounded-full bg-[#25252d] border-3 border-[#0e0e13]`
- 텍스트: Manrope Regular / text-[15px] / text-white / text-center

---

## Props 설계

\`\`\`jsx
<FocusCard
  title='신인 발굴'
  desc='VODA가 예측하는 2026년 최고의 루키들을 소개합니다.'
  avatars={[                          // 표시할 인물 배열 (최대 3개 이미지 표시)
    { id: 1, photo: '/path/img1.jpg', name: '배우1' },
    { id: 2, photo: '/path/img2.jpg', name: '배우2' },
    { id: 3, photo: '/path/img3.jpg', name: '배우3' },
  ]}
  totalCount={15}                     // 전체 인원 수 (+N 계산용)
  to='/person/category?type=rookie'   // 카드 클릭 시 이동 경로
/>
\`\`\`

## TMDB 데이터 연결 포인트

\`\`\`js
// PersonPage.jsx에서 personTrending 데이터로 구성
// avatars: EP.personTrending('day').results.slice(0, 3)
// totalCount: EP.personTrending('day').total_results
// EP.img(person.profile_path, 'w185') 로 이미지 URL 생성
\`\`\`

## 작성 형식 (CLAUDE.md 컨벤션)

\`\`\`jsx
import { Link } from 'react-router'
import { EP } from '../api/tmdb'

const FocusCard = ({ title, desc, avatars = [], totalCount = 0, to = '/person' }) => {
  // 표시할 아바타: 최대 3개
  const shown = avatars.slice(0, 3)
  // "+N" 카운터: 전체 인원 - 표시 아바타 수
  const extra = Math.max(totalCount - shown.length, 0)

  return (
    <Link
      to={to}
      className='bg-primary-950 border border-[rgba(189,157,255,0.2)] rounded-[36px] p-12 flex flex-col items-start justify-between w-full h-full'
    >
      {/* 상단: 제목 + 설명 */}
      <div className='flex flex-col gap-3 w-full'>
        <h3 className='font-medium text-4xl text-white leading-[48px]'>
          {title}
        </h3>
        <p className='font-medium text-2xl text-[#acaab1] leading-9'>
          {desc}
        </p>
      </div>

      {/* 하단: 아바타 스택 */}
      <div className='flex items-center'>
        {shown.map((person, idx) => (
          <div
            key={person.id ?? idx}
            className='size-[60px] rounded-full border-[3px] border-[#0e0e13] overflow-hidden shrink-0 -mr-[18px]'
          >
            <img
              src={EP.img(person.photo, 'w185') ?? '/placeholder.png'}
              alt={person.name}
              className='size-full object-cover'
            />
          </div>
        ))}

        {/* "+N" 카운터 */}
        {extra > 0 && (
          <div className='size-[60px] rounded-full bg-[#25252d] border-[3px] border-[#0e0e13] flex items-center justify-center shrink-0 -mr-[18px]'>
            <span className='font-normal text-[15px] text-white text-center leading-[22.5px]'>
              +{extra}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default FocusCard
\`\`\`

## 사용 예시

\`\`\`jsx
// PersonPage.jsx 에서
import FocusCard from '../components/FocusCard'
import { EP } from '../api/tmdb'
import useFetch from '../hooks/useFetch'

const PersonPage = () => {
  const { data, loading } = useFetch(() => EP.personTrending('day'), [])

  if (loading) return <p className='text-zinc-400 p-12'>로딩 중...</p>

  const avatars = data.results.slice(0, 3).map(p => ({
    id: p.id,
    photo: p.profile_path,
    name: p.name,
  }))

  return (
    <div>
      {/* Focus 섹션 */}
      <FocusCard
        title='신인 발굴'
        desc='VODA가 예측하는 2026년 최고의 루키들을 소개합니다.'
        avatars={avatars}
        totalCount={data.total_results}
        to='/person/category?type=rookie'
      />
    </div>
  )
}
\`\`\`

## 요구사항
1. 아바타 최대 3개 표시, 나머지는 "+N" 카운터로 표시
2. 아바타 겹침: `-mr-[18px]` — 마지막 아바타는 mr 없음 (부모 flex가 처리)
3. 테두리 색 `border-[#0e0e13]` — 카드 배경(#0e0e13)과 맞춰 아바타 분리감 표현
4. 카드 전체가 `<Link>` — 클릭 시 to prop 경로로 이동
5. photo가 null이면 `/placeholder.png` 폴백
6. EP.img(photo, 'w185') 사용 (프로필 이미지 추천 크기)
7. 인라인 스타일 style={{}} 절대 금지
8. Tailwind 임의값 [px값] — border, size처럼 표준 클래스 없는 경우만 허용, 나머지는 @theme 토큰 정의
9. 하드코딩 색상 중 primary-950은 @theme 토큰 사용, #acaab1 / #25252d / #0e0e13은 없으면 @theme에 정의
10. 컴포넌트 내 다른 컴포넌트 인라인 정의 금지

## 공통 규칙 (매 작업마다 준수)
- 새 패키지 설치하지 마
- 기존 패키지 버전 변경하지 마
- BrowserRouter / Routes / Route 절대 사용 금지
- loader / action 함수 작성 금지
- 데이터 로딩은 useFetch 훅으로만 처리
- Layout이 GNB/Footer 처리하므로 페이지에서 렌더하지 않음
- 완결된 코드로 제공해줘