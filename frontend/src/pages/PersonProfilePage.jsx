import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faChevronRight,
  faChevronDown,
  faRobot,
  faFilm,
  faTv,
  faUser,
} from '@fortawesome/free-solid-svg-icons'

// 더미 데이터 (TMDB 연동 전)
const ACTOR = {
  name: '이제훈',
  birth: '1984. 07. 04',
  role: 'Actor',
  bio: '진정성 있는 연기로 매 작품마다 독보적인 존재감을 드러내는 배우. 독립영화 \'파수꾼\'으로 화려하게 데뷔한 이후, \'건축학개론\', \'시그널\', \'모범택시\' 등 장르를 가리지 않는 폭넓은 스펙트럼을 증명하며 대한민국을 대표하는 연기파 배우로 자리 매김했습니다.',
}

const MOVIES = [
  { id: 1, title: '모범택시', genre: '액션 • 드라마', year: '2021', free: true },
  { id: 2, title: '시그널', genre: '스릴러 • 미스터리', year: '2016', free: false },
  { id: 3, title: '건축학개론', genre: '로맨스 • 드라마', year: '2012', free: true },
  { id: 4, title: '파수꾼', genre: '드라마', year: '2011', free: true },
  { id: 5, title: '무브 투 헤븐', genre: '드라마', year: '2021', free: false },
]

const DRAMAS = [
  { id: 1, ep: '1화. 과거의 울림', duration: '65분', status: '시청 중', progress: 85 },
  { id: 2, ep: '2화. 잊혀진 기억', duration: '58분', status: '미시청', progress: 0 },
  { id: 3, ep: '3화. 진실의 무게', duration: '62분', status: '미시청', progress: 0 },
  { id: 4, ep: '4화. 붉은 실', duration: '70분', status: '미시청', progress: 0 },
  { id: 5, ep: '5화. 마지막 신호', duration: '68분', status: '미시청', progress: 0 },
]

const AWARDS = [
  { year: '2023', award: 'SBS 연기대상', detail: '대상 (모범택시 2)' },
  { year: '2021', award: '제2회 아시아 콘텐츠 어워즈', detail: '남우주연상 (무브 투 헤븐)' },
  { year: '2011', award: '제32회 청룡영화상', detail: '신인남우상 (파수꾼)' },
  { year: '2011', award: '제48회 대종상 영화제', detail: '신인남우상 (파수꾼)' },
]

const COLLABORATORS = [
  { name: '김은희', role: 'Writer' },
  { name: '장항준', role: 'Director' },
  { name: '공유', role: 'Actor' },
  { name: '배두나', role: 'Actress' },
]

