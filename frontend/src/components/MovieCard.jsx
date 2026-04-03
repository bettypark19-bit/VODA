import { useState, useRef } from 'react'
import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'
import { EP } from '../api/tmdb'

const MovieCard = ({ id, type = 'movie', title, genre, year, badgeText, posterUrl }) => {
  const [hovered, setHovered] = useState(false)
  const [trailerKey, setTrailerKey] = useState(null)
  const [overview, setOverview] = useState('')
  const timerRef = useRef(null)
  const fetched = useRef(false)

  // 예고편 우선순위 선택 (공식 트레일러 > 트레일러 > 티저 > 아무 YouTube 영상)
  const findTrailer = (vids) => {
    if (!vids || vids.length === 0) return null
    return (
      vids.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.official) ||
      vids.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
      vids.find(v => v.type === 'Teaser' && v.site === 'YouTube') ||
      vids.find(v => v.site === 'YouTube') ||
      null
    )
  }

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setHovered(true)
      if (!fetched.current) {
        fetched.current = true
        // 전 세계 예고편 3단계 탐색
        ;(async () => {
          let key = null

          // 1단계: 한국어 예고편
          const koRes = await EP.videos(type, id, 'ko-KR')
          key = findTrailer(koRes.data.results)?.key || null

          // 2단계: 영어(글로벌) 예고편
          if (!key) {
            const enRes = await EP.videos(type, id, 'en-US')
            key = findTrailer(enRes.data.results)?.key || null
          }

          // 3단계: 무차별 탐색 (언어 무관 전체) + 개요
          const detailRes = await EP.detail(type, id)
          setOverview(detailRes.data.overview || '')
          if (!key) {
            key = findTrailer(detailRes.data.videos?.results)?.key || null
          }

          if (key) setTrailerKey(key)
        })()
      }
    }, 600)
  }

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current)
    setHovered(false)
  }

  return (
    <Link
      to={`/${type}/${id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={twMerge(
        'group flex flex-col gap-3 transition-transform duration-300 w-full',
        !hovered && 'hover:-translate-y-2',
      )}
    >
      {/* 포스터 + 오버레이 컨테이너 */}
      <div className='relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-white/5'>
        <img
          src={posterUrl}
          alt={title}
          className='size-full object-cover transition-transform duration-500 group-hover:scale-110'
        />

        {badgeText && (
          <span className='absolute top-4 left-4 bg-secondary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10'>
            {badgeText}
          </span>
        )}

        {/* 호버 오버레이 */}
        <div
          className={twMerge(
            'absolute inset-0 flex flex-col bg-neutral-950 transition-opacity duration-300',
            hovered ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
        >
          {/* 예고편 영역 */}
          <div className='w-full aspect-video shrink-0 bg-neutral-900'>
            {trailerKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`}
                className='w-full h-full'
                allow='autoplay'
                title={title}
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center'>
                <i className='fa-solid fa-film text-neutral-700 text-3xl' />
              </div>
            )}
          </div>

          {/* 정보 영역 */}
          <div className='flex flex-col gap-2 p-4 flex-1 overflow-hidden'>
            <h3 className='text-white font-bold text-base leading-tight line-clamp-2'>{title}</h3>
            <div className='flex items-center gap-1.5 text-xs text-neutral-500'>
              {year && <span>{year}</span>}
              {year && genre && <span>·</span>}
              {genre && <span>{genre}</span>}
            </div>
            {overview ? (
              <p className='text-neutral-400 text-xs leading-relaxed line-clamp-4 mt-1'>
                {overview}
              </p>
            ) : (
              <div className='flex flex-col gap-1.5 mt-1'>
                <div className='h-2.5 bg-neutral-800 rounded animate-pulse w-full' />
                <div className='h-2.5 bg-neutral-800 rounded animate-pulse w-4/5' />
                <div className='h-2.5 bg-neutral-800 rounded animate-pulse w-3/5' />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 카드 하단 텍스트 */}
      <div className='flex flex-col px-1'>
        <h3 className='text-xl font-bold text-neutral-100 truncate group-hover:text-primary-400 transition-colors'>
          {title}
        </h3>
        <div className='flex items-center gap-2 text-sm text-neutral-500 mt-1'>
          <span>{genre}</span>
          <span className='text-xs opacity-30'>|</span>
          <span>{year}</span>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
