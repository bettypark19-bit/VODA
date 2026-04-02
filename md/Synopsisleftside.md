## 중요
Synopsis.jsx를 만들어줘. text, genres, date, runtime을 props로 받아. 좌우 flex gap-12. 왼쪽 flex-1: '시놉시스' text-xl font-bold mb-4. 줄거리 text-zinc-300 leading-relaxed. 3줄 초과 시 line-clamp-3 + '더보기' 버튼(useState 토글). 오른쪽 w-140 bg-zinc-900/50 rounded-2xl p-8: 장르/출시일/러닝타임 grid grid-cols-2 gap-y-4 gap-x-8. 라벨 text-sm text-zinc-500, 값 text-sm text-zinc-200




CLAUDE.md와 md/ 폴더의 모든 파일을 읽어줘.
오늘 Synopsis 컴포넌트 작업을 시작한다.

---

# Task: src/components/Synopsis.jsx 구현

## 피그마 기준 (Left Side: Synopsis & Info 노드 292:8769)

### 전체 구조
- `flex flex-col gap-24 w-full`
- 상단: 시놉시스 섹션
- 하단: 정보 그리드 섹션

---

## 디자인 명세 (피그마 정확 수치)

### 1. 시놉시스 섹션 (상단)
- `flex flex-col gap-6 w-full`

**섹션 타이틀 "시놉시스"**
- Pretendard Bold / text-3xl(30px) / text-zinc-50 / opacity-60 / uppercase

