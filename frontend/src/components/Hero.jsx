import { EP } from '../api/tmdb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faInfoCircle, faStar } from '@fortawesome/free-solid-svg-icons'
import DetailBtn from './DetailBtn'

/**
 * Hero 컴포넌트
 * @param {string} type - 'home' | 'person' | 'detail'
 * @param {string} subtitle - 상단 소제목 (보라색 강조)
 * @param {string} title - 메인 제목
 * @param {string} description - 설명 텍스트
 * @param {string} backdrop - 배경 이미지 경로
 * @param {string} poster - 포스터 이미지 경로 (home 타입용)
 * @param {number} rating - 평점 (detail 타입용)
 */
const Hero = ({ 
  type = 'home', 
  subtitle, 
  title, 
  description, 
  backdrop, 
  poster, 
  rating 
}) => {
  
  // 1. 사람을 보다 (PersonPage) 전용 히어로: 좌측 정렬 + 사진 제거
  if (type === 'person') {
    return (
      <section className='relative w-full h-[500px] flex items-center overflow-hidden bg-[#0e0e13]'>
        {/* 장식용 보라색 그라데이션 포인트 (사진 대신 은은한 빛 효과) */}
        <div className='absolute -top-40 -left-40 w-96 h-96 bg-primary-600/10 blur-[120px] rounded-full' />
        <div className='absolute top-1/2 -right-40 w-80 h-80 bg-secondary-600/5 blur-[100px] rounded-full' />

        {/* 좌측 텍스트 컨텐츠 */}
        <div className='relative z-10 w-full px-12 md:px-20 text-left flex flex-col items-start'>
          {subtitle && (
            <p className='text-primary-400 text-lg font-bold tracking-[0.25em] uppercase mb-4 font-serif'>
              {subtitle}
            </p>
          )}
          <h1 className='text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight'>
            {title}
          </h1>
          {description && (
            <p className='text-xl md:text-2xl text-neutral-400 leading-relaxed max-w-3xl font-serif font-medium pl-2 md:pl-4 whitespace-pre-wrap'>
              {description}
            </p>
          )}
        </div>
      </section>
    )
  }

  // 2. 기본/상세/홈 히어로 (영화/TV)
  return (
    <section className='relative w-full h-[85vh] min-h-[700px] overflow-hidden'>
      {/* 배경 이미지 */}
      <div className='absolute inset-0'>
        <img 
          src={EP.bg(backdrop)} 
          alt={title} 
          className='size-full object-cover object-top'
        />
        <div className='absolute inset-0 bg-linear-to-r from-[#0e0e13] via-[#0e0e13]/60 to-transparent' />
        <div className='absolute inset-0 bg-linear-to-t from-[#0e0e13] via-transparent to-transparent' />
      </div>

      {/* 콘텐츠 */}
      <div className='relative h-full flex flex-col justify-center px-12 md:px-20 max-w-5xl gap-6'>
        {rating && (
          <div className='flex items-center gap-2 text-secondary-400 font-bold text-lg'>
            <FontAwesomeIcon icon={faStar} />
            <span>{rating.toFixed(1)}</span>
            <span className='text-neutral-500 text-sm font-normal ml-1'>/ 10</span>
          </div>
        )}

        <h1 className='text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl'>
          {title}
        </h1>

        <p className='text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl line-clamp-3 drop-shadow-md font-serif font-medium'>
          {description}
        </p>

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
