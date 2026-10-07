'use client'

import dynamic from 'next/dynamic'
import FunLoaderView from './ui/FunLoaderView'

// Three.js / R3F 只在浏览器里跑：跳过服务端预渲染（静态导出时 useGLTF.preload 等会在服务端出错）。
// 代码下载期间先显示同一个加载画面（不定进度），之后由 LoadingScreen 接着显示真实进度并淡出。
const Fun3DApp = dynamic(() => import('./Fun3DApp'), {
  ssr: false,
  loading: () => <FunLoaderView />,
})

export default function Fun3DClient() {
  return <Fun3DApp />
}
