import { useState, useEffect } from 'react'
import { EP } from '../api/tmdb'
import Hero from '../components/Hero'
import GenreTab from '../components/GenreTab'
import PersonCard from '../components/PersonCard'
import SearchBar from '../components/SearchBar'
import SectionTitle from '../components/SectionTitle'
import DirectorCard from '../components/DirectorCard'
import FocusCard from '../components/FocusCard'
import ChatBtn from '../components/ChatBtn'

const TABS = [
  { id: 'trending', name: '오늘의 트렌딩' },
  { id: 'popular', name: '인기 인물' },
]

const PersonPage = () => {
  const [heroPerson, setHeroPerson] = useState(null)
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [activeTab, setActiveTab] = useState('trending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      EP.personTrending('day'),
      EP.personPopular(),
    ]).then(([trendRes, popRes]) => {
      const trendData = trendRes.data.results
      setHeroPerson(trendData[0])
      setTrending(trendData)
      setPopular(popRes.data.results)
      setLoading(false)
    })
  }, [])

  const persons = activeTab === 'trending' ? trending : popular

  if (loading) return <div className='p-20 text-center text-zinc-500'>로딩 중...</div>

  // 포커스 카드 아바타 데이터 매핑
  const avatars = trending.slice(0, 3).map(p => ({
    id: p.id,
    photo: p.profile_path,
    name: p.name,
  }))

  return (
    <div className='bg-neutral-950 min-h-screen pb-32'>
      {/* 히어로 — 오늘의 트렌딩 1위 인물 */}
      {heroPerson && (
        <Hero
          type='person'
          title={heroPerson.name}
          img={heroPerson.profile_path}
          department={heroPerson.known_for_department}
        />
      )}

      {/* 검색바 */}
      <div className='px-12 mt-10'>
        <SearchBar variant='normal' />
      </div>

      {/* 인물 탭 */}
      <div className='mt-8'>
        <GenreTab tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* 인물 그리드 섹션 */}
      <div className='px-12 mt-16'>
        {/* SectionTitle은 전체 너비(px-12)에 맞춰 정렬 */}
        <SectionTitle
          title={activeTab === 'trending' ? '오늘의 트렌딩 인물' : '인기 인물'}
          subtitle={activeTab === 'trending' ? '지금 가장 주목받는 인물' : '전 세계에서 사랑받는 인물'}
          link='/person/category'
        />
        {/* 인물 그리드만 중앙 정렬 */}
        <div className='max-w-screen-xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-12'>
            {persons.slice(0, 4).map((p) => (
              <PersonCard
                key={p.id}
                id={p.id}
                name={p.name}
                img={p.profile_path}
                role={p.known_for_department}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Focus 섹션 (Director Insight + Rookie Focus) */}
      <div className='px-12 mt-20'>
        {/* SectionTitle이 px-12 전체 너비에 맞춰 정렬 (위와 동일한 패턴) */}
        <SectionTitle
          title='포커스 인물'
          subtitle='VODA가 주목하는 이번 주 인물 기획전'
        />
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2'>
            <DirectorCard
              label='Director Insight'
              title='박찬욱의 미장센'
              desc={'대칭의 미학, 폭력의 시적 표현.\n한국 영화를 세계로 알린 거장의 발자취를 따라가 봅니다.'}
              btnText='기획전 보기'
              to='/find?curator=parkwook'
            />
          </div>
          <div className='lg:col-span-1'>
            <FocusCard
              title='신인 발굴'
              desc='VODA가 예측하는 2026년 최고의 루키들을 소개합니다.'
              avatars={avatars}
              totalCount={24} // UI 시연용 카운터
              to='/person/category'
            />
          </div>
        </div>
      </div>

      <ChatBtn />
    </div>
  )
}

export default PersonPage
