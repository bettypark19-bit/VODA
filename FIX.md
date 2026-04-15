# FIX.md — 수정 내역

## 1. `backend/main.py` — 환경변수 로드 버그

**원인**: `os.getenv()`에 환경변수 키 대신 URL 문자열을 전달하여 `SELF_URL`이 항상 `None`이 됨. 이후 `SELF_URL.exists()` 호출로 루트 엔드포인트가 500 에러.

**수정**:
```python
SELF_URL = os.getenv("SELF_URL", "http://localhost:8000")
```
루트 응답도 `self_url` 문자열을 그대로 반환하도록 변경.

---

## 2. `frontend/src/components/ChatBtn.jsx` — 하드코딩된 백엔드 URL

**원인**: `let BACKEND`을 두 번 할당하여 항상 `localhost:8000`으로 고정 → 배포 환경에서 챗봇 동작 불가.

**수정**:
```js
const BACKEND = `${import.meta.env.VITE_BACKEND || 'https://vodamovie.onrender.com'}/chat`
```
환경변수 `VITE_BACKEND` 우선, 없으면 프로덕션 URL로 폴백.

---

## 3. `frontend/src/components/Hero.jsx` — 불필요한 TMDB 호출

**원인**: `bgVideo` prop이 이미 주어졌거나 `id`가 숫자가 아닌 경우에도 `EP.detail`을 호출해 404 발생.

**수정**: `useEffect` 상단에 가드 추가.
```jsx
if (bgVideo) return
if (typeof id !== 'number' && !(typeof id === 'string' && /^\d+$/.test(id))) return
```
