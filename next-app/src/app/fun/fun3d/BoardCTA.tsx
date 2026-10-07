'use client'

import { type Ref } from 'react'
import { motion } from 'framer-motion'
import { usePageExit } from '@/lib/page-transition'



// 故事区的收尾：淡入的按钮；点击后页面内容柔和淡出（导航栏不动），再跳到 /fun/canvas
export default function BoardCTA({ innerRef }: { innerRef: Ref<HTMLElement> }) {
  const go = usePageExit()

  return (
    <section className="board-cta" ref={innerRef as never}>
      <motion.div
        className="board-cta-inner"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <button type="button" className="board-cta-btn" onClick={() => go('/fun/canvas')}>
          See my collection <span aria-hidden="true">→</span>
        </button>
      </motion.div>
    </section>
  )
}
