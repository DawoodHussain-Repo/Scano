import { NextRequest, NextResponse } from "next/server";
import { analyzeContract } from "@/app/lib/contractAnalyzer";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required" },
        { status: 400 }
      );
    }

    // Analyze contract using RAG
    const issues = await analyzeContract(fileName);

    return NextResponse.json({
      fileName,
      issues,
      totalIssues: issues.length,
      highSeverity: issues.filter((i) => i.severity === "high").length,
      mediumSeverity: issues.filter((i) => i.severity === "medium").length,
      lowSeverity: issues.filter((i) => i.severity === "low").length,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to analyze contract: ${errorMessage}` },
      { status: 500 }
    );
  }
}
