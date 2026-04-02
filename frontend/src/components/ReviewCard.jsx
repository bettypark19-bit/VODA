/**
 * 영화/TV 상세 리뷰 카드 컴포넌트
 * @param {string} author - 작성자 이름
 * @param {string} content - 리뷰 본문 내용
 * @param {number} rating - 평점 (TMDB 기준 0~10)
 * @param {string} date - 작성 일자
 */
const ReviewCard = ({ author, content, rating, date }) => {
  // 별점 계산 (TMDB는 10점 만점이므로 2로 나눠 5점 만점으로 변환)
  const stars = Math.max(0, Math.min(5, Math.round(rating / 2)))
  
  return (
    <div className='bg-zinc-900/50 border border-white/5 rounded-2xl p-6'>
      {/* 상단: 작성자와 날짜 */}
      <div className='flex justify-between items-center'>
        <h4 className='font-semibold text-zinc-50'>{author}</h4>
        <span className='text-sm text-zinc-500'>{date}</span>
      </div>
      
      {/* 중간: 별점 */}
      <div className='mt-3 flex items-center gap-1'>
        <span className='text-primary-400 text-sm tracking-widest'>
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </span>
      </div>
      
      {/* 하단: 리뷰 내용 */}
      <p className='mt-3 text-zinc-300 text-sm line-clamp-3 leading-relaxed'>
        {content}
      </p>
    </div>
  )
}

export default ReviewCard