**본문 텍스트**
- Pretendard Medium / text-3xl(30px) / text-zinc-300(#d4d4d8) / leading-[40px]
- 기본: `line-clamp-4` (h-[160px] overflow-hidden)
- 펼침: 전체 표시
- useState로 토글

**"더보기" 버튼**
- `flex items-center gap-2`
- 텍스트: Pretendard Medium / text-2xl / text-primary-400
- 우측에 ▼ 화살표 아이콘 (w-[14px] h-[10px])
- 펼치면 "접기 ▲"로 텍스트 변경

### 2. 정보 그리드 섹션 (하단)
- `grid grid-cols-3 gap-x-9 gap-y-15`
- 총 3행: 1행(장르/국가/개봉연도), 2행(러닝타임/감독/제작사), 3행(출연 — col-span-3)

**각 정보 셀 구조**
- `flex flex-col gap-3`
- 라벨: Pretendard Medium / text-lg(18px) / `text-white/50` / tracking-[0.8px] / uppercase
- 값: Pretendard Medium / text-2xl(24px) / text-zinc-200(#e4e4e7) / leading-[36px]
- 감독만 예외: 값 색상 `text-primary-400` (클릭 시 감독 상세 페이지로 이동 — Link 사용)

---

## Props 설계

\`\`\`jsx
<Synopsis
  overview='전원 백수로 살 길 막막하지만...'  // 줄거리 전체 텍스트
  genres={[{ id: 18, name: '드라마' }]}       // TMDB genres 배열
  country='대한민국'                           // 제작 국가
  year='2019'                                 // 개봉 연도
  runtime={132}                               // 러닝타임 (분)
  director={{ id: 1234, name: '봉준호' }}     // 감독 정보 { id, name }
  company='바른손이앤에이'                     // 제작사
  cast={['송강호', '이선균', '조여정']}        // 출연 배우 배열
/>
\`\`\`

## TMDB 데이터 연결 포인트

\`\`\`js
// EP.detail(type, id) 응답에서 추출
const director = data.credits.crew.find(c => c.job === 'Director')
const cast = data.credits.cast.slice(0, 7).map(c => c.name)
const company = data.production_companies?.[0]?.name ?? ''
const country = data.production_countries?.[0]?.name ?? ''
const year = (data.release_date ?? data.first_air_date ?? '').slice(0, 4)
\`\`\`

## 작성 형식 (CLAUDE.md 컨벤션)

\`\`\`jsx
import { useState } from 'react'
import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

const Synopsis = ({ overview, genres, country, year, runtime, director, company, cast }) => {
  const [expanded, setExpanded] = useState(false)

  // 장르 배열을 "드라마, 스릴러" 형태로 변환
  const genreText = genres?.map(g => g.name).join(', ') ?? ''
  // 출연진 배열을 "송강호, 이선균, ..." 형태로 변환
  const castText = cast?.join(', ') ?? ''

  return (
    <div className='flex flex-col gap-24 w-full'>

      {/* 시놉시스 섹션 */}
      <div className='flex flex-col gap-6'>
        <h2 className='font-bold text-3xl text-zinc-50 opacity-60 uppercase'>시놉시스</h2>
        <div className='flex flex-col gap-3'>
          <p className={`font-medium text-3xl text-zinc-300 leading-[40px] ${expanded ? '' : 'line-clamp-4'}`}>
            {overview}
          </p>
          <button
            onClick={() => setExpanded(prev => !prev)}
            className='flex items-center gap-2 text-primary-400 text-2xl font-medium w-fit'
          >
            {expanded ? '접기' : '더보기'}
            <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} className='w-3.5 h-2.5' />
          </button>
        </div>
      </div>

      {/* 정보 그리드 */}
      <div className='grid grid-cols-3 gap-x-9 gap-y-15'>
        {/* 1행 */}
        <InfoCell label='장르' value={genreText} />
        <InfoCell label='국가' value={country} />
        <InfoCell label='개봉 연도' value={year} />

        {/* 2행 */}
        <InfoCell label='러닝타임' value={runtime ? `${runtime}분` : ''} />
        <div className='flex flex-col gap-3'>
          <span className='font-medium text-lg text-white/50 tracking-[0.8px] uppercase'>감독</span>
          {/* 감독은 primary-400 + Link */}
          {director?.id
            ? <Link to={`/person/${director.id}`} className='font-medium text-2xl text-primary-400 leading-9'>{director.name}</Link>
            : <span className='font-medium text-2xl text-zinc-200 leading-9'>{director?.name}</span>
          }
        </div>
        <InfoCell label='제작사' value={company} />

        {/* 3행 — 출연 (col-span-3) */}
        <div className='col-span-3 flex flex-col gap-3'>
          <span className='font-medium text-lg text-white/50 tracking-[0.8px] uppercase'>출연</span>
          <p className='font-medium text-2xl text-zinc-200 leading-9'>{castText}</p>
        </div>
      </div>
    </div>
  )
}

// 반복 정보 셀 — 내부용 헬퍼 컴포넌트
const InfoCell = ({ label, value }) => (
  <div className='flex flex-col gap-3'>
    <span className='font-medium text-lg text-white/50 tracking-[0.8px] uppercase'>{label}</span>
    <span className='font-medium text-2xl text-zinc-200 leading-9'>{value}</span>
  </div>
)

export default Synopsis
\`\`\`

## 사용 예시

\`\`\`jsx
// AboutPage.jsx 에서
import Synopsis from '../components/Synopsis'

// EP.detail(type, id) 응답 data 기준
const director = data.credits.crew.find(c => c.job === 'Director')
const cast = data.credits.cast.slice(0, 7).map(c => c.name)

<Synopsis
  overview={data.overview}
  genres={data.genres}
  country={data.production_countries?.[0]?.name ?? ''}
  year={(data.release_date ?? data.first_air_date ?? '').slice(0, 4)}
  runtime={data.runtime ?? data.episode_run_time?.[0]}
  director={director ? { id: director.id, name: director.name } : null}
  company={data.production_companies?.[0]?.name ?? ''}
  cast={cast}
/>
\`\`\`

## 요구사항
1. overview 3줄 초과 시 line-clamp-4 + "더보기" 버튼 — useState 토글
2. 펼치면 "접기 ▲" 로 버튼 텍스트 변경
3. 감독 셀: text-primary-400 + Link to={`/person/${director.id}`}
4. genres 배열 → `name` 필드 join(', ')으로 변환
5. cast 배열 → join(', ')으로 변환
6. runtime은 숫자(분)을 받아 `${runtime}분` 형태로 표시
7. props 없을 때 빈 문자열 폴백 처리 (`?? ''`)
8. InfoCell은 파일 내부 헬퍼 컴포넌트로 분리 (export 하지 않음)
9. 인라인 스타일 style={{}} 절대 금지
10. Tailwind 임의값 [px값] 하드코딩 금지 — 표준 유틸리티 클래스 사용, 없으면 @theme 토큰 정의
11. 하드코딩 색상값 금지 — primary-400, zinc-300 등 @theme 토큰 사용

## 공통 규칙 (매 작업마다 준수)
- 새 패키지 설치하지 마
- 기존 패키지 버전 변경하지 마
- 인라인 스타일 style={{}} 금지
- BrowserRouter / Routes / Route 절대 사용 금지
- loader / action 함수 작성 금지
- 데이터 로딩은 useFetch 훅으로만 처리
- Layout이 GNB/Footer 처리하므로 페이지에서 렌더하지 않음
- 완결된 코드로 제공해줘