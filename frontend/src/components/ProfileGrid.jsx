import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell, faUser, faCog, faChevronRight, faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons'

// ✅ 지침 반영: 컴포넌트 외부로 추출
const Toggle = ({ on, onToggle }) => (
  <button
    onClick={onToggle}
    className={`flex h-7 w-14 shrink-0 p-1 rounded-full transition-colors cursor-pointer ${on ? 'bg-primary-400 justify-end' : 'bg-neutral-800 justify-start'}`}
  >
    <div className='size-5 rounded-full bg-neutral-50' />
  </button>
)

const CardTitle = ({ icon, title }) => (
  <div className='flex items-center gap-3 mb-8'>
    <FontAwesomeIcon icon={icon} className='text-primary-400 text-xl' />
    <p className='font-serif text-2xl text-white font-bold'>{title}</p>
  </div>
)

const ProfileGrid = ({ user, onLogout }) => {
  const [alarmSettings, setAlarmSettings] = useState({
    curation: true,
    interest: true,
    marketing: false
  })

  const [viewSettings, setViewSettings] = useState({
    subtitle: true,
    autoplay: true,
    dataSaver: false // 데이터 절약 모드용 토글 추가
  })

  const toggleAlarm = (key) => setAlarmSettings(prev => ({ ...prev, [key]: !prev[key] }))
  const toggleView = (key) => setViewSettings(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className='flex flex-col gap-10 w-full max-w-screen-2xl mx-auto'>

      {/* 1. 상단 프로필 히어로 */}
      {/* ✅ rounded-[40px] -> rounded-3xl로 수정 */}
      <div className='bg-neutral-900/50 border border-white/5 flex items-center justify-between p-10 rounded-3xl'>
        <div className='flex items-center gap-8'>
          <div className='size-24 rounded-full bg-linear-to-br from-primary-400 to-secondary-400 p-0.5 shadow-glow-purple'>
            <div className='w-full h-full rounded-full bg-neutral-800 flex items-center justify-center text-3xl font-bold text-white'>
              {user?.name?.[0] || 'U'}
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <p className='font-serif text-3xl text-white font-bold'>{user?.name}</p>
            <p className='font-serif text-lg text-neutral-500'>{user?.email}</p>
            {user?.isSubscribed && (
              <span className='mt-2 bg-secondary-500/20 text-secondary-400 border border-secondary-500/30 text-sm px-3 py-1 rounded-full w-fit '>
                구독중
              </span>
            )}
          </div>
        </div>
        <div className='flex items-center gap-4'>
          {/* 구독 플랜 버튼 추가 */}
          <button className='bg-primary-500/10 text-primary-400 font-serif font-bold px-8 py-3 rounded-full hover:bg-primary-500/20 border border-primary-500/30 transition-colors cursor-pointer flex items-center gap-2'>
            {/* <i className='fa-solid fa-crown text-primary-400'></i> */}
            구독 플랜
          </button>

          <button className='bg-zinc-900 border border-[#525254] text-zinc-300 font-serif font-bold px-8 py-3 rounded-full hover:bg-zinc-800 hover:text-zinc-50 transition-colors cursor-pointer'>
            프로필 편집
          </button>
        </div>
      </div>

      {/* 2. 설정 카드 그리드 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        <div className='bg-zinc-900/40 p-8 rounded-[32px] border border-white/5 shadow-lg flex flex-col gap-8'>
          <CardTitle icon={faBell} title='알림 설정' />
          <div className='flex flex-col gap-6'>
            {[
              { key: 'curation', label: 'VODA 큐레이션 알림' },
              { key: 'interest', label: '관심 콘텐츠 업데이트' },
              { key: 'marketing', label: '마케팅 정보 수신 동의' }
            ].map(item => (
              <div key={item.key} className='flex items-center justify-between'>
                <span className='text-zinc-500 font-serif text-[17px]'>{item.label}</span>
                <Toggle on={alarmSettings[item.key]} onToggle={() => toggleAlarm(item.key)} />
              </div>
            ))}
          </div>
        </div>

        <div className='bg-zinc-900/40 p-8 rounded-[32px] border border-white/5 shadow-lg flex flex-col gap-8'>
          <CardTitle icon={faUser} title='계정 관리' />
          <div className='flex flex-col gap-3 -mx-4'>
            {['이메일 주소 변경', '비밀번호 재설정', '결제 수단 관리', '구독 해지'].map(label => (
              <button key={label} className='flex items-center justify-between w-full px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer'>
                <span className='text-zinc-500 font-serif text-[17px] group-hover:text-primary-300 transition-colors'>{label}</span>
                <FontAwesomeIcon icon={faChevronRight} className='text-primary-400/50 text-sm group-hover:text-primary-400 transition-colors' />
              </button>
            ))}
          </div>
        </div>

        <div className='bg-zinc-900/40 p-8 rounded-[32px] border border-white/5 shadow-lg flex flex-col gap-8'>
          <CardTitle icon={faCog} title='시청 환경' />
          <div className='flex flex-col gap-2 -mx-4'>
            {/* 1. 토글형 설정들 (패딩 조절하여 버튼과 라인 맞춤) */}
            <div className='flex flex-col gap-6 px-4 mb-4'>
              {[
                { key: 'subtitle', label: '자막 자동 활성화' },
                { key: 'autoplay', label: '다음 회차 자동 재생' },
                { key: 'dataSaver', label: '데이터 절약 모드' }
              ].map(item => (
                <div key={item.key} className='flex items-center justify-between'>
                  <span className='text-zinc-500 font-serif text-[17px]'>{item.label}</span>
                  <Toggle on={viewSettings[item.key]} onToggle={() => toggleView(item.key)} />
                </div>
              ))}
            </div>

            {/* 2. 이동형 설정들 (계정 관리와 동일한 버튼 스타일) */}
            {[
              { label: '언어 설정' },
              { label: '화질 우선순위' }
            ].map(item => (
              <button key={item.label} className='flex items-center justify-between w-full px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer'>
                <div className='flex flex-col items-start'>
                  <span className='text-zinc-500 font-serif text-[17px] group-hover:text-primary-300 transition-colors'>{item.label}</span>
                  <span className='text-primary-400/60 font-serif text-xs'>{item.value}</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className='text-primary-400/50 text-sm group-hover:text-primary-400 transition-colors' />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. 하단 액션 - 상단 그리드 전체 너비에 맞춤 및 좌측 정렬 */}
      <div className='flex flex-col gap-3 pt-4 w-full'>
        <button
          onClick={onLogout}
          className='w-full flex items-center justify-start gap-4 px-8 py-4 rounded-full bg-neutral-900 border border-white/10 text-zinc-500 font-serif font-bold hover:bg-primary-400/10 hover:text-primary-400 hover:border-primary-400/20 transition-all cursor-pointer'
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} className='text-primary-400' />
          <span>VODA 로그아웃</span>
        </button>

        <button
          className='w-full flex items-center justify-start gap-4 px-8 py-4 rounded-full bg-neutral-900 border border-white/10 text-zinc-500 font-serif font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all cursor-pointer'
        >
          <FontAwesomeIcon icon={faUser} className='text-red-500/60' />
          <span>계정 탈퇴하기</span>
        </button>
      </div>
      
      

    </div>
  )
}

export default ProfileGrid