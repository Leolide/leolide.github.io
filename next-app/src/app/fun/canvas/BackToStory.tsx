'use client'

import { usePageExit } from '@/lib/page-transition'

// 画布页 dock 里的"回到故事"按钮：画布内容柔和淡出（导航栏不动），再回到 /fun
export function BackToStory() {
  const go = usePageExit()
  return (
    <button type="button" className="dock-item dock-item-back" title="Back to my story" onClick={() => go('/fun')}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="dock-primary-label">My story</span>
    </button>
  )
}
