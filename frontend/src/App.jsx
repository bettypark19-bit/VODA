import { Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import GNB from './components/GNB'
import Footer from './components/Footer'
import ChatBtn from './components/ChatBtn'
import ScoreSummary from './components/ScoreSummary';

// 페이지 이동 시 스크롤을 맨 위로 초기화
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/**
 * Layout: 전역 레이아웃
 * 화면 전체 너비를 1920px로 제한하고 중앙 정렬합니다.
 */
const Layout = () => (
  <div className='min-h-screen flex flex-col bg-base'>
    <ScrollToTop />
    <GNB />
    <main className='flex-1 w-full max-w-content mx-auto'>
      <Outlet />
    </main>
    <Footer />
    <ChatBtn />
  </div>
)

const TestPage = () => {
  // TMDB 응답 구조와 유사한 테스트 데이터
  const dummyReviews = [
    { author_details: { rating: 9 } },
    { author_details: { rating: 8 } },
    { author_details: { rating: 10 } },
    { author_details: { rating: 4 } },
    { author_details: { rating: 2 } },
  ];

  return (
    <div className="p-20 bg-neutral-950"> {/* 배경색이 있어야 흰색 글자가 보입니다 */}
      <ScoreSummary 
        avg={8.4} 
        count={12402} 
        reviews={dummyReviews} 
      />
    </div>
  );
};

export default Layout
