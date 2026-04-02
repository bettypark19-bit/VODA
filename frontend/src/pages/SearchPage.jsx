import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import MoodGrid from '../components/MoodGrid'
import SectionTitle from '../components/SectionTitle'
import MovieCard from '../components/MovieCard'
import { EP } from '../api/tmdb'

const SearchPage = () => {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  // 추천 무드 데이터
  const mockMoods = [
    {
      title: '액션',
      desc: '긴장감 넘치는 추격전과 폭발적인 아드레날린',
      img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: '로맨스',
      desc: '가슴 설레는 첫사랑과 따뜻한 감성 멜로',
      img: 'https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: '공포',
      desc: '잠 못 이루는 밤, 극한의 공포 속으로',
      img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: '애니메이션',
      desc: '지친 일상을 달래줄 순수하고 따뜻한 세계',
      img: 'https://images.unsplash.com/photo-1578632738908-4521c626df48?q=80&w=600&auto=format&fit=crop'
    }
  ]

  // 실시간 검색 로직 (Debounce 적용 없이 즉시 실행 - 간단한 구현)
  useEffect(() => {
    if (!keyword.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      EP.search(keyword)
        .then((res) => {
          // 멀티 검색 결과 중 포스터가 있는 항목만 필터링
          setResults(res.data.results.filter(item => item.poster_path))
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }, 500) // 500ms 디바운스 효과

    return () => clearTimeout(timer)
  }, [keyword])

  // 무드 카드 클릭 핸들러
  const handleMoodClick = (mood) => {
    setKeyword(mood.title)
  }

  return (
    <div className='bg-neutral-950 min-h-screen text-white px-12 py-16'>
      {/* 1. 검색바 영역 */}
      <div className='max-w-2xl mx-auto mb-20'>
        <h1 className='text-4xl font-bold text-center mb-8 bg-gradient-to-r from-zinc-50 to-zinc-400 bg-clip-text text-transparent'>
          어떤 작품을 찾으시나요?
        </h1>
        <SearchBar 
          value={keyword} 
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='영화, 배우, 시리즈를 검색해보세요'
        />
      </div>

      {/* 2. 검색 전 추천: 무드 그리드 */}
      {!keyword && (
        <div className='animate-in fade-in slide-in-from-bottom-4 duration-700'>
          <MoodGrid moods={mockMoods} onItemClick={handleMoodClick} />
          
          <div className='mt-16'>
            <SectionTitle title='인기 검색어' subtitle='지금 사람들이 많이 찾는 키워드' />
            <div className='flex flex-wrap gap-3 mt-6'>
              {['어벤져스', '기생충', '오징어 게임', '크리스토퍼 놀란', '반전 영화'].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => setKeyword(tag)}
                  className='px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm hover:bg-zinc-800 hover:text-zinc-50 transition-colors'
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. 검색 결과 영역 */}
      {keyword && (
        <div className='animate-in fade-in duration-500'>
          <div className='flex justify-between items-end mb-10'>
            <div>
              <h2 className='text-2xl font-bold text-zinc-50'>
                '<span className='text-primary-400'>{keyword}</span>' 검색 결과
              </h2>
              <p className='text-zinc-500 mt-1'>총 {results.length}개의 작품을 찾았습니다.</p>
            </div>
            {keyword && (
              <button 
                onClick={() => setKeyword('')}
                className='text-sm text-zinc-500 hover:text-zinc-300 underline underline-offset-4'
              >
                검색 초기화
              </button>
            )}
          </div>

          {loading ? (
            <div className='flex justify-center py-20'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500'></div>
            </div>
          ) : results.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10'>
              {results.map((item) => (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  type={item.media_type || 'movie'}
                  title={item.title || item.name}
                  posterUrl={EP.img(item.poster_path)}
                  year={(item.release_date || item.first_air_date || '').split('-')[0]}
                  genre={item.media_type === 'tv' ? 'TV 시리즈' : '영화'}
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800'>
              <p className='text-zinc-500 text-lg'>검색 결과가 없습니다.</p>
              <p className='text-zinc-600 text-sm mt-2'>다른 검색어를 입력해 보세요.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchPage
