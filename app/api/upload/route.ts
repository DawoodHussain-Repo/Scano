import { NextRequest, NextResponse } from "next/server";
import { extractPDFContent } from "@/app/lib/pdfService";
import { chunkText } from "@/app/lib/textChunker";
import { generateEmbeddings } from "@/app/lib/embeddingService";
import { vectorStore } from "@/app/lib/inMemoryVectorStore";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDFs supported for now" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Extract text using enhanced PDF service
    const { text, totalPages, hasStructuredContent } =
      await extractPDFContent(uint8Array);

    console.log("PDF text extracted:", text.slice(0, 200));
    console.log(`Pages: ${totalPages}, Has tables: ${hasStructuredContent}`);

    // Split text into chunks
    const chunks = await chunkText(text);
    console.log(`Split into ${chunks.length} chunks`);

    // Generate embeddings for all chunks
    const embeddings = await generateEmbeddings(chunks);
    console.log(`Generated ${embeddings.length} embeddings`);

    // Store in in-memory vector store
    const chunksStored = await vectorStore.storeChunks(
      file.name,
      chunks,
      embeddings
    );

    console.log(`Stored ${chunksStored} chunks in memory for ${file.name}`);

    return NextResponse.json({
      fileName: file.name,
      size: file.size,
      type: file.type,
      text: text.slice(0, 500),
      pages: totalPages,
      chunksStored,
      hasStructuredContent,
      message:
        "PDF processed successfully. Analysis ready.",
    });
  } catch (err) {
    console.error("Upload error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to process PDF: ${errorMessage}` },
      { status: 500 },
    );
  }
}
