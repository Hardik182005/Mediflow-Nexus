/**
 * Shared OpenAI GPT-4o helper for all AI-powered API routes.
 * Primary: GPT-4o
 * Fallback: Groq llama-3.1-8b-instant (free tier)
 */

// ── OpenAI GPT-4o Call ───────────────────────────────────────
export async function callOpenAI(
  systemPrompt: string,
  userContent: string,
  options?: { maxTokens?: number; temperature?: number; jsonMode?: boolean }
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const body: any = {
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    temperature: options?.temperature ?? 0.4,
    max_tokens: options?.maxTokens ?? 4096,
  };

  if (options?.jsonMode !== false) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── OpenAI with vision (for image inputs) ──────────────────────
export async function callOpenAIVision(
  systemPrompt: string,
  parts: any[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const contentParts: any[] = [];
  for (const part of parts) {
    if (part.text) {
      contentParts.push({ type: "text", text: part.text });
    } else if (part.inlineData) {
      const { mimeType, data } = part.inlineData;
      if (mimeType.startsWith("image/")) {
        contentParts.push({
          type: "image_url",
          image_url: { url: `data:${mimeType};base64,${data}`, detail: "low" },
        });
      } else {
        try {
          const decoded = Buffer.from(data, "base64").toString("utf-8");
          contentParts.push({ type: "text", text: decoded.substring(0, 5000) });
        } catch {
          contentParts.push({ type: "text", text: "[Binary file - make reasonable assumptions]" });
        }
      }
    }
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: contentParts },
      ],
      temperature: options?.temperature ?? 0.4,
      max_tokens: options?.maxTokens ?? 4096,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenAI Vision error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── OpenAI Chat (for conversational use like copilot) ──────────
export async function callOpenAIChat(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map(m => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    })),
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: formattedMessages,
      temperature: options?.temperature ?? 0.5,
      max_tokens: options?.maxTokens ?? 2048,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenAI Chat error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── Groq Fallback ──────────────────────────────────────────────
export async function callGroqFallback(
  systemPrompt: string,
  userContent: string,
  options?: { maxTokens?: number; jsonMode?: boolean }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  const maxChars = 6000;
  const truncated = userContent.length > maxChars
    ? userContent.substring(0, maxChars) + "\n[Truncated]"
    : userContent;

  const body: any = {
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: truncated },
    ],
    temperature: 0.4,
    max_tokens: options?.maxTokens ?? 4096,
  };

  if (options?.jsonMode !== false) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Groq error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── Helper to clean JSON from AI responses ─────────────────────
export function cleanJsonResponse(text: string): string {
  return text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();
}
