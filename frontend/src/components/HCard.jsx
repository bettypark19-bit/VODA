// src/components/HCard.jsx
import { useNavigate } from 'react-router'
import { EP } from '../api/tmdb'

const HCard = ({ id, type, title, poster, genre, runtime, vote_average, showCurator = false }) => {
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(`/${type}/${id}`)} className='w-110 flex-shrink-0 cursor-pointer'>
      <div className='rounded-2xl overflow-hidden border-2 border-neutral-800 bg-neutral-900/40 backdrop-blur-md flex flex-col'>
        <div className='aspect-video overflow-hidden'>
          <img src={EP.img(poster, 'w780')} alt={title} className='size-full object-cover' />
        </div>
        <div className='p-5 flex flex-col gap-1'>
          <div className='flex items-center justify-between'>
            {showCurator
              ? <span className='text-sm font-bold text-secondary-500'>CURATOR'S CHOICE</span>
              : <span />
            }
            <div className='flex items-center gap-1'>
              <i className='fa-solid fa-star text-primary-400 text-sm'></i>
              <span className='text-sm font-bold text-primary-400'>{vote_average?.toFixed(1)}</span>
            </div>
          </div>
          <h3 className='text-2xl font-regular text-neutral-50 truncate'>{title}</h3>
          <p className='text-sm text-neutral-400'>{genre} • {runtime}분</p>
        </div>
      </div>
    </div>
  )
}
export default HCard