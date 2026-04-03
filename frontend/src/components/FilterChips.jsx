import ChipBtn from './ChipBtn'

/**
 * FilterChips 컴포넌트
 * @param {Array} filters - [{id, label}] 형태의 필터 데이터 배열
 * @param {string|number} active - 현재 활성화된 필터의 id
 * @param {function} onChange - 필터 클릭 시 부모에게 id를 전달하는 콜백 함수
 */
const FilterChips = ({ filters = [], active, onChange }) => {
  return (
    <nav className='flex flex-wrap gap-3 justify-center py-6 font-serif'>
      {filters.map((filter) => (
        <ChipBtn
          key={filter.id}
          label={filter.label}
          // Figma 시안 1: active===id 조건을 만족하면 활성화 상태(true) 전달
          active={active === filter.id}
          // 필터 클릭 시 해당 id를 상위로 전달하여 상태 업데이트 유도
          onClick={() => onChange && onChange(filter.id)}
        />
      ))}
    </nav>
  )
};

export default FilterChips