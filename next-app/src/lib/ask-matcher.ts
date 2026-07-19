import knowledge from "@/content/ask-knowledge.json";

export interface AskSource {
  label: string;
  href: string;
  external: boolean;
}

export interface AskEntry {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
  sources: AskSource[];
  followUps: string[];
}

const ENTRIES = knowledge.entries as AskEntry[];
const BY_ID = new Map(ENTRIES.map((e) => [e.id, e]));

export const MISS = knowledge.miss as Pick<AskEntry, "answer" | "sources">;
export const SUGGESTED = knowledge.suggested
  .map((id) => BY_ID.get(id))
  .filter((e): e is AskEntry => Boolean(e));

export function getEntry(id: string): AskEntry | undefined {
  return BY_ID.get(id);
}

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did",
  "what", "whats", "who", "whos", "how", "why", "where", "when", "which",
  "can", "could", "would", "should", "has", "have", "had", "his", "her",
  "their", "there", "of", "in", "on", "at", "to", "for", "with", "and",
  "or", "any", "some", "me", "you", "i", "s", "lide", "lides", "li",
]);

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export interface AskMatch {
  entry: AskEntry;
  score: number;
}

/**
 * Score entries by keyword overlap with the query. Exact token hits score 2,
 * prefix hits score 1 (so "commun" still finds "community"). Question-text
 * tokens count half so display wording nudges but never dominates.
 */
export function matchQuery(query: string): { best: AskMatch | null; runnersUp: AskEntry[] } {
  const tokens = tokenize(query);
  if (tokens.length === 0) return { best: null, runnersUp: SUGGESTED.slice(0, 3) };

  const scored: AskMatch[] = ENTRIES.map((entry) => {
    const questionTokens = tokenize(entry.question);
    let score = 0;
    for (const token of tokens) {
      for (const kw of entry.keywords) {
        if (kw === token) { score += 2; break; }
        if (kw.startsWith(token) || token.startsWith(kw)) { score += 1; break; }
      }
      if (questionTokens.includes(token)) score += 1;
    }
    return { entry, score };
  })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = scored.length > 0 && scored[0].score >= 2 ? scored[0] : null;
  const runnersUp = (best ? scored.slice(1, 4) : scored.slice(0, 3)).map((m) => m.entry);
  return {
    best,
    runnersUp: runnersUp.length > 0 ? runnersUp : SUGGESTED.slice(0, 3),
  };
}
