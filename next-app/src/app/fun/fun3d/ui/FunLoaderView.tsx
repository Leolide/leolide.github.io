// 进入 /fun 时的加载画面（代码加载 + 模型加载两个阶段共用同一个画面，衔接无跳变）：
// 深色底 + 导航栏下方一条细进度条 + 一行手写字轻轻"呼吸"。
// 动画全部用 CSS（加载期间主线程很忙，CSS 动画不掉帧）；样式在 globals.css 的 .fun-loader。
export default function FunLoaderView({
  progress,
  hiding = false,
}: {
  /** 0–100；不传 = 还不知道进度（显示来回流动的不定进度条） */
  progress?: number
  hiding?: boolean
}) {
  const known = typeof progress === 'number'
  return (
    <div className={`fun-loader${hiding ? ' is-hiding' : ''}`} aria-hidden={hiding} role="status">
      <div className="fun-loader-bar">
        <div
          className={`fun-loader-fill${known ? '' : ' is-indeterminate'}`}
          style={known ? { transform: `scaleX(${Math.max(0.04, Math.min(1, progress / 100))})` } : undefined}
        />
      </div>
      <p className="fun-loader-text">Getting Lide ready…</p>
    </div>
  )
}
