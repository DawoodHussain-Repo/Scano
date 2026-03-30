# Scano - Contract Risk Analysis Implementation

## Overview
A production-ready RAG-powered contract analysis system using Next.js 16, HuggingFace embeddings, DataStax vector database, and Gemini AI.

## Architecture

### Core Services (Modular Design)

1. **Embedding Service** (`app/lib/embeddingService.ts`)
   - HuggingFace Inference API
   - Model: `sentence-transformers/all-MiniLM-L6-v2`
   - 384-dimensional embeddings
   - Handles both document and query embeddings

2. **Database Service** (`app/lib/databaseService.ts`)
   - DataStax Astra DB client
   - Centralized database configuration
   - Collection management

3. **Text Chunker** (`app/lib/textChunker.ts`)
   - LangChain RecursiveCharacterTextSplitter
   - 1000 character chunks with 200 character overlap
   - Optimized for semantic coherence

4. **Error Handler** (`app/lib/errorHandler.ts`)
   - Centralized error handling
   - Consistent error messages
   - Logging and debugging support

5. **Vector Store** (`app/lib/vectorStore.ts`)
   - Document storage with embeddings
   - Vector similarity search
   - Automatic collection management

6. **Contract Analyzer** (`app/lib/contractAnalyzer.ts`)
   - Gemini 1.5 Flash for analysis
   - RAG-based risk assessment
   - Structured JSON output

## API Endpoints

### POST /api/upload
- Accepts PDF files (max 10MB)
- Extracts text using `unpdf`
- Chunks and embeds text
- Stores in DataStax vector database
- Returns chunk count and metadata

### POST /api/analyze
- Retrieves relevant chunks via vector search
- Analyzes contract with Gemini AI
- Returns structured risk assessment:
  - Dangerous clauses
  - Missing protections
  - Vague language
  - Severity levels (high/medium/low)

## Frontend Components

### PdfUpload Component
- Drag-and-drop file upload
- File validation (PDF, 10MB limit)
- Real-time analysis progress
- Error handling and user feedback

### Verdict Page
- Dynamic route: `/verdict/[id]`
- Loads analysis from localStorage
- Displays risk assessment
- Loading and error states

## Technology Stack

- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript
- **Embeddings**: HuggingFace Inference API
- **Vector DB**: DataStax Astra DB
- **AI Analysis**: Google Gemini 1.5 Flash
- **PDF Processing**: unpdf
- **Text Processing**: LangChain

## Environment Variables

```env
ASTRA_DB_API_ENDPOINT=<your-datastax-endpoint>
ASTRA_DB_APPLICATION_TOKEN=<your-datastax-token>
GOOGLE_API_KEY=<your-gemini-api-key>
HUGGINGFACE_API_KEY=<your-hf-api-key>
```

## Key Features

✅ Modular, maintainable codebase
✅ Comprehensive error handling
✅ Vector-based semantic search
✅ RAG-powered AI analysis
✅ Real-time processing feedback
✅ Production-ready architecture
✅ Free-tier API usage

## Commit History

1. `feat: add HuggingFace embedding service module`
2. `feat: add DataStax database service module`
3. `feat: add text chunking service module`
4. `feat: add error handling utility module`
5. `refactor: modularize vector store with service dependencies`
6. `fix: update Gemini model to gemini-1.5-flash-latest`
7. `feat: add contract analysis API endpoint`
8. `feat: integrate PDF upload with vector storage and analysis`
9. `feat: integrate real AI analysis in PDF upload component`
10. `feat: add real-time verdict loading from localStorage`
11. `chore: update dependencies for HuggingFace and LangChain`

## Next Steps

- [ ] Add user authentication
- [ ] Implement contract history
- [ ] Add export functionality (PDF/JSON)
- [ ] Enhance UI with animations
- [ ] Add batch processing
- [ ] Implement caching layer
- [ ] Add analytics dashboard
