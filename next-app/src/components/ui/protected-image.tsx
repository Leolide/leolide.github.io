"use client";

import type { CSSProperties, DragEvent, MouseEvent } from "react";

/**
 * Lightweight deterrent only — not real DRM. Blocks the obvious "right
 * click → Save image as" and drag-out-to-desktop paths; does nothing
 * against a screenshot. Spread onto any plain <img> that doesn't need
 * the watermark overlay (e.g. small index-page thumbnails).
 */
export function imageGuardProps() {
  return {
    draggable: false,
    onContextMenu: (e: MouseEvent) => e.preventDefault(),
    onDragStart: (e: DragEvent) => e.preventDefault(),
  };
}

function watermarkDataUri(text: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="170">
      <text x="-20" y="95" font-family="-apple-system,Helvetica,Arial,sans-serif"
        font-size="13" letter-spacing="2" fill="#ffffff" fill-opacity="0.5"
        transform="rotate(-28 110 85)">${text}</text>
    </svg>`
    .replace(/\s+/g, " ")
    .trim();
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

type ProtectedImageProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  watermark?: boolean;
  watermarkText?: string;
};

/**
 * Drop-in replacement for <img> used on real project screenshots: adds
 * the right-click/drag guard above plus a faint tiled watermark so a
 * screenshot still carries attribution. `wrapperClassName` controls the
 * positioning wrapper so it can match whatever layout the <img> it's
 * replacing already lived in (w-full h-auto, object-contain, etc).
 */
export function ProtectedImage({
  src,
  alt,
  className,
  wrapperClassName = "relative block",
  style,
  width,
  height,
  watermark = true,
  watermarkText = "LIDE LI · PORTFOLIO",
}: ProtectedImageProps) {
  const guard = imageGuardProps();
  return (
    <span className={wrapperClassName} style={{ WebkitTouchCallout: "none" }}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ WebkitUserDrag: "none", userSelect: "none", ...style } as CSSProperties}
        {...guard}
      />
      {watermark && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: watermarkDataUri(watermarkText),
            backgroundRepeat: "repeat",
            mixBlendMode: "overlay",
          }}
        />
      )}
    </span>
  );
}
