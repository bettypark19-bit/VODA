import { EP } from '../api/tmdb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faInfoCircle, faStar } from '@fortawesome/free-solid-svg-icons'
import DetailBtn from './DetailBtn'

const Hero = ({ type = 'default', title, backdrop, overview, rating, img, department }) => {
  // 인물 전용 히어로
  if (type === 'person') {
    return (
      <section className='relative w-full h-96 overflow-hidden flex items-end'>
        <div className='absolute inset-0'>
          <img
            src={EP.img(img, 'h632')}
            alt={title}
            className='size-full object-cover object-top'
          />
          <div className='absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/70 to-transparent' />
          <div className='absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-transparent' />
        </div>
        <div className='relative px-12 md:px-20 pb-14 flex flex-col gap-2'>
          {department && (
            <span className='text-primary-400 font-semibold text-lg'>{department}</span>
          )}
          <h1 className='text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl'>
            {title}
          </h1>
        </div>
      </section>
    )
  }

  // 기본 히어로 (영화/TV)
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
          <DetailBtn
            label='지금 시청하기'
            icon={<FontAwesomeIcon icon={faPlay} />}
            variant='primary'
          />
          <DetailBtn
            label='상세 정보'
            icon={<FontAwesomeIcon icon={faInfoCircle} />}
            variant='secondary'
          />
        </div>

      </div>
    </section>
  )
}

export default Hero
