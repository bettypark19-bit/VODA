import { useState, useRef } from 'react'
import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'
import { EP } from '../api/tmdb'

const RankCard = ({ rank, id, type = 'movie', title, poster, genre, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const [trailerKey, setTrailerKey] = useState(null)
  const [overview, setOverview] = useState('')
  const timerRef = useRef(null)
  const fetched = useRef(false)

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

  const handleClick = onClick ? (e) => { e.preventDefault(); onClick() } : undefined

  return (
    <Link
      to={`/${type}/${id}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='w-58 flex-shrink-0 relative block'
    >
      {/* 순위 숫자 — 오버레이 시 숨김 */}
      {!hovered && (
        <span className='absolute -left-6 bottom-14 text-8xl font-bold text-white/80 font-sans drop-shadow-lg z-10'>
          {rank}
        </span>
      )}

      <div className={twMerge(
        'relative aspect-[2/3] rounded-3xl overflow-hidden transition-all duration-300',
        hovered && 'ring-2 ring-primary-400/50',
      )}>
        <img
          src={EP.img(poster)}
          alt={title}
          className='size-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent' />

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
            {/* 순위 뱃지 */}
            <div className='flex items-center gap-2'>
              <span className='text-primary-400 font-bold text-2xl font-sans'>{rank}</span>
              <h3 className='text-white font-bold text-sm leading-tight line-clamp-2'>{title}</h3>
            </div>
            {overview ? (
              <p className='text-neutral-400 text-xs leading-relaxed line-clamp-4'>
                {overview}
              </p>
            ) : (
              <div className='flex flex-col gap-1.5'>
                <div className='h-2.5 bg-neutral-800 rounded animate-pulse w-full' />
                <div className='h-2.5 bg-neutral-800 rounded animate-pulse w-4/5' />
                <div className='h-2.5 bg-neutral-800 rounded animate-pulse w-3/5' />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='mt-2'>
        <h3 className='text-xl font-medium truncate text-zinc-50'>{title}</h3>
        <p className='text-sm text-zinc-400 mt-1'>{genre}</p>
      </div>
    </Link>
  )
}

export default RankCard
