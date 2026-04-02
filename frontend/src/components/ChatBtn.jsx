import { useState, useRef, useEffect } from 'react'

// 초기 AI 인사 메시지
const INIT_MESSAGES = [
  {
    id: 1,
    role: 'ai',
    text: '안녕하세요! 오늘 어떤 영화가 보고 싶으신가요? 취향을 알려주시면 제가 찾아드릴게요.',
  },
]

/**
 * ChatWindow: AI 챗봇 팝업 창
 */
const ChatWindow = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState(INIT_MESSAGES)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  // 메시지 추가 시 스크롤 하단 이동
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: trimmed }])
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // AskPage 이동
  const goToAskPage = () => {
    window.location.href = '/ask'
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed bottom-28 right-8 z-50 flex h-[675px] w-[480px] flex-col overflow-hidden rounded-3xl border-[1.5px] border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl'>
      {/* 헤더 */}
      <div className='shrink-0 bg-primary-500 px-6 py-5'>
        <div className='flex items-center justify-between'>
          <span className='font-serif text-[21px] font-bold leading-[30px] text-neutral-950'>
            VODA AI 어시스턴트
          </span>
          <div className='flex items-center gap-4'>
            {/* AskPage 이동 버튼 */}
            <button
              onClick={goToAskPage}
              className='cursor-pointer text-neutral-950 transition-opacity hover:opacity-70'
            >
              <i className='fa-solid fa-up-right-and-down-left-from-center text-sm'></i>
            </button>
            <button
              onClick={onClose}
              className='cursor-pointer text-neutral-950 transition-opacity hover:opacity-70'
            >
              <i className='fa-solid fa-xmark text-lg'></i>
            </button>
          </div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className='flex-1 overflow-y-auto px-6 py-6 space-y-4'>
        {messages.map((msg) =>
          msg.role === 'ai' ? (
            // AI 메시지 — 왼쪽 정렬, 상단 왼쪽 모서리 없음
            <div key={msg.id} className='flex justify-start'>
              <div className='max-w-[343px] rounded-tr-[18px] rounded-br-[18px] rounded-bl-[18px] bg-neutral-900 px-[18px] py-[18px]'>
                <p className='font-serif text-lg leading-6 text-neutral-50'>{msg.text}</p>
              </div>
            </div>
          ) : (
            // 사용자 메시지 — 오른쪽 정렬, 상단 오른쪽 모서리 없음
            <div key={msg.id} className='flex justify-end'>
              <div className='max-w-[343px] rounded-tl-[18px] rounded-br-[18px] rounded-bl-[18px] border-[1.5px] border-primary-400/20 bg-primary-400/20 px-[19.5px] py-[19.5px]'>
                <p className='font-serif text-lg leading-6 text-neutral-50'>{msg.text}</p>
              </div>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 (HorizontalBorder) */}
      <div className='shrink-0 border-t-[1.5px] border-white/10 px-6 pb-6 pt-[25.5px]'>
        <div className='flex items-center gap-3'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='메시지를 입력하세요...'
            className='flex-1 rounded-xl bg-white/5 px-[18px] py-[13.5px] font-serif text-lg text-neutral-50 placeholder:text-neutral-400 outline-none'
          />
          <button
            onClick={handleSend}
            className='shrink-0 cursor-pointer text-primary-400 transition-colors hover:text-primary-300'
          >
            <i className='fa-solid fa-paper-plane text-xl'></i>
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * ChatBtn: 채팅창 토글 버튼
 */
const ChatBtn = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev)
  }

  return (
    <>
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <button
        onClick={toggleChat}
        className='fixed bottom-8 right-8 z-50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition hover:bg-primary-400 active:scale-95'
      >
        {isChatOpen ? (
          <i className='fa-solid fa-chevron-down text-2xl'></i>
        ) : (
          <i className='fa-solid fa-robot text-2xl'></i>
        )}
      </button>
    </>
  )
}

export default ChatBtn