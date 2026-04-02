import { useSearchParams } from 'react-router'
import useFetch from '../hooks/useFetch'
import { EP } from '../api/tmdb'
import Feed from '../components/Feed'
import MoodGrid from '../components/MoodGrid'
import SearchBar from '../components/SearchBar'
import FilterChips from '../components/FilterChips'

// TMDB 장르 ID 기반 필터 목록
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

// 무드 탐색 더미 데이터
const MOODS = [
  { title: '심장이 쫄깃한',  desc: '손에 땀을 쥐게 하는 스릴러', img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800' },
  { title: '몽글몽글 로맨스', desc: '설레는 사랑 이야기',           img: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800' },
  { title: '배꼽 잡는 코미디', desc: '스트레스 날려버릴 웃음',      img: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800' },
  { title: '웅장한 대서사시', desc: '압도적인 스케일의 SF',          img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800' },
]

const FindPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // URL 쿼리 파라미터에서 현재 필터 값 추출
  const query  = searchParams.get('q')      || ''
  const genre  = searchParams.get('genre')  || ''
  const year   = searchParams.get('year')   || '2024'
  const region = searchParams.get('region') || 'KR'

  // 필터 변경 → URL 쿼리 업데이트
  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value)
    else p.delete(key)
    setSearchParams(p)
  }

  // 장르 칩 토글 (같은 값 클릭 시 해제)
  const handleGenre = (id) => updateFilter('genre', genre === id ? '' : id)

  // SearchBar submit → q 파라미터 갱신
  const handleSearch = (val) => updateFilter('q', val)

  // 무드 클릭 → 해당 무드 제목으로 검색
  const handleMood = (mood) => updateFilter('q', mood.title)

  // query가 있으면 검색, 없으면 discover
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

      {/* 1. 검색바 */}
      <section className='mb-10 max-w-2xl'>
        <SearchBar onSubmit={handleSearch} />
      </section>

      {/* 2. FilterChips — 장르 / 연도 / 국가 3그룹 */}
      <section className='mb-12 space-y-6'>
        <div>
          <p className='text-zinc-500 text-sm mb-3 font-medium'>장르</p>
          <FilterChips
            filters={GENRE_FILTERS}
            active={genre}
            onChange={handleGenre}
          />
        </div>
        <div>
          <p className='text-zinc-500 text-sm mb-3 font-medium'>연도</p>
          <FilterChips
            filters={YEAR_FILTERS}
            active={year}
            onChange={(id) => updateFilter('year', id)}
          />
        </div>
        <div>
          <p className='text-zinc-500 text-sm mb-3 font-medium'>국가</p>
          <FilterChips
            filters={REGION_FILTERS}
            active={region}
            onChange={(id) => updateFilter('region', id)}
          />
        </div>
      </section>

      {/* 3. 검색 결과 (rank 타입으로 순위 강조) */}
      <section className='mb-16'>
        {loading ? (
          <p className='text-zinc-500 py-20 text-center'>결과를 불러오는 중...</p>
        ) : items.length > 0 ? (
          <Feed type='rank' title={feedTitle} items={items} />
        ) : (
          <p className='text-zinc-500 py-20 text-center'>결과가 없습니다.</p>
        )}
      </section>

      {/* 4. 무드 그리드 (Bento Style) */}
      <MoodGrid moods={MOODS} onItemClick={handleMood} />

    </main>
  )
}

export default FindPage
