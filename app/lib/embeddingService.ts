import { HfInference } from "@huggingface/inference";

const hfClient = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const EMBEDDING_DIMENSION = 384;
export const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

/**
 * Generate embeddings for multiple text chunks
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const results = await Promise.all(
    texts.map(async (text) => {
      const result = await hfClient.featureExtraction({
        model: EMBEDDING_MODEL,
        inputs: text,
      });
      
      if (Array.isArray(result)) {
        if (Array.isArray(result[0])) {
          return result[0] as number[];
        }
        return result as number[];
      }
      return [];
    })
  );
  return results;
}

/**
 * Generate embedding for a single query
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  const result = await hfClient.featureExtraction({
    model: EMBEDDING_MODEL,
    inputs: query,
  });
  
  if (Array.isArray(result)) {
    if (Array.isArray(result[0])) {
      return result[0] as number[];
    }
    return result as number[];
  }
  return [];
}
