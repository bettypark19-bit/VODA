import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import GenreTab from '../components/GenreTab'
import Feed from '../components/Feed'
import { EP } from '../api/tmdb'
import ChatBtn from '../components/ChatBtn'

const TVPage = () => {
  const [heroMovie, setHeroMovie] = useState(null)
  const [genres, setGenres] = useState([{ id: 0, name: '전체' }])
  const [activeTab, setActiveTab] = useState(0)
  
  const [rankMovies, setRankMovies] = useState([])
  const [newMovies, setNewMovies] = useState([])
  const [genreMovies, setGenreMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    EP.genres('tv').then((res) => {
      setGenres([{ id: 0, name: '전체' }, ...res.data.genres])
    })

    EP.popular('tv').then((res) => {
      const results = res.data.results
      setHeroMovie(results[Math.floor(Math.random() * results.length)])
      setRankMovies(results.slice(0, 10))
      setLoading(false)
    })

    EP.nowPlaying('tv').then((res) => {
      setNewMovies(res.data.results)
    })
  }, [])

  useEffect(() => {
    const params = activeTab !== 0 ? { with_genres: activeTab } : {}
    EP.discover('tv', params).then((res) => {
      setGenreMovies(res.data.results)
    })
  }, [activeTab])

  if (loading) return <div className='p-20 text-center text-zinc-500'>로딩 중...</div>

  return (
    <div className='bg-neutral-950 min-h-screen pb-32'>
      {/* 히어로 섹션 */}
      {heroMovie && (
        <Hero
          type='tv'
          id={heroMovie.id}
          title={heroMovie.name}
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
            title='지금 가장 뜨거운 TV'
            sub='VODA에서 가장 많이 찾은 TV 랭킹'
            items={rankMovies}
            mediaType='tv'
            link='/browse/tv/popular?title=지금+가장+뜨거운+TV'
          />
        )}

        {/* 2. 장르별/전체 피드 */}
        <Feed
          type='normal'
          title={activeTab === 0 ? '추천 TV' : `${genres.find(g => g.id === activeTab)?.name} TV`}
          sub='당신을 위해 엄선한 명작들'
          items={genreMovies}
          mediaType='tv'
          link={
            activeTab === 0
              ? '/browse/tv/discover?title=추천+TV'
              : `/browse/tv/discover?title=${encodeURIComponent(genres.find(g => g.id === activeTab)?.name + ' TV')}&genre=${activeTab}`
          }
        />

        {/* 3. 신작 피드 */}
        <Feed
          type='normal'
          title='막 올라온 따끈한 신작'
          sub='지금 방영 중인 최신 TV 시리즈'
          items={newMovies}
          mediaType='tv'
          link='/browse/tv/on_the_air?title=막+올라온+따끈한+신작'
        />
      </div>

      <ChatBtn />
    </div>
  )
}

export default TVPage