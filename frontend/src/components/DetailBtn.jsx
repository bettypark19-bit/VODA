/**
 * DetailBtn 컴포넌트 (Figma: Hero 내 Action Buttons)
 * @param {string} label - 버튼 텍스트
 * @param {ReactNode} icon - FontAwesome 아이콘
 * @param {'primary' | 'secondary'} variant - 버튼 스타일 (기본: primary)
 * @param {function} onClick - 클릭 핸들러
 */
const DetailBtn = ({ label, icon, variant = 'primary', onClick }) => {
  
  // 피그마 디자인 시스템에 맞춘 variant별 스타일 (주문서 옵션)
  const baseStyle = 'flex items-center justify-center gap-2 rounded-full font-semibold px-7 py-3.5 transition-all duration-200 cursor-pointer active:scale-95'
  
  const variants = {
    // 재생 버튼 스타일: VODA 브랜드 컬러
    primary: 'bg-primary-500 hover:bg-primary-400 text-white shadow-lg shadow-primary-500/20',
    // 상세 정보 버튼 스타일: 반투명 유리 효과 (Glassmorphism)
    secondary: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md'
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {/* 아이콘 크기 및 간격 최적화 */}
      {icon && <span className='text-xl flex items-center'>{icon}</span>}
      
      <span className='font-serif tracking-tight'>
        {label}
      </span>
    </button>
  )
}

export default DetailBtn