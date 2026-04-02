import { Link } from 'react-router'
import { EP } from '../api/tmdb'

/**
 * PersonCard 컴포넌트
 * @param {string|number} id - 인물 ID (상세 페이지 이동용)
 * @param {string} name - 인물 이름
 * @param {string} img - 인물 프로필 이미지 경로
 * @param {string} role - 담당 역할 (배우/감독 등)
 */
const PersonCard = ({ id, name, img, role }) => {
  return (
    <Link 
      to={`/person/${id}`} 
      className='w-full group block'
    >
      {/* 인물 프로필 이미지 컨테이너 */}
      <div className='aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-800'>
        <img
          src={EP.img(img)}
          alt={name}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
      </div>

      {/* 인물 정보 영역 */}
      <div className='mt-4 text-center'>
        <h3 className='text-lg font-semibold text-zinc-50 truncate font-sans'>
          {name}
        </h3>
        <p className='text-xs text-primary-400 mt-1 font-serif font-medium'>
          {role}
        </p>
      </div>
    </Link>
  )
}

export default PersonCard