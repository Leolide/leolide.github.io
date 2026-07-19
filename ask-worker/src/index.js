import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./prompt.js";

const ALLOWED_ORIGINS = [
  "https://www.lide.studio",
  "https://lide.studio",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method === "HEAD") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method === "GET") {
      return new Response(
        "Ask Worker: send a POST request with JSON { question }.",
        { status: 200, headers: cors }
      );
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }

    let question;
    try {
      ({ question } = await request.json());
    } catch {
      return new Response("Bad request", { status: 400, headers: cors });
    }
    if (typeof question !== "string" || !question.trim() || question.length > 300) {
      return new Response("Question must be a non-empty string under 300 characters", {
        status: 400,
        headers: cors,
      });
    }

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const stream = client.messages.stream({
      model: env.ASK_MODEL || "claude-opus-4-8",
      max_tokens: 1024,
      output_config: { effort: "low" },
      system: [
        { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
      ],
      messages: [{ role: "user", content: question.trim() }],
    });

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            await writer.write(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" || final.content.length === 0) {
          await writer.write(
            encoder.encode("That's not something I can answer here — email lideli.leo@gmail.com instead.")
          );
        }
      } catch {
        // Close with whatever streamed so far; an empty body tells the
        // client to fall back to curated answers.
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" },
    });
  },
};
