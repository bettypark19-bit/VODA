import { useState } from 'react'
import ChipBtn from '../components/ChipBtn'

const MoviePage = () => {
  const [activeTab, setActiveTab] = useState('전체')
  const genres = ['전체', '액션', '로맨스', '스릴러', 'SF', '코미디']

  return (
    <div className='text-white px-12 py-16'>
      <h1 className='text-3xl font-bold mb-8'>영화보다</h1>
      
      <div className='flex flex-wrap gap-3'>
        {genres.map((genre) => (
          <ChipBtn
            key={genre}
            label={genre}
            active={activeTab === genre}
            onClick={() => setActiveTab(genre)}
          />
        ))}
      </div>

      
    </div>
  )
}

export default MoviePage
