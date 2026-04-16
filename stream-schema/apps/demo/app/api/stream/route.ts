import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const PROMPTS: Record<string, string> = {
  meal: `Generate a meal plan for a single day. Respond ONLY with a JSON object - no explanation, no markdown.
Schema: { "title": string, "description": string, "items": [{ "meal": string, "name": string, "calories": number, "emoji": string }], "totalCalories": number, "tags": string[] }
Make it interesting - a specific cuisine or theme. 4 meals. Real dish names.`,

  startup: `Invent a fictional B2B SaaS startup. Respond ONLY with a JSON object - no explanation, no markdown.
Schema: { "name": string, "tagline": string, "problem": string, "features": [{ "title": string, "description": string }], "targetMarket": string, "pricing": string }
Make it believable and specific. 4 features.`,

  travel: `Create a one-day travel itinerary. Respond ONLY with a JSON object - no explanation, no markdown.
Schema: { "destination": string, "theme": string, "morning": { "activity": string, "tip": string }, "afternoon": { "activity": string, "tip": string }, "evening": { "activity": string, "tip": string }, "tips": string[] }
Pick a specific, interesting city. 3 practical tips.`,
};

export async function POST(request: Request) {
  const { demo = 'meal' } = await request.json();
  const prompt = PROMPTS[demo] ?? PROMPTS.meal;

  const stream = await client.messages.stream({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
