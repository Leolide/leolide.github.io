// Public worker URL (not a secret — it ships in the client bundle either way).
// Baked in as the default so production builds don't depend on env config;
// NEXT_PUBLIC_ASK_ENDPOINT still overrides it, e.g. for a local worker.
export const ASK_ENDPOINT =
  process.env.NEXT_PUBLIC_ASK_ENDPOINT ?? "https://lide-ask.lide-studio.workers.dev";

/**
 * Stream an answer from the ask-worker as text chunks.
 * Throws if the endpoint is unset, unreachable, or errors — callers fall
 * back to curated matching.
 */
export async function streamAsk(
  question: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  if (!ASK_ENDPOINT) throw new Error("ask endpoint not configured");
  const res = await fetch(ASK_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(`ask failed: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let received = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += decoder.decode(value, { stream: true });
    onChunk(received);
  }
  if (received.trim() === "") throw new Error("empty answer");
}
