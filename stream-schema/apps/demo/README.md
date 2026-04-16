# stream-schema demo

Interactive demo app for the `stream-schema` library.

## Running locally

```bash
cd apps/demo
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Simulation mode (default)

Works immediately with no API key. Pre-baked JSON streams character by character to simulate a real LLM.

## Real AI mode

1. Create `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

2. Check "use AI" in the demo UI and click Generate.

## Demos

- **Meal Plan** - streams `{ title, description, items[], totalCalories, tags[] }`
- **Startup Profile** - streams `{ name, tagline, problem, features[], targetMarket, pricing }`
- **Travel Day** - streams `{ destination, theme, morning, afternoon, evening, tips[] }`
