import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
import { storeDocumentChunks } from "@/app/lib/vectorStore";

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

    // Extract text using unpdf with merged pages
    const { text, totalPages } = await extractText(uint8Array, {
      mergePages: true,
    });

    console.log("PDF text extracted:", text.slice(0, 200));

    // Store chunks in DataStax vector database
    const { chunksStored } = await storeDocumentChunks(file.name, text);

    console.log(`Stored ${chunksStored} chunks for ${file.name}`);

    return NextResponse.json({
      fileName: file.name,
      size: file.size,
      type: file.type,
      text: text.slice(0, 500), // Return preview only
      pages: totalPages,
      chunksStored,
      message: "PDF processed. Call /api/analyze with fileName to get risk analysis.",
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
