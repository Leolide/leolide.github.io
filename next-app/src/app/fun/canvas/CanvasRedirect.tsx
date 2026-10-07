"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function CanvasRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/fun/pinboard");
  }, [router]);
  return null;
}
