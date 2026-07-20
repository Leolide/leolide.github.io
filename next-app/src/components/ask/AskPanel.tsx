"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AppWindowMac, ArrowUp, ArrowUpRight, PanelRight, Trash, X } from "lucide-react";
import {
  type AskEntry,
  type AskSource,
  MISS,
  SUGGESTED,
  getEntry,
  matchQuery,
} from "@/lib/ask-matcher";
import { ASK_ENDPOINT, streamAsk } from "@/lib/ask-llm";
import { Textarea } from "@/components/ui/textarea";

interface AskPanelProps {
  open: boolean;
  onClose: () => void;
  skipInitialAnimation?: boolean;
}

interface Answer {
  id: number;
  question: string;
  text: string;
  /** Words revealed so far for curated typewriter; -1 = live LLM stream */
  visible: number;
  thinking: boolean;
  done: boolean;
  sources: AskSource[];
  followUps: AskEntry[];
}

const STORAGE_KEY = "ask-panel-state";

const THINKING_MS = 500;
const WORD_MS = 26;
/** Matcher score at or above which a typed question uses the curated answer */
const STRONG_MATCH = 4;

const CONTACT_SOURCES: AskSource[] = [
  { label: "Email", href: "mailto:lideli.leo@gmail.com", external: true },
];

