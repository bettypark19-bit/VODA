import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  const footerLinks = [
    '자막 및 음성', '음성 지원', '고객 센터', '기프트카드',
    '미디어 센터', '투자 정보(IR)', '입사 정보', '이용 약관',
    '개인정보 처리방침', '법적 고지', '쿠키 설정', '회사 정보', '문의하기'
  ]

  return (
    <footer className='bg-black text-[#a1a1aa] py-16 px-12 border-t border-white/5'>
      <div className='max-w-[1664px] mx-auto'>
        {/* 소셜 미디어 아이콘 */}
        <div className='flex gap-6 mb-10 text-[#fafafa] text-2xl'>
          <a href='#' className='hover:text-white transition-colors' aria-label="Facebook"><FontAwesomeIcon icon={faFacebook} /></a>
          <a href='#' className='hover:text-white transition-colors' aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href='#' className='hover:text-white transition-colors' aria-label="Twitter"><FontAwesomeIcon icon={faTwitter} /></a>
          <a href='#' className='hover:text-white transition-colors' aria-label="YouTube"><FontAwesomeIcon icon={faYoutube} /></a>
        </div>

        {/* 푸터 링크 그리드 */}
        <ul className='grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 mb-8 text-sm'>
          {footerLinks.map((link) => (
            <li key={link}>
              <a href='#' className='hover:underline'>
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* 서비스 코드 및 회사 정보 */}
        <div className='text-xs leading-5'>
          <button className='border border-gray-500 px-2 py-1 mb-4 hover:text-white hover:border-white transition-colors'>
            서비스 코드
          </button>
          <p>보여주식회사 (VODA)</p>
          <p>대표이사: 주니어 팀원 4인 | 사업자등록번호: 000-00-00000</p>
          <p>주소: 서울특별시 강남구 AI 테크밸리 VODA 타워</p>
          <p className='mt-4'>© 1996-2026 VODA, Inc.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer