import { db, COLLECTION_NAME } from "./databaseService";
import { chunkText } from "./textChunker";
import {
  generateEmbeddings,
  generateQueryEmbedding,
  EMBEDDING_DIMENSION,
} from "./embeddingService";
import { withErrorHandling } from "./errorHandler";

interface DocumentChunk {
  text: string;
  $vector?: number[];
  metadata: {
    fileName: string;
    chunkIndex: number;
    totalChunks: number;
  };
}

/**
 * Store document chunks in DataStax with embeddings
 */
export async function storeDocumentChunks(
  fileName: string,
  text: string
): Promise<{ success: boolean; chunksStored: number }> {
  return withErrorHandling(async () => {
    // Drop existing collection to ensure correct settings
    try {
      await db.dropCollection(COLLECTION_NAME);
      console.log("Dropped existing collection");
    } catch (error) {
      console.log("No existing collection to drop");
    }

    // Create collection with vector support
    const collection = await db.createCollection<DocumentChunk>(
      COLLECTION_NAME,
      {
        vector: {
          dimension: EMBEDDING_DIMENSION,
          metric: "cosine",
        },
      }
    );
    console.log(`Created collection with ${EMBEDDING_DIMENSION} dimensions`);

    // Split text into chunks
    const chunks = await chunkText(text);
    const totalChunks = chunks.length;

    console.log(`Split text into ${totalChunks} chunks`);

    if (totalChunks === 0) {
      throw new Error("No text chunks generated from document");
    }

    // Generate embeddings
    console.log("Generating embeddings...");
    const vectors = await generateEmbeddings(chunks);

    console.log(`Generated ${vectors.length} embeddings`);

    if (vectors.length === 0 || vectors[0].length === 0) {
      throw new Error("Failed to generate embeddings");
    }

    // Store chunks with vectors
    const documents = chunks.map((chunk, index) => ({
      text: chunk,
      $vector: vectors[index],
      metadata: {
        fileName,
        chunkIndex: index,
        totalChunks,
      },
    }));

    await collection.insertMany(documents);

    console.log(`Successfully stored ${totalChunks} chunks`);

    return { success: true, chunksStored: totalChunks };
  }, "Error storing document chunks");
}

/**
 * Retrieve relevant chunks using vector similarity search
 */
export async function retrieveRelevantChunks(
  query: string,
  limit: number = 10
): Promise<string[]> {
  return withErrorHandling(async () => {
    const collection = db.collection<DocumentChunk>(COLLECTION_NAME);

    // Generate embedding for the query
    const queryVector = await generateQueryEmbedding(query);

    // Perform vector search
    const results = await collection
      .find({}, { sort: { $vector: queryVector }, limit })
      .toArray();

    return results.map((doc) => doc.text);
  }, "Error retrieving chunks");
}

