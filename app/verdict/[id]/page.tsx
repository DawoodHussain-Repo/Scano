"use client";

import { useEffect, useState } from "react";
import ScanoLayout from "../../components/ScanoLayout";
import VerdictCard from "../../components/VerdictCard";
import { useParams, useRouter } from "next/navigation";

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
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No verdict ID provided");
      setLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(`scano-verdict:${id}`);
      if (!stored) {
        setError("Verdict not found. Please upload and analyze a contract first.");
        setLoading(false);
        return;
      }

      const parsedVerdict: Verdict = JSON.parse(stored);
      setVerdict(parsedVerdict);
    } catch (err) {
      console.error("Error loading verdict:", err);
      setError("Failed to load verdict data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <ScanoLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading verdict...</p>
          </div>
        </div>
      </ScanoLayout>
    );
  }

  if (error || !verdict) {
    return (
      <ScanoLayout>
        <div className="max-w-2xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Error Loading Verdict
          </h2>
          <p className="text-red-700 mb-4">{error || "Verdict not found"}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Upload
          </button>
        </div>
      </ScanoLayout>
    );
  }

  return (
    <ScanoLayout>
      <VerdictCard verdict={verdict} />
    </ScanoLayout>
  );
}
