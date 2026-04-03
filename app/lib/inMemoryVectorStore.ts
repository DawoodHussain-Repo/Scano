/**
 * In-memory vector store for session-based contract analysis
 * No external dependencies, perfect for portfolio demos
 */

interface VectorDocument {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    fileName: string;
    chunkIndex: number;
  };
}

class InMemoryVectorStore {
  private documents: VectorDocument[] = [];

  /**
   * Store document chunks with embeddings
   */
  async storeChunks(
    fileName: string,
    chunks: string[],
    embeddings: number[][]
  ): Promise<number> {
    if (chunks.length !== embeddings.length) {
      throw new Error("Chunks and embeddings length mismatch");
    }

    // Clear previous documents for this session
    this.documents = [];

    // Store new documents
    for (let i = 0; i < chunks.length; i++) {
      this.documents.push({
        id: `${fileName}_chunk_${i}`,
        text: chunks[i],
        embedding: embeddings[i],
        metadata: {
          fileName,
          chunkIndex: i,
        },
      });
    }

    return chunks.length;
  }

  /**
   * Search for similar documents using cosine similarity
   */
  async search(
    queryEmbedding: number[],
    topK: number = 5
  ): Promise<Array<{ text: string; score: number }>> {
    if (this.documents.length === 0) {
      return [];
    }

    // Calculate cosine similarity for each document
    const results = this.documents.map((doc) => ({
      text: doc.text,
      score: this.cosineSimilarity(queryEmbedding, doc.embedding),
    }));

    // Sort by similarity score (descending) and return top K
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error("Vectors must have same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  /**
   * Clear all stored documents
   */
  clear(): void {
    this.documents = [];
  }

  /**
   * Get total number of stored documents
   */
  size(): number {
    return this.documents.length;
  }
}

// Singleton instance for the session
export const vectorStore = new InMemoryVectorStore();
