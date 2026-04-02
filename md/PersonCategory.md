CLAUDE.md 파일을 읽어줘. voda-vibe 폴더 안의 모든 파일도 읽어줘.
오늘 작업: PersonCategoryPage.jsx 리팩터
새 패키지 설치하지 마.
아래 두 파일을 열어서 현재 상태를 알려줘.

1. src/pages/PersonCategoryPage.jsx — 현재 코드 구조 확인
2. src/components/PersonCard.jsx — props 목록 확인 (id, name, role, photo, movies 등)

코드 수정하지 말고 현재 상태만 보고해줘.

src/pages/PersonCategoryPage.jsx 파일을 리팩터해줘.

[역할]
감독/출연 전체 목록 페이지.
EP.personPopular() 데이터를 5열 그리드로 표시한다.

[import]
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import useFetch from '../hooks/useFetch'
import { EP } from '../api/tmdb'
import PersonCard from '../components/PersonCard'

※ PersonCard의 실제 props는 STEP 1에서 확인한 것을 기준으로 맞춰줘.

[데이터 로딩]
useFetch(() => EP.personPopular(), []) 훅으로 { data, loading, err } 반환받기.

[UI 구조]
최상위 div: min-h-screen bg-zinc-950 px-16 py-10

1) 상단 헤더 (flex items-center gap-4 mb-10)
   - 뒤로가기 버튼
     button onClick={() => navigate(-1)}
     text-zinc-400 hover:text-zinc-50 transition-colors
     aria-label='뒤로가기'
     아이콘: FontAwesome faArrowLeft className='text-xl'
   - 제목: h1 '감독/출연' text-zinc-50 text-2xl font-bold

2) 로딩 상태
   loading이 true면: p '로딩 중...' text-zinc-400 text-center py-20

3) 에러 상태
   err가 있으면: p '데이터를 불러오지 못했습니다.' text-red-400 text-center py-20

4) 인물 그리드
   data가 있으면:
   div grid grid-cols-5 gap-6
   data.results.map(person =>
     <PersonCard
       key={person.id}
       id={person.id}
       name={person.name}
       role={person.known_for_department}
       photo={person.profile_path}
       movies={person.known_for ?? []}
     />
   )

[규칙]
- GNB / Footer 렌더 금지 (App.jsx Layout이 처리)
- 인라인 style={{}} 금지
- 임의값 [px값] 금지
- 세미콜론 생략, 작은따옴표, 2칸 들여쓰기
- export default PersonCategoryPage

src/router/index.jsx 파일을 열어서 아래 경로가 있는지 확인해줘.

{ path: '/person/category', element: <PersonCategoryPage /> }

없으면 children 배열 안 /person/:id 보다 위에 추가해줘.
(⚠️ /person/category 가 /person/:id 보다 반드시 먼저 와야 라우팅이 정상 작동함)

import PersonCategoryPage from '../pages/PersonCategoryPage' 도 상단에 추가해줘.

방금 수정한 PersonCategoryPage.jsx를 검토해줘.

확인 항목:
1. import 경로가 모두 맞는지
2. PersonCard에 넘기는 props가 실제 PersonCard.jsx의 props와 일치하는지
3. grid-cols-5 gap-6 이 표준 클래스인지 (임의값 없는지)
4. useFetch 훅 사용 패턴이 다른 페이지와 동일한지
5. GNB / Footer가 페이지 안에 없는지
6. 세미콜론 없는지, 작은따옴표 사용했는지

문제 있으면 해당 부분만 수정해줘. 새 패키지 설치하지 마.

이 에러를 해결해줘:
[여기에 에러 메시지 전체 붙여넣기]

먼저 아래 3가지 중 어디에 해당하는지 분류해줘:
1. 코드 에러 (오타, import 경로, props 불일치)
2. 환경 에러 (.env 누락, node_modules, 경로 착각)
3. API 에러 (TMDB 키, 엔드포인트, 응답 구조)

분류 후에만 수정해줘.
새 패키지 설치하지 마. 기존 패키지 버전 변경하지 마.