# VODA 코드 품질 검사 프롬프트
> Claude Code 터미널에서 아래 프롬프트를 상황에 맞게 붙여넣어 실행한다.

---

## 🔴 LEVEL 1 — 커밋 전 필수 검사 (매번 실행)

```
CLAUDE.md를 읽어줘.
오늘 수정하거나 새로 만든 파일을 대상으로 아래 항목을 순서대로 검사해줘.

[검사 항목]
1. import 경로가 실제 파일 위치와 일치하는지
2. 컴포넌트에 넘기는 props가 해당 컴포넌트의 실제 props 정의와 일치하는지
3. Tailwind 임의값(arbitrary value) [px값] 사용 여부 — 발견 시 표준 클래스로 교체
4. 인라인 style={{}} 사용 여부 — 발견 시 Tailwind 클래스로 교체
5. 세미콜론 사용 여부 — 발견 시 제거
6. 큰따옴표 문자열 사용 여부 — 발견 시 작은따옴표로 교체
7. 들여쓰기 2칸 준수 여부

문제가 있으면 해당 줄만 수정해줘.
문제가 없으면 "이상 없음"으로 보고해줘.
새 패키지 설치하지 마.
```

---

## 🟠 LEVEL 2 — 빌드 검증 (기능 완성 후 실행)

```
CLAUDE.md를 읽어줘.
아래 순서로 실행하고 각 단계 결과를 보고해줘.

STEP 1 — 빌드 실행
cd frontend && npm run build

STEP 2 — 에러 분류
빌드 에러가 있으면 아래 3가지 중 어디에 해당하는지 분류해줘:
1. 코드 에러 (import 경로, props, 문법)
2. 환경 에러 (.env, node_modules, 경로)
3. 타입/버전 에러 (패키지 충돌)

STEP 3 — 수정
분류된 에러를 원인 파일에서만 수정해줘.
새 패키지 설치하지 마.
기존 패키지 버전 변경하지 마.

STEP 4 — 재빌드
수정 후 다시 npm run build 실행해서 통과 확인해줘.
```

---

## 🟡 LEVEL 3 — 컴포넌트 단위 검사 (컴포넌트 완성 후 실행)

```
CLAUDE.md를 읽어줘.
src/components/[파일명].jsx 를 검사해줘.

[검사 항목]
1. props 기본값이 설정되어 있는지
   - 배열 props: 기본값 [] 설정 여부
   - 문자열 props: 기본값 '' 또는 null 설정 여부
2. 이미지 렌더 시 EP.img() 헬퍼 사용 여부 (직접 URL 하드코딩 금지)
3. Link 컴포넌트 사용 시 to 경로가 router/index.jsx에 등록된 경로와 일치하는지
4. 조건부 클래스에 tailwind-merge(twMerge) 사용 여부
5. 하드코딩 색상 사용 여부 — bg-[#색상코드] 대신 @theme 토큰 사용하는지
6. 컴포넌트 안에서 다른 컴포넌트를 인라인 정의하는지 (금지 패턴)
7. export default 가 파일 맨 아래에 있는지

문제 항목만 줄 번호와 함께 보고하고 수정해줘.
새 패키지 설치하지 마.
```

---

## 🟢 LEVEL 4 — 페이지 단위 검사 (페이지 완성 후 실행)

```
CLAUDE.md를 읽어줘.
src/pages/[파일명].jsx 를 검사해줘.

[검사 항목]
1. GNB, Footer가 페이지 안에서 렌더되고 있는지 — 있으면 제거 (App.jsx Layout이 처리)
2. useFetch 훅 사용 패턴이 올바른지
   - useFetch(() => EP.함수명(), []) 형태인지
   - { data, loading, err } 구조분해 하는지
3. loading 상태 처리가 있는지 — 없으면 추가
4. err 상태 처리가 있는지 — 없으면 추가
5. 데이터 접근 전 null 체크가 있는지 (data?.results 또는 if (!data) 패턴)
6. .map() 사용 시 key prop이 item.id로 설정되어 있는지
7. EP 객체 없이 axios를 직접 import해서 사용하는지 — 있으면 EP 객체로 교체

문제 항목만 줄 번호와 함께 보고하고 수정해줘.
새 패키지 설치하지 마.
```

---

## 🔵 LEVEL 5 — 라우터 정합성 검사 (전체 페이지 연결 후 실행)

```
CLAUDE.md를 읽어줘.
src/router/index.jsx 와 src/pages/ 폴더 전체를 읽고 아래를 검사해줘.

[검사 항목]
1. pages/ 폴더에 있는 모든 페이지 파일이 router/index.jsx에 등록되어 있는지
2. 등록된 경로 중 실제 파일이 없는 경로가 있는지
3. /person/category 경로가 /person/:id 보다 앞에 위치하는지
   (순서가 바뀌면 /person/category 접근 시 :id로 매칭됨)
4. BrowserRouter / Routes / Route import가 있는지 — 있으면 제거
5. loader / action 함수가 있는지 — 있으면 제거
6. Layout(App.jsx)이 최상위 element로 감싸져 있는지

누락 경로는 추가해줘.
잘못된 패턴은 수정해줘.
새 패키지 설치하지 마.
```

---

## ⚪ LEVEL 6 — 전체 프로젝트 일괄 검사 (PR/머지 전 실행)

```
CLAUDE.md를 읽어줘.
src/ 폴더 전체를 순회하면서 아래 항목을 검사하고
문제가 있는 파일명과 줄 번호를 표로 정리해줘.

[검사 항목]
A. 컨벤션
   - 세미콜론 사용
   - 큰따옴표 문자열
   - 인라인 style={{}}
   - Tailwind 임의값 [px값]
   - 하드코딩 색상 bg-[#...]

B. 구조
   - GNB/Footer 페이지 내 렌더
   - axios 직접 import (EP 객체 우회)
   - BrowserRouter/Routes/Route import
   - loader/action 함수

C. 안전성
   - .map() key prop 누락
   - data 접근 전 null 체크 누락
   - loading/err 상태 처리 누락

결과를 아래 형식으로 보고해줘:

| 파일 | 줄 | 항목 | 내용 |
|------|----|------|------|
| Card.jsx | 12 | A | 인라인 style={{}} |

보고 후 자동 수정할지 물어봐줘.
새 패키지 설치하지 마.
```

---

## 에러 발생 시 즉시 사용 프롬프트

```
이 에러를 해결해줘:
[에러 메시지 전체 붙여넣기]

먼저 아래 3가지 중 어디에 해당하는지 분류해줘:
1. 코드 에러 (오타, import 경로, props 불일치)
2. 환경 에러 (.env 누락, node_modules, 경로 착각)
3. API 에러 (TMDB 키, 엔드포인트, 응답 구조)

분류 후에만 수정해줘.
새 패키지 설치하지 마.
기존 패키지 버전 변경하지 마.
```

---

## 언제 어떤 레벨을 쓰는가

| 상황 | 사용할 레벨 |
|------|------------|
| 파일 하나 수정하고 저장할 때 | LEVEL 1 |
| 컴포넌트 하나 완성했을 때 | LEVEL 1 → LEVEL 3 |
| 페이지 하나 완성했을 때 | LEVEL 1 → LEVEL 4 → LEVEL 2 |
| 팀원 코드 머지 받은 후 | LEVEL 2 |
| 새 페이지를 라우터에 연결했을 때 | LEVEL 5 |
| 최종 제출 전날 | LEVEL 6 → LEVEL 2 |