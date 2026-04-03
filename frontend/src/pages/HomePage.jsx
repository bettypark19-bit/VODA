import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import Feed from '../components/Feed' // 통합된 Feed 컴포넌트 임포트
import { EP } from '../api/tmdb'
import ChatBtn from '../components/ChatBtn'

const HomePage = () => {
  const [heroMovie, setHeroMovie] = useState(null)
  const [popularMovies, setPopularMovies] = useState([])
  const [newMovies, setNewMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 데이터 페칭 로직
    Promise.all([
      EP.popular('movie'),
      EP.nowPlaying('movie'),
      EP.topRated('movie')
    ]).then(([pop, now, top]) => {
      const popResults = pop.data.results
      setHeroMovie(popResults[Math.floor(Math.random() * popResults.length)])
      setPopularMovies(popResults)
      setNewMovies(now.data.results)
      setTopRatedMovies(top.data.results)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

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

      <div className='px-12 mt-12 flex flex-col gap-16'>
        
        {/* 1. 이어보기 섹션 */}
        <Feed
          type='play'
          title='시청 중인 콘텐츠'
          sub='이어보기'
          items={popularMovies.slice(0, 5)}
          mediaType='movie'
          link='/browse/movie/popular?title=시청+중인+콘텐츠'
        />

        {/* 2. 인기 섹션 */}
        <Feed
          type='rank'
          title='지금 가장 핫한 콘텐츠'
          sub='인기 영화'
          items={popularMovies}
          mediaType='movie'
          link='/browse/movie/popular?title=지금+가장+핫한+콘텐츠'
        />

        {/* 3. 신작 섹션 */}
        <Feed
          type='normal'
          title='막 올라온 따끈한 신작'
          sub='최신 개봉작'
          items={newMovies}
          mediaType='movie'
          link='/browse/movie/now_playing?title=막+올라온+따끈한+신작'
        />

        {/* 4. 평점 높은 섹션 */}
        <Feed
          type='normal'
          title='VODA 유저들이 사랑하는 명작'
          sub='평점 TOP 영화'
          items={topRatedMovies}
          mediaType='movie'
          link='/browse/movie/top_rated?title=VODA+유저들이+사랑하는+명작'
        />
      </div>

      <ChatBtn />
    </div>
  )
}

export default HomePage