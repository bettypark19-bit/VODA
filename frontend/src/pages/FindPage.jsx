import { useSearchParams } from 'react-router'
import useFetch from '../hooks/useFetch'
import { EP } from '../api/tmdb'
import Feed from '../components/Feed'
import MoodGrid from '../components/MoodGrid'
import SearchBar from '../components/SearchBar'
import FilterChips from '../components/FilterChips'
import ChatBtn from '../components/ChatBtn'

const GENRE_FILTERS = [
  { id: '28',    label: '액션' },
  { id: '35',    label: '코미디' },
  { id: '27',    label: '공포' },
  { id: '10749', label: '로맨스' },
  { id: '878',   label: 'SF' },
  { id: '18',    label: '드라마' },
]

const YEAR_FILTERS = [
  { id: '2025', label: '2025년' },
  { id: '2024', label: '2024년' },
  { id: '2023', label: '2023년' },
  { id: '2022', label: '2022년' },
]

const REGION_FILTERS = [
  { id: 'KR', label: '한국' },
  { id: 'US', label: '미국' },
  { id: 'JP', label: '일본' },
  { id: 'GB', label: '영국' },
]

const FindPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // ✅ 해결책: 파일명 앞의 슬래시(/)를 제거했습니다. 
  // EP.bg나 EP.img가 내부적으로 슬래시를 붙여주기 때문에 중복을 막아야 합니다.
  const MOOD_DATA = [
    {
      title: "가슴이 웅장해지는 액션",
      desc: "아드레날린이 솟구치는 거대한 스케일의 블록버스터",
      img: EP.bg('/628MTeuPnb2p9vQY2N9B7mqFL0W.jpg'), 
      mediaType: "movie",
      category: "discover",
      genre: "28", 
    },
    {
      title: "밤에 혼자 보는 스릴러",
      desc: "숨 막히는 긴장감과 반전이 기다리는 미스터리",
      img: EP.bg('/uDVkJ6pMs9pS3CjXvgnp9f0tC7u.jpg'),
      mediaType: "movie",
      category: "discover",
      genre: "53",
    },
    {
      title: "몽글몽글한 로맨스",
      desc: "잠들었던 연애 세포를 깨워줄 설렘 가득한 이야기",
      img: EP.bg('/709YpTNUuYfk0pXFv9S7XmS6T9R.jpg'),
      mediaType: "movie",
      category: "discover",
      genre: "10749",
    },
    {
      title: "현실 도피 판타지",
      desc: "상상력이 만들어낸 완전히 새로운 세계로의 초대",
      img: EP.bg('/9re9mgotSgYpY2v9v9pS3CjXvgn.jpg'),
      mediaType: "movie",
      category: "discover",
      genre: "14",
    }
  ]

  // ... (나머지 로직 동일)

  // ... 나머지 로직 동일 ...
  const query  = searchParams.get('q')      || ''
  const genre  = searchParams.get('genre')  || ''
  const year   = searchParams.get('year')   || '2024'
  const region = searchParams.get('region') || 'KR'

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value)
    else p.delete(key)
    setSearchParams(p)
  }

  const handleGenre  = (id) => updateFilter('genre', genre === id ? '' : id)
  const handleSearch = (val) => updateFilter('q', val)

  const { data, loading } = useFetch(
    () => query
      ? EP.search(query)
      : EP.discover('movie', {
          with_genres: genre || undefined,
          primary_release_year: year,
          with_origin_country: region,
        }),
    [query, genre, year, region]
  )

  const items     = data?.results || []
  const feedTitle = query ? `'${query}' 검색 결과` : `${year}년 ${region} 주요 콘텐츠`

  return (
    <main className='pt-24 pb-20 min-h-screen px-8 md:px-16'>
      <section className='mb-10 max-w-2xl mx-auto'>
        <SearchBar onSubmit={handleSearch} />
      </section>

      <section className='mb-12'>
        <div className='mb-6'>
          <p className='text-zinc-500 text-lg font-medium text-center mb-2'>장르</p>
          <FilterChips filters={GENRE_FILTERS} active={genre}  onChange={handleGenre} />
        </div>
        <div className='mb-6'>
          <p className='text-zinc-500 text-lg font-medium text-center mb-2'>연도</p>
          <FilterChips filters={YEAR_FILTERS}  active={year}   onChange={(id) => updateFilter('year', id)} />
        </div>
        <div className='mb-6'>
          <p className='text-zinc-500 text-lg font-medium text-center mb-2'>국가</p>
          <FilterChips filters={REGION_FILTERS} active={region} onChange={(id) => updateFilter('region', id)} />
        </div>
      </section>

      <section className='mb-16'>
        {loading ? (
          <p className='text-zinc-500 py-20 text-center'>결과를 불러오는 중...</p>
        ) : items.length > 0 ? (
          <Feed type='rank' title={feedTitle} items={items} />
        ) : (
          <p className='text-zinc-500 py-20 text-center'>결과가 없습니다.</p>
        )}
      </section>

      <MoodGrid moods={MOOD_DATA} />
      <ChatBtn />
    </main>
  )
}

export default FindPage