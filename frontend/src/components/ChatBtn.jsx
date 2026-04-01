import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentDots, faXmark, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

const AIChatWindow = ({ onClose }) => {
  return (
    <div className='relative flex flex-col h-[675px] w-[480px] rounded-[24px] overflow-hidden bg-zinc-900/90 backdrop-blur-xl border border-white/10 shadow-2xl'>
      {/* Header: VODA 바이브에 맞춘 색상 토큰 적용 */}
      <div className='flex items-center justify-between p-6 bg-primary-400 text-zinc-950'>
        <h2 className='text-xl font-bold'>VODA AI 어시스턴트</h2>
        <button onClick={onClose} className='cursor-pointer'>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      {/* Messages Area: ChatBubble 패턴 적용 */}
      <div className='flex-1 overflow-y-auto p-6 space-y-4'>
        <div className='self-start bg-zinc-800 p-4 rounded-2xl rounded-tl-none text-zinc-50'>
          안녕하세요! 어떤 영화를 찾으시나요?
        </div>
      </div>

      {/* Input Area: SearchBar(mode="ai")와 유사한 스타일 적용 */}
      <div className='p-6 bg-zinc-900 border-t border-white/10'>
        <div className='flex items-center gap-3 p-3 bg-white/5 rounded-xl'>
          <input
            type='text'
            placeholder='메시지를 입력하세요...'
            className='flex-1 bg-transparent outline-none text-zinc-50 placeholder:text-zinc-500'
          />
          <button className='text-primary-400 cursor-pointer'>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  )
}

const ChatBtn = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className='fixed bottom-6 right-6 z-50'>
        <button
          className={twMerge(
            'flex items-center justify-center rounded-full transition-all duration-300 size-16 shadow-lg cursor-pointer',
            'bg-primary-400 hover:bg-primary-500 text-zinc-950',
            isOpen && 'rotate-90'
          )}
          onClick={() => setIsOpen(prev => !prev)}
        >
          <FontAwesomeIcon icon={isOpen ? faXmark : faCommentDots} className='text-2xl' />
        </button>
      </div>

      {isOpen && (
        <div className='fixed bottom-[100px] right-6 z-50 animate-fade-in'>
          <AIChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  )
}

export default ChatBtn
