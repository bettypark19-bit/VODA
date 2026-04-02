import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import GenreTab from '../components/GenreTab'
import Feed from '../components/Feed'
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
      setHeroMovie(results[0])
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
        {/* 1. 랭킹 피드 (전체일 때만 표시하거나 상단 고정) */}
        {activeTab === 0 && (
          <Feed 
            type='rank' 
            title='지금 가장 뜨거운 영화' 
            sub='VODA에서 가장 많이 찾은 영화 랭킹' 
            items={rankMovies} 
            mediaType='movie' 
          />
        )}

        {/* 2. 장르별/전체 피드 */}
        <Feed 
          type='normal' 
          title={activeTab === 0 ? '추천 영화' : `${genres.find(g => g.id === activeTab)?.name} 영화`}
          sub='당신을 위해 엄선한 명작들'
          items={genreMovies} 
          mediaType='movie' 
        />

        {/* 3. 신작 피드 */}
        <Feed 
          type='normal' 
          title='막 올라온 따끈한 신작' 
          sub='극장에서 갓 내려온 최신 영화들'
          items={newMovies} 
          mediaType='movie' 
        />
      </div>

      <ChatBtn />
    </div>
  )
}

export default MoviePage
