import { useState, useEffect } from 'react'

// API 함수(fn)를 받아 data/loading/err 상태를 반환하는 공용 훅
// deps 배열이 바뀔 때마다 재호출됨
export default function useFetch(fn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let alive = true  // 언마운트 후 setState 방지
    setLoading(true)
    setErr(null)
    fn()
      .then(res => { if (alive) setData(res.data) })
      .catch(e => { if (alive) { setErr(e); console.error(e) } })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, deps)

  return { data, loading, err }
}
