import React, { useState, useRef, useEffect } from 'react'
import ChatBubble from '../components/ChatBubble'

// ✅ ChatBtn과 동일한 엔드포인트 설정
const BACKEND = 'https://vodamovie.onrender.com/chat'

const INIT_MESSAGES = [
  { id: 1, role: 'ai', text: '안녕하세요! 당신만의 영화 큐레이터 VODA AI입니다. \n오늘의 기분이나 선호하는 장르를 말씀해 주시면 딱 맞는 콘텐츠를 추천해 드릴게요.' },
]

const QUICK_PROMPTS = [
  "비 오는 날 어울리는 로맨스 추천해줘",
  "보다에서 인기있는 영화 보다",
  "긴장감 넘치는 스릴러 영화 찾아줘",
  "주말에 가족이랑 보기 좋은 애니메이션"
]

const AskPage = () => {
  const [messages, setMessages] = useState(INIT_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef(null)

  useEffect(() => {
    if (messages.length <= INIT_MESSAGES.length && !loading) return
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSend = async (text) => {
    const trimmed = (typeof text === 'string' ? text : input).trim()
    if (!trimmed || loading) return

    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: trimmed }])
    setInput('')
    setLoading(true)

    try {
      // ✅ ChatBtn의 fetch 방식과 동일하게 수정
      const res = await fetch(BACKEND, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      })
      
      if (!res.ok) throw new Error('서버 응답 오류')
      
      const data = await res.json()
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', text: data.reply }])
    } catch (err) {
      // ✅ VODA 프로젝트 지침에 따른 에러 처리
      setMessages((prev) => [...prev, { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: '서버 연결에 실패했습니다. 백엔드 서버 상태를 확인하거나 잠시 후 다시 시도해주세요.' 
      }])
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
    <div className='flex flex-col h-[calc(100vh-80px)] px-12 py-10 bg-zinc-950'>
      <div className="max-w-3xl w-full mx-auto mb-10">
      </div>

      <div 
        ref={messagesRef} 
        className='flex-1 min-h-0 max-w-3xl w-full mx-auto flex flex-col gap-6 pb-10 overflow-y-auto no-scrollbar'
      >
        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id} 
            msg={msg.text} 
            isAi={msg.role === 'ai'} 
          />
        ))}
        {loading && <ChatBubble msg='...' isAi={true} />}
      </div>

      <div className='sticky bottom-0 pb-10 pt-4 max-w-3xl w-full mx-auto flex flex-col gap-5'>
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-2 justify-start">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-4 py-2 rounded-lg border border-white/5 bg-zinc-900/50 text-zinc-400 text-sm hover:border-primary-400/30 hover:text-primary-400 transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-2 flex items-center gap-4 shadow-2xl focus-within:border-primary-400/50 transition-all'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='좋아하는 영화나 장르를 알려주세요'
            disabled={loading}
            className='bg-transparent outline-none text-white h-14 w-full placeholder-zinc-500 disabled:opacity-50 font-serif text-lg'
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className='shrink-0 px-6 h-10 rounded-xl bg-primary-500 text-white font-serif font-bold hover:bg-primary-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer'
          >
            전송
          </button>
        </div>
      </div>
    </div>
  )
}

export default AskPage