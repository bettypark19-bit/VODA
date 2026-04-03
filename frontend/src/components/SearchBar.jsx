import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faStar } from '@fortawesome/free-solid-svg-icons'

// value/onChange를 받으면 controlled 모드, 없으면 내부 state로 동작
const SearchBar = ({ variant = 'normal', onSubmit, value: externalValue, onChange: externalOnChange, placeholder }) => {
  const [internalValue, setInternalValue] = useState('')

  const isControlled = externalValue !== undefined
  const value = isControlled ? externalValue : internalValue

  const handleChange = (e) => {
    if (isControlled) {
      externalOnChange?.(e)
    } else {
      setInternalValue(e.target.value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim() && onSubmit) {
      onSubmit(value)
    }
  }

  const defaultPlaceholder = variant === 'ai' ? 'AI에게 물어보세요' : '궁금한 영화나 TV 프로그램을 물어보세요.'

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto'>
      <div className='backdrop-blur-md bg-white/5 border border-[#6C5BA0]/60 rounded-full px-8 py-5 flex items-center gap-4 transition-all focus-within:border-primary-400/80 shadow-lg shadow-primary-900/10'>
        <FontAwesomeIcon
          icon={variant === 'ai' ? faStar : faMagnifyingGlass}
          className='text-white/70'
        />
        <input
          type='text'
          value={value}
          onChange={handleChange}
          placeholder={placeholder || defaultPlaceholder}
          className='bg-transparent outline-none text-white w-full placeholder-zinc-400'
        />
      </div>
    </form>
  )
}

export default SearchBar
