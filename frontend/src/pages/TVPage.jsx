import { useState } from 'react'
import ChipBtn from '../components/ChipBtn'

const TVPage = () => {
  const [activeTab, setActiveTab] = useState('인기순')
  const categories = ['인기순', '방영 중', '오늘의 화제작', '높은 평점', '드라마', '애니메이션']

  return (
    <div className='text-white px-12 py-16'>
      <h1 className='text-3xl font-bold mb-8'>TV 시리즈</h1>
      
      <div className='flex flex-wrap gap-3'>
        {categories.map((cat) => (
          <ChipBtn
            key={cat}
            label={cat}
            active={activeTab === cat}
            onClick={() => setActiveTab(cat)}
          />
        ))}
      </div>
    </div>
  )
}

export default TVPage
