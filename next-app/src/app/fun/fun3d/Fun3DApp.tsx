'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import * as THREE from 'three'
import Scene from './Scene'
import NoiseOverlay from './ui/NoiseOverlay'
import Resume from './ui/Resume'
import BoardCTA from './BoardCTA'
import LoadingScreen from './ui/LoadingScreen'
import { useStore } from './store'
import { pageScrollY, setPageScrollY } from './pageScroll'
import './fun3d.css'

function Backdrop() {
  // 点击空白处收起详情
  const setActive = useStore((s) => s.setActive)
  return (
    <mesh position={[0, 0, -40]} onClick={() => setActive(null)}>
      <planeGeometry args={[600, 300]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}


const HERO_TAGLINE = 'Hey, come see Lide outside of work'

function Hero({ cueOpacity }: { cueOpacity: MotionValue<number> }) {
  // 首屏大段文字叠层（标题 + 正文）已移除，避免和模型自带的 hero 文字重复；
  // 这里只保留一行很短的 tagline，放在 scroll-cue 上方，三语言跟随切换按钮。
  return (
    <section className="hero">
      <motion.div
        className="hero-tagline"
        style={{ opacity: cueOpacity }}
        aria-hidden="true"
      >
        {HERO_TAGLINE}
      </motion.div>
      <motion.div className="scroll-cue" style={{ opacity: cueOpacity }} aria-hidden="true">
        <span className="scroll-cue-label">
          scroll
        </span>
        <span className="scroll-cue-track">
          <span className="scroll-cue-dot" />
        </span>
      </motion.div>
    </section>
  )
}


export default function Fun3DApp() {
  // 不用 framer 的 useScroll()：它只看 window，而 Ask 面板停靠时滚动的是 body。
  // 在 window 上用 capture 监听（scroll 事件不冒泡，capture 能收到 body 的滚动），两种情况都覆盖。
  const scrollY = useMotionValue(0)
  // 收尾区蒙层：收尾区顶部从视口底部（0）到视口中线（1）的进度
  const worksRef = useRef<HTMLElement>(null)
  const worksProgress = useMotionValue(0)
  useEffect(() => {
    const update = () => {
      scrollY.set(pageScrollY())
      const el = worksRef.current
      if (el) {
        const vh = window.innerHeight
        const top = el.getBoundingClientRect().top
        worksProgress.set(Math.min(1, Math.max(0, (vh - top) / (vh * 0.5))))
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true, capture: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, { capture: true })
      window.removeEventListener('resize', update)
    }
  }, [scrollY, worksProgress])

  // 宽度变化时（Ask 面板打开/关闭、窗口缩放）保持"读到哪儿"不变：
  // 文字换行会让内容变高/变矮，同一个 scrollY 会落到故事的不同位置，模型就会突然跳。
  // 做法：滚动时记住离参考线最近的那一块内容（首屏 / 每条故事 / 收尾）和它在视口里的位置；
  // 宽度一变，就瞬间把同一块内容放回同一个位置。宽度变化引起的那次 scroll 事件不更新锚点。
  const contentRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const content = contentRef.current
    if (!content) return
    let width = content.clientWidth
    let anchor: { index: number; top: number } | null = null

    const blocks = () =>
      Array.from(content.querySelectorAll<HTMLElement>(':scope > section, .tl-entry'))

    const remember = () => {
      if (content.clientWidth !== width) return // 布局正在变，交给下面的 ResizeObserver
      const line = window.innerHeight * 0.3
      let best: { index: number; top: number } | null = null
      blocks().forEach((el, index) => {
        const top = el.getBoundingClientRect().top
        if (!best || Math.abs(top - line) < Math.abs(best.top - line)) best = { index, top }
      })
      anchor = best
    }

    const ro = new ResizeObserver(() => {
      const w = content.clientWidth
      if (w === width) return
      width = w
      const a = anchor
      if (a) {
        const el = blocks()[a.index]
        if (el) setPageScrollY(pageScrollY() + (el.getBoundingClientRect().top - a.top))
      }
      remember()
    })

    remember()
    ro.observe(content)
    window.addEventListener('scroll', remember, { passive: true, capture: true })
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', remember, { capture: true })
    }
  }, [])
  const fogBg = useTransform(
    worksProgress,
    [0, 1],
    ['rgba(8, 11, 18, 0)', 'rgba(8, 11, 18, 0.41)'] // 压暗减半（原 0.82）
  )
  const fogBlur = useTransform(worksProgress, [0, 1], ['blur(0px)', 'blur(10px)'])
  // 滚动渐暗：离开首屏后压暗 3D 场景，保证履历文字可读
  const scrimOpacity = useTransform(scrollY, [0, 520], [0, 0.4])
  // 首屏滚动提示随之淡出
  const cueOpacity = useTransform(scrollY, [0, 160], [1, 0])
  // 首屏底部渐变底色：开始滑动后淡出
  const heroGradientOpacity = useTransform(scrollY, [0, 240], [1, 0])
  // 磨砂右轨：进入履历区后淡入（首屏不磨砂）
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const railOpacity = useTransform(scrollY, [vh * 0.5, vh * 1.1], [0, 1])
  // 首屏装饰画框/角标：滚动后淡出
  const heroChromeOpacity = useTransform(scrollY, [0, 280], [1, 0])

  return (
    <div className="fun3d-root" data-page-content>
      {/* 加载遮罩：模型全部加载完成前覆盖全屏，完成后淡出 */}
      <LoadingScreen />

      {/* 固定的 3D 背景 */}
      <div className="scene-bg">
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 5, 19], fov: 39, near: 0.1, far: 500 }}
          gl={{ antialias: false, stencil: false, depth: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <color attach="background" args={['#110d0a']} />
          <Suspense fallback={null}>
            <Backdrop />
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* 滚动渐暗蒙层 */}
      <motion.div className="scrim" style={{ opacity: scrimOpacity }} aria-hidden="true" />

      {/* 作品区固定蒙层：仅压暗（减半），模糊先注释掉 */}
      <motion.div
        className="stage-fog"
        style={{ background: fogBg /* , backdropFilter: fogBlur, WebkitBackdropFilter: fogBlur */ }}
        aria-hidden="true"
      />

      {/* 固定磨砂右轨（进入履历区淡入） */}
      <motion.div className="glass-rail" style={{ opacity: railOpacity }} aria-hidden="true" />

      {/* 首屏底部渐变底色，滚动后淡出 —— 暂时注释查看效果 */}
      {/* <motion.div
        className="hero-gradient"
        style={{ opacity: heroGradientOpacity }}
        aria-hidden="true"
      /> */}



      {/* 顶部黑色渐变：垫在网站导航栏下面，让导航文字更清楚 */}
      <div className="top-fade" aria-hidden="true" />

      {/* 全屏胶片噪点蒙层（multiply 混合） */}
      <NoiseOverlay />

      {/* 可滚动内容 */}
      <main className="content" ref={contentRef}>
        <Hero cueOpacity={cueOpacity} />
        <Resume />
        <BoardCTA innerRef={worksRef} />
      </main>
    </div>
  )
}
