import { Outlet } from 'react-router'
import GNB from './components/GNB'
import Footer from './components/Footer'

/**
 * Layout: 전역 레이아웃
 * 화면 전체 너비를 1920px로 제한하고 중앙 정렬합니다.
 */
const Layout = () => (
  <div className='min-h-screen flex flex-col bg-base'>
    <GNB />
    <main className='flex-1 w-full max-w-content mx-auto'>
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default Layout
