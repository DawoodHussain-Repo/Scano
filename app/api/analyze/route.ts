import { NextRequest, NextResponse } from "next/server";
import { analyzeContract } from "@/app/lib/contractAnalyzer";
import { checkRateLimit, getClientIdentifier } from "@/app/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 analyses per 15 minutes per IP
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

    return NextResponse.json(
      {
        fileName,
        issues,
        totalIssues: issues.length,
        highSeverity: issues.filter((i) => i.severity === "high").length,
        mediumSeverity: issues.filter((i) => i.severity === "medium").length,
        lowSeverity: issues.filter((i) => i.severity === "low").length,
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
    console.error("Analysis error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to analyze contract: ${errorMessage}` },
      { status: 500 }
    );
  }
}
