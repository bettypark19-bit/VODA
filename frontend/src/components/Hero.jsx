import { useState, useEffect } from 'react'
import { EP } from '../api/tmdb'

const Hero = ({ type = 'home', title, backdrop, rating, year, runtime, overview }) => {
  const [featured, setFeatured] = useState(null)

  useEffect(() => {
    if (type === 'home') {
      EP.trending('movie', 'week').then(res => {
        setFeatured(res.data.results[0])
      })
    }
  }, [type])

  // type별 데이터 분기
  const bgPath = type === 'home' ? featured?.backdrop_path : backdrop
  const displayTitle = type === 'home' ? featured?.title : title
  const displayOverview = type === 'home' ? featured?.overview : overview
  const displayRating = type === 'home' ? featured?.vote_average : rating
  const displayYear = type === 'home' ? featured?.release_date?.slice(0, 4) : year

  return (
    <section className='relative w-full h-screen'>
      {/* 배경 이미지 */}
      {bgPath && (
        <img
          src={EP.bg(bgPath)}
          alt=''
          className='absolute inset-0 w-full h-full object-cover object-top'
        />
      )}

      {/* 그라디언트 오버레이 — 아래에서 위로 페이드 */}
      <div className='absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent' />

      {/* 좌측 사이드 그라디언트 */}
      <div className='absolute inset-0 bg-gradient-to-r from-neutral-950/80 to-transparent' />

      {/* 콘텐츠 영역 */}
      <div className='relative h-full flex items-end pb-24 max-w-screen-2xl mx-auto px-12'>
        <div className='flex flex-col gap-4 max-w-2xl'>

          {/* 배지 */}
          <span className='w-fit bg-primary-500/20 border border-primary-400/40 text-primary-300 text-xs font-semibold font-serif px-3 py-1 rounded-full tracking-widest uppercase'>
            VODA 추천
          </span>

          {/* 타이틀 */}
          <h1 className='text-white text-6xl font-bold font-sans leading-tight drop-shadow-lg'>
            {displayTitle ?? '로딩 중...'}
          </h1>

          {/* 메타 정보 */}
          <div className='flex items-center gap-3 text-sm font-serif'>
            {displayRating != null && (
              <span className='flex items-center gap-1 text-primary-400 font-bold'>
                <i className='fa-solid fa-star text-xs' />
                {Number(displayRating).toFixed(1)}
              </span>
            )}
            {displayRating != null && <span className='text-neutral-600'>·</span>}
            {displayYear && <span className='text-neutral-400'>{displayYear}</span>}
            {runtime > 0 && (
              <>
                <span className='text-neutral-600'>·</span>
                <span className='text-neutral-400'>{runtime}분</span>
              </>
            )}
          </div>

          {/* 줄거리 */}
          {displayOverview && (
            <p className='text-neutral-300 text-base leading-relaxed line-clamp-3 font-serif'>
              {displayOverview}
            </p>
          )}

          {/* 액션 버튼 */}
          <div className='flex gap-3 mt-2'>
            <button className='flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white px-8 py-3 rounded-full font-semibold font-serif transition-colors cursor-pointer'>
              <i className='fa-solid fa-play text-sm' />
              재생
            </button>
            <button className='flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3 rounded-full font-semibold font-serif backdrop-blur-sm transition-colors cursor-pointer'>
              <i className='fa-regular fa-bookmark text-sm' />
              찜하기
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
