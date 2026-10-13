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

type ProtectedImageProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
};

/**
 * Drop-in replacement for <img> used on real project screenshots: adds
 * the right-click/drag guard above. `wrapperClassName` controls the
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
    </span>
  );
}
