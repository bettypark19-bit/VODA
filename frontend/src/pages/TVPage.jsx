import { useState, useEffect } from 'react'
import ChipBtn from '../components/ChipBtn'
import RankCard from '../components/RankCard'
import SectionTitle from '../components/SectionTitle'
import EpisodeSection from '../components/EpisodeSection'
import { EP } from '../api/tmdb'

const TVPage = () => {
  const [activeTab, setActiveTab] = useState('인기순')
  const [rankTvShows, setRankTvShows] = useState([])
  const [selectedTv, setSelectedTv] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loadingEp, setLoadingEp] = useState(false)
  const categories = ['인기순', '방영 중', '오늘의 화제작', '높은 평점', '드라마', '애니메이션']

  useEffect(() => {
    EP.popular('tv').then((res) => {
      setRankTvShows(res.data.results.slice(0, 10))
    }).catch(console.error)
  }, [])

  const handleSelectTv = (tv) => {
    // 같은 시리즈 클릭 시 접기
    if (selectedTv?.id === tv.id) {
      setSelectedTv(null)
      setEpisodes([])
      return
    }
    setSelectedTv(tv)
    setLoadingEp(true)
    EP.season(tv.id, 1).then((res) => {
      setEpisodes(res.data.episodes || [])
    }).catch(console.error).finally(() => setLoadingEp(false))
  }

  return (
    <div className='bg-neutral-950 min-h-screen pb-24 text-white px-12 py-16'>
      <h1 className='text-3xl font-bold mb-8'>TV 시리즈</h1>

      <div className='flex flex-wrap gap-3 mb-16'>
        {categories.map((cat) => (
          <ChipBtn
            key={cat}
            label={cat}
            active={activeTab === cat}
            onClick={() => setActiveTab(cat)}
          />
        ))}
      </div>

      <section>
        <SectionTitle title='지금 가장 뜨거운 TV 시리즈' subtitle='Top 10 시리즈 순위' />
        <div className='flex gap-10 overflow-x-auto pb-12 pt-4 px-6 no-scrollbar'>
          {rankTvShows.map((tv, idx) => (
            <RankCard
              key={tv.id}
              rank={idx + 1}
              id={tv.id}
              type='tv'
              title={tv.name}
              poster={tv.poster_path}
              genre={tv.genre_ids?.[0] ? 'TV 시리즈' : ''}
              onClick={() => handleSelectTv(tv)}
            />
          ))}
        </div>
      </section>

      {/* 에피소드 목록 (섹션 컴포넌트 활용) */}
      {selectedTv && (
        <div className='mt-8'>
          <SectionTitle
            title={`${selectedTv.name} — 시즌 1`}
            subtitle='에피소드 목록'
          />
          {loadingEp ? (
            <p className='text-zinc-500 mt-4'>불러오는 중...</p>
          ) : (
            <EpisodeSection episodes={episodes} showTitle={false} />
          )}
        </div>
      )}
    </div>
  )
}

export default TVPage
