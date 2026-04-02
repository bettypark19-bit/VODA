import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell,
  faUser,
  faEye,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'

// ─── 공용 서브 컴포넌트 ────────────────────────────────────────────

// 토글 스위치
const Toggle = ({ on, onToggle }) => (
  <button
    onClick={onToggle}
    className={`flex h-7.5 w-15 shrink-0 p-1 rounded-full transition-colors ${on ? 'bg-primary-400 justify-end' : 'bg-neutral-800 justify-start'}`}
  >
    <div className='size-6 rounded-full bg-neutral-50' />
  </button>
)

// 섹션 제목
const CardTitle = ({ icon, title }) => (
  <div className='flex items-center gap-3 mb-9'>
    <FontAwesomeIcon icon={icon} className='text-neutral-50 text-xl' />
    <p className='font-serif text-2xl text-white leading-9'>{title}</p>
  </div>
)

// ─── 알림 설정 카드 ────────────────────────────────────────────────

const AlarmContent = () => {
  const [settings, setSettings] = useState({
    curation: true,
    interest: true,
    marketing: false,
    individual: false,
  })

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))

  const items = [
    { key: 'curation', label: '신규 큐레이션 추천' },
    { key: 'interest', label: '관심 영화 정보' },
    { key: 'marketing', label: '마케팅 정보 수신' },
    { key: 'individual', label: '개별 영화 추천' },
  ]

  return (
    <>
      <CardTitle icon={faBell} title='알림 설정' />
      <div className='flex flex-col gap-6 w-full'>
        {items.map(({ key, label }) => (
          <div key={key} className='flex items-center justify-between w-full'>
            <p className='font-serif text-xl text-neutral-500 leading-8'>{label}</p>
            <Toggle on={settings[key]} onToggle={() => toggle(key)} />
          </div>
        ))}
      </div>
    </>
  )
}

// ─── 계정 설정 카드 ────────────────────────────────────────────────

const AccountContent = () => {
  const items = [
    { label: '이메일 변경' },
    { label: '비밀번호 변경' },
    { label: '연결된 소셜 계정' },
    { label: '로그아웃' },
  ]

  return (
    <>
      <CardTitle icon={faUser} title='계정 설정' />
      <div className='flex flex-col gap-6 w-full'>
        {items.map(({ label }) => (
          <button
            key={label}
            className='flex items-center justify-between w-full group'
          >
            <p className='font-serif text-xl text-neutral-500 leading-8 group-hover:text-neutral-300 transition-colors'>
              {label}
            </p>
            <FontAwesomeIcon
              icon={faChevronRight}
              className='text-neutral-600 group-hover:text-neutral-400 transition-colors text-sm'
            />
          </button>
        ))}
      </div>
    </>
  )
}

// ─── 시청 설정 카드 ────────────────────────────────────────────────

const ViewContent = () => {
  const [settings, setSettings] = useState({
    subtitle: true,
    autoplay: true,
    hd: false,
    intro: false,
  })

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))

  const items = [
    { key: 'subtitle', label: '자막 자동 표시' },
    { key: 'autoplay', label: '다음 에피소드 자동 재생' },
    { key: 'hd', label: '고화질 우선 재생' },
    { key: 'intro', label: '인트로 건너뛰기' },
  ]

  return (
    <>
      <CardTitle icon={faEye} title='시청 설정' />
      <div className='flex flex-col gap-6 w-full'>
        {items.map(({ key, label }) => (
          <div key={key} className='flex items-center justify-between w-full'>
            <p className='font-serif text-xl text-neutral-500 leading-8'>{label}</p>
            <Toggle on={settings[key]} onToggle={() => toggle(key)} />
          </div>
        ))}
      </div>
    </>
  )
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────

const CONTENT = {
  alarm: AlarmContent,
  account: AccountContent,
  view: ViewContent,
}

const ProfileCard = ({ type = 'alarm' }) => {
  const Content = CONTENT[type] ?? AlarmContent

  return (
    <div className='bg-neutral-900 flex flex-col items-start p-9 rounded-3xl w-full'>
      <Content />
    </div>
  )
}

export default ProfileCard
