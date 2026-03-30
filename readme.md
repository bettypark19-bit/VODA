# VODA — 풀사이클 생성형 AI OTT 미디어 서비스

인기 영화·TV 시리즈 큐레이션 OTT 서비스

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **기간** | 2026.03.24(화) ~ 2026.04.03(금) · 주말 제외 총 9일 |
| **팀 구성** | A·B: 디자인 리드 / C: 프론트엔드 리드 / D: 백엔드·AI 리드 |
| **코딩 방식** | Gemini CLI 바이브 코딩 |

### 수행 단계

```
기획 (2일) → 디자인 (3일) → 구현 (3일) → 검토·배포 (1일)
```

### 핵심 워크플로우

```
Google Stitch → Figma → Gemini CLI → Render
```

---

## 기술 스택

### 프론트엔드

| 기술 | 버전 |
|------|------|
| React | 19 |
| Tailwind CSS | v4 |
| React Router | v7 |
| react-player | latest |
| Axios | latest |
| FontAwesome | latest |
| tailwind-merge | latest |

### 백엔드

| 기술 | 버전 |
|------|------|
| Python FastAPI | latest |
| TMDB API | v3 |

---

## 프로젝트 구조

```
voda/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       └── utils/
├── backend/
│   └── app/
│       ├── routers/
│       ├── services/
│       └── models/
└── CLAUDE.md
```

---

## 시작하기

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

`.env` 파일에 TMDB API 키를 설정하세요:

```
VITE_TMDB_API_KEY=your_api_key_here
```

### 백엔드

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 작성자

안건 외 3인
