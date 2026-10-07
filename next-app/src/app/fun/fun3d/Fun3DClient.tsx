'use client'

import dynamic from 'next/dynamic'

// Three.js / R3F 只在浏览器里跑：跳过服务端预渲染（静态导出时 useGLTF.preload 等会在服务端出错）。
// 代码加载期间就是一块深色底（导航栏照常显示），之后由 LoadingScreen 柔和淡出露出场景。
const Fun3DApp = dynamic(() => import('./Fun3DApp'), {
  ssr: false,
  loading: () => <div style={{ position: 'fixed', inset: 0, right: 'var(--ask-panel-offset-right, 0px)', background: '#010102' }} />,
})

export default function Fun3DClient() {
  return <Fun3DApp />
}
