import { useParams } from 'react-router'
import { EP } from '../api/tmdb'
import useFetch from '../hooks/useFetch'
import Hero from '../components/Hero'
import Synopsis from '../components/Synopsis-ls'
import CastSection from '../components/CastSection'
import ScoreSummary from '../components/ScoreSummary'
import ReviewCard from '../components/ReviewCard'
import Feed from '../components/Feed'
import ChatBtn from '../components/ChatBtn'
import EpisodeSection from '../components/EpisodeSection'

/**
 * AboutPage - 콘텐츠 상세 정보 페이지 (영화/TV 공용)
 */
const AboutPage = () => {
  // 1. URL 파라미터 추출 (type: movie 또는 tv, id: 콘텐츠 ID)
  const { type, id } = useParams()

  // 2. 상세 데이터 호출 (credits, reviews, videos, similar 포함)
  const { data, loading, error } = useFetch(EP.detail(type, id))

  // 3. TV 시리즈일 경우 시즌 1 에피소드 데이터 추가 호출
  const isTv = type === 'tv'
  const { data: seasonData } = useFetch(isTv ? EP.season(id, 1) : null)

  // 로딩 및 에러 처리
  if (loading) return <div className='min-h-screen bg-neutral-950 flex items-center justify-center text-zinc-400'>Loading...</div>
  if (error || !data) return <div className='min-h-screen bg-neutral-950 flex items-center justify-center text-red-500'>데이터를 불러오는 중 오류가 발생했습니다.</div>

  return (
    <main className='bg-neutral-950 min-h-screen pb-20'>
      {/* 히어로 섹션: 배경 이미지 및 타이틀 표시 */}
      <Hero 
        type={type} 
        title={data.title || data.name} 
        img={data.backdrop_path} 
      />

      <div className='px-20 space-y-16 mt-12'>
        {/* 시놉시스 및 상세 정보 (장르, 출시일, 러닝타임) */}
        <Synopsis 
          text={data.overview}
          genres={data.genres?.map(g => g.name).join(', ')}
          date={data.release_date || data.first_air_date}
          runtime={data.runtime || (data.episode_run_time && data.episode_run_time[0])}
        />

        {/* 출연진 섹션 (최대 10명 표시) */}
        <CastSection casts={data.credits?.cast} />

        {/* TV 시리즈 전용 에피소드 목록 섹션 */}
        {isTv && seasonData && (
          <EpisodeSection 
            episodes={seasonData.episodes} 
            showTitle={data.name} 
          />
        )}

        {/* 평점 요약 섹션 */}
        <div className='flex justify-center'>
          <ScoreSummary 
            score={data.vote_average} 
            count={data.vote_count} 
          />
        </div>

        {/* 리뷰 섹션 */}
        <section>
          <h2 className='text-xl font-bold text-zinc-50 mb-6 font-sans'>사용자 리뷰</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {data.reviews?.results?.slice(0, 4).map(review => (
              <ReviewCard 
                key={review.id}
                author={review.author}
                content={review.content}
                rating={review.author_details?.rating}
                date={review.created_at}
              />
            ))}
            {(!data.reviews?.results || data.reviews.results.length === 0) && (
              <p className='text-zinc-500'>작성된 리뷰가 없습니다.</p>
            )}
          </div>
        </section>

        {/* 하단 비슷한 작품 피드 */}
        <Feed 
          type='normal' 
          title='비슷한 작품' 
          items={data.similar?.results?.map(item => ({ ...item, type }))} 
        />
      </div>

      {/* 우측 하단 고정 AI 챗봇 버튼 */}
      <ChatBtn />
    </main>
  )
}

export default AboutPage