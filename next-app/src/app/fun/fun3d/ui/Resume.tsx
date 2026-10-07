import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ZooopLogo } from './ZooopLogo'
import { SOCIAL_ICONS } from './SocialIcons'
import { FOCUS_POINTS } from '../data/focusPoints'
import { pageScrollY, scrollPageTo } from '../pageScroll'

const SOCIAL_LINKS = [
  {
    id: 'douyin',
    label: '抖音',
    href: 'https://www.douyin.com/user/MS4wLjABAAAAlmQDgHf0NlbsjrfWENm8LyrIikxSRRq7mzlzQSIStQJkV7Ju52B6A55zw5TUDU5d',
  },
  {
    id: 'bilibili',
    label: 'B站',
    href: 'https://space.bilibili.com/275344092?spm_id_from=333.937.0.0',
  },
  {
    id: 'xiaohongshu',
    label: '小红书',
    href: 'https://www.xiaohongshu.com/user/profile/5ceba8c8000000000502fd69',
  },
]

// 履历数据（双语）。英文为译稿，可按需润色。
interface ResumeGroup {
  heading?: string
  logo?: string
  logoImg?: string
  sub?: string
  link?: string
  items?: string[]
  links?: { id: string; label: string; href: string }[]
}
interface ResumeEntry {
  period: string
  place: string
  role?: string
  logo?: { src: string; alt: string }
  points?: string[]
  groups?: ResumeGroup[]
  links?: { href: string; label: string }[]
}
const RESUME: Record<'en', { title: string; entries: ResumeEntry[] }> = {
  en: {
    title: 'Outside of Work',
    entries: [
      {
        period: '2015 – 2022',
        place: 'Once Architecture Student',
        logo: { src: '/images/sdc-mark.svg', alt: 'Solar Decathlon China' },
        role: 'Before apps, I designed buildings.',
        points: [
          'I actually built a house! Long Plan went up in Dezhou, China and won Solar Decathlon China 2018. I also helped plan the revitalisation of West Oakland, which won an ASLA 2020 Award of Excellence.',
        ],
        links: [
          { href: 'https://chinaroom.polito.it/portfolio/solar-decathlon-long-plan/', label: 'Long Plan project' },
          {
            href: 'https://www.asla.org/awards-events-main-landing/honors-awards/pro-student-awards/2020-student-awards/945',
            label: 'ASLA award',
          },
        ],
      },
      {
        period: '2022 – present',
        place: 'Turns Out I Make Stickers Too',
        logo: { src: '/images/baobao-white.svg', alt: 'Baobao the Buddy Dino' },
        role: 'A dinosaur I drew for fun took off.',
        points: [
          'Baobao the Buddy Dino and Lazy Cat’s Daily: 7,000+ downloads, 200,000+ sends.',
        ],
        links: [{ href: 'https://store.line.me/stickershop/author/4727135/en', label: 'LINE sticker shop' }],
      },
      {
        period: '2020 – 2022',
        place: 'Rowing Before Sunrise',
        logo: { src: '/images/boatclub.svg', alt: 'Clare Hall Boat Club' },
        role: 'Cambridge mornings meant a boat, not a laptop.',
        points: [
          'Began rowing at Clare Hall Boat Club, and somehow that turned into skiing, hiking, anything outside.',
        ],
        links: [{ href: 'https://www.instagram.com/leo.lide/', label: 'Instagram' }],
      },
      {
        period: '2025 – present',
        place: 'Starting Something in London',
        logo: { src: '/images/fouxy-squad-logo.svg', alt: 'Fouxy Squad' },
        role: 'A few designers meeting up became a real community.',
        points: ['Started Fouxy Squad, now 400+ designers strong.'],
        links: [{ href: 'https://www.fouxysquad.com/', label: 'Fouxy Squad' }],
      },
      {
        period: '2026 – present',
        place: 'A New Chapter',
        logo: { src: '/images/figma-mark-white.svg', alt: 'Friends of Figma' },
        role: 'Now running the room, not just showing up to it.',
        points: ['Now I am leading the Friends of Figma London chapter.'],
        links: [{ href: 'https://friends.figma.com/london/', label: 'Friends of Figma London' }],
      },
    ],
  },
}

// 履历条目依次对应 glb 里的聚焦锚点（相机停靠点），顺序须与 entries 一致。
// 名单是唯一真源，见 data/focusPoints.ts（Scene.tsx 也从那里取）。
const POINT_ORDER = FOCUS_POINTS

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}
const itemV = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}

