import { extractText } from "unpdf";

interface PDFExtractionResult {
  text: string;
  totalPages: number;
  hasStructuredContent: boolean;
}

/**
 * Extract text from PDF with enhanced table and structure handling
 */
export async function extractPDFContent(
  buffer: Uint8Array
): Promise<PDFExtractionResult> {
  // Extract text with merged pages
  const { text, totalPages } = await extractText(buffer, {
    mergePages: true,
  });

  // Detect if PDF has structured content (tables, lists)
  const hasStructuredContent = detectStructuredContent(text);

  // Clean and normalize text
  const cleanedText = cleanPDFText(text);

  return {
    text: cleanedText,
    totalPages,
    hasStructuredContent,
  };
}

/**
 * Detect if text contains structured content like tables
 */
function detectStructuredContent(text: string): boolean {
  // Check for common table indicators
  const tableIndicators = [
    /\|.*\|.*\|/g, // Pipe-separated columns
    /\t.*\t.*\t/g, // Tab-separated columns
    /^\s*\d+\.\s+/gm, // Numbered lists
    /^\s*[-•]\s+/gm, // Bullet points
  ];

  return tableIndicators.some((pattern) => pattern.test(text));
}

/**
 * Clean and normalize PDF text
 */
function cleanPDFText(text: string): string {
  return (
    text
      // Remove excessive whitespace
      .replace(/\s+/g, " ")
      // Normalize line breaks
      .replace(/\r\n/g, "\n")
      // Remove page numbers (common patterns)
      .replace(/\n\s*\d+\s*\n/g, "\n")
      // Remove headers/footers (repeated text)
      .replace(/(.{20,})\n(?=\1)/g, "")
      // Trim
      .trim()
  );
}

/**
 * Extract tables from text (basic implementation)
 */
export function extractTables(text: string): string[] {
  const tables: string[] = [];
  const lines = text.split("\n");

  let currentTable: string[] = [];
  let inTable = false;

  for (const line of lines) {
    // Detect table rows (pipe or tab separated)
    if (/\|.*\|/.test(line) || /\t.*\t/.test(line)) {
      inTable = true;
      currentTable.push(line);
    } else if (inTable && currentTable.length > 0) {
      // End of table
      tables.push(currentTable.join("\n"));
      currentTable = [];
      inTable = false;
    }
  }

  // Add last table if exists
  if (currentTable.length > 0) {
    tables.push(currentTable.join("\n"));
  }

  return tables;
}
