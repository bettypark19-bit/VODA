import { useNavigate } from 'react-router'

// SectionTitle: 디자인 유지 및 조건부 '전체보기' 표시
const SectionTitle = ({ title, subtitle, link = '#', hideAllBtn = false }) => {
  const navigate = useNavigate()

  return (
    <div className='flex items-center w-full py-10'>
      {/* 왼쪽: 제목 + 부제목 */}
      <div className='flex-1 flex flex-col gap-3'>

        {/* 제목 행: 보라색 세로 바 + 타이틀 */}
        <div className='flex items-center gap-2.5 py-0.5'>
          <div className='w-3 h-12 bg-primary-400 rounded-full shrink-0' />
          <h2 className='font-serif font-bold text-4xl leading-none text-neutral-50 whitespace-nowrap'>
            {title}
          </h2>
        </div>

        {/* 부제목: subtitle prop이 있을 때만 표시 */}
        {subtitle && (
          <div className='flex items-start gap-2.5'>
            <div className='w-3 h-5 shrink-0' />
            <p className='font-serif font-normal text-lg leading-9 text-neutral-400'>
              {subtitle}
            </p>
          </div>
        )}
      </div>

      {/* 오른쪽: 전체보기 버튼 (hideAllBtn이 false일 때만 렌더링) */}
      {!hideAllBtn && (
        <button
          onClick={() => navigate(link)}
          className='flex items-center gap-2 shrink-0 cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none'
        >
          <span className='font-serif font-medium text-2xl text-primary-400'>전체보기</span>
          <i className='fa-solid fa-arrow-right text-primary-400 text-xl' />
        </button>
      )}
    </div>
  )
}

export default SectionTitle
