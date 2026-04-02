/**
 * VODA AI 챗봇 대화 말풍선 컴포넌트
 * @param {string} msg - 메시지 내용
 * @param {boolean} isAi - AI 메시지 여부 (true: AI, false: 사용자)
 */
const ChatBubble = ({ msg, isAi }) => {
  if (isAi) {
    // AI 메시지 디자인 (좌측 정렬, 아바타 제거)
    return (
      <div className='flex items-start gap-3 w-full'>
        {/* 말풍선 */}
        <div className='bg-zinc-800 rounded-2xl rounded-tl-sm px-5 py-3 text-zinc-200 max-w-lg font-serif leading-relaxed whitespace-pre-wrap break-words'>
          {msg}
        </div>
      </div>
    )
  }

  // 사용자 메시지 디자인 (우측 정렬 + Solid 프라이머리 컬러 #8B5CF6)
  return (
    <div className='flex justify-end w-full'>
      <div className='bg-primary-500 rounded-2xl rounded-tr-sm px-5 py-3 text-white max-w-lg font-serif leading-relaxed whitespace-pre-wrap break-words shadow-lg shadow-primary-500/20'>
        {msg}
      </div>
    </div>
  )
}

export default ChatBubble
