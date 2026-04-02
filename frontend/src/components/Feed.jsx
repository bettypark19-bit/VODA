import { twMerge } from 'tailwind-merge'
import SectionTitle from './SectionTitle'
import MovieCard from './MovieCard'
import RankCard from './RankCard'
import HCard from './HCard'

/**
 * Feed 컴포넌트: 섹션 타이틀과 카드 리스트를 포함하는 공통 섹션
 * @param {string} type - 'normal' | 'rank' | 'play'
 * @param {string} title - 섹션 제목
 * @param {string} sub - 부제목 (옵션)
 * @param {Array} items - 표시할 아이템 배열
 * @param {string} mediaType - 'movie' | 'tv'
 * @param {string} link - 전체보기 클릭 시 이동할 경로
 */
const Feed = ({ type = 'normal', title, sub, items = [], mediaType = 'movie', link }) => {
  if (!items || items.length === 0) return null

  return (
    <section className='w-full'>
      {/* 섹션 헤더 */}
      <SectionTitle 
        title={title} 
        sub={sub} 
        showMore={!!link} 
        onMoreClick={() => link && (window.location.href = link)} 
      />

      {/* 카드 리스트 (가로 스크롤) */}
      <div className={twMerge(
        'flex gap-6 overflow-x-auto pb-8 no-scrollbar pt-4',
        type === 'rank' && 'gap-10' // 랭킹 카드는 간격을 조금 더 넓게
      )}>
        {items.map((item, idx) => {
          if (type === 'rank') {
            return (
              <RankCard
                key={item.id}
                rank={idx + 1}
                id={item.id}
                type={mediaType}
                title={item.title || item.name}
                poster={item.poster_path}
                genre={item.genre_ids?.[0] ? (mediaType === 'movie' ? '영화' : 'TV') : ''}
              />
            )
          }

          if (type === 'play') {
            return (
              <HCard
                key={item.id}
                id={item.id}
                type={mediaType}
                title={item.title || item.name}
                poster={item.backdrop_path || item.poster_path}
                progress={item.progress || 0}
              />
            )
          }

          // Default: normal
          return (
            <div key={item.id} className='min-w-72 md:min-w-80'>
              <MovieCard
                id={item.id}
                title={item.title || item.name}
                genre={item.genre_ids?.[0]}
                year={(item.release_date || item.first_air_date)?.slice(0, 4)}
                posterUrl={item.poster_path}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Feed
