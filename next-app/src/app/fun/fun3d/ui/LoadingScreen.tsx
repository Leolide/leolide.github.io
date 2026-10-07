import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import FunLoaderView from './FunLoaderView'

// 模型加载阶段：显示真实进度（three 的 LoadingManager），加载完后整体柔和淡出露出场景。
// 模型有缓存时几乎瞬间就绪，加载画面会"闪一下"——所以至少停留 MIN_VISIBLE_MS，
// 让进度条走满、文字呼吸一拍，再慢慢淡出，回访也一样柔和。
// 垫在导航栏下面（z 44 < navbar 50），导航栏一直都在。
const MIN_VISIBLE_MS = 1100

export default function LoadingScreen() {
  const mountedAt = useRef(Date.now())
  const { progress } = useProgress()
  const peak = useRef(0)
  peak.current = Math.max(peak.current, Math.min(Math.max(progress, 0), 100))
  const [reached, setReached] = useState(false)
  const [hiding, setHiding] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    if (progress >= 100) setReached(true)
  }, [progress])

  useEffect(() => {
    if (!reached) return
    const wait = Math.max(250, MIN_VISIBLE_MS - (Date.now() - mountedAt.current))
    const t1 = setTimeout(() => setHiding(true), wait)
    const t2 = setTimeout(() => setRemoved(true), wait + 900)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reached])

  if (removed) return null
  return <FunLoaderView progress={peak.current} hiding={hiding} />
}
