import { Link } from 'react-router'

// 피그마 에셋 (배경 패턴 + 카메라 이미지)
const imgPattern = 'https://www.figma.com/api/mcp/asset/7da6e699-02b8-4793-b830-9377eb7c49d7'
const imgCamera  = 'https://www.figma.com/api/mcp/asset/9937d1f4-37ae-41f2-8172-de36814010a8'

const DirectorCard = ({
  label = 'Director Insight',
  title,
  desc,
  btnText = '기획전 보기',
  to = '/find',
}) => {
  return (
    <div className='relative overflow-hidden bg-zinc-900 border border-white/5 rounded-[36px] p-12 flex flex-col justify-center w-full min-h-[408px]'>

      {/* ① 배경 노이즈 패턴 (opacity-5) */}
      <div className='absolute inset-0 opacity-5 pointer-events-none'>
        <img src={imgPattern} alt='' className='size-full object-cover' />
      </div>

      {/* ② 우측 카메라 이미지 */}
      <div className='absolute right-0 top-0 bottom-0 w-1/2 opacity-40 rounded-bl-[36px] rounded-tl-[36px] overflow-hidden pointer-events-none'>
        <div className='relative size-full bg-zinc-500'>
          <img src={imgCamera} alt='' className='absolute size-full object-cover opacity-20' />
        </div>
      </div>

      {/* ③ 텍스트 컨텐츠 */}
      <div className='relative flex flex-col items-start'>
        {/* 라벨 */}
        <p className='font-serif font-bold text-lg text-secondary-400 tracking-[1.6px] uppercase leading-6'>
          {label}
        </p>

        {/* 제목 */}
        <h3 className='font-serif font-medium text-6xl text-white leading-[60px] py-3'>
          {title}
        </h3>

        {/* 설명 */}
        <p className='font-serif font-medium text-2xl text-zinc-400 leading-9 max-w-xl py-6 whitespace-pre-wrap'>
          {desc}
        </p>

        {/* CTA 버튼 */}
        <Link
          to={to}
          className='bg-white text-black font-serif font-medium text-2xl text-center rounded-full px-12 py-4 leading-9 transition-transform hover:scale-105 active:scale-95'
        >
          {btnText}
        </Link>
      </div>
    </div>
  )
}

export default DirectorCard
