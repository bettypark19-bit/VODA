import { NavLink, Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { twMerge } from 'tailwind-merge'

const GNB = () => {
  const menus = [
    { name: '홈', path: '/' },
    { name: '영화보다', path: '/movie' },
    { name: 'TV보다', path: '/tv' },
    { name: '사람을 보다', path: '/person' },
    { name: '물어보다', path: '/ask' },
    { name: '찾아보다', path: '/search' },
  ]

  const linkStyle = ({ isActive }) => 
    twMerge(
      'text-xl font-medium transition-colors hover:text-primary-400 px-4 py-2 rounded-lg',
      isActive ? 'text-primary-400 bg-primary-900/20' : 'text-neutral-400'
    )

  return (
    <header className='sticky top-0 z-50 h-25 flex items-center justify-between px-12 bg-base/80 backdrop-blur-md shadow-glow-purple border-b border-white/5'>
      {/* 로고 */}
      <Link to='/' className='text-3xl font-bold tracking-tighter text-primary-400'>
        VODA
      </Link>

      {/* 메뉴 */}
      <nav className='flex items-center gap-4'>
        {menus.map((m) => (
          <NavLink key={m.path} to={m.path} className={linkStyle}>
            {m.name}
          </NavLink>
        ))}
      </nav>

      {/* 검색 및 프로필 */}
      <div className='flex items-center gap-8'>
        <Link to='/search' className='text-neutral-400 hover:text-primary-400 transition-colors text-2xl'>
          <FontAwesomeIcon icon={faSearch} />
        </Link>
        <Link to='/profile' className='text-neutral-400 hover:text-primary-400 transition-colors text-3xl'>
          <FontAwesomeIcon icon={faUserCircle} />
        </Link>
      </div>
    </header>
  )
}

export default GNB
