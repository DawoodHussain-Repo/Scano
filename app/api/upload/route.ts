import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

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

    // Extract text using unpdf
    const { text, totalPages } = await extractText(uint8Array);

    console.log("PDF text extracted:", text.slice(0, 200));

    return NextResponse.json({
      fileName: file.name,
      size: file.size,
      type: file.type,
      text,
      pages: totalPages,
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
