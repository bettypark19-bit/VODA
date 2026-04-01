import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'

const MovieCard = ({ id, type = 'movie', title, genre, year, badgeText, posterUrl, size = 'sm' }) => {
  const widthClass = size === 'sm' ? 'w-full' : 'w-full' // Flex container will handle width

  return (
    <Link 
      to={`/${type}/${id}`} 
      className={twMerge('group flex flex-col gap-3 transition-transform duration-300 hover:-translate-y-2', widthClass)}
    >
      {/* 포스터 컨테이너 */}
      <div className='relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-white/5'>
        <img 
          src={posterUrl} 
          alt={title} 
          className='size-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
        
        {/* 배지 (badgeText) */}
        {badgeText && (
          <span className='absolute top-4 left-4 bg-secondary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg'>
            {badgeText}
          </span>
        )}

        {/* 오버레이 (호버 시) */}
        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      </div>

      {/* 정보 섹션 */}
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
