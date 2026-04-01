import { twMerge } from 'tailwind-merge'

const ChipBtn = ({ label, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'rounded-full px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200',
        active
          ? 'bg-primary-400 text-primary-900'
          : 'bg-zinc-800 hover:bg-primary-400 hover:text-primary-900'
      )}
    >
      {label}
    </button>
  )
}

export default ChipBtn
