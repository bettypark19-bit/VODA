import React, { useState } from 'react'
import EpisodeCard from './EpisodeCard'

/**
 * EpisodeSection 컴포넌트 (Figma: Section_ep_list, node-id: 362:8167)
 * @param {Array} episodes - TMDB 에피소드 데이터 배열
 * @param {boolean} showTitle - 상단 타이틀 노출 여부 (기본값: true)
 */
const EpisodeSection = ({ episodes = [], showTitle = true }) => {
  // 1. 더보기 상태 관리 (초기값: false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  // 데이터가 없을 경우를 위한 방어 코드 (오류 방지)
  if (!episodes || episodes.length === 0) return null

  // 2. 출력할 에피소드 데이터 가공 (더보기 상태에 따라 5개 또는 전체)
  const displayedEpisodes = isExpanded ? episodes : episodes.slice(0, 5)

  return (
    <section className='px-20 py-8 w-full bg-zinc-950'>
      {/* 1. 상단 헤더: showTitle이 true일 때만 노출 */}
      {showTitle && (
        <div className='mb-8'>
          <h2 className='text-xl font-bold text-zinc-50'>
            에피소드 <span className='ml-2 text-zinc-500 font-medium text-lg'>{episodes.length}</span>
          </h2>
        </div>
      )}

      {/* 2. 에피소드 리스트 (레고 블록 쌓기) */}
      <div className='flex flex-col gap-6'>
        {displayedEpisodes.map((item) => (
          <EpisodeCard
            key={item.id}
            ep={item.episode_number}
            title={item.name}
            thumb={item.still_path}
            duration={item.runtime ? `${item.runtime}분` : '정보 없음'}
            overview={item.overview || '에피소드 줄거리가 없습니다.'}
            // 시청 기록 데이터가 연동될 경우 여기에 progress 전달 가능
            showStatus={false} 
          />
        ))}
      </div>

      {/* 3. [추가] 더보기 버튼 (에피소드가 5개보다 많을 때만 노출) */}
      {!isExpanded && episodes.length > 5 && (
        <div className='mt-10 flex justify-center'>
          <button 
            onClick={() => setIsExpanded(true)}
            className='px-12 py-4 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 font-serif text-lg hover:bg-zinc-800 hover:text-primary-400 transition-all cursor-pointer'
          >
            에피소드 더보기 ({episodes.length - 5}개)
          </button>
        </div>
      )}
    </section>
  )
}

export default EpisodeSection