import { useState, useEffect } from 'react'
import Feed from "../components/Feed"; 
import { EP } from '../api/tmdb'
import ProfileGrid from "../components/ProfileGrid";
import ReviewCard from "../components/ReviewCard";
import SectionTitle from "../components/SectionTitle";


// 내가 작성한 리뷰 예시 데이터
const myReviews = [
  {
    id: 1,
    title: '라라랜드',
    image: '/uDO8v217STjInpUoj0DAn3i9hoM.jpg',
    date: '2026.04.02',
    rating: 10,
    content: '올해 본 영화 중 최고입니다! 연출, 연기, 스토리 모두 완벽했어요.',
  },
  {
    id: 2,
    title: '어벤져스: 엔드게임',
    image: '/or06vSydvSpgvJJqFAq0uUqSJxX.jpg',
    date: '2026.03.28',
    rating: 8,
    content: '전체적으로 재밌게 봤습니다. 다만 초반 빌드업이 조금 지루한 감이 있어서 아쉬웠어요.',
  },
  {
    id: 3,
    title: '인셉션',
    image: '/edv5bs1pS9S0S6TYYp6S3p6QE0S.jpg',
    date: '2026.02.15',
    rating: 6,
    content: '기대가 너무 컸던 탓일까요? 배우들의 연기는 훌륭했지만, 스토리가 너무 복잡해서 아쉬움이 남습니다.',
  },
  {
    id: 4,
    title: '기생충',
    image: '/7IiTTjMvSssUvB90ZphuGhHqSmn.jpg',
    date: '2026.01.05',
    rating: 9,
    content: '영상미가 정말 압도적입니다! 스크린에서 눈을 뗄 수가 없었어요.',
  }
];

// 가상 사용자 데이터
const mockUser = {
  name: 'VODA 마스터',
  email: 'voda_master@voda.ai',
  isSubscribed: true
};

const ProfilePage = () => {
  const [popularMovies, setPopularMovies] = useState([])
  const [showAllReviews, setShowAllReviews] = useState(false)
  
  useEffect(() => {
    // 필요한 데이터만 페칭하도록 정리
    EP.popular('movie')
      .then((res) => {
        setPopularMovies(res.data.results)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  return (
    <div className="text-white px-12 py-16 bg-neutral-950 min-h-screen">
      
      {popularMovies.length > 0 && (
        <Feed
          type="play" 
          title="시청 중인 콘텐츠"
          subtitle=""
          items={popularMovies.slice(0, 5)}
          mediaType="movie"
          link="/browse/movie/popular?title=시청 중인 콘텐츠"
        />
      )}

      {/* 내가 작성한 리뷰 섹션 */}
      <section className="my-16">
        <SectionTitle title="내가 작성한 리뷰" hideAllBtn={true} />

        <div className="grid grid-cols-1 gap-4 w-full mt-4">
          {/* showAllReviews 상태에 따라 2개 또는 전체 노출 */}
          {(showAllReviews ? myReviews : myReviews.slice(0, 2)).map(review => (
            <ReviewCard 
              key={review.id}
              title={review.title}
              image={EP.img(review.image, 'w200')}
              date={review.date}
              rating={review.rating}
              content={review.content}
            />
          ))}

          {/* 리뷰 더보기/접기 버튼 (중앙 정렬 및 컴팩트 디자인) */}
          {myReviews.length > 2 && (
            <button 
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-6 mx-auto w-fit px-10 py-2.5 rounded-full border border-white/10 bg-zinc-900/50 text-zinc-400 font-serif text-sm hover:bg-zinc-800 hover:text-primary-400 hover:border-primary-400/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{showAllReviews ? '리뷰 접기' : `리뷰 더보기 (${myReviews.length - 2})`}</span>
              <i className={`fa-solid fa-chevron-${showAllReviews ? 'up' : 'down'} text-[10px]`} />
            </button>
          )}
        </div>
      </section>

      {/* 프로필 설정 섹션 타이틀 */}
      <section className="my-16">
        <SectionTitle title="프로필 설정" hideAllBtn={true} />

        <div className="mt-4">
          <ProfileGrid 
            user={mockUser} 
            onLogout={() => alert('로그아웃 클릭!')} 
          />
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;