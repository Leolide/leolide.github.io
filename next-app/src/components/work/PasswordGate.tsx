"use client";

import { useState, useEffect } from "react";

const CORRECT_PASSWORD = "lide2025";

export function PasswordGate({ slug }: { slug: string }) {
  const storageKey = `unlocked:${slug}`;
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

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
      <div className="rounded-xl border border-hairline bg-surface-1 p-8 text-center">
        <p className="text-ink-subtle text-sm">
          Case study unlocked. Full content coming soon.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-8">
      <p className="text-ink text-sm font-medium mb-1">This case study is protected</p>
      <p className="text-ink-subtle text-xs mb-6">
        Enter the password or reach out at{" "}
        <a
          href="mailto:lideli.leo@gmail.com"
          className="text-ink hover:text-accent underline underline-offset-2 transition-colors"
        >
          lideli.leo@gmail.com
        </a>{" "}
        to request access.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          placeholder="Password"
          className={[
            "flex-1 h-9 px-3 rounded-lg text-sm bg-surface-2 border text-ink placeholder:text-ink-tertiary outline-none transition-colors",
            error
              ? "border-red-500/60 focus:border-red-500"
              : "border-hairline focus:border-hairline-strong",
          ].join(" ")}
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="h-9 px-4 rounded-lg text-xs font-medium bg-surface-3 border border-hairline text-ink hover:border-hairline-strong transition-colors"
        >
          Unlock
        </button>
      </form>
      {error && (
        <p className="text-red-400 text-xs mt-2">Incorrect password.</p>
      )}
    </div>
  );
}
