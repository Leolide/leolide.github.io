// 页面滚动位置：平时是 window 在滚；Ask 面板停靠时 AskPanel 会把 body 变成滚动容器
// （window.scrollY 一直是 0）。两种情况都取得到真实的滚动量。
export function pageScrollY(): number {
  if (typeof window === 'undefined') return 0
  return Math.max(window.scrollY, document.body.scrollTop)
}

/** 瞬间滚到某个位置（不做平滑），自动选对正在滚动的那个元素。 */
export function setPageScrollY(y: number) {
  const body = document.body
  if (body.scrollHeight > body.clientHeight && getComputedStyle(body).overflowY !== 'visible') {
    body.scrollTop = y
  } else {
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
  }
}
