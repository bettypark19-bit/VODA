import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import MovieCard from '../components/MovieCard'

// 임시 영화 데이터 (TMDB 연동 전까지 사용)
const POPULAR_MOVIES = [
  { id: 1, title: '듄: 파트 2', genre: 'SF', year: '2024', badgeText: 'VODA 추천', posterUrl: 'https://image.tmdb.org/t/p/w500/czembW0Rk1Ke7lCJjAkLx7Wd4iU.jpg' },
  { id: 2, title: '패스트 라이브즈', genre: '드라마', year: '2023', badgeText: '수상작', posterUrl: 'https://image.tmdb.org/t/p/w500/k3waqVXSnQSGBFG5LowYXBMPEzP.jpg' },
  { id: 3, title: '오펜하이머', genre: '드라마', year: '2023', badgeText: 'VODA 추천', posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv2mYqUjZGWpARcAVspC77N2W.jpg' },
  { id: 4, title: '가여운 것들', genre: '판타지', year: '2023', badgeText: '수상작', posterUrl: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXISTzAPpAEQuBR.jpg' },
  { id: 5, title: '존 윅 4', genre: '액션', year: '2023', badgeText: 'HOT', posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg' },
]

const NEW_MOVIES = [
  { id: 6, title: '퓨리오사', genre: '액션', year: '2024', badgeText: '최신', posterUrl: 'https://image.tmdb.org/t/p/w500/dGKiEwIhLuTDBaOhCFwKL2x4HRk.jpg' },
  { id: 7, title: '혹성탈출: 새로운 시대', genre: 'SF', year: '2024', badgeText: '최신', posterUrl: 'https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg' },
  { id: 8, title: '인사이드 아웃 2', genre: '애니메이션', year: '2024', badgeText: '최신', posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg' },
  { id: 9, title: '데드풀과 울버린', genre: '액션', year: '2024', badgeText: '최신', posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg' },
  { id: 10, title: '에이리언: 로물루스', genre: '공포', year: '2024', badgeText: '최신', posterUrl: 'https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg' },
]

const HomePage = () => {
  return (
    <div className='text-white'>
      {/* Hero */}
      <Hero />

      {/* 콘텐츠 영역 */}
      <main className='max-w-[1920px] mx-auto px-12 py-16 flex flex-col gap-16'>

        {/* 인기 영화 */}
        <section>
          <SectionTitle title='인기 영화' subtitle='지금 가장 많이 보는 영화' link='/movie' />
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {POPULAR_MOVIES.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                genre={movie.genre}
                year={movie.year}
                badgeText={movie.badgeText}
                posterUrl={movie.posterUrl}
              />
            ))}
          </div>
        </section>

        {/* 최신 영화 */}
        <section>
          <SectionTitle title='최신 영화' subtitle='막 개봉한 따끈한 신작' link='/movie' />
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
            {NEW_MOVIES.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                genre={movie.genre}
                year={movie.year}
                badgeText={movie.badgeText}
                posterUrl={movie.posterUrl}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}

export default HomePage
