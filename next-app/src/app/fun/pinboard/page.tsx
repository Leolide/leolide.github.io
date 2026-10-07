import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { FunCanvasBoot } from "./FunCanvasBoot";
import { BackToStory } from "./BackToStory";

export const metadata = {
  title: "Pinboard | Lide Li",
  description: "Lide's experiments: community, architecture, stickers, food, and more.",
};

export default function FunPage() {
  return (
    <>
      {/* Canvas CSS — loaded before paint (versioned to bust stale caches) */}
      <link rel="stylesheet" href="/fun-canvas.css?v=22" />
      <link rel="stylesheet" href="/fun-pinboard.css?v=18" />
      {/* Force navbar background since the canvas page never scrolls */}
      <style>{`header { background: rgba(1,1,2,0.92) !important; border-bottom: 1px solid #23252a !important; backdrop-filter: blur(16px) !important; }
        /* Loading: no dots — the board's own dark grid just sits there, then the cards fade in */
        #fun-page-loader { transition: opacity 400ms cubic-bezier(0.23, 1, 0.32, 1), visibility 0s linear 400ms !important; }
        #fun-page-loader .loader-dot { display: none !important; }
        /* No footer: the canvas runs all the way to the bottom edge (the strip it used to reserve is gone) */
        :root { --fc-footer-h: 0px !important; }
        #fun-footer-strip { display: none !important; }
        /* Toolbar sits near the bottom edge now that there's no footer strip */
        #fun-dock { bottom: 24px !important; }
        /* Next stop: label first, arrow after (mirror the primary button's padding) */
        #fun-wander-btn { padding: 0 10px 0 13px; }
        /* fixed width (fits the longest stop name) so the toolbar never resizes as you move between stops */
        .dock-status { box-sizing: border-box; width: 168px; text-align: center; font-size: 0.78rem; line-height: 20px; color: #8a8f98; padding: 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
        .dock-item.dock-item-back { width: auto; gap: 6px; padding: 0 12px 0 8px; }
        .dock-item.dock-item-back svg { width: 14px; height: 14px; }`}</style>

      <Navbar />

      {/* Loading curtain — a page-level sibling (not nested in #fun-canvas-viewport,
          which is display:none on mobile) so it covers both the desktop canvas while
          items are unpositioned and the mobile fallback while it settles in. */}
      <div id="fun-page-loader" aria-hidden="true">
        <span className="loader-dot" />
        <span className="loader-dot" />
        <span className="loader-dot" />
      </div>

      {/* ── CANVAS VIEWPORT ── */}
      <div id="fun-canvas-viewport" data-page-content>
        <div id="fun-canvas">

          {/* HERO TEXT */}
          <div className="canvas-item hero-item" id="canvas-hero">
            <div className="dt-master-scroll-move-1">
              <div className="dt-first-scroll-move-1">
                <div className="dt-text-scroll-move-1 dt-italic-scroll-move-1">I <strong>craft</strong> and</div>
              </div>
              <div className="dt-second-scroll-move-2">
                <div className="dt-text-scroll-move-1 dt-normal-scroll-move">make</div>
                <img src="/images/website-Recovered-14.webp" alt="" loading="lazy" className="dt-pill-scroll-move-1" />
                <div className="dt-text-scroll-move-1 dt-normal-scroll-move">fun</div>
              </div>
              <div className="dt-third-scroll-move-1">
                <div className="dt-text-scroll-move-1 dt-normal-scroll-move fun"><strong>artifacts</strong></div>
              </div>
            </div>
          </div>

          {/* CARD 0: Community Building */}
          <div className="canvas-item card-item" id="canvas-card-0" data-href="https://www.fouxysquad.com/">
            <img src="/images/IMG_5937.webp" alt="Community Building" loading="lazy" className="dt-image-feature-16" />
            <h3 className="dt-h3">Community Building</h3>
            <div className="dt-body-big">A 250+ member design community in London, with playful events, fresh ideas, and skill-sharing.</div>
          </div>

          {/* CARD 1: Architecture Design */}
          <div className="canvas-item card-item" id="canvas-card-1" data-href="https://chinaroom.polito.it/portfolio/solar-decathlon-long-plan/">
            <img src="/images/Solar_8.webp" alt="Architecture Design" loading="lazy" className="dt-image-feature-16" />
            <h3 className="dt-h3">Architecture Design</h3>
            <div className="dt-body-big"><em>Long Plan</em>, built in Dezhou, China, won the <em>Solar Decathlon China 2018</em> championship.</div>
          </div>

          {/* CARD 2: Urban Planning */}
          <div className="canvas-item card-item" id="canvas-card-2" data-href="https://www.asla.org/2020studentawards/945.html">
            <img src="/images/FOD.webp" alt="Urban Planning" loading="lazy" className="dt-image-feature-16" />
            <h3 className="dt-h3">Urban Planning</h3>
            <div className="dt-body-big">A data-driven revitalisation plan for West Oakland that won the <em>ASLA 2020 Award of Excellence</em>.</div>
          </div>

          {/* CARD 3: Sticker Design */}
          <div className="canvas-item card-item" id="canvas-card-3" data-href="https://store.line.me/stickershop/author/4727135/en">
            <section className="stickerwrapper">
              <div className="sticker-marquee">
                <div className="sticker-track">
                  {["7","13","8","12","2","4-睡觉","6-早","2-爱你","6","10","11","4","8_1","12_1","14","2_1","7_1",
                    "7","13","8","12","2","4-睡觉","6-早","2-爱你","6","10","11","4","8_1","12_1","14","2_1","7_1"].map((n, i) => (
                    <div key={i} className="sticker-item" style={{ backgroundImage: `url('/images/${n}.webp')` }} />
                  ))}
                </div>
              </div>
            </section>
            <h3 className="dt-h3">Sticker Design</h3>
            <div className="dt-body-big"><em>Baobao the Buddy Dino</em> &amp; <em>Lazy Cat&apos;s Daily</em>: 7,000+ downloads and 200,000+ stickers sent.</div>
          </div>

          {/* CARD 4: Graphic Design */}
          <div className="canvas-item card-item" id="canvas-card-4" data-href="https://dribbble.com/shots/14918317-TedxSCUT-poster-and-art-installation">
            <img src="/images/01_Hero.webp" alt="Graphic Design" loading="lazy" className="dt-image-feature-16" />
            <h3 className="dt-h3">Graphic Design</h3>
            <div className="dt-body-big">100+ posters and visual identities directed for <em>TEDxSCUT</em> and my architecture department.</div>
          </div>

          {/* CARD 5: Manga Drawing */}
          <div className="canvas-item card-item" id="canvas-card-5" data-href="https://drive.google.com/file/d/1LAa6T4Eoc7vRyeHXOLzW9sjDXyLWwTQq/view?usp=sharing">
            <img src="/images/01_Hero_1.webp" alt="Manga Drawing" loading="lazy" className="dt-image-feature-16" />
            <h3 className="dt-h3">Manga Drawing</h3>
            <div className="dt-body-big"><em>Folk in Long-Plan</em>, a manga series I created for the Long Plan architecture project.</div>
          </div>

          {/* CARD 6: AR/VR Design */}
          <div className="canvas-item card-item" id="canvas-card-6" data-href="https://drive.google.com/file/d/1G56hgrdgLb-pdCCcAGBw6kDNx-C971uB/view?usp=sharing">
            <img src="/images/AR.webp" alt="AR/VR Design" loading="lazy" className="dt-image-feature-16" />
            <h3 className="dt-h3">AR/VR Design</h3>
            <div className="dt-body-big">An AR exhibition bringing Bruce Lee&apos;s ancestral home to life in YongQing Fang.</div>
          </div>

          {/* CARD 7: Innovation Research */}
          <div className="canvas-item card-item" id="canvas-card-7" data-href="https://issuu.com/lideli1931/docs/lide_li_maud_dissertation_singlepage">
            <img src="/images/Cetizen.webp" alt="Innovation Research" loading="lazy" className="dt-image-feature-16" />
            <h3 className="dt-h3">Innovation Research</h3>
            <div className="dt-body-big">Living Labs research with <em>Cambridge Distinction</em>, exhibited at Seoul &amp; Shenzhen UABB.</div>
          </div>

          {/* CARD 8: Aspiring Chef */}
          <div className="canvas-item card-item" id="canvas-card-8" data-href="https://www.instagram.com/lide.food/">
            <img src="/images/Coffee-Beans.webp" alt="Aspiring Chef" loading="lazy" className="dt-image-feature-16" />
            <h3 className="dt-h3">Aspiring Chef</h3>
            <div className="dt-body-big">I cook every day and post it at <em>lide.food</em>. Japanese and Chinese cuisine.</div>
          </div>

          {/* PHOTOS */}
          <div className="canvas-item photo-item" id="canvas-photo-0" style={{ width: 280, height: 360 }}><img src="/images/IMG_6574_VSCO.webp" alt="" loading="lazy" /><div className="resize-handle" /></div>
          <div className="canvas-item photo-item" id="canvas-photo-2" style={{ width: 340, height: 260 }}><img src="/images/IMG_9821.webp" alt="" loading="lazy" /><div className="resize-handle" /></div>
          <div className="canvas-item photo-item" id="canvas-photo-4" style={{ width: 310, height: 260 }}><img src="/images/b1b9349f-4834-46bc-8735-e48470e2e2ce.webp" alt="" loading="lazy" /><div className="resize-handle" /></div>
          <div className="canvas-item photo-item" id="canvas-photo-5" style={{ width: 260, height: 340 }}><img src="/images/WechatIMG3407.webp" alt="" loading="lazy" /><div className="resize-handle" /></div>
          <div className="canvas-item photo-item" id="canvas-photo-6" style={{ width: 340, height: 260 }}><img src="/images/WechatIMG3409.webp" alt="" loading="lazy" /><div className="resize-handle" /></div>
          <div className="canvas-item photo-item" id="canvas-photo-7" style={{ width: 260, height: 320 }}><img src="/images/WechatIMG3410.webp" alt="" loading="lazy" /><div className="resize-handle" /></div>
          <div className="canvas-item photo-item" id="canvas-photo-8" style={{ width: 280, height: 360 }}><img src="/images/34081735130221.webp" alt="" loading="lazy" /><div className="resize-handle" /></div>
          <div className="canvas-item photo-item" id="canvas-photo-9" style={{ width: 360, height: 240 }}><img src="/images/event-speaker.webp" alt="Speaking at a community event" loading="lazy" /><div className="resize-handle" /></div>
          <div className="canvas-item photo-item" id="canvas-photo-10" style={{ width: 250, height: 445 }}><img src="/images/patagonia.webp" alt="Hiking in Torres del Paine, Patagonia" loading="lazy" /><div className="resize-handle" /></div>
          <div className="canvas-item photo-item" id="canvas-photo-11" style={{ width: 250, height: 436 }}><img src="/images/config-watchparty-2026.webp?v=3" alt="Speaking at the Config WatchParty 2026" loading="lazy" /><div className="resize-handle" /></div>

        </div>
      </div>

      {/* macOS dock */}
      <div id="fun-dock" data-page-content>
        <BackToStory />
        <div className="dock-divider" />
        <span id="fun-tour-status" className="dock-status" aria-live="polite">Start · 1/5</span>
        <button id="fun-wander-btn" className="dock-item dock-item-primary" title="Fly to the next area (→ key, ← to go back)">
          <span className="dock-primary-label">Next stop</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7.5 4.5L13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {/* Author-only tools — visible with ?edit=1 */}
        <div className="dock-divider" id="fun-edit-divider" />
        <button id="fun-add-text-btn" className="dock-item" data-label="Add Note" title="Add a handwritten note">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <button id="fun-restore-btn" className="dock-item" data-label="Restore" title="Bring back deleted items">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.5 8.5A6.5 6.5 0 1 1 3.5 13M3.5 4v4.5H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button id="fun-export-btn" className="dock-item" data-label="Export" title="Copy current layout as code">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Canvas engine — loaded after DOM is ready (versioned to bust stale caches) */}
      <Script src="/fun-canvas.js?v=28" strategy="afterInteractive" />
      {/* Re-inits the canvas after client-side navigation */}
      <FunCanvasBoot />

      {/* ── MOBILE FALLBACK — shown when canvas is hidden (≤767px) ── */}
      <div id="fun-mobile-content" data-page-content>
        <div className="pt-24 pb-20 px-5 bg-canvas min-h-screen">
          <Link href="/fun" className="inline-block text-ink-subtle hover:text-ink text-sm mb-6 transition-colors">← My story</Link>
          <h1 className="text-2xl font-semibold tracking-tight text-ink mb-10">Experiments &amp; side projects</h1>

          <div className="flex flex-col gap-4">
            {[
              { title: "Community Building", img: "/images/IMG_5937.webp", href: "https://www.fouxysquad.com/", desc: "A 250+ member design community in London with regular events and skill-sharing." },
              { title: "Architecture Design", img: "/images/Solar_8.webp", href: "https://chinaroom.polito.it/portfolio/solar-decathlon-long-plan/", desc: "Long Plan in Dezhou won the Solar Decathlon China 2018 championship." },
              { title: "Urban Planning", img: "/images/FOD.webp", href: "https://www.asla.org/2020studentawards/945.html", desc: "ASLA 2020 Award of Excellence for West Oakland urban revitalisation." },
              { title: "Sticker Design", img: "/images/7.webp", href: "https://store.line.me/stickershop/author/4727135/en", desc: "7,000+ downloads, 200,000+ stickers sent on Line & WeChat." },
              { title: "Graphic Design", img: "/images/01_Hero.webp", href: "https://dribbble.com/shots/14918317-TedxSCUT-poster-and-art-installation", desc: "100+ posters for TEDxSCUT and Architecture Department." },
              { title: "Manga Drawing", img: "/images/01_Hero_1.webp", href: "https://drive.google.com/file/d/1LAa6T4Eoc7vRyeHXOLzW9sjDXyLWwTQq/view", desc: "Folk in Long-Plan, a manga series for the architecture project." },
              { title: "AR/VR Design", img: "/images/AR.webp", href: "https://drive.google.com/file/d/1G56hgrdgLb-pdCCcAGBw6kDNx-C971uB/view", desc: "AR exhibition of Bruce Lee's ancestral home for YongQing Fang." },
              { title: "Innovation Research", img: "/images/Cetizen.webp", href: "https://issuu.com/lideli1931/docs/lide_li_maud_dissertation_singlepage", desc: "Cambridge Distinction research on Living Labs in China." },
              { title: "Aspiring Chef", img: "/images/Coffee-Beans.webp", href: "https://www.instagram.com/lide.food/", desc: "Daily cooking log of Japanese and Chinese cuisine." },
            ].map((card) => (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 p-4 rounded-xl border border-hairline bg-surface-1 hover:bg-surface-2 transition-colors"
              >
                <div
                  className="shrink-0 w-16 h-16 rounded-md overflow-hidden bg-surface-2"
                  style={{ backgroundImage: `url('${card.img}')`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
                <div className="min-w-0">
                  <p className="text-ink text-sm font-semibold truncate">{card.title} <span className="opacity-40 text-xs">↗</span></p>
                  <p className="text-ink-subtle text-xs leading-relaxed mt-1 line-clamp-2">{card.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
