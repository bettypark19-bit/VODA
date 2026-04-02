/**
 * Curator's Note & Rating 컴포넌트 (Synopsis 우측)
 * 영화 상세 페이지(AboutPage) 우측 정보 영역
 * @param {string} quote - 큐레이터 인용문 (큰따옴표 포함 권장)
 * @param {number} rating - 큐레이터 평점 (0~10)
 */
const SynopsisRs = ({ quote, rating = 0 }) => {
  // 프로그레스 바 너비 (최대 100%)
  const pct = Math.max(0, Math.min((rating / 10) * 100, 100))

  return (
    <div className='flex flex-col gap-12 w-full'>

      {/* 1. Curator's Note 카드 */}
      <div className='relative bg-zinc-900 rounded-[36px] flex flex-col gap-9 px-12 py-12 overflow-hidden'>
        {/* 좌측 보라색 세로 바 */}
        <div className='absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500' />

        {/* 인용문 본문 */}
        <p className='font-serif font-medium text-3xl text-white leading-10 whitespace-pre-wrap'>
          {quote}
        </p>

        {/* 출처 */}
        <p className='font-serif font-semibold text-xl text-zinc-400 tracking-widest uppercase'>
          — The Ethereal Curator
        </p>
      </div>

      {/* 2. Curator Rating 프로그레스 바 */}
      <div className='flex flex-col gap-6 px-3 w-full'>
        {/* 라벨 & 점수 */}
        <div className='flex items-center justify-between'>
          <span className='font-serif font-normal text-xl text-zinc-400'>Curator Rating</span>
          <span className='font-serif font-bold text-3xl text-secondary-500'>{rating}/10</span>
        </div>
        
        {/* 프로그레스 바 */}
        <div className='bg-[#25252d] h-1.5 rounded-full w-full overflow-hidden'>
          <div
            className='bg-secondary-500 h-full rounded-full transition-all duration-1000 ease-out'
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

    </div>
  )
}

export default SynopsisRs