export function AskPanel({ open, onClose, skipInitialAnimation = false }: AskPanelProps) {
  const reduceMotion = useReducedMotion();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Answer[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored) as { messages?: Answer[] };
      const list = Array.isArray(parsed.messages) ? parsed.messages : [];
      // Older builds could persist colliding ids; keys must be unique
      const seen = new Set<number>();
      return list.map((m) => {
        let id = m.id;
        while (seen.has(id)) id += 1;
        seen.add(id);
        return id === m.id ? m : { ...m, id };
      });
    } catch {
      return [];
    }
  });
  const [pinned, setPinned] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;
      const parsed = JSON.parse(stored) as { pinned?: boolean };
      return typeof parsed.pinned === "boolean" ? parsed.pinned : false;
    } catch {
      return false;
    }
  });
  const [pinnedWidth, setPinnedWidth] = useState<number>(() => {
    if (typeof window === "undefined") return 360;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return 360;
      const parsed = JSON.parse(stored) as { pinnedWidth?: number };
      return typeof parsed.pinnedWidth === "number" ? parsed.pinnedWidth : 360;
    } catch {
      return 360;
    }
  });
  // Side-panel (docked) mode is desktop-only; on small screens the panel
  // always floats. The stored pinned preference survives for desktop.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const docked = pinned && !isMobile;
  const fullscreen = isMobile;
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const runIdRef = useRef(0);
  const resizingRef = useRef(false);
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(420);
  const lastMessage = messages.length ? messages[messages.length - 1] : null;
  const MIN_PINNED_WIDTH = 320;
  const MAX_PINNED_WIDTH = 720;
  const clearChat = () => {
    setMessages([]);
    setDraft("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, messages.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages, pinned, pinnedWidth })
    );
  }, [messages, pinned, pinnedWidth]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // While docked, body becomes the scroll container so the page scrollbar
  // renders at the body's right edge — left of the panel, not under it.
  useEffect(() => {
    if (!(docked && open)) return;
    const docEl = document.documentElement;
    const body = document.body;
    const y = window.scrollY || body.scrollTop;
    docEl.style.overflow = "hidden";
    body.style.height = "100dvh";
    body.style.overflowY = "auto";
    body.style.marginRight = `${pinnedWidth}px`;
    body.scrollTop = y;
    docEl.style.setProperty("--ask-panel-offset-right", `${pinnedWidth}px`);
    return () => {
      const restoreY = body.scrollTop;
      docEl.style.overflow = "";
      body.style.height = "";
      body.style.overflowY = "";
      body.style.marginRight = "";
      docEl.style.setProperty("--ask-panel-offset-right", "0px");
      window.scrollTo(0, restoreY);
    };
  }, [docked, open, pinnedWidth]);

  // Fullscreen (mobile): lock page scrolling behind the panel.
  useEffect(() => {
    if (!(fullscreen && open)) return;
    const docEl = document.documentElement;
    const prev = docEl.style.overflow;
    docEl.style.overflow = "hidden";
    return () => {
      docEl.style.overflow = prev;
    };
  }, [fullscreen, open]);

  // Wheel anywhere over the panel scrolls the chat area, never the page behind.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const onWheel = (e: WheelEvent) => {
      const scroller = scrollRef.current;
      if (!scroller) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const target = e.target as Node;
      if (scroller.contains(target) || inputRef.current?.contains(target)) return;
      e.preventDefault();
      scroller.scrollTop += e.deltaY;
    };
    panel.addEventListener("wheel", onWheel, { passive: false });
    return () => panel.removeEventListener("wheel", onWheel);
  }, [open]);

  // Keep the newest content in view while the chat updates.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, lastMessage?.visible, lastMessage?.text, lastMessage?.done]);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = resizeStartXRef.current - event.clientX;
      const nextWidth = Math.min(
        MAX_PINNED_WIDTH,
        Math.max(MIN_PINNED_WIDTH, resizeStartWidthRef.current + delta)
      );
      setPinnedWidth(nextWidth);
    };

    const onMouseUp = () => {
      if (resizingRef.current) resizingRef.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const showCurated = (
    question: string,
    entry: AskEntry | null,
    runId: number,
    replaceLast = false
  ) => {
    const followUps = entry
      ? entry.followUps.map(getEntry).filter((e): e is AskEntry => Boolean(e))
      : matchQuery(question).runnersUp;
    const text = entry ? entry.answer : MISS.answer;
    const sources = entry ? entry.sources : MISS.sources;
    const base: Answer = {
      id: runId,
      question,
      text,
      visible: 0,
      thinking: !reduceMotion,
      done: false,
      sources,
      followUps,
    };

    const writeMessage = (message: Answer) => {
      setMessages((current) =>
        replaceLast && current.length
          ? [...current.slice(0, -1), message]
          : [...current, message]
      );
    };

    if (reduceMotion) {
      writeMessage({ ...base, visible: text.split(" ").length, done: true });
      return;
    }

    writeMessage(base);
    const words = text.split(" ");
    setTimeout(() => {
      if (runIdRef.current !== runId) return;
      let count = 0;
      const interval = setInterval(() => {
        if (runIdRef.current !== runId) {
          clearInterval(interval);
          return;
        }
        count += 1;
        const done = count >= words.length;
        setMessages((prev) => {
          if (!prev.length) return prev;
          const currentLast = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            { ...currentLast, thinking: false, visible: count, done },
          ];
        });
        if (done) clearInterval(interval);
      }, WORD_MS);
    }, THINKING_MS);
  };

  const showLLM = async (question: string, runId: number) => {
    const base: Answer = {
      id: runId,
      question,
      text: "",
      visible: -1,
      thinking: true,
      done: false,
      sources: CONTACT_SOURCES,
      followUps: [],
    };
    setMessages((current) => [...current, base]);
    try {
      await streamAsk(question, (text) => {
        if (runIdRef.current !== runId) return;
        setMessages((prev) => {
          if (!prev.length) return prev;
          const currentLast = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            { ...currentLast, thinking: false, text },
          ];
        });
      });
      if (runIdRef.current !== runId) return;
      const { best, runnersUp } = matchQuery(question);
      const matchedSources = best ? best.entry.sources : CONTACT_SOURCES;
      setMessages((prev) => {
        if (!prev.length) return prev;
        const currentLast = prev[prev.length - 1];
        return [
          ...prev.slice(0, -1),
          { ...currentLast, done: true, followUps: runnersUp, sources: matchedSources },
        ];
      });
    } catch {
      if (runIdRef.current !== runId) return;
      const { best } = matchQuery(question);
      showCurated(question, best ? best.entry : null, runId, true);
    }
  };

  const ask = (question: string, entryId: string | null) => {
    const q = question.trim();
    if (!q) return;
    // Unique across reloads too — restored messages keep their old ids as keys
    const runId = (runIdRef.current = Math.max(runIdRef.current + 1, Date.now()));
    setDraft("");
    const entry = entryId ? getEntry(entryId) : null;
    if (entry) {
      showCurated(q, entry, runId);
      return;
    }
    const { best } = matchQuery(q);
    if (best && best.score >= STRONG_MATCH) {
      showCurated(q, best.entry, runId);
    } else if (ASK_ENDPOINT) {
      void showLLM(q, runId);
    } else {
      showCurated(q, best ? best.entry : null, runId);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* click-away catcher — floating mode only; while docked the page stays interactive */}
          {!docked && !fullscreen && (
            <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />
          )}

          <motion.div
            ref={panelRef}
            initial={skipInitialAnimation ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.25, 0, 0, 1] }}
            className={`fixed z-50 origin-top-right bg-surface-2/90 backdrop-blur-xl shadow-2xl shadow-black/40 flex flex-col gap-3 ${
              fullscreen
                ? "inset-x-0 top-0 h-dvh rounded-none pb-[env(safe-area-inset-bottom)]"
                : docked
                  ? "top-0 right-0 bottom-0 h-screen rounded-none"
                  : "top-16 right-4 sm:right-6 w-[calc(100vw-2rem)] max-w-[400px] rounded-xl"
            }`}
            style={docked ? { width: `${pinnedWidth}px` } : undefined}
            role="dialog"
            aria-label="Ask about Lide"
          >
            {/* header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkle-icon text-accent" aria-hidden="true">
                  <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                </svg>
                <span className="text-sm font-medium text-ink">Ask about Lide</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPinned((current) => !current)}
                  aria-label={pinned ? "Switch to floating panel" : "Pin as side panel"}
                  title={pinned ? "Switch to floating panel" : "Pin as side panel"}
                  className="max-sm:hidden rounded-md p-1 text-ink-subtle transition-colors hover:bg-surface-3 hover:text-ink"
                >
                  {pinned ? <AppWindowMac className="size-4" /> : <PanelRight className="size-4" />}
                </button>
                <button
                  onClick={clearChat}
                  aria-label="Clear"
                  title="Clear conversation"
                  className="rounded-md p-1 text-ink-subtle transition-colors hover:bg-surface-3 hover:text-ink"
                >
                  <Trash className="size-4" />
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-md p-1 text-ink-subtle transition-colors hover:bg-surface-3 hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* body */}
            {docked && (
              <div
                className="absolute left-0 top-0 h-full w-3 cursor-col-resize touch-none hover:bg-surface-3"
                onMouseDown={(event) => {
                  resizingRef.current = true;
                  resizeStartXRef.current = event.clientX;
                  resizeStartWidthRef.current = pinnedWidth;
                }}
              />
            )}
            <div
              ref={scrollRef}
              className={`overflow-y-auto overscroll-contain px-5 pb-4 ${docked || fullscreen ? "flex-1 min-h-0" : "max-h-[55vh]"}`}
            >
              {messages.length === 0 ? (
                <div className="pb-2">
                  <p className="mb-3 text-sm leading-relaxed text-ink-subtle">
                    Anything about Lide&apos;s work, background, or how to get in
                    touch. Pick a question or type your own.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 pb-4">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-3">
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl bg-surface-3 px-3.5 py-2 text-sm text-ink">
                          <p>{message.question}</p>
                        </div>
                      </div>
                      <div className="text-sm text-ink-muted">
                        {message.thinking ? (
                          <div className="flex items-center gap-1 py-1" aria-label="Thinking">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="size-1 rounded-full bg-ink-subtle"
                                animate={{ opacity: [0.25, 1, 0.25] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {message.visible === -1
                              ? message.text
                              : message.text.split(" ").slice(0, message.visible).join(" ")}
                            {!message.done && (
                              <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-accent align-middle" />
                            )}
                          </p>
                        )}
                        {message.done && message.sources.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mt-3 flex flex-wrap gap-1.5"
                          >
                            {message.sources.map((s) => (
                              <a
                                key={s.href}
                                href={s.href}
                                target={s.external ? "_blank" : undefined}
                                rel={s.external ? "noopener" : undefined}
                                className="flex items-center gap-1 rounded-full border border-hairline bg-surface-2 px-2.5 py-1 text-xs text-ink-subtle transition-colors hover:border-hairline-strong hover:text-ink"
                              >
                                {s.label}
                                {s.external && <ArrowUpRight className="size-3" />}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* follow-up chips */}
            {lastMessage?.done && lastMessage.followUps.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="px-4"
              >
                <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                  {lastMessage.followUps.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => ask(f.question, f.id)}
                      className="whitespace-nowrap rounded-full border border-hairline px-3 py-1 text-xs text-ink-subtle transition-colors hover:border-hairline-strong hover:text-ink"
                    >
                      {f.question}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* suggested chips */}
            {messages.length === 0 && (
              <div className="px-4">
                <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => ask(s.question, s.id)}
                      className="whitespace-nowrap rounded-full border border-hairline px-3 py-1 text-xs text-ink-subtle transition-colors hover:border-hairline-strong hover:text-ink"
                    >
                      {s.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* input */}
            <div className={`ask-panel-input mx-4 mb-4 flex items-end gap-2 rounded-2xl border border-hairline bg-surface-1/50 p-2 pl-4 transition-colors focus-within:border-hairline-strong ${docked || fullscreen ? "mt-auto" : ""}`}>
              <Textarea
                ref={inputRef}
                aria-label="Message"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    ask(draft, null);
                  }
                }}
                maxLength={300}
                placeholder="Ask a question..."
                rows={1}
                className="min-h-0 max-h-28 resize-none overflow-y-auto overscroll-contain rounded-none border-0 bg-transparent p-0 py-1 leading-6 shadow-none outline-none focus-visible:ring-0 selection:bg-surface-3 selection:text-ink placeholder:text-ink-subtle"
              />
              <button
                onClick={() => ask(draft, null)}
                disabled={!draft.trim()}
                aria-label="Send message"
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink text-canvas transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
