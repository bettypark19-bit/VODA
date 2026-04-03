import { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { EP } from '../api/tmdb'

const HCard = ({ id, type, title, poster, genre, runtime, vote_average, showCurator = false }) => {
  const navigate = useNavigate()
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

          // 3단계: 무차별 탐색 + 개요
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
    <div
      onClick={() => navigate(`/${type}/${id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='w-110 flex-shrink-0 cursor-pointer'
    >
      <div className='relative rounded-2xl overflow-hidden border-2 border-neutral-800 bg-neutral-900/40 backdrop-blur-md flex flex-col'>
        {/* 썸네일 */}
        <div className='aspect-video overflow-hidden'>
          <img
            src={EP.img(poster, 'w780')}
            alt={title}
            className='size-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        </div>

        {/* 카드 하단 정보 */}
        <div className='p-5 flex flex-col gap-1'>
          <div className='flex items-center justify-between'>
            {showCurator
              ? <span className='text-sm font-bold text-secondary-500'>CURATOR'S CHOICE</span>
              : <span />
            }
            <div className='flex items-center gap-1'>
              <i className='fa-solid fa-star text-primary-400 text-sm' />
              <span className='text-sm font-bold text-primary-400'>{vote_average?.toFixed(1)}</span>
            </div>
          </div>
          <h3 className='text-2xl font-regular text-neutral-50 truncate'>{title}</h3>
          <p className='text-sm text-neutral-400'>{genre} • {runtime}분</p>
        </div>

        {/* 호버 오버레이 — 카드 전체 덮기 */}
        <div
          className={`absolute inset-0 flex flex-col bg-neutral-950 transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* 예고편 (16:9) */}
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

          {/* 개요 */}
          <div className='flex flex-col gap-2 p-4 flex-1 overflow-hidden'>
            <h3 className='text-white font-bold text-base leading-tight truncate'>{title}</h3>
            {overview ? (
              <p className='text-neutral-400 text-xs leading-relaxed line-clamp-3'>
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
    </div>
  )
}

export default HCard
