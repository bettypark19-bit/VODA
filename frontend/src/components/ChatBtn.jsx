import { useState, useRef, useEffect } from 'react'

const BACKEND = 'https://vodamovie.onrender.com/chat'

const INIT_MESSAGES = [
  {
    id: 1,
    role: 'ai',
    text: '안녕하세요! 오늘 어떤 영화가 보고 싶으신가요? 취향을 알려주시면 제가 찾아드릴게요.',
  },
]

const ChatWindow = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState(INIT_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: trimmed }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch(BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { id: Date.now(), role: 'ai', text: data.reply }])
    } catch {
      setMessages((prev) => [...prev, { id: Date.now(), role: 'ai', text: '서버 연결에 실패했습니다. 다시 시도해주세요.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const goToAskPage = () => {
    window.location.href = '/ask'
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed bottom-28 right-8 z-50 flex h-168.75 w-120 flex-col overflow-hidden rounded-3xl border-[1.5px] border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl'>
      <div className='shrink-0 bg-primary-500 px-6 py-5'>
        <div className='flex items-center justify-between'>
          <span className='font-serif text-[21px] font-bold leading-7.5 text-neutral-950'>
            VODA AI 어시스턴트
          </span>
          <div className='flex items-center gap-4'>
            <button onClick={goToAskPage} className='cursor-pointer text-neutral-950 transition-opacity hover:opacity-70'>
              <i className='fa-solid fa-up-right-and-down-left-from-center text-sm'></i>
            </button>
            <button onClick={onClose} className='cursor-pointer text-neutral-950 transition-opacity hover:opacity-70'>
              <i className='fa-solid fa-xmark text-lg'></i>
            </button>
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-6 space-y-4'>
        {messages.map((msg) =>
          msg.role === 'ai' ? (
            <div key={msg.id} className='flex justify-start'>
              <div className='max-w-85.75 rounded-tr-[18px] rounded-br-[18px] rounded-bl-[18px] bg-neutral-900 px-4.5 py-4.5'>
                <p className='font-serif text-lg leading-6 text-neutral-50'>{msg.text}</p>
              </div>
            </div>
          ) : (
            <div key={msg.id} className='flex justify-end'>
              <div className='max-w-85.75 rounded-tl-[18px] rounded-br-[18px] rounded-bl-[18px] border-[1.5px] border-primary-400/20 bg-primary-400/20 px-4.5 py-4.5'>
                <p className='font-serif text-lg leading-6 text-neutral-50'>{msg.text}</p>
              </div>
            </div>
          )
        )}
        {loading && (
          <div className='flex justify-start'>
            <div className='rounded-tr-[18px] rounded-br-[18px] rounded-bl-[18px] bg-neutral-900 px-4.5 py-4.5'>
              <p className='font-serif text-lg leading-6 text-neutral-400'>...</p>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className='shrink-0 border-t-[1.5px] border-white/10 px-6 pb-6 pt-6.5'>
        <div className='flex items-center gap-3'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='메시지를 입력하세요...'
            disabled={loading}
            className='flex-1 rounded-xl bg-white/5 px-4.5 py-3.375 font-serif text-lg text-neutral-50 placeholder:text-neutral-400 outline-none disabled:opacity-50'
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className='shrink-0 cursor-pointer text-primary-400 transition-colors hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <i className='fa-solid fa-paper-plane text-xl'></i>
          </button>
        </div>
      </div>
    </div>
  )
}

const ChatBtn = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const toggleChat = () => setIsChatOpen((prev) => !prev)

  return (
    <>
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <button
        onClick={toggleChat}
        className='fixed bottom-8 right-8 z-50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition hover:bg-primary-400 active:scale-95'
      >
        {isChatOpen ? <i className='fa-solid fa-chevron-down text-2xl'></i> : <i className='fa-solid fa-robot text-2xl'></i>}
      </button>
    </>
  )
}

export default ChatBtn