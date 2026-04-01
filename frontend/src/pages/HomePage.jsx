import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import MovieCard from '../components/MovieCard'
import { EP } from '../api/tmdb'

const toMovieProps = (movie, badgeText) => ({
  id: movie.id,
  title: movie.title,
  genre: movie.genre_ids?.[0] ?? '',
  year: movie.release_date?.slice(0, 4) ?? '',
  badgeText,
  posterUrl: EP.img(movie.poster_path),
})

const HomePage = () => {
  const [heroMovie, setHeroMovie] = useState(null)
  const [popularMovies, setPopularMovies] = useState([])
  const [newMovies, setNewMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])

  useEffect(() => {
    // 히어로 섹션용 인기 영화 1위 데이터
    EP.popular('movie').then((res) => {
      const results = res.data.results
      setHeroMovie(results[0])
      setPopularMovies(results.map((m) => toMovieProps(m, '인기')))
    })

    // 최신 영화 (상영 중)
    EP.nowPlaying('movie').then((res) => {
      setNewMovies(res.data.results.map((m) => toMovieProps(m, '최신')))
    })

    // 높은 평점 영화
    EP.topRated('movie').then((res) => {
      setTopRatedMovies(res.data.results.map((m) => toMovieProps(m, 'TOP')))
    })
  }, [])

  return (
    <div className='bg-base min-h-screen pb-24'>
      {/* 1. 히어로 섹션 */}
      {heroMovie && (
        <Hero
          title={heroMovie.title}
          backdrop={heroMovie.backdrop_path}
          overview={heroMovie.overview}
          rating={heroMovie.vote_average}
        />
      )}

      {/* 2. 콘텐츠 섹션 (Feeds) */}
      <div className='flex flex-col gap-20 mt-16 px-12'>
        
        {/* 인기 영화 섹션 */}
        <section>
          <SectionTitle title='지금 가장 핫한 콘텐츠' subtitle='인기 영화' link='/movie' />
          <div className='flex gap-6 overflow-x-auto pb-8 no-scrollbar'>
            {popularMovies.map((movie) => (
              <div key={movie.id} className='min-w-72 md:min-w-80'>
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  genre={movie.genre}
                  year={movie.year}
                  badgeText={movie.badgeText}
                  posterUrl={movie.posterUrl}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 최신 영화 섹션 */}
        <section>
          <SectionTitle title='막 올라온 따끈한 신작' subtitle='최신 영화' link='/movie' />
          <div className='flex gap-6 overflow-x-auto pb-8 no-scrollbar'>
            {newMovies.map((movie) => (
              <div key={movie.id} className='min-w-72 md:min-w-80'>
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  genre={movie.genre}
                  year={movie.year}
                  badgeText={movie.badgeText}
                  posterUrl={movie.posterUrl}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 평점 높은 영화 섹션 */}
        <section>
          <SectionTitle title='평단이 극찬한 명작' subtitle='최고의 영화' link='/movie' />
          <div className='flex gap-6 overflow-x-auto pb-8 no-scrollbar'>
            {topRatedMovies.map((movie) => (
              <div key={movie.id} className='min-w-72 md:min-w-80'>
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  genre={movie.genre}
                  year={movie.year}
                  badgeText={movie.badgeText}
                  posterUrl={movie.posterUrl}
                />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

export default HomePage
