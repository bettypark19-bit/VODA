# 의존성 통제 + 에러 분류 규칙

## 목차
1. 절대 금지 목록
2. 에러 분류 프로토콜
3. 패키지 허용 목록
4. 모노레포 경로 규칙
5. 자주 발생하는 에러와 해결법

---

## 1. 절대 금지 목록

| # | 금지 항목 | 이유 |
|---|----------|------|
| 1 | `npm install [새패키지]` | 허용 목록 외 설치 시 빌드 깨짐 |
| 2 | `pip install [새패키지]` | requirements.txt에 없는 패키지 설치 금지 |
| 3 | 루트 디렉토리에서 `npm` 실행 | frontend/node_modules와 충돌 |
| 4 | 기존 패키지 버전 변경 | 팀원 간 버전 불일치 → 빌드 에러 |
| 5 | `style={{}}` 인라인 스타일 | Tailwind 토큰 사용 원칙 위반 |
| 6 | `tailwind.config.js` 생성 | Tailwind v4는 `@theme` 블록 사용 |
| 7 | 다른 팀원 담당 파일 직접 수정 | 충돌 방지. 반드시 먼저 공유 |
| 8 | 디버깅 중 AI가 제안하는 패키지 설치 | 에러 원인은 패키지가 아니라 코드 |

### 왜 이렇게 엄격한가

팀원은 초기 세팅을 **외워서** 한다. 이해하고 하는 것이 아니다. 외운 절차는 예상대로 흘러갈 때만 작동한다. API 버그 디버깅에 몰입하면 방어가 풀리고, AI가 제안하는 의존성 변경을 무의식적으로 실행한다. 한 번 의존성이 꼬이면 복구하는 데 1~2시간이 날아간다.

---

## 2. 에러 분류 프로토콜

에러가 발생하면 **먼저 분류**한다. 분류하지 않고 바로 고치려 하면 안 된다.

### 코드 에러

증상: `SyntaxError`, `ReferenceError`, `TypeError`, `Cannot find module`, `is not defined`

원인: 오타, import 경로 틀림, props 이름 틀림, 괄호 안 닫음

해결:
1. 에러 메시지에서 파일명과 줄 번호 확인
2. 해당 파일 열어서 해당 줄 확인
3. **해당 파일만 수정** — 다른 파일 건드리지 않음

비유: 식당에서 주문서(코드)에 오타가 있으면 주문서만 고친다. 주방 설비(패키지)를 바꾸지 않는다.

### 환경 에러

증상: `ENOENT`, `permission denied`, `command not found`, `.env` 관련, `node_modules` 관련

원인: 파일이 없음, 경로 틀림, 환경변수 미설정, node_modules 손상

해결:
1. `cd frontend` 확인 (루트가 아닌지)
2. `.env` 파일 존재 + `VITE_TMDB_API_KEY` 값 확인
3. node_modules 문제 → `rm -rf node_modules && npm install` (frontend/ 안에서)

비유: 건물 1층(루트)에서 2층(frontend) 전등 스위치를 찾으면 안 된다. 2층으로 올라가서 찾아야 한다.

### API 에러

증상: `401`, `403`, `404`, `500`, `Network Error`, `CORS`, 응답이 예상과 다름

원인: API 키 틀림, 엔드포인트 경로 틀림, 파라미터 틀림, 네트워크 문제

해결:
1. **console.log로 응답 먼저 확인** — 에러 내용을 읽기 전에 고치려 하지 않음
2. API 키가 `.env`에 있는지 확인
3. 엔드포인트 URL이 TMDB 공식 문서와 일치하는지 확인
4. CORS → 백엔드 미들웨어 확인 (이미 설정됨)

비유: 식당(API)에서 주문이 안 될 때, 주방 기계(패키지)를 바꾸지 않는다. 메뉴판(문서)을 다시 읽는다.

### 분류할 수 없는 에러

1. 에러 메시지 전체를 복사
2. AI에게 붙여넣기
3. "먼저 이 에러를 분류해줘"라고 요청
4. **AI가 "이 패키지를 설치하세요"라고 하면 무시**

---

## 3. 패키지 허용 목록

### frontend (package.json에 이미 있는 것만)

| 패키지 | 용도 |
|--------|------|
| react, react-dom | UI 프레임워크 |
| react-router-dom | 클라이언트 라우팅 |
| axios | HTTP 클라이언트 |
| @fortawesome/* | 아이콘 |
| tailwind-merge | 조건부 클래스 병합 |
| react-player | 영상 재생 |
| @tailwindcss/vite | Tailwind 빌드 |
| vite | 빌드 도구 |

### backend (requirements.txt에 이미 있는 것만)

| 패키지 | 용도 |
|--------|------|
| fastapi | REST API 서버 |
| uvicorn | ASGI 서버 |
| requests | HTTP 클라이언트 |
| python-dotenv | 환경변수 |

**위 목록에 없는 패키지는 절대 설치하지 않는다.**

---

## 4. 모노레포 경로 규칙

```
VODA/                    ← 루트 (여기서 npm 치면 안 됨)
├── frontend/            ← npm 명령은 반드시 여기서
│   ├── src/
│   ├── package.json
│   └── node_modules/
├── backend/             ← pip/python 명령은 여기서
│   ├── main.py
│   └── requirements.txt
├── CLAUDE.md
└── TASK.md
```

### 올바른 명령어

```bash
# ✅ 프론트엔드 작업
cd frontend
npm run dev
npm run build

# ✅ 백엔드 작업
cd backend
uvicorn main:app --reload

# ✅ Git 작업 (루트에서)
cd VODA
git add .
git commit -m "feat: 홈페이지 구현"
git push origin dev
```

### 잘못된 명령어

```bash
# ❌ 루트에서 npm
cd VODA
npm install          # ← 루트에 node_modules 생김 → 충돌

# ❌ 경로 착각
cd VODA
npm run dev          # ← package.json이 여기 없음

# ❌ 새 패키지 설치
cd frontend
npm install some-new-package  # ← 금지
```

---

## 5. 자주 발생하는 에러와 해결법

### "Module not found: Can't resolve './components/[이름]'"

분류: 코드 에러
원인: import 경로 오타 또는 파일이 아직 없음
해결: 파일명 대소문자 확인. 파일이 없으면 먼저 만들기.

### "Uncaught TypeError: Cannot read properties of undefined"

분류: 코드 에러
원인: API 데이터가 아직 로딩 중인데 접근 시도
해결: `if (loading) return <p>로딩 중...</p>` 조건 추가

### "Failed to fetch" / "Network Error"

분류: API 에러
원인: API 키 누락, URL 오타, 서버 미실행
해결: `.env`의 `VITE_TMDB_API_KEY` 확인 → `console.log(res)` 추가

### "npm ERR! ERESOLVE unable to resolve dependency tree"

분류: 환경 에러
원인: 루트에서 npm install 실행했거나, 버전 충돌
해결: `rm -rf node_modules package-lock.json && npm install` (frontend 안에서)

### "VITE_TMDB_API_KEY is undefined"

분류: 환경 에러
원인: `.env` 파일 없거나 키 누락
해결: `frontend/.env` 파일 생성 → `VITE_TMDB_API_KEY=발급받은키` 작성 → 서버 재시작

### "Each child in a list should have a unique 'key' prop"

분류: 코드 에러 (경고)
원인: `.map()` 안에서 `key` prop 누락
해결: `{items.map(item => <Card key={item.id} ... />)}`

### "Objects are not valid as a React child"

분류: 코드 에러
원인: 객체를 직접 렌더링하려 함 (예: `{movie.genres}` → 배열)
해결: `{movie.genres.map(g => g.name).join(' • ')}` 처럼 문자열로 변환
