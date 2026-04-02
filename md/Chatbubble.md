# ChatBubble 컴포넌트 프롬프트

## 중요
ChatBubble.jsx를 만들어줘. msg, isAi props. isAi면 flex gap-3. 왼쪽 AI 아바타 size-8 rounded-full bg-primary-500 text-white text-xs 'AI'. 말풍선 bg-zinc-800 rounded-2xl px-5 py-3 text-zinc-200 max-w-lg. 사용자면 flex justify-end. 말풍선 bg-primary-500/20 border border-primary-400/30



## 기본 정보
- **컴포넌트명**: ChatBubble
- **경로**: src/components/ChatBubble.jsx
- **용도**: AI 챗봇 대화 인터페이스의 메시지 말풍선

---

## Props

```typescript
interface ChatBubbleProps {
  msg: string;          // 메시지 내용
  isAi: boolean;        // AI 메시지 여부 (true: AI, false: 사용자)
}
```

---

## 디자인 스펙

### AI 메시지 (isAi === true)
```
레이아웃: flex gap-3 (왼쪽 정렬)

아바타:
- size-8 rounded-full
- bg-primary-500 text-white
- text-xs, 'AI' 텍스트 표시

말풍선:
- bg-zinc-800
- rounded-2xl px-5 py-3
- text-zinc-200
- max-w-lg
```

### 사용자 메시지 (isAi === false)
```
레이아웃: flex justify-end (오른쪽 정렬)

말풍선:
- bg-primary-500/20
- border border-primary-400/30
- rounded-2xl px-5 py-3
- text-zinc-200
- max-w-lg

(아바타 없음)
```

---

## 컴포넌트 생성 프롬프트

```
CLAUDE.md를 읽어줘.
src/components/ChatBubble.jsx를 만들어줘.

- props: msg (string), isAi (boolean)
- isAi가 true일 때:
  - flex gap-3 레이아웃
  - 왼쪽에 AI 아바타: size-8 rounded-full bg-primary-500 text-white text-xs, 'AI' 텍스트
  - 말풍선: bg-zinc-800 rounded-2xl px-5 py-3 text-zinc-200 max-w-lg
- isAi가 false일 때:
  - flex justify-end 레이아웃
  - 말풍선: bg-primary-500/20 border border-primary-400/30 rounded-2xl px-5 py-3 text-zinc-200 max-w-lg
  - 아바타 없음
- Tailwind v4 + @theme 토큰 사용
- 새 패키지 설치하지 마
```

---

## 사용 예시

```jsx
import ChatBubble from './components/ChatBubble';

function AskPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* AI 메시지 */}
      <ChatBubble 
        msg="안녕하세요! 무엇을 도와드릴까요?" 
        isAi={true} 
      />
      
      {/* 사용자 메시지 */}
      <ChatBubble 
        msg="액션 영화 추천해줘" 
        isAi={false} 
      />
      
      {/* AI 응답 */}
      <ChatBubble 
        msg="좋아요! 2024년 인기 액션 영화를 추천드릴게요." 
        isAi={true} 
      />
    </div>
  );
}
```

---

## 주의사항

1. **색상**: primary-500, primary-400, zinc-800, zinc-200은 @theme 토큰 사용
2. **아바타**: AI 메시지에만 표시, 사용자 메시지에는 없음
3. **정렬**: AI는 왼쪽, 사용자는 오른쪽
4. **너비**: max-w-lg로 말풍선 최대 너비 제한
5. **패키지**: 새 패키지 설치 금지, 순수 Tailwind + React만 사용

---

## 변형 가능성

### 타이핑 인디케이터 추가
```jsx
{isTyping && (
  <ChatBubble 
    msg={<TypingIndicator />} 
    isAi={true} 
  />
)}
```

### 타임스탬프 추가
```typescript
interface ChatBubbleProps {
  msg: string;
  isAi: boolean;
  timestamp?: string;  // "오후 2:30" 형식
}
```

### 에러 상태 표시
```typescript
interface ChatBubbleProps {
  msg: string;
  isAi: boolean;
  error?: boolean;  // true일 때 빨간색 테두리
}
```
