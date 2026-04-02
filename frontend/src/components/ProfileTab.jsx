// 프로필 히어로 카드: 아바타 + 사용자 정보 + 액션 버튼
const ProfileTab = ({
  name = '김보미',
  email = 'bomi_k@thecurator.com',
  avatar = null,
  isSubscribed = true,
}) => {
  return (
    <div className='bg-neutral-900 flex items-center justify-between gap-8 p-12 rounded-3xl w-full'>

      {/* 왼쪽: 아바타 + 이름·이메일·뱃지 */}
      <div className='flex items-center gap-9'>

        {/* 그라데이션 링 + 글로우 */}
        <div className='size-30 shrink-0 p-0.5 rounded-full bg-linear-to-br from-primary-400 to-secondary-400 shadow-glow-avatar'>
          <div className='w-full h-full rounded-full overflow-hidden border-4 border-neutral-900'>
            {avatar
              ? <img src={avatar} alt={name} className='w-full h-full object-cover' />
              : <div className='w-full h-full bg-neutral-700 flex items-center justify-center font-serif text-2xl text-neutral-400'>
                  {name[0]}
                </div>
            }
          </div>
        </div>

        {/* 텍스트 정보 */}
        <div className='flex flex-col gap-1.5'>
          <p className='font-serif text-4xl text-white leading-10'>{name}</p>
          <p className='font-serif text-xl text-neutral-500 leading-6'>{email}</p>
          {isSubscribed && (
            <span className='bg-secondary-500 text-neutral-50 font-serif text-base tracking-wider uppercase px-4 py-1 rounded-full self-start shadow-md'>
              구독중
            </span>
          )}
        </div>
      </div>

      {/* 오른쪽: 버튼 그룹 */}
      <div className='flex gap-4 items-center shrink-0'>
        <button className='bg-primary-400 text-neutral-900 font-serif text-xl px-12 py-4 rounded-full shadow-md whitespace-nowrap'>
          프로필 편집
        </button>
        <button className='border-2 border-white/25 text-neutral-50 font-serif text-xl px-12 py-4 rounded-full whitespace-nowrap'>
          구독 플랜 보기
        </button>
      </div>

    </div>
  )
}

export default ProfileTab
