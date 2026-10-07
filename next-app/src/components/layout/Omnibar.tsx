"use client";

import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface OmnibarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function Omnibar({ open, onOpenChange }: OmnibarProps) {
  const router = useRouter();

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
        <CommandInput placeholder="Search pages, projects…" className="text-base" />
        <CommandList className="max-h-[min(60vh,28rem)] mt-1">
          <CommandEmpty>No results found.</CommandEmpty>

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
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