// 영화 세로 카드
const MovieCard = ({ movie }) => (
  <div className='w-[360px] flex-shrink-0 flex flex-col cursor-pointer group'>
    <div className='relative w-full h-[540px] rounded-lg overflow-hidden bg-[#25252d]'>
      <div className='w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300'>
        <FontAwesomeIcon icon={faFilm} className='text-[#71717a] text-4xl' />
      </div>
      {/* 그라데이션 */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
      {/* FREE 배지 */}
      {movie.free && (
        <div className='absolute top-4 left-4 bg-[#fafafa] rounded px-3 py-1'>
          <span className='text-[#0a0a0a] text-xs font-bold'>FREE</span>
        </div>
      )}
      {/* 플레이 버튼 */}
      <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
        <div className='w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
          <FontAwesomeIcon icon={faPlay} className='text-white text-xl ml-1' />
        </div>
      </div>
    </div>
    <div className='pt-3'>
      <h4 className='text-[#fafafa] text-base font-bold'>{movie.title}</h4>
      <p className='text-[#a1a1aa] text-sm mt-1'>{movie.genre} • {movie.year}</p>
    </div>
  </div>
)

// 드라마 에피소드 카드
const EpisodeCard = ({ ep }) => (
  <div className='w-[400px] flex-shrink-0 flex flex-col cursor-pointer group'>
    <div className='relative w-full h-[240px] rounded-lg overflow-hidden bg-[#25252d]'>
      <div className='w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300'>
        <FontAwesomeIcon icon={faTv} className='text-[#71717a] text-4xl' />
      </div>
      <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
      {/* 재생 버튼 */}
      <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
        <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
          <FontAwesomeIcon icon={faPlay} className='text-white text-lg ml-0.5' />
        </div>
      </div>
      {/* 진행도 바 */}
      <div className='absolute bottom-0 left-0 right-0 h-[5px] bg-white/20'>
        {ep.progress > 0 && (
          <div
            className='h-full bg-[#a78bfa] transition-all'
            style={{ width: `${ep.progress}%` }}
          />
        )}
      </div>
    </div>
    <div className='pt-3'>
      <h4 className='text-[#fafafa] text-base font-semibold'>{ep.ep}</h4>
      <p className='text-[#a1a1aa] text-sm mt-1'>
        {ep.duration} • {ep.status}
      </p>
    </div>
  </div>
)

const PersonProfilePage = () => {
  return (
    <div className='min-h-screen bg-[#0e0e13]'>

      {/* ── Hero Section ── */}
      <section className='relative w-full h-[965px] overflow-hidden'>
        {/* 배경 이미지 플레이스홀더 */}
        <div className='absolute inset-0 bg-[#1a1a24] flex items-center justify-center'>
          <FontAwesomeIcon icon={faUser} className='text-[#3f3f46] text-[200px]' />
        </div>
        {/* 그라데이션 오버레이 */}
        <div className='absolute inset-0 bg-gradient-to-r from-[#0e0e13] via-[#0e0e13]/70 to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-t from-[#0e0e13] via-transparent to-transparent' />

        {/* 컨텐츠 */}
        <div className='relative h-full max-w-[1664px] mx-auto px-12 flex items-center gap-16'>
          {/* 배우 포토 */}
          <div className='w-[500px] h-[750px] flex-shrink-0 rounded-xl overflow-hidden bg-[#25252d] flex items-center justify-center'>
            <FontAwesomeIcon icon={faUser} className='text-[#71717a] text-8xl' />
          </div>

          {/* 텍스트 영역 */}
          <div className='flex flex-col gap-6 max-w-[1100px]'>
            {/* 배지 + 생년월일 */}
            <div className='flex items-center gap-4'>
              <span className='bg-[#f472b6] text-[#50071c] text-xs font-bold px-3 py-1.5 rounded'>
                Actor
              </span>
              <span className='text-[#a1a1aa] text-sm'>{ACTOR.birth}</span>
            </div>

            {/* 이름 */}
            <h1
              className='text-[#fafafa] font-bold leading-none'
              style={{ fontSize: '96px', letterSpacing: '-2px' }}
            >
              {ACTOR.name}
            </h1>

            {/* 소개 */}
            <p className='text-[#a1a1aa] text-base leading-relaxed max-w-[1100px]'>
              {ACTOR.bio}
            </p>

            {/* 버튼 */}
            <div className='flex gap-4 mt-2'>
              <button className='flex items-center gap-2 bg-[#fafafa] text-[#0a0a0a] font-semibold text-sm px-6 py-5 rounded-xl hover:bg-white transition-colors'>
                <FontAwesomeIcon icon={faPlay} />
                대표작 보기
              </button>
              <button className='flex items-center gap-2 border border-[#fafafa]/40 text-[#fafafa] font-semibold text-sm px-6 py-5 rounded-xl hover:bg-white/10 transition-colors'>
                <FontAwesomeIcon icon={faUser} />
                팬 가입하기
              </button>
            </div>
          </div>
        </div>

        {/* 스크롤 버튼 */}
        <button className='absolute bottom-8 right-12 w-[80px] h-[80px] rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors'>
          <FontAwesomeIcon icon={faChevronDown} className='text-[#fafafa] text-xl' />
        </button>
      </section>

      {/* ── 출연 영화 ── */}
      <section className='w-full py-12 relative overflow-hidden'>
        {/* 배경 블롭 */}
        <div className='absolute top-0 left-[100px] w-[576px] h-[576px] rounded-full bg-[#bda1ff]/8 blur-[150px] pointer-events-none' />

        <div className='max-w-[1664px] mx-auto px-12'>
          {/* 섹션 헤더 */}
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <div className='w-[12px] h-[48px] bg-[#a78bfa] rounded-sm' />
              <div>
                <h2 className='text-[#fafafa] text-2xl font-bold'>출연 영화</h2>
                <p className='text-[#a1a1aa] text-sm mt-1'>매주 찾아오는 큐레이터의 무료 영화 선물</p>
              </div>
            </div>
            <Link to='/people/category' className='flex items-center gap-1 text-[#a78bfa] text-sm hover:text-[#c4b5fd] transition-colors'>
              전체보기 <FontAwesomeIcon icon={faChevronRight} className='text-xs' />
            </Link>
          </div>

          {/* 스크롤 카드 열 */}
          <div className='flex gap-6 overflow-x-auto pb-4 scrollbar-hide'>
            {MOVIES.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 출연 드라마 ── */}
      <section className='w-full py-12 relative overflow-hidden'>
        <div className='absolute top-0 right-[100px] w-[576px] h-[576px] rounded-full bg-[#bda1ff]/6 blur-[150px] pointer-events-none' />

        <div className='max-w-[1664px] mx-auto px-12'>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <div className='w-[12px] h-[48px] bg-[#a78bfa] rounded-sm' />
              <div>
                <h2 className='text-[#fafafa] text-2xl font-bold'>출연 드라마</h2>
                <p className='text-[#a1a1aa] text-sm mt-1'>매주 찾아오는 큐레이터의 무료 영화 선물</p>
              </div>
            </div>
            <Link to='/people/category' className='flex items-center gap-1 text-[#a78bfa] text-sm hover:text-[#c4b5fd] transition-colors'>
              전체보기 <FontAwesomeIcon icon={faChevronRight} className='text-xs' />
            </Link>
          </div>

          <div className='flex gap-6 overflow-x-auto pb-4 scrollbar-hide'>
            {DRAMAS.map((ep) => (
              <EpisodeCard key={ep.id} ep={ep} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 수상 내역 + 함께한 인물 (벤토) ── */}
      <section className='w-full py-12'>
        <div className='max-w-[1664px] mx-auto px-12'>
          <div className='flex gap-6 h-[735px]'>

            {/* 주요 수상 내역 */}
            <div className='flex-1 bg-[#19191f] rounded-xl p-10 flex flex-col gap-8 relative overflow-hidden'>
              {/* 배경 블롭 */}
              <div className='absolute bottom-0 right-0 w-[384px] h-[384px] rounded-full bg-[#bda1ff]/15 blur-[100px] pointer-events-none' />

              <h2 className='text-white text-2xl font-bold relative z-10'>주요 수상 내역</h2>

              <div className='flex flex-col gap-0 relative z-10'>
                {AWARDS.map((item, i) => (
                  <div
                    key={i}
                    className='flex items-start gap-8 py-6 border-b border-white/8 last:border-0'
                  >
                    <span className='text-[#bda1ff] text-2xl font-bold w-16 flex-shrink-0'>
                      {item.year}
                    </span>
                    <div className='flex flex-col gap-1'>
                      <span className='text-white text-base font-semibold'>{item.award}</span>
                      <span className='text-[#acabb1] text-sm'>{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 함께 작업한 인물 */}
            <div className='w-[544px] flex-shrink-0 bg-[#1f1f26] rounded-xl p-10 flex flex-col justify-between'>
              <div className='flex flex-col gap-6'>
                <h2 className='text-white text-2xl font-bold'>함께 작업한 인물</h2>

                {/* 협업자 그리드 */}
                <div className='grid grid-cols-2 gap-6'>
                  {COLLABORATORS.map((person, i) => (
                    <div key={i} className='flex flex-col items-center gap-3 cursor-pointer group'>
                      {/* 아바타 */}
                      <div className='w-[120px] h-[120px] rounded-full border-2 border-[#3f3f46] bg-[#2a2a33] flex items-center justify-center group-hover:border-[#a78bfa] transition-colors overflow-hidden'>
                        <FontAwesomeIcon icon={faUser} className='text-[#71717a] text-3xl' />
                      </div>
                      <div className='text-center'>
                        <p className='text-white text-base font-semibold group-hover:text-[#a78bfa] transition-colors'>
                          {person.name}
                        </p>
                        <p className='text-[#acabb1] text-sm'>{person.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 전체 인맥 네트워크 링크 */}
              <button className='flex items-center gap-1.5 text-[#bda1ff] text-sm hover:text-[#a78bfa] transition-colors'>
                전체 인맥 네트워크
                <FontAwesomeIcon icon={faChevronRight} className='text-xs' />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* AI 챗봇 플로팅 버튼 */}
      <button className='fixed bottom-8 right-8 w-[64px] h-[64px] bg-[#8b5cf6] rounded-full flex items-center justify-center shadow-lg shadow-[#8b5cf6]/30 hover:bg-[#7c3aed] transition-colors z-50'>
        <FontAwesomeIcon icon={faRobot} className='text-[#0a0a0a] text-xl' />
      </button>

    </div>
  )
}

export default PersonProfilePage
