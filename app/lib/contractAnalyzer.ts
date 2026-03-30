import { ChatGroq } from "@langchain/groq";
import { retrieveRelevantChunks } from "./vectorStore";

interface ContractIssue {
  clause: string;
  issue: string;
  severity: "high" | "medium" | "low";
}

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "llama-3.3-70b-versatile",
  temperature: 0.1,
});

const ANALYSIS_PROMPT = `You are a contract risk analyzer. Given the following contract clauses, identify:
- Dangerous clauses (unlimited liability, IP transfer before payment, one-sided termination)
- Missing protections (no kill fee, no dispute resolution, no payment schedule)
- Vague language that could be exploited

For each issue found return:
{
  "clause": "exact text from contract",
  "issue": "plain English explanation",
  "severity": "high/medium/low"
}

Return only a JSON array. No preamble.

Contract clauses:
{context}`;

export async function analyzeContract(
  fileName: string
): Promise<ContractIssue[]> {
  // Retrieve relevant chunks using vector search with targeted queries
  const queries = [
    "liability clauses and indemnification",
    "payment terms and intellectual property",
    "termination and dispute resolution",
    "warranties and representations",
  ];

  const allChunks: string[] = [];
  for (const query of queries) {
    const chunks = await retrieveRelevantChunks(query, 3);
    allChunks.push(...chunks);
  }

  // Remove duplicates
  const uniqueChunks = [...new Set(allChunks)];

  if (uniqueChunks.length === 0) {
    throw new Error("No contract data found for analysis");
  }

  const context = uniqueChunks.join("\n\n---\n\n");

  // Generate analysis using Groq
  const prompt = ANALYSIS_PROMPT.replace("{context}", context);
  const result = await model.invoke(prompt);

  // Parse JSON response
  const content =
    typeof result.content === "string"
      ? result.content
      : JSON.stringify(result.content);

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("No valid JSON array found in response");
  }

  const issues: ContractIssue[] = JSON.parse(jsonMatch[0]);
  return issues;
}
