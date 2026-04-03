# Scano - AI Contract Risk Analyzer

Upload your contract and get instant AI-powered risk analysis. Identify dangerous clauses, missing protections, and vague language before you sign.

## Features

- **Lightning Fast Analysis** - Get comprehensive contract analysis in under 10 seconds with Groq AI
- **Risk Detection** - Automatically identify dangerous clauses, missing protections, and vague language
- **Smart RAG Analysis** - Vector search powered by HuggingFace embeddings with in-memory storage
- **Table Support** - Handles complex PDFs with tables, lists, and structured content
- **Beautiful UI** - Modern, responsive interface with color-coded risk badges and animations
- **Zero Dependencies** - No external database required, perfect for portfolio demos

## Tech Stack

- **Next.js 16.2.1** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Groq AI** - Lightning-fast LLM inference (Llama 3.3 70B)
- **HuggingFace** - Embeddings generation (all-MiniLM-L6-v2)
- **LangChain** - Text splitting and AI orchestration
- **unpdf** - PDF text extraction
- **In-Memory Vector Store** - Session-based vector search with cosine similarity

## Architecture

### Session-Based Design
Scano uses an in-memory vector store, making it perfect for portfolio demos and production use:
- No external database dependencies
- Zero cold starts or hibernation issues
- Each user session is independent
- Vectors are generated on-demand and cleared after analysis

### RAG Pipeline
1. PDF uploaded → text extracted with table detection
2. Text chunked (1000 chars, 200 overlap)
3. Embeddings generated via HuggingFace API
4. Stored in in-memory vector store
5. Query embeddings search for relevant clauses
6. Groq AI analyzes and returns structured risk assessment

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Environment Variables
Create a `.env` file:

```bash
# HuggingFace for embeddings
HUGGINGFACE_API_KEY="your_key_here"

# Groq AI for contract analysis
GROQ_API_KEY="your_key_here"
```

Get free API keys:
- HuggingFace: https://huggingface.co/settings/tokens
- Groq: https://console.groq.com/keys

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to Vercel with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Just add your environment variables in the Vercel dashboard.

## Project Structure

```
app/
├── api/
│   ├── upload/          # PDF upload and processing
│   └── analyze/         # Contract risk analysis
├── components/          # React components
│   ├── LandingHero.tsx
│   ├── FeaturesSection.tsx
│   ├── PdfUpload.tsx
│   ├── VerdictCard.tsx
│   └── ...
├── lib/
│   ├── pdfService.ts           # PDF extraction with table support
│   ├── textChunker.ts          # LangChain text splitting
│   ├── embeddingService.ts     # HuggingFace embeddings
│   ├── inMemoryVectorStore.ts  # Cosine similarity search
│   ├── contractAnalyzer.ts     # Groq AI analysis
│   └── errorHandler.ts         # Error handling
└── verdict/[id]/        # Analysis results page
```

## License

MIT
