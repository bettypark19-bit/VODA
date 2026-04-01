// SectionTitle: 섹션 헤딩 컴포넌트
// props:
//   title      - 제목 텍스트 (필수)
//   sub        - 부제목 텍스트 (Frame 52, 생략 시 숨김)
//   showMore   - '전체보기' 버튼 표시 여부 (기본 true)
//   onMoreClick - '전체보기' 클릭 핸들러
const SectionTitle = ({ title, sub, showMore = true, onMoreClick }) => {
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

        {/* Frame 52: 부제목 — sub prop이 있을 때만 표시 */}
        {sub && (
          <div className='flex items-start gap-2.5'>
            <div className='w-3 h-5 shrink-0' />
            <p className='font-serif font-normal text-lg leading-9 text-neutral-400'>
              {sub}
            </p>
          </div>
        )}

      </div>

      {/* 오른쪽: 전체보기 버튼 */}
      {showMore && (
        <button
          onClick={onMoreClick}
          className='flex items-center gap-2 shrink-0 cursor-pointer'
        >
          <span className='font-serif font-medium text-2xl text-primary-400'>전체보기</span>
          <i className='fa-solid fa-arrow-right text-primary-400 text-xl' />
        </button>
      )}
    </div>
  )
}

export default SectionTitle
