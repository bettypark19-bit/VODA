SearchBar.jsx 리액트 컴포넌트를 다음 요구사항대로 만들어줘:

컴포넌트 기본 설정:
- 컴포넌트 이름: SearchBar
- Figma: Search Bar Short (2v: AI/normal)
- Props: variant ('normal' 또는 'ai'), onSubmit (콜백 함수)
- useState로 입력값 관리
- FontAwesome 아이콘: @fortawesome/free-solid-svg-icons에서 faMagnifyingGlass, faStar 임포트
- @fortawesome/react-fontawesome에서 FontAwesomeIcon 임포트

스타일링 (Tailwind v4 + @theme 토큰 사용):
- 최상위 form 태그: max-w-3xl mx-auto (가운데 정렬)
- 내부 검색 바 div: backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-3
- flex items-center gap-3로 아이콘과 input 가로 배치

아이콘 동작:
- variant='normal'일 때: faMagnifyingGlass 아이콘
- variant='ai'일 때: faStar 아이콘으로 변경
- 아이콘 스타일: text-white/70

Input 필드:
- 클래스: bg-transparent outline-none text-white w-full placeholder-zinc-400
- placeholder: variant='normal'이면 "Search...", variant='ai'면 "AI에게 물어보세요"
- controlled input으로 state 연결

폼 제출:
- form의 onSubmit 이벤트로 엔터키 처리
- preventDefault() 호출
- 입력값이 비어있지 않으면 (trim 후 확인) onSubmit prop 호출하고 입력값 전달

추가 규칙:
- 인라인 스타일 style={{}} 사용 금지
- @theme 토큰 사용 (하드코딩 색상 금지)
- default export로 내보내기
- 들여쓰기 2칸, 세미콜론 생략, 작은따옴표 사용