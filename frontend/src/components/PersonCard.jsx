import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { EP } from '../api/tmdb'

const PersonCard = ({ id, name, img, role }) => {
  return (
    <Link to={`/person/${id}`} className='w-44 flex-shrink-0 text-center block group'>
      <div className='relative'>
        {img ? (
          <img
            src={EP.img(img, 'w185')}
            alt={name}
            className='size-40 rounded-full object-cover mx-auto transition-transform duration-300 group-hover:scale-105'
          />
        ) : (
          <div className='size-40 rounded-full bg-zinc-800 flex items-center justify-center mx-auto transition-transform duration-300 group-hover:scale-105'>
            <FontAwesomeIcon icon={faUser} className='text-zinc-600 text-4xl' />
          </div>
        )}
      </div>
      <p className='mt-3 text-sm font-medium truncate text-white'>{name}</p>
      <p className='text-xs text-zinc-400 truncate'>{role}</p>
    </Link>
  )
}

export default PersonCard
