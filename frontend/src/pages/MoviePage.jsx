import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import GenreTab from '../components/GenreTab'
import Feed from '../components/Feed'
import ChatBubble from '../components/ChatBubble' // ChatBubble 추가
import { EP } from '../api/tmdb'
import ChatBtn from '../components/ChatBtn'

const MoviePage = () => {
  const [heroMovie, setHeroMovie] = useState(null)
  const [genres, setGenres] = useState([{ id: 0, name: '전체' }])
  const [activeTab, setActiveTab] = useState(0)
  
  const [rankMovies, setRankMovies] = useState([])
  const [newMovies, setNewMovies] = useState([])
  const [genreMovies, setGenreMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. 장르 목록 가져오기
    EP.genres('movie').then((res) => {
      setGenres([{ id: 0, name: '전체' }, ...res.data.genres])
    })

    // 2. 히어로 및 랭킹 데이터
    EP.popular('movie').then((res) => {
      const results = res.data.results
      setHeroMovie(results[Math.floor(Math.random() * results.length)])
      setRankMovies(results.slice(0, 10))
      setLoading(false)
    })

    // 3. 최신 개봉작
    EP.nowPlaying('movie').then((res) => {
      setNewMovies(res.data.results)
    })
  }, [])

  // 장르 탭 변경 시 해당 장르 영화 가져오기
  useEffect(() => {
    const params = activeTab !== 0 ? { with_genres: activeTab } : {}
    EP.discover('movie', params).then((res) => {
      setGenreMovies(res.data.results)
    })
  }, [activeTab])

  if (loading) return <div className='p-20 text-center text-zinc-500'>로딩 중...</div>

  return (
    <div className='bg-neutral-950 min-h-screen pb-32'>
      {/* 히어로 섹션 */}
      {heroMovie && (
        <Hero
          type='movie'
          id={heroMovie.id}
          title={heroMovie.title}
          backdrop={heroMovie.backdrop_path}
          poster={heroMovie.poster_path}
          overview={heroMovie.overview}
          rating={heroMovie.vote_average}
        />
      )}

      {/* 장르 탭 */}
      <GenreTab 
        tabs={genres} 
        active={activeTab} 
        onChange={setActiveTab} 
      />

      <div className='px-12 mt-12 flex flex-col gap-10'>
        {/* 1. 랭킹 피드 */}
        {activeTab === 0 && (
          <Feed
            type='rank'
            title='지금 가장 뜨거운 영화'
            sub='VODA에서 가장 많이 찾은 영화 랭킹'
            items={rankMovies}
            mediaType='movie'
            link='/browse/movie/popular?title=지금+가장+뜨거운+영화'
          />
        )}

        {/* 2. 장르별/전체 피드 */}
        <Feed
          type='normal'
          title={activeTab === 0 ? '추천 영화' : `${genres.find(g => g.id === activeTab)?.name} 영화`}
          sub='당신을 위해 엄선한 명작들'
          items={genreMovies}
          mediaType='movie'
          link={
            activeTab === 0
              ? '/browse/movie/discover?title=추천+영화'
              : `/browse/movie/discover?title=${encodeURIComponent(genres.find(g => g.id === activeTab)?.name + ' 영화')}&genre=${activeTab}`
          }
        />

        {/* 3. 신작 피드 */}
        <Feed
          type='normal'
          title='막 올라온 따끈한 신작'
          sub='극장에서 갓 내려온 최신 영화들'
          items={newMovies}
          mediaType='movie'
          link='/browse/movie/now_playing?title=막+올라온+따끈한+신작'
        />

        {/* [임시] ChatBubble 디자인 미리보기 섹션 */}
        <section className='mt-10 mb-20 max-w-3xl mx-auto w-full'>
          <div className='flex items-center gap-2.5 mb-8'>
            <div className='w-3 h-12 bg-primary-400 rounded-full' />
            <h2 className='font-serif font-bold text-3xl text-neutral-50'>AI 챗봇 디자인 미리보기 (확정안)</h2>
          </div>
          
          <div className='bg-zinc-900/30 p-10 rounded-[32px] border border-white/5 flex flex-col gap-6'>
            <ChatBubble 
              msg='안녕하세요! VODA의 AI 큐레이터입니다. 원하시는 장르나 분위기의 영화가 있으신가요?' 
              isAi={true} 
            />
            
            <ChatBubble 
              msg='주말에 가족들과 함께 보기 좋은 따뜻한 픽사 애니메이션 추천해줘!' 
              isAi={false} 
            />
            
            <ChatBubble 
              msg='가족과 함께라면 <코코>를 강력 추천드립니다! 사후 세계를 다룬 아름다운 영상미와 감동적인 음악이 어우러져 가족 모두에게 특별한 추억이 될 거예요.' 
              isAi={true} 
            />
          </div>
        </section>
      </div>

      <ChatBtn />
    </div>
  )
}

export default MoviePage
