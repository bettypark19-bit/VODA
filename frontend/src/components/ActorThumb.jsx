import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { EP } from '../api/tmdb'

/**
 * 배우 썸네일 컴포넌트
 * @param {string} name - 배우 이름
 * @param {string} img - 프로필 이미지 경로 (TMDB profile_path)
 * @param {string} role - 극중 역할 이름
 */
const ActorThumb = ({ name, img, role }) => {
  return (
    <div className='w-44 flex-shrink-0 text-center'>
      {/* 프로필 이미지 컨테이너 */}
      <div className='mx-auto'>
        {img ? (
          <img 
            src={EP.img(img, 'w185')} 
            alt={name} 
            className='size-40 rounded-full object-cover mx-auto' 
          />
        ) : (
          /* 이미지 없을 때 폴백 */
          <div className='size-40 rounded-full bg-zinc-800 flex items-center justify-center mx-auto'>
            <FontAwesomeIcon icon={faUser} className='text-4xl text-zinc-600' />
          </div>
        )}
      </div>

      {/* 텍스트 정보 */}
      <div className='mt-3'>
        <h4 className='text-sm font-medium truncate text-zinc-50'>{name}</h4>
        <p className='text-xs text-zinc-400 truncate mt-1'>{role}</p>
      </div>
    </div>
  )
}

export default ActorThumb