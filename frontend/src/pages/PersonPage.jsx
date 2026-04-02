import { useState, useEffect } from 'react'
import { EP } from '../api/tmdb'
import Hero from '../components/Hero'
import GenreTab from '../components/GenreTab'
import PersonCard from '../components/PersonCard'
import SearchBar from '../components/SearchBar'
import SectionTitle from '../components/SectionTitle'
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

      {/* 인물 그리드 */}
      <div className='px-12'>
        <SectionTitle
          title={activeTab === 'trending' ? '오늘의 트렌딩 인물' : '인기 인물'}
          subtitle={activeTab === 'trending' ? '지금 가장 주목받는 인물' : '전 세계에서 사랑받는 인물'}
          link='/person/category'
        />
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
          {persons.map((p) => (
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

      <ChatBtn />
    </div>
  )
}

export default PersonPage
