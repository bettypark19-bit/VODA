import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { EP } from '../api/tmdb'
import PersonCard from '../components/PersonCard'
import useDragScroll from '../hooks/useDragScroll'

const PersonCategoryPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const title = searchParams.get('title') || '인물 전체보기'
  const category = searchParams.get('category') || 'popular'

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, onDragStart, onClickCapture } = useDragScroll()

  useEffect(() => {
    setLoading(true)
    // 인물 카테고리 데이터를 한꺼번에 많이 가져와서 가로로 길게 배치 (전체보기 느낌)
    EP.browsePerson(category, 1)
      .then(res => {
        setItems(res.data.results || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category])

  return (
    <div className='bg-zinc-950 min-h-screen pb-32'>
      <div className='px-12 pt-20'>
        {/* 뒤로가기 + 제목 */}
        <div className='flex items-center gap-4 mb-10'>
          <button
            onClick={() => navigate(-1)}
            className='w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:border-primary-400 hover:text-primary-400 transition-colors bg-transparent cursor-pointer'
          >
            <i className='fa-solid fa-arrow-left text-sm' />
          </button>
          <div className='flex items-center gap-2.5'>
            <div className='w-3 h-12 bg-primary-400 rounded-full shrink-0' />
            <h1 className='font-serif font-bold text-4xl text-neutral-50'>{title}</h1>
          </div>
        </div>

        {loading ? (
          <div className='text-center text-neutral-500 py-40'>로딩 중...</div>
        ) : (
          <div 
            ref={ref}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onDragStart={onDragStart}
            onClickCapture={onClickCapture}
            className='flex gap-8 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none pb-10 pt-4'
          >
            {items.map(person => (
              <div key={person.id} className='w-80 shrink-0'>
                <PersonCard
                  id={person.id}
                  name={person.name}
                  role={person.known_for_department}
                  img={person.profile_path}
                />
              </div>
            ))}
            
            {items.length === 0 && (
              <div className='text-center text-neutral-500 w-full py-20'>
                표시할 인물이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonCategoryPage
