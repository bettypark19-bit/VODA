import { useState } from 'react'
import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

/**
 * 작품 상세 정보 섹션 (줄거리 + 정보 그리드)
 * @param {string} overview - 줄거리 전체 텍스트
 * @param {Array} genres - TMDB genres 배열
 * @param {string} country - 제작 국가
 * @param {string} year - 개봉/방영 연도
 * @param {number} runtime - 러닝타임 (분)
 * @param {object} director - 감독 정보 { id, name }
 * @param {string} company - 제작사
 * @param {Array} cast - 출연 배우 이름 배열
 */
const Synopsis = ({ 
  overview, 
  genres = [], 
  country = '', 
  year = '', 
  runtime, 
  director, 
  company = '', 
  cast = [] 
}) => {
  const [expanded, setExpanded] = useState(false)

  // 데이터 가공
  const genreText = genres?.map(g => g.name).join(', ') ?? ''
  const castText = cast?.join(', ') ?? ''

  return (
    <div className='flex flex-col gap-12 w-full'>

      {/* 1. 시놉시스 섹션 (상단) */}
      <div className='flex flex-col gap-4'>
        <h2 className='font-serif font-bold text-xl text-zinc-50 opacity-60 uppercase'>시놉시스</h2>
        <div className='flex flex-col gap-2'>
          <p className={`font-serif font-medium text-lg text-zinc-300 leading-relaxed ${expanded ? '' : 'line-clamp-4'}`}>
            {overview || '등록된 줄거리가 없습니다.'}
          </p>
          
          {/* 글자수가 일정 이상일 때만 더보기 버튼 표시 */}
          {overview && overview.length > 200 && (
            <button
              onClick={() => setExpanded(prev => !prev)}
              className='flex items-center gap-1.5 text-primary-400 text-lg font-serif font-medium w-fit cursor-pointer hover:opacity-80 transition-opacity'
            >
              {expanded ? '접기' : '더보기'}
              <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} className='text-xs' />
            </button>
          )}
        </div>
      </div>

      {/* 2. 정보 그리드 섹션 (하단) */}
      <div className='grid grid-cols-3 gap-x-6 gap-y-10 border-t border-white/10 pt-10'>
        {/* 1행: 장르, 국가, 개봉 연도 */}
        <InfoCell label='장르' value={genreText} />
        <InfoCell label='국가' value={country} />
        <InfoCell label='개봉 연도' value={year} />

        {/* 2행: 러닝타임, 감독, 제작사 */}
        <InfoCell label='러닝타임' value={runtime ? `${runtime}분` : '-'} />
        
        <div className='flex flex-col gap-1.5'>
          <span className='font-serif font-medium text-sm text-white/50 tracking-widest uppercase'>감독</span>
          {director?.id ? (
            <Link 
              to={`/person/${director.id}`} 
              className='font-serif font-medium text-xl text-primary-400 leading-normal hover:underline transition-all'
            >
              {director.name}
            </Link>
          ) : (
            <span className='font-serif font-medium text-xl text-zinc-200 leading-normal'>
              {director?.name || '-'}
            </span>
          )}
        </div>
        
        <InfoCell label='제작사' value={company} />

        {/* 3행: 출연 (가로 전체 차지) */}
        <div className='col-span-3 flex flex-col gap-1.5'>
          <span className='font-serif font-medium text-sm text-white/50 tracking-widest uppercase'>출연</span>
          <p className='font-serif font-medium text-xl text-zinc-200 leading-normal'>
            {castText || '-'}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * 정보 그리드 내의 개별 셀 헬퍼 컴포넌트
 */
const InfoCell = ({ label, value }) => (
  <div className='flex flex-col gap-1.5'>
    <span className='font-serif font-medium text-sm text-white/50 tracking-widest uppercase'>{label}</span>
    <span className='font-serif font-medium text-xl text-zinc-200 leading-normal'>{value || '-'}</span>
  </div>
)

export default Synopsis
