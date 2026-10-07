"use client";

import { MotionConfig } from "framer-motion";

// reducedMotion="user": visitors with "reduce motion" turned on get the fades but no
// sliding/scaling — Framer drops transform animations and keeps opacity for them.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
