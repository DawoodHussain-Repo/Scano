import { NextRequest, NextResponse } from "next/server";
import { extractPDFContent } from "@/app/lib/pdfService";
import { chunkText } from "@/app/lib/textChunker";
import { storeChunks } from "@/app/lib/inMemoryVectorStore";
import { checkRateLimit, getClientIdentifier } from "@/app/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 uploads per 15 minutes per IP
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientId, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    });

    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime);
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          resetTime: resetDate.toISOString(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetDate.toISOString(),
          },
        }
      );
    }
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

    // Store in LangChain MemoryVectorStore (handles embeddings internally)
    const chunksStored = await storeChunks(file.name, chunks);

    console.log(`Stored ${chunksStored} chunks in memory for ${file.name}`);

    return NextResponse.json({
      fileName: file.name,
      size: file.size,
      type: file.type,
      text: text.slice(0, 500),
      pages: totalPages,
      chunksStored,
      hasStructuredContent,
      message: "PDF processed successfully. Analysis ready.",
    },
    {
      headers: {
        "X-RateLimit-Limit": "5",
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
      },
    }
  );
  } catch (err) {
    console.error("Upload error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to process PDF: ${errorMessage}` },
      { status: 500 },
    );
  }
}
