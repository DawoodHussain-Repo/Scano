"use client";

import ScanoLayout from "../../components/ScanoLayout";
import VerdictCard from "../../components/VerdictCard";
import { useParams } from "next/navigation";

type Verdict = {
  id: string;
  summary: string;
  score: "high" | "medium" | "low";
  risks: Array<{
    clause: string;
    explanation: string;
    severity: "high" | "medium" | "low";
  }>;
};

export default function VerdictPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const mockVerdict: Verdict = {
    id: id ?? "verdict-mock-id",
    summary:
      "This contract shows moderate risk in key indemnity and renewal clauses.",
    score: "medium",
    risks: [
      {
        clause:
          "The indemnity clause delegates all risk to the vendor without capping liability.",
        explanation:
          "Uncapped indemnity obligations can result in unlimited financial exposure.",
        severity: "high",
      },
      {
        clause:
          "The automatic renewal clause lacks a 30-day cancellation window.",
        explanation:
          "You may be locked into the contract longer than expected.",
        severity: "medium",
      },
      {
        clause:
          "Payment terms allow invoice due date at 90 days with no late fee cap.",
        explanation:
          "Long unsecured payment terms can strain cash flow and increase risk.",
        severity: "low",
      },
    ],
  };

  return (
    <ScanoLayout>
      <VerdictCard verdict={mockVerdict} />
    </ScanoLayout>
  );
}
