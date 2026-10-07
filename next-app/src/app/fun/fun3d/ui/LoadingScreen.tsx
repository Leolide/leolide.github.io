import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'

// 加载遮罩：一块深色底（和网站背景同色），模型加载完后慢慢淡出，露出夕阳场景。
// 垫在导航栏下面（z 44 < navbar 50），所以导航栏一直都在。
// 这里是"等待→揭晓"的一次性画面，不是高频 UI，所以淡出可以比 300ms 长一些。
export default function LoadingScreen() {
  const { progress } = useProgress()
  const [reached, setReached] = useState(false)
  const [hiding, setHiding] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    if (progress >= 100) setReached(true)
  }, [progress])

  useEffect(() => {
    if (!reached) return
    const t1 = setTimeout(() => setHiding(true), 150)
    const t2 = setTimeout(() => setRemoved(true), 1000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reached])

  if (removed) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        right: 'var(--ask-panel-offset-right, 0px)',
        zIndex: 44,
        background: '#010102',
        opacity: hiding ? 0 : 1,
        transition: 'opacity 700ms cubic-bezier(0.23, 1, 0.32, 1)',
        pointerEvents: hiding ? 'none' : 'auto',
      }}
    />
  )
}
