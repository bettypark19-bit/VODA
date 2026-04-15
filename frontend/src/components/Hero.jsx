import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { EP } from '../api/tmdb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlay, 
  faInfoCircle, 
  faStar, 
  faXmark, 
  faPlus, 
  faHeart, 
  faChevronLeft 
} from '@fortawesome/free-solid-svg-icons'
import DetailBtn from './DetailBtn'

const Hero = ({ 
  type = 'movie', 
  id,
  subtitle, 
  title, 
  overview, 
  backdrop, 
  poster,
  rating,
  videos = [],
  bgVideo // 직접 만든 영상 파일 URL
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  // 🔥 영상 상태 관리 (더 유연하게)
  const [isVideoReady, setIsVideoReady] = useState(false) 
  const [videoError, setVideoError] = useState(false)
  const playerRef = useRef(null)
  const timeoutRef = useRef(null)

  const findBestTrailer = (vids) => {
    if (!vids || vids.length === 0) return null
    const officialTrailer = vids.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.official)
    if (officialTrailer) return officialTrailer.key
    const trailer = vids.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    if (trailer) return trailer.key
    const anyYoutube = vids.find(v => v.site === 'YouTube')
    return anyYoutube ? anyYoutube.key : null
  }

  const derivedTrailerKey = useMemo(() => findBestTrailer(videos), [videos])
  const [fetchedTrailerKey, setFetchedTrailerKey] = useState(null)

  useEffect(() => {
    if (derivedTrailerKey) return
    if (bgVideo) return
    if (typeof id !== 'number' && !(typeof id === 'string' && /^\d+$/.test(id))) return
    if (id && !['person', 'home'].includes(type)) {
      const apiType = type === 'detail' ? location.pathname.split('/')[1] : type
      EP.detail(apiType, id).then(res => {
        const vids = res?.data?.videos?.results
        setFetchedTrailerKey(findBestTrailer(vids))
      }).catch(() => null)
    }
  }, [derivedTrailerKey, id, type, location.pathname])

  const trailerKey = derivedTrailerKey || fetchedTrailerKey

  // 🔥 YouTube IFrame API (최적화 버전)
  useEffect(() => {
    if (!trailerKey || bgVideo || videoError) return

    let player
    let checkInterval

    const initPlayer = () => {
      const playerEl = document.getElementById(`yt-bg-${id}`)
      if (!playerEl || !window.YT || !window.YT.Player) return

      // 기존 플레이어가 있으면 파괴 후 재생성 (중복 방지)
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy()
      }

      player = new window.YT.Player(`yt-bg-${id}`, {
        videoId: trailerKey,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: trailerKey,
          controls: 0,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            event.target.playVideo()
            // 넉넉하게 6초 대기 (네트워크 지연 고려)
            timeoutRef.current = setTimeout(() => {
              if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
                const state = playerRef.current.getPlayerState()
                if (state !== 1 && state !== 3) { // PLAYING(1) 혹은 BUFFERING(3)이 아니면 에러로 간주
                  setVideoError(true)
                }
              }
            }, 6000)
          },
          onStateChange: (event) => {
            if (event.data === 1) { // PLAYING 시작 시 즉시 사진 숨김
              setIsVideoReady(true)
              if (timeoutRef.current) clearTimeout(timeoutRef.current)
            }
          },
          onError: () => setVideoError(true)
        }
      })
      playerRef.current = player
    }

    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }

    checkInterval = setInterval(() => {
      if (window.YT && window.YT.Player && document.getElementById(`yt-bg-${id}`)) {
        clearInterval(checkInterval)
        initPlayer()
      }
    }, 300)

    return () => {
      clearInterval(checkInterval)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (player && player.destroy) player.destroy()
    }
  }, [trailerKey, bgVideo, id, videoError])

  const handleWatchNow = () => {
    if (trailerKey) setIsTrailerOpen(true)
    else alert('준비된 트레일러가 없습니다.')
  }

  const renderBackground = () => (
    <div className='absolute inset-0 overflow-hidden bg-neutral-950'>
      {/* 사진 레이어: 비디오 에러거나 아직 재생 전일 때 노출 */}
      <img 
        src={EP.bg(backdrop)} 
        alt={title} 
        className={`size-full object-cover object-top transition-opacity duration-1000 absolute inset-0 ${isVideoReady ? 'opacity-0 z-0' : 'opacity-100 z-10'}`} 
      />

      {/* 비디오 레이어 */}
      <div className={`size-full absolute inset-0 transition-opacity duration-1000 ${isVideoReady ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
        {bgVideo ? (
          <video 
            src={bgVideo} 
            autoPlay muted loop playsInline 
            onCanPlay={() => setIsVideoReady(true)}
            className='size-full object-cover object-top'
          />
        ) : (trailerKey && !videoError) ? (
          <div className='size-full scale-150 pointer-events-none'>
            <div id={`yt-bg-${id}`} className='size-full' />
          </div>
        ) : null}
      </div>

      {/* 오버레이 그라데이션 (항상 최상단) */}
      <div className='absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/60 to-transparent z-20' />
      <div className='absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-transparent z-20' />
    </div>
  )

  const renderTrailerModal = () => (
    isTrailerOpen && trailerKey && (
      <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-20'>
        <button onClick={() => setIsTrailerOpen(false)} className='absolute top-10 right-10 text-white text-3xl hover:text-primary-400 cursor-pointer z-[110]'>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className='w-full max-w-6xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl'>
          <iframe 
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} 
            className='w-full h-full' 
            allow='autoplay; fullscreen' 
            title="Trailer" 
          />
        </div>
      </div>
    )
  )
  
  if (type === 'person') {
    return (
      <section className='relative w-full h-150 flex items-center overflow-hidden bg-neutral-950 text-white'>
        <div className='absolute inset-0'>
          <img src={EP.bg(backdrop)} alt='' className='size-full object-cover object-top blur-2xl opacity-50 scale-110' />
          <div className='absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/40 to-transparent' />
          <div className='absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-transparent' />
        </div>
        <div className='relative z-30 w-full px-12 md:px-20 flex flex-row items-center gap-12 md:gap-20'>
          {poster && (
            <div className='hidden md:block shrink-0 w-80 aspect-3/4 rounded-2xl overflow-hidden shadow-2xl border border-white/10'>
              <img src={EP.img(poster, 'w500')} alt={title} className='size-full object-cover' />
            </div>
          )}
          <div className='flex flex-col items-start max-w-2xl text-left'>
            {subtitle && <p className='text-primary-400 text-lg font-bold tracking-widest uppercase mb-4 font-serif'>{subtitle}</p>}
            <h1 className='text-6xl md:text-7xl font-bold mb-6 font-serif leading-tight'>{title}</h1>
            {overview && <p className='text-lg md:text-xl text-neutral-300 leading-relaxed font-serif line-clamp-6 whitespace-pre-wrap'>{overview}</p>}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='relative w-full h-[85vh] min-h-175 overflow-hidden text-white'>
      {renderBackground()}

      {type === 'detail' && (
        <button 
          onClick={() => navigate(-1)}
          className='absolute top-32 left-12 md:left-20 z-30 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer group'
        >
          <FontAwesomeIcon icon={faChevronLeft} className='group-hover:-translate-x-1 transition-transform' />
          <span className='font-medium'>뒤로가기</span>
        </button>
      )}

      <div className='relative h-full flex flex-col justify-center px-12 md:px-20 max-w-5xl gap-6 z-30'>
        {rating && (
          <div className='flex items-center gap-2 text-secondary-400 font-bold text-lg'>
            <FontAwesomeIcon icon={faStar} />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
        <h1 className='text-6xl md:text-8xl font-bold tracking-tighter drop-shadow-2xl font-serif leading-none'>{title}</h1>
        <p className='text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl line-clamp-3 font-serif font-medium'>{overview}</p>
        
        <div className='flex items-center gap-4 mt-4'>
          <DetailBtn label='지금 시청하기' icon={<FontAwesomeIcon icon={faPlay} />} variant='primary' onClick={handleWatchNow} />
          <button
            onClick={() => setIsWishlisted(prev => !prev)}
            className={`flex items-center justify-center gap-2 rounded-full font-semibold px-7 py-3.5 transition-all ${isWishlisted ? 'bg-primary-500 text-white border-primary-500' : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md'}`}
          >
            <FontAwesomeIcon icon={isWishlisted ? faHeart : faPlus} />
            <span className='font-serif'>{isWishlisted ? '찜!' : '찜하기'}</span>
          </button>
          {type !== 'detail' && (
            <DetailBtn label='상세 정보' icon={<FontAwesomeIcon icon={faInfoCircle} />} variant='secondary' onClick={() => navigate(`/${type}/${id}`)} />
          )}
        </div>
      </div>
      {renderTrailerModal()}
    </section>
  )
}

export default Hero
