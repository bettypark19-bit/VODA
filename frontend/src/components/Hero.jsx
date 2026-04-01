import { EP } from '../api/tmdb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faInfoCircle, faStar } from '@fortawesome/free-solid-svg-icons'

const Hero = ({ title, backdrop, overview, rating }) => {
  return (
    <section className='relative w-full h-[85vh] overflow-hidden'>
      {/* 배경 이미지 (그라데이션 오버레이 포함) */}
      <div className='absolute inset-0'>
        <img 
          src={EP.bg(backdrop)} 
          alt={title} 
          className='size-full object-cover object-top'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-base via-base/60 to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent' />
      </div>

      {/* 콘텐츠 */}
      <div className='relative h-full flex flex-col justify-center px-12 md:px-20 max-w-4xl gap-6'>
        
        {/* 평점 */}
        <div className='flex items-center gap-2 text-secondary-400 font-bold text-lg'>
          <FontAwesomeIcon icon={faStar} />
          <span>{rating?.toFixed(1) || '0.0'}</span>
          <span className='text-neutral-500 text-sm font-normal ml-1'>/ 10</span>
        </div>

        {/* 타이틀 */}
        <h1 className='text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl'>
          {title}
        </h1>

        {/* 개요 */}
        <p className='text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl line-clamp-3 drop-shadow-md'>
          {overview}
        </p>

        {/* 버튼 */}
        <div className='flex items-center gap-4 mt-4'>
          <button className='bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-primary-500/20'>
            <FontAwesomeIcon icon={faPlay} />
            지금 시청하기
          </button>
          <button className='bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 transition-all backdrop-blur-md'>
            <FontAwesomeIcon icon={faInfoCircle} />
            상세 정보
          </button>
        </div>

      </div>
    </section>
  )
}

export default Hero
