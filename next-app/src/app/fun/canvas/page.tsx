import { CanvasRedirect } from "./CanvasRedirect";

// The pinboard used to live at /fun/canvas. This static page forwards old links/bookmarks
// to /fun/pinboard (the site is a static export, so there's no server-side redirect).
export const metadata = {
  title: "Pinboard | Lide Li",
  robots: { index: false },
};

export default function OldCanvasPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/fun/pinboard/" />
      <link rel="canonical" href="/fun/pinboard/" />
      <CanvasRedirect />
      <p style={{ padding: "96px 24px", textAlign: "center" }}>
        The pinboard has moved: <a href="/fun/pinboard/">/fun/pinboard</a>
      </p>
    </>
  );
}
