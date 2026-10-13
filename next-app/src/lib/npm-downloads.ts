// Live npm download counts for the public headline stats on case-study pages.
// Called from the browser (the site is a static export), so numbers are current
// for every visitor; the value baked into works-pro.json is the fallback.

const API = "https://api.npmjs.org/downloads/point";
const DAY = 86_400_000;

export type DownloadPeriod = "total" | "last-month" | "last-week";

const cache = new Map<string, Promise<number | null>>();

const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

async function point(range: string, pkg: string): Promise<number> {
  const res = await fetch(`${API}/${range}/${pkg}`);
  if (!res.ok) throw new Error(`npm ${res.status}`);
  const json = (await res.json()) as { downloads?: number };
  return json.downloads ?? 0;
}

/** All-time = sum of ≤1-year windows (the API caps a range at 18 months). */
async function total(pkg: string, since: string): Promise<number> {
  const end = Date.now() - DAY; // npm data lags about a day
  const windows: string[] = [];
  for (let start = Date.parse(since); start <= end; start += 365 * DAY) {
    windows.push(`${iso(start)}:${iso(Math.min(start + 364 * DAY, end))}`);
  }
  const counts = await Promise.all(windows.map((w) => point(w, pkg)));
  return counts.reduce((a, b) => a + b, 0);
}

export function fetchDownloads(pkg: string, period: DownloadPeriod, since = "2025-01-01") {
  const key = `${pkg}|${period}|${since}`;
  if (!cache.has(key)) {
    const p = (period === "total" ? total(pkg, since) : point(period, pkg)).catch(() => null);
    cache.set(key, p);
  }
  return cache.get(key)!;
}

/** 87,312 → "87,000+", 7,664 → "7,600+", 412 → "412". Rounds down so the "+" stays true. */
export function formatPlus(n: number) {
  if (n < 1000) return n.toLocaleString("en-US");
  const step = n >= 10_000 ? 1000 : 100;
  return `${(Math.floor(n / step) * step).toLocaleString("en-US")}+`;
}