function Group({ group }: { group: ResumeGroup }) {
  const heading =
    group.logo === 'zooop' ? (
      <a
        className="zooop-logo-link"
        href={group.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ZOOOP"
      >
        <ZooopLogo className="zooop-logo" animated />
      </a>
    ) : group.link ? (
      <a className="about-link" href={group.link} target="_blank" rel="noopener noreferrer">
        {group.heading}
      </a>
    ) : (
      <span>{group.heading}</span>
    )

  return (
    <motion.div className="tl-group" variants={itemV}>
      <div className="tl-group-head">
        {group.logoImg && (
          <span className="tl-group-logo">
            <img src={group.logoImg} alt={group.heading || ''} loading="lazy" />
          </span>
        )}
        {heading}
        {group.sub && <span className="tl-group-sub">{group.sub}</span>}
      </div>
      {group.items && (
        <ul className="tl-points">
          {group.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
      {group.links && (
        <div className="tl-logos">
          {group.links.map((l) => {
            const Icon = SOCIAL_ICONS[l.id as keyof typeof SOCIAL_ICONS]
            return (
              <a
                key={l.id}
                className="tl-logo"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                title={l.label}
              >
                <Icon />
              </a>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

/* 手机上的"Next"：滚动不好控制，点一下直接跳到下一个故事。
   落点 = 下一条的卡片刚好钉住（entry 顶部到达 sticky top）之后再往里一点，让镜头已经停在那张贴纸上。 */
function goToNext(from: HTMLElement) {
  const entry = from.closest('.tl-entry')
  const next = entry?.nextElementSibling as HTMLElement | null
  const pin = next?.querySelector<HTMLElement>('.tl-pin')
  const hold = next?.querySelector<HTMLElement>('.tl-hold')
  if (!next || !pin) {
    // 最后一个故事：滑到底部的 "See my pinboard"，让它整块出现在屏幕里
    const cta = document.querySelector<HTMLElement>('.board-cta')
    if (cta) {
      const r = cta.getBoundingClientRect()
      scrollPageTo(r.bottom + pageScrollY() - window.innerHeight)
    }
    return
  }
  const y = pageScrollY()
  const stickyTop = parseFloat(getComputedStyle(pin).top) || 0
  const entryTop = next.getBoundingClientRect().top + y
  // 下一张卡片刚钉住的位置，再往停留区里走一点（镜头已经停在那张贴纸上）
  let target = entryTop - stickyTop + (hold?.offsetHeight ?? 0) * 0.25
  // 但上一张卡片此时可能还没离开，露在导航栏下面 → 至少滚到它整张移出导航栏为止。
  // sticky 卡片最低只能停在所属 tl-entry 的内容底边（entry 底边 - padding-bottom），据此算出它完全离场的滚动量。
  const prev = entry as HTMLElement | null
  if (prev) {
    const nav = document.querySelector('header')?.getBoundingClientRect().bottom ?? 56
    const contentBottom = prev.getBoundingClientRect().bottom + y - (parseFloat(getComputedStyle(prev).paddingBottom) || 0)
    target = Math.max(target, contentBottom - nav + 8)
  }
  // 也别滚过头：下一张卡片开始往上走之前停下
  const nextContentBottom = next.getBoundingClientRect().bottom + y - (parseFloat(getComputedStyle(next).paddingBottom) || 0)
  const nextUnpin = nextContentBottom - stickyTop - pin.offsetHeight
  scrollPageTo(Math.min(target, nextUnpin - 4))
}

function Entry({ entry, index, pinnedTitle, isLast }: { entry: ResumeEntry; index: number; pinnedTitle?: string; isLast?: boolean }) {
  // 记下这张卡片（含圆点）的高度 → CSS 变量 --pin-h，手机上用它把卡片钉在屏幕底部附近
  const pinRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = pinRef.current
    if (!el) return
    const ro = new ResizeObserver(() => el.style.setProperty('--pin-h', `${el.offsetHeight}px`))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <motion.div
      className="tl-entry"
      data-point={POINT_ORDER[index]}
      variants={containerV}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
    >
      {/* tl-pin：圆点 + 卡片一起"钉住"（sticky）在镜头锁定线上，下面的 tl-hold 是停留距离——
          滚到某个故事时，卡片和贴纸会停住一段，要多滚一会儿才继续，给人时间读。
          不改滚动手感、不劫持滚轮，只是把这一段的滚动距离拉长。 */}
      <div className="tl-pin" ref={pinRef}>
      {/* 桌面：第一个故事的卡片上方带一份"Outside of Work"标题，跟卡片一起钉住、一起离开；
          真正的 h2 在上面保留占位（桌面隐藏、手机显示）。 */}
      {pinnedTitle && (
        <motion.div className="tl-pin-title" variants={itemV} aria-hidden="true">
          {pinnedTitle}
        </motion.div>
      )}
      <motion.span className="tl-dot" variants={itemV} aria-hidden="true" />
      {/* tl-body 包住文字内容（点保持在外做时间轴标记）：移动端可给它加卡片衬底，
          且它紧贴内容高度，不含 tl-entry 用于排布的大 padding。
          用普通 div（非 motion）：framer 变体经 React context 穿透它，叶子元素仍是
          tl-entry 的直接 stagger 子级，入场动画与包裹前完全一致。 */}
      <div className="tl-body">
        <motion.div className="tl-period" variants={itemV}>
          {entry.period}
        </motion.div>
        <motion.div className="tl-head" variants={itemV}>
          {entry.logo && (
            <span className="tl-logo-chip">
              <img src={entry.logo.src} alt={entry.logo.alt} decoding="async" />
            </span>
          )}
          <h3 className="tl-place">{entry.place}</h3>
        </motion.div>
        {entry.role && (
          <motion.div className="tl-role" variants={itemV}>
            {entry.role}
          </motion.div>
        )}
        {entry.points && (
          <motion.ul className="tl-points" variants={itemV}>
            {entry.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </motion.ul>
        )}
        {entry.links && entry.links.length > 0 && (
          <motion.div className="tl-link-row" variants={itemV}>
            {entry.links.map((l, i) => (
              <a
                key={i}
                className="tl-link"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label} ↗
              </a>
            ))}
          </motion.div>
        )}
        {entry.groups && entry.groups.map((g, i) => <Group key={i} group={g} />)}
        <motion.div className="tl-next-row" variants={itemV}>
          <button type="button" className="tl-next" aria-label={isLast ? 'Go to the pinboard link' : 'Next story'} onClick={(e) => goToNext(e.currentTarget)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </motion.div>
      </div>
      </div>
      <div className="tl-hold" aria-hidden="true" />
    </motion.div>
  )
}

export default function Resume() {
  const data = RESUME.en
  return (
    <section className="resume">
      <motion.h2
        className="resume-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {data.title}
      </motion.h2>
      <div className="timeline">
        {data.entries.map((e, i) => (
          <Entry key={i} entry={e} index={i} isLast={i === data.entries.length - 1} />
        ))}
      </div>
    </section>
  )
}
