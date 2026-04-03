/**
 * In-memory vector store using LangChain's MemoryVectorStore
 * Session-based storage with no external dependencies
 */

import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

// Initialize embeddings model
const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY!,
  model: "sentence-transformers/all-MiniLM-L6-v2",
});

// Singleton instance for the session
let vectorStore: MemoryVectorStore | null = null;

/**
 * Store document chunks in memory vector store
 */
export async function storeChunks(
  fileName: string,
  chunks: string[]
): Promise<number> {
  // Create new vector store from documents
  vectorStore = await MemoryVectorStore.fromTexts(
    chunks,
    chunks.map((_, i) => ({ fileName, chunkIndex: i })),
    embeddings
  );

  return chunks.length;
}

/**
 * Search for similar documents
 */
export async function searchSimilar(
  query: string,
  topK: number = 5
): Promise<string[]> {
  if (!vectorStore) {
    return [];
  }

  const results = await vectorStore.similaritySearch(query, topK);
  return results.map((doc) => doc.pageContent);
}

/**
 * Clear the vector store
 */
export function clearStore(): void {
  vectorStore = null;
}
