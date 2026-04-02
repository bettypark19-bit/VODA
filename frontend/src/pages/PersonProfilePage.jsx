import { useParams } from 'react-router'
import { EP } from '../api/tmdb'
import useFetch from '../hooks/useFetch'
import Hero from '../components/Hero'
import Feed from '../components/Feed'
import ChatBtn from '../components/ChatBtn'

/**
 * PersonProfilePage - 인물 상세 프로필 페이지
 * 특정 인물의 바이오그래피와 출연 영화/TV 목록을 표시합니다.
 */
const PersonProfilePage = () => {
  // 1. URL 파라미터에서 인물 ID 추출
  const { id } = useParams()

  // 2. 인물 상세 정보 데이터 호출 (combined_credits 포함)
  const { data: person, loading, error } = useFetch(EP.person(id))

  // 로딩 및 에러 처리
  if (loading) return <div className='min-h-screen bg-neutral-950 flex items-center justify-center text-zinc-400'>Loading...</div>
  if (error) return <div className='min-h-screen bg-neutral-950 flex items-center justify-center text-red-500'>인물 정보를 불러오는 데 실패했습니다.</div>
  if (!person) return null

  // 출연작 목록 추출 (combined_credits.cast)
  const castCredits = person.combined_credits?.cast || []

  return (
    <div className='bg-neutral-950 min-h-screen pb-20'>
      {/* 3. 인물 전용 히어로 섹션 */}
      <Hero
        type='person'
        title={person.name}
        img={person.profile_path}
      />

      {/* 4. 바이오그래피(Biography) 섹션 */}
      <section className='px-20 py-16'>
        <h2 className='text-3xl font-bold text-zinc-50 mb-6 font-sans'>소개</h2>
        <div className='max-w-5xl text-lg text-zinc-300 leading-relaxed font-serif whitespace-pre-wrap'>
          {person.biography || `${person.name}님에 대한 상세 정보가 준비 중입니다.`}
        </div>
      </section>

      {/* 5. 출연작 피드 (Feed type='normal') */}
      {castCredits.length > 0 && (
        <Feed
          type='normal'
          title='출연작'
          items={castCredits.map(item => ({
            ...item,
            type: item.media_type // 영화/TV 구분 데이터 주입
          }))}
        />
      )}

      {/* 6. AI 챗봇 버튼 추가 */}
      <ChatBtn />
    </div>
  )
}

export default PersonProfilePage