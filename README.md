## Synapse

AI-powered study assistant that turns your PDFs into summaries, flashcards, quizzes, topic maps, deep explanations, Q&A, and curated resources using Google Gemini.

### Tech stack

- **Next.js 14+ (App Router)**
- **TypeScript**
- **Tailwind CSS** + shadcn-style UI primitives
- **Zustand** for client state
- **Framer Motion** for micro-interactions
- **Google Gemini API** (JSON-only responses, streaming)
- **pdf-parse** for server-side text extraction
- **Semantic search** using Gemini embeddings + cosine similarity

### Getting started

1. Install dependencies:

```bash
cd web
npm install
```

2. Add your Gemini API key in a `.env.local` file:

```bash
GEMINI_API_KEY=your_key_here
```

3. Run the dev server:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Features

- Drag-and-drop style PDF upload (uses file chooser in this version)
- Server-side PDF parsing, cleaning, chunking, and embedding
- In-memory session store keyed by session ID
- Retrieval-augmented Q&A over PDF content
- JSON-only Gemini prompts for:
  - summaries (multi-level)
  - flashcards
  - quizzes
  - topics
  - explanations (ELI5 / exam / technical)
  - contextual Q&A
  - external learning resources
- Dark/light mode with system preference and `localStorage` persistence
- Polished, responsive UI with sidebar navigation and animated flashcards/quizzes

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
