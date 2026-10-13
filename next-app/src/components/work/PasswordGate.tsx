"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Lock, Mail } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";
import { CaseStudySlides } from "@/components/work/CaseStudySlides";
import { CaseStudyNarrative } from "@/components/work/CaseStudyNarrative";
import { caseStudyNarrative } from "@/content/case-study-narrative";
import { publicResources } from "@/content/public-resources";

const CORRECT_PASSWORD = "lide2026";

export function PasswordGate({ slug }: { slug: string }) {
  const storageKey = `unlocked:${slug}`;
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(storageKey) === "1") {
      setUnlocked(true);
    }
  }, [storageKey]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === CORRECT_PASSWORD) {
      localStorage.setItem(storageKey, "1");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setValue("");
    }
  }

  if (unlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        {caseStudyNarrative[slug] ? (
          <CaseStudyNarrative slug={slug} />
        ) : (
          <CaseStudySlides slug={slug} />
        )}
      </motion.div>
    );
  }

  const resources = publicResources[slug];

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 overflow-hidden">
      <div className="p-6 sm:p-8">
        <p className="flex items-center gap-1.5 text-ink-tertiary text-[11px] font-medium tracking-eyebrow uppercase mb-3">
          <Lock className="h-3 w-3" aria-hidden="true" />
          Confidential
        </p>
        <h2 className="text-ink text-base font-semibold mb-1.5">
          The full write-up is under NDA
        </h2>
        <p className="text-ink-subtle text-sm leading-relaxed max-w-[52ch] mb-6">
          Happy to walk you through the process, decisions and results in a call.
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 min-h-9">
          <a
            href="mailto:lideli.leo@gmail.com?subject=Case%20study%20access"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-ink px-4 text-xs font-medium text-canvas hover:bg-ink-muted transition-colors"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Request access
          </a>

          <AnimatePresence mode="wait" initial={false}>
            {showPassword ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex gap-2"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                <input
                  type="password"
                  autoFocus
                  value={value}
                  onChange={(e) => { setValue(e.target.value); setError(false); }}
                  onKeyDown={(e) => { if (e.key === "Escape") setShowPassword(false); }}
                  placeholder="Password"
                  aria-invalid={error}
                  className={[
                    "w-40 h-9 px-3 rounded-md text-sm bg-surface-2 border text-ink placeholder:text-ink-tertiary outline-none transition-colors",
                    error
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-hairline focus:border-hairline-strong",
                  ].join(" ")}
                  autoComplete="current-password"
                />
                <button
                  type="submit"
                  className="h-9 px-3 rounded-md text-xs font-medium border border-hairline text-ink hover:border-hairline-strong transition-colors"
                >
                  Unlock
                </button>
              </motion.form>
            ) : (
              <motion.button
                key="toggle"
                type="button"
                onClick={() => setShowPassword(true)}
                className="h-9 text-xs text-ink-subtle hover:text-ink underline-offset-4 hover:underline transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
              >
                I have a password
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        {error && (
          <p className="text-red-400 text-xs mt-2">That password didn&apos;t work.</p>
        )}
      </div>

      {resources && resources.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline bg-surface-2/40 px-6 sm:px-8 py-4">
          <span className="text-ink-tertiary text-xs">Public resources</span>
          {resources.map((r) => (
            <a
              key={r.href}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-xs text-ink-subtle hover:text-ink transition-colors"
            >
              {r.label}
              <ArrowUpRight
                className="h-3.5 w-3.5 text-ink-tertiary transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-ink"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
