# React + Vite 풀사이클 스타터 (프론트엔드)

React 19와 Vite 7을 기반으로 한 프론트엔드 스타터 템플릿입니다. HMR(Hot Module Replacement)과 ESLint가 기본 설정되어 있습니다.

## 기술 스택

- **React** 19
- **Vite** 7
- **React Compiler** (babel-plugin-react-compiler)
- **ESLint** 9

## 시작하기

### 의존성 설치

```bash
npm install
```
### 의존성 오류 발생시

```bash
npm install --legacy-peer-deps
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

### 빌드

```bash
npm run build
```

### 빌드 결과물 미리보기

```bash
npm run preview
```

### 린트 검사

```bash
npm run lint
```

## 프로젝트 구조

```
frontend/
├── src/
│   ├── App.jsx       # 루트 컴포넌트
│   └── main.jsx      # 진입점
├── index.html
├── vite.config.js    # Vite 설정
├── eslint.config.js  # ESLint 설정
└── package.json
```

## React Compiler

이 프로젝트는 React Compiler가 활성화되어 있습니다. React Compiler는 컴포넌트를 자동으로 최적화하여 불필요한 리렌더링을 방지합니다.

> 참고: React Compiler를 사용하면 Vite의 개발 서버 및 빌드 성능에 영향을 줄 수 있습니다.

자세한 내용은 [React Compiler 공식 문서](https://react.dev/learn/react-compiler)를 참고하세요.

## Vite 플러그인

- **@vitejs/plugin-react**: Babel을 사용한 Fast Refresh 지원

## ESLint 설정 확장

프로덕션 애플리케이션 개발 시 TypeScript와 타입 기반 린트 규칙 사용을 권장합니다.
TypeScript 통합 방법은 [TS 템플릿](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)과 [`typescript-eslint`](https://typescript-eslint.io) 문서를 참고하세요.
