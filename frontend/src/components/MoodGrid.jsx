import React from 'react'
import { twMerge } from 'tailwind-merge'
import { useNavigate } from 'react-router'

/**
 * MoodGrid 컴포넌트 (Bento Style Search Suggestions)
 * @param {Array} moods - 무드 데이터 배열 [{title, desc, img, mediaType, category, genre}]
 */
const MoodGrid = ({ moods = [] }) => {
  const navigate = useNavigate()
  
  // Bento 그리드 배치 스타일 (디자인 유지)
  const gridStyles = [
    'col-span-2 row-span-2', // 1번째: 대형
    'col-span-2 row-span-1', // 2번째: 가로 와이드
    'col-span-1 row-span-1', // 3번째: 소형
    'col-span-1 row-span-1'  // 4번째: 소형
  ]

  // 클릭 시 BrowsePage의 엔드포인트로 이동하는 핸들러
  const handleMoodClick = (mood) => {
    const { mediaType = 'movie', category = 'discover', title, genre } = mood
    
    // 쿼리 스트링 생성 (제목과 장르 ID 전달)
    const params = new URLSearchParams()
    if (title) params.set('title', title)
    if (genre) params.set('genre', genre)

    // 최종 경로 예시: /browse/movie/discover?title=가슴이+웅장해지는+액션&genre=28
    navigate(`/browse/${mediaType}/${category}?${params.toString()}`)
  }

  if (!moods || moods.length === 0) return null

  return (
    <section className='py-10 w-full'>
      <h2 className='text-3xl font-bold mb-8 text-zinc-50 font-sans tracking-tight'>
        지금 이런 분위기 어때요?
      </h2>

      <div className='grid grid-cols-4 grid-rows-2 gap-6 h-150'>
        {moods.slice(0, 4).map((mood, idx) => (
          <div
            key={idx}
            onClick={() => handleMoodClick(mood)}
            className={twMerge(
              'relative rounded-3xl overflow-hidden group cursor-pointer bg-zinc-900',
              gridStyles[idx]
            )}
          >
            {/* 배경 이미지 */}
            {mood.img && (
              <img
                src={mood.img}
                alt={mood.title}
                className='absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110'
              />
            )}

            {/* 그라데이션 오버레이 */}
            <div className='absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/20 to-transparent transition-opacity duration-300 group-hover:opacity-80' />

            {/* 텍스트 정보 */}
            <div className='absolute bottom-8 left-8 right-8 z-10'>
              <h3 className='text-2xl font-bold text-zinc-50 transform transition-transform duration-300 group-hover:-translate-y-1'>
                {mood.title}
              </h3>
              <p className='text-sm text-zinc-300 mt-2 opacity-80 line-clamp-1'>
                {mood.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MoodGrid