import React from 'react'
import { twMerge } from 'tailwind-merge'

/**
 * MoodGrid 컴포넌트 (Bento Style Search Suggestions)
 * @param {Array} moods - 무드 데이터 배열 [{title, desc, img}] (최대 4개 권장)
 * @param {Function} onItemClick - 아이템 클릭 시 실행될 콜백 (클릭된 mood 객체 전달)
 */
const MoodGrid = ({ moods = [], onItemClick }) => {
  
  // 그리드 배치를 위한 레고 블록 설정 (주문서의 위치 정보)
  const gridStyles = [
    'col-span-2 row-span-2', // 1번째: 대형 (2x2)
    'col-span-2 row-span-1', // 2번째: 가로 와이드 (2x1)
    'col-span-1 row-span-1', // 3번째: 소형 (1x1)
    'col-span-1 row-span-1'  // 4번째: 소형 (1x1)
  ]

  // 데이터가 없을 경우 방어 코드
  if (!moods || moods.length === 0) return null

  return (
    <section className='py-10 w-full'>
      {/* 상단 타이틀 */}
      <h2 className='text-3xl font-bold mb-8 text-zinc-50 font-sans tracking-tight'>
        지금 이런 분위기 어때요?
      </h2>

      {/* Bento 그리드 영역 (h-150 = 600px) */}
      <div className='grid grid-cols-4 grid-rows-2 gap-6 h-150'>
        {moods.slice(0, 4).map((mood, idx) => (
          <div
            key={idx}
            onClick={() => onItemClick?.(mood)}
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

            {/* 그라데이션 오버레이 (텍스트 가독성) */}
            <div className='absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent transition-opacity duration-300 group-hover:opacity-80' />

            {/* 하단 텍스트 정보 */}
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