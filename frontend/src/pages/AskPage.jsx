import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import ChatBubble from '../components/ChatBubble'

const BACKEND = 'https://vodamovie.onrender.com/chat'

const INIT_MESSAGES = [
  { id: 1, role: 'ai', text: '안녕하세요! 오늘 어떤 영화가 보고 싶으신가요? 취향을 알려주시면 제가 찾아드릴게요.' },
]

const AskPage = () => {
  const [messages, setMessages] = useState(INIT_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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

      if (!res.ok) {
        throw new Error(`서버 응답 오류 (상태코드: ${res.status})`)
      }

      const data = await res.json()
      setMessages((prev) => [...prev, { id: Date.now(), role: 'ai', text: data.reply }])
    } catch (err) {
      setMessages((prev) => [...prev, { id: Date.now(), role: 'ai', text: `연결 오류: ${err.message}. 백엔드 서버(8000번 포트)가 실행 중인지 확인해 주세요.` }])
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

  return (
    <div className='flex flex-col min-h-screen px-12 py-10'>
      {/* 메시지 목록 */}
      <div className='flex-1 max-w-3xl w-full mx-auto flex flex-col gap-4 pb-6'>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} msg={msg.text} isAi={msg.role === 'ai'} />
        ))}
        {/* 로딩 인디케이터 */}
        {loading && <ChatBubble msg='...' isAi={true} />}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className='sticky bottom-0 pb-10 pt-4 max-w-3xl w-full mx-auto'>
        <div className='backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-6 py-3 flex items-center gap-3'>
          <FontAwesomeIcon icon={faStar} className='text-white/70 shrink-0' />
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='AI에게 물어보세요'
            disabled={loading}
            className='bg-transparent outline-none text-white w-full placeholder-zinc-400 disabled:opacity-50 font-serif'
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className='shrink-0 text-white/70 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer'
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AskPage
