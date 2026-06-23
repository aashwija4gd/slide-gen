# slide-gen

An AI-powered slide deck generator built with Next.js. Enter a topic and slide count, and the app generates a structured presentation with text and images sourced from Unsplash.

## How it works

1. A prompt and slide count are submitted via the UI at `/deck`
2. The `/api/generate` route calls GPT-4o-mini (via OpenRouter) to produce structured slide content — titles, bullet points, and image search queries
3. Image queries are resolved against the Unsplash API
4. The assembled deck is rendered client-side with Framer Motion animations

Slides alternate between `just-text` and `text-with-images` layouts, each with a consistent header and footer.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/deck`.

## Environment variables

Create a `.env.local` file:

```
OPENROUTER_API_KEY=your_openrouter_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
```

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [AI SDK](https://sdk.vercel.ai/) with OpenRouter / GPT-4o-mini
- [Unsplash API](https://unsplash.com/developers) for images
- [Framer Motion](https://www.framer.com/motion/) for slide animations
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Zod](https://zod.dev/) for schema validation
