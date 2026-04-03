import { useRef, useCallback } from 'react'

/**
 * 마우스 드래그로 가로 스크롤을 제어하는 최종 고도화 훅
 */
export default function useDragScroll() {
  const ref = useRef(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const isMoved = useRef(false) // 드래그 발생 여부 (ref로 관리하여 즉각 반영)

  const onMouseDown = (e) => {
    isDown.current = true
    isMoved.current = false
    const boardLeft = ref.current.getBoundingClientRect().left
    startX.current = e.clientX - boardLeft
    scrollLeft.current = ref.current.scrollLeft
    
    // 스타일 즉시 변경
    ref.current.style.cursor = 'grabbing'
    ref.current.style.userSelect = 'none'
  }

  const onMouseLeave = () => {
    if (!isDown.current) return
    isDown.current = false
    ref.current.style.cursor = 'grab'
    ref.current.style.removeProperty('user-select')
  }

  const onMouseUp = () => {
    if (!isDown.current) return
    isDown.current = false
    ref.current.style.cursor = 'grab'
    ref.current.style.removeProperty('user-select')
    
    // 마우스 버튼을 뗐을 때 드래그 중이었다면 클릭 방지를 위해 아주 짧은 시간 동안 true 유지
    if (isMoved.current) {
      setTimeout(() => {
        isMoved.current = false
      }, 10)
    }
  }

  const onMouseMove = (e) => {
    if (!isDown.current) return
    e.preventDefault()
    
    const boardLeft = ref.current.getBoundingClientRect().left
    const x = e.clientX - boardLeft
    const walk = (x - startX.current) * 1.5 // 감도 조절
    
    if (Math.abs(walk) > 5) {
      isMoved.current = true
    }
    
    ref.current.scrollLeft = scrollLeft.current - walk
  }

  // 드래그 중 클릭(상세 페이지 이동)을 원천 봉쇄
  const onClickCapture = useCallback((e) => {
    if (isMoved.current) {
      e.stopPropagation()
      e.preventDefault()
    }
  }, [])

  // 브라우저 기본 이미지 드래그 방지
  const onDragStart = (e) => {
    e.preventDefault()
  }

  return {
    ref,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
    onClickCapture,
    onDragStart
  }
}
