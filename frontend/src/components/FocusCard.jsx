import { Link } from 'react-router'
import { EP } from '../api/tmdb'

/**
 * FocusCard (포커스 섹션 인물 카드 - Overlay+Border)
 * @param {string} title - 카드 제목 (예: 신인 발굴)
 * @param {string} desc - 설명 문구
 * @param {Array} avatars - 아바타 배열 [{ id, photo, name }]
 * @param {number} totalCount - 전체 인물 수
 * @param {string} to - 클릭 시 이동 경로
 */
const FocusCard = ({ 
  title, 
  desc, 
  avatars = [], 
  totalCount = 0, 
  to = '/person' 
}) => {
  // 표시할 아바타: 최대 3개
  const shown = avatars.slice(0, 3)
  
  // "+N" 카운터: 전체 인원 - 표시 아바타 수
  const extra = Math.max(totalCount - shown.length, 0)

  return (
    <Link
      to={to}
      className='bg-primary-950 border border-[rgba(189,157,255,0.2)] rounded-[36px] p-12 flex flex-col items-start justify-between w-full h-full min-h-[408px] transition-transform hover:scale-[1.02] active:scale-[0.98]'
    >
      {/* 상단: 제목 + 설명 */}
      <div className='flex flex-col gap-3 w-full mb-12'>
        <h3 className='font-serif font-medium text-4xl text-white leading-[48px]'>
          {title}
        </h3>
        <p className='font-serif font-medium text-2xl text-zinc-400 leading-9'>
          {desc}
        </p>
      </div>

      {/* 하단: 아바타 스택 */}
      <div className='flex items-center'>
        {shown.map((person, idx) => (
          <div
            key={person.id ?? idx}
            className='w-[60px] h-[60px] rounded-full border-[3px] border-[#0e0e13] overflow-hidden shrink-0 -mr-[18px] relative z-0'
          >
            {/* 이미지가 없을 경우 대체 UI (bg-zinc-800) */}
            {person.photo ? (
              <img
                src={EP.img(person.photo, 'w185')}
                alt={person.name || '인물 사진'}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full bg-zinc-800' />
            )}
          </div>
        ))}

        {/* "+N" 카운터 */}
        {extra > 0 && (
          <div className='w-[60px] h-[60px] rounded-full bg-[#25252d] border-[3px] border-[#0e0e13] flex items-center justify-center shrink-0 -mr-[18px] relative z-10'>
            <span className='font-sans font-normal text-[15px] text-white text-center leading-[22.5px]'>
              +{extra}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default FocusCard
