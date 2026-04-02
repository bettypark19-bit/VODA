import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import useFetch from '../hooks/useFetch'
import { EP } from '../api/tmdb'
import PersonCard from '../components/PersonCard'

// 감독/출연 카테고리 페이지 — EP.personPopular() 데이터로 grid 표시
const PersonCategoryPage = () => {
  const navigate = useNavigate()
  const { data, loading, err } = useFetch(() => EP.personPopular(), [])

  return (
    <div className='min-h-screen bg-zinc-950 px-16 py-10'>

      {/* 상단 헤더 — 뒤로가기 + 제목 */}
      <div className='flex items-center gap-4 mb-10'>
        <button
          onClick={() => navigate(-1)}
          className='text-primary-400 transition-transform duration-300 transform hover:-translate-x-1'
          aria-label='뒤로가기'
        >
          <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
        </button>
        <h1 className='text-zinc-50 text-2xl font-bold font-serif'>감독/출연</h1>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <p className='text-zinc-400 text-center py-20'>로딩 중...</p>
      )}

      {/* 에러 상태 */}
      {err && (
        <p className='text-red-400 text-center py-20'>데이터를 불러오지 못했습니다.</p>
      )}

      {/* 인물 그리드 */}
      {data && (
        <div className='grid grid-cols-5 gap-6'>
          {data.results.map(person => (
            <PersonCard
              key={person.id}
              id={person.id}
              name={person.name}
              role={person.known_for_department}
              img={person.profile_path}
            />
          ))}
        </div>
      )}

    </div>
  )
}

export default PersonCategoryPage
