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
  { label: "Clientelling app", company: "Deloitte", href: "/work/a-clientelling-app" },
];

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lideli/", external: true },
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
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Search pages, projects…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Pages">
            {PAGES.map((p) => (
              <CommandItem key={p.href} onSelect={() => go(p.href)}>
                {p.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Projects">
            {PROJECTS.map((p) => (
              <CommandItem key={p.label} onSelect={() => go(p.href, p.external)}>
                <span>{p.label}</span>
                <span className="text-ink-subtle">· {p.company}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Connect">
            {SOCIAL.map((s) => (
              <CommandItem key={s.label} onSelect={() => go(s.href, s.external)}>
                {s.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
