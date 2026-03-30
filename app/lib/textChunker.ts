import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

/**
 * Split text into chunks for embedding
 */
export async function chunkText(text: string): Promise<string[]> {
  return await textSplitter.splitText(text);
}
