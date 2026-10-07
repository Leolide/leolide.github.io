"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface OmnibarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Send the typed text to the Ask panel as a question */
  onAsk: (question: string) => void;
}

const PAGES = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/#selected-works" },
  { label: "About me", href: "/#about" },
  { label: "Fun", href: "/fun" },
];

const PROJECTS = [
  { label: "Autopilot", company: "Palantir", href: "https://www.palantir.com/docs/foundry/autopilot/overview", external: true },
  { label: "OSDK Component Library", company: "Palantir", href: "https://youtu.be/O7aeOmnbCuo", external: true },
  { label: "Clientelling app", company: "Deloitte", href: "/work/a-clientelling-app" },
];

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lideli/", external: true },
  { label: "GitHub", href: "https://github.com/Leolide", external: true },
  { label: "Email", href: "mailto:lideli.leo@gmail.com", external: true },
];

const KBD =
  "inline-flex min-w-5 h-5 items-center justify-center rounded border border-white/15 bg-white/[0.06] px-1 font-mono text-[11px] text-white/70";

export function Omnibar({ open, onOpenChange, onAsk }: OmnibarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);
  const q = query.trim();

  const go = (href: string, external = false) => {
    onOpenChange(false);
    if (external) {
      window.open(href, "_blank", "noopener");
    } else {
      router.push(href);
    }
  };

  return (
    // Glass palette (same look as the navbar/cards): translucent dark fill + strong backdrop blur,
    // bigger than the default shadcn size so it reads as a proper search surface.
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      className="top-[18%] sm:max-w-xl bg-[rgba(18,18,20,0.55)] backdrop-blur-2xl backdrop-saturate-150 ring-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
    >
      <Command className="bg-transparent p-2 **:data-[slot=input-group]:h-12! **:data-[slot=input-group]:rounded-xl! **:data-[slot=input-group]:bg-white/[0.06]! **:data-[slot=input-group]:border-white/10!">
        <CommandInput placeholder="Search, or ask anything about Lide…" className="text-base" value={query} onValueChange={setQuery} />
        <CommandList className="max-h-[min(60vh,28rem)] mt-1">

          <CommandGroup heading="Pages" className="**:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-3 **:[[cmdk-group-heading]]:text-[11px] **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-wider **:[[cmdk-group-heading]]:text-white/45">
            {PAGES.map((p) => (
              <CommandItem key={p.href} className="px-3 py-2.5 text-[15px] data-selected:bg-white/10" onSelect={() => go(p.href)}>
                {p.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="mx-1 my-1 bg-white/10" />

          <CommandGroup heading="Projects" className="**:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-3 **:[[cmdk-group-heading]]:text-[11px] **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-wider **:[[cmdk-group-heading]]:text-white/45">
            {PROJECTS.map((p) => (
              <CommandItem key={p.label} className="px-3 py-2.5 text-[15px] data-selected:bg-white/10" onSelect={() => go(p.href, p.external)}>
                <span>{p.label}</span>
                <span className="text-ink-subtle">· {p.company}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator className="mx-1 my-1 bg-white/10" />

          <CommandGroup heading="Connect" className="**:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-3 **:[[cmdk-group-heading]]:text-[11px] **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-wider **:[[cmdk-group-heading]]:text-white/45">
            {SOCIAL.map((s) => (
              <CommandItem key={s.label} className="px-3 py-2.5 text-[15px] data-selected:bg-white/10" onSelect={() => go(s.href, s.external)}>
                {s.label}
              </CommandItem>
            ))}
          </CommandGroup>
          {/* Ask: always offered once you've typed something. Its value never matches the query,
              so it scores 0 and sorts after real matches — and becomes the only row when nothing matches. */}
          {q && (
            <>
              <CommandSeparator className="mx-1 my-1 bg-white/10" alwaysRender />
              <CommandGroup forceMount heading="Ask" className="**:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:pt-3 **:[[cmdk-group-heading]]:text-[11px] **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-wider **:[[cmdk-group-heading]]:text-white/45">
                <CommandItem forceMount value="__ask_about_lide__" className="px-3 py-2.5 text-[15px] data-selected:bg-white/10" onSelect={() => onAsk(q)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent" aria-hidden="true">
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                  </svg>
                  <span className="truncate">Ask about Lide: <span className="text-white/60">&ldquo;{q}&rdquo;</span></span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>

        {/* Footer: keyboard hints (Raycast/Linear style) — also gives the scrolling list a clean bottom edge */}
        <div className="mt-1 flex items-center justify-end gap-4 border-t border-white/10 px-3 pt-2.5 pb-1 text-xs text-white/45">
          <div className="flex shrink-0 items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className={KBD}>↑</kbd>
              <kbd className={KBD}>↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className={KBD}>↵</kbd>
              Open
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <kbd className={KBD}>esc</kbd>
              Close
            </span>
          </div>
        </div>
      </Command>
    </CommandDialog>
  );
}
