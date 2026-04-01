---
name: voda-vibe
description: "VODA OTT 프로젝트 바이브 코딩 스킬. 팀원이 Gemini CLI 또는 Claude Code로 컴포넌트 생성, TMDB API 연동, 페이지 조립, 에러 수정을 요청할 때 사용한다. 'VODA', '컴포넌트 만들어', 'TMDB 연동', '페이지 조립', '에러 수정', 'Figma 변환', '카드 컴포넌트', 'Feed', '바이브 코딩' 등의 키워드가 포함된 요청에서 반드시 트리거한다. 팀원 숙련도가 디자인 80%/코딩 20%이므로, 코드는 반드시 완결된 형태로 제공하고 설명은 비유 기반으로 한다."
---

# VODA 바이브 코딩 스킬

## 이 스킬을 쓰는 사람

- 디자인 80% / 코딩 20% 숙련도의 KDT 수강생 4인
- Gemini CLI(주) + Claude Code(보조)로 바이브 코딩한다
- **외운 절차로 작업한다. 이해해서 하는 게 아니다.**
- 디버깅에 몰입하면 AI가 제안하는 의존성 변경을 무의식적으로 실행한다

## 핵심 원칙 3개

1. **이해보다 습관 먼저** — 왜 이렇게 하는지 길게 설명하지 않는다. "이렇게 해라"를 먼저 주고, 이유는 한 줄 코멘트로 붙인다.
2. **변수만 바꾸면 누구나 사용** — 프롬프트 템플릿의 `[변수]`만 실제 값으로 바꾸면 동작한다.
3. **AI가 에러를 분류한 뒤에 고친다** — 새 패키지 설치는 어떤 에러의 해결책도 아니다.

## 멘탈 모델 (비유)

팀원에게 설명할 때 이 비유를 사용한다:

| 개념 | 비유 |
|------|------|
| npm install | 앱스토어에서 앱 설치. 이미 설치된 앱으로만 작업한다 |
| API 호출 | 식당 주문. 메뉴(endpoint)에 있는 것만 주문 가능 |
| 모노레포 | 같은 건물 다른 층. frontend는 2층, backend는 3층. 1층(루트)에서 npm 치면 엉뚱한 층에 설치됨 |
| 컴포넌트 | 레고 블록. Card는 작은 블록, Feed는 큰 블록, 페이지는 블록을 쌓은 결과 |
| props | 주문서. 같은 레고 블록이어도 주문서(props)에 따라 색이 다르다 |

## 스택 고정

| 기술 | 버전 | 비고 |
|------|------|------|
| React | 19 | |
| Vite | 7 | |
| Tailwind CSS | v4 | `@import "tailwindcss"` + `@theme` 블록. tailwind.config.js 없음 |
| React Router | v7 | |
| Axios | latest | `src/api/axios.js` 인스턴스 |
| FontAwesome | latest | 아이콘 |
| tailwind-merge | latest | 조건부 클래스 |
| FastAPI | latest | 백엔드 |

**허용 목록 외 패키지 설치 절대 금지.**

## 작업 유형별 흐름

### 1. 컴포넌트 생성

→ `references/components.md` 읽기

1. Figma 컴포넌트명 확인
2. React 컴포넌트 매핑 표에서 대응 찾기
3. props 정의 → JSX 작성 → Tailwind 클래스 적용
4. `@theme` 토큰(primary-400, secondary-400 등) 사용 확인
5. 파일을 `src/components/`에 저장

### 2. TMDB API 연동

→ `references/tmdb-api.md` 읽기

1. `src/api/tmdb.js`의 EP 객체에서 필요한 함수 확인
2. `useFetch` 훅으로 데이터 로딩
3. `EP.img(path)` 헬퍼로 이미지 URL 생성
4. 로딩/에러 상태 처리

### 3. 페이지 조립

→ `references/components.md`에서 페이지 구성 패턴 확인

1. 해당 페이지의 Figma 구조 확인 (Hero + Feed 스태킹)
2. 필요한 컴포넌트 import
3. useFetch로 TMDB 데이터 연결
4. Layout(GNB+Footer+ChatBtn)은 App.jsx에서 감싸므로 페이지에서 렌더하지 않음

### 4. 에러 수정

→ `references/rules.md` 읽기

**반드시 먼저 분류한다:**
- 코드 에러 (오타, import, props) → 해당 파일만 수정
- 환경 에러 (node_modules, .env, 경로) → 터미널 명령으로 해결
- API 에러 (네트워크, 키, 응답) → console.log로 응답 먼저 확인

**절대 하지 않는 것:**
- 새 패키지 설치
- 기존 패키지 버전 변경
- 다른 라이브러리로 교체

### 5. 프롬프트 사용

→ `references/prompts.md` 읽기

팀원 역할(A/B/C)에 맞는 프롬프트 템플릿을 선택하고, `[변수]`만 실제 값으로 교체한다.

## 코드 컨벤션

- 들여쓰기 2칸, 세미콜론 생략, 작은따옴표
- 식별자 짧게: `res`, `uid`, `idx`, `img`
- 인라인 스타일 `style={{}}` 금지
- 장식적 CSS 금지 (그라데이션은 Figma 시안에 있는 것만)
- 커밋 접두어: `feat` / `fix` / `docs` 3개만
- 한국어 주석, 한국어 응답

## 파일 구조

```
frontend/src/
├── api/          tmdb.js, axios.js
├── hooks/        useFetch.js
├── components/   공용 컴포넌트 25개
├── pages/        페이지 컴포넌트 9개
├── App.jsx       라우팅
├── main.jsx
└── index.css     @theme 토큰
```

## 참조 파일 안내

| 파일 | 언제 읽는가 |
|------|------------|
| `references/components.md` | 컴포넌트 생성, 페이지 조립 시 |
| `references/tmdb-api.md` | TMDB 데이터 연동 시 |
| `references/prompts.md` | 팀원이 프롬프트 템플릿 요청 시 |
| `references/rules.md` | 에러 수정, 의존성 관련 질문 시 |
