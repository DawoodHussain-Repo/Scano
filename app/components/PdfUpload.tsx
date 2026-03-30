"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UploadState = "idle" | "dragging" | "done";

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

export default function PdfUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadState>("idle");
  const [pending, setPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFile = useCallback((file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      setUploadedFile(null);
      return;
    }

    const tenMb = 10 * 1024 * 1024;
    if (file.size > tenMb) {
      setError("File size must be 10 MB or less.");
      setUploadedFile(null);
      setStatus("idle");
      return;
    }

    setError(null);
    setUploadedFile(file);
    setStatus("done");
  }, []);

  const onSelectFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setStatus("idle");
      const file = event.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const analyzeFile = useCallback(async () => {
    if (!uploadedFile) return;

    setError(null);
    setPending(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorJson = await response.json();
        throw new Error(errorJson.error || "Upload failed");
      }

      const payload = await response.json();
      console.log("PDF uploaded:", payload);

      // Now analyze the contract
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: uploadedFile.name }),
      });

      if (!analyzeResponse.ok) {
        const errorJson = await analyzeResponse.json();
        throw new Error(errorJson.error || "Analysis failed");
      }

      const analysisResult = await analyzeResponse.json();
      console.log("Contract analysis:", analysisResult);

      // Build verdict from real analysis
      const verdictId = `verdict-${Date.now()}`;
      const verdict: Verdict = {
        id: verdictId,
        summary: `Found ${analysisResult.totalIssues} issues: ${analysisResult.highSeverity} high, ${analysisResult.mediumSeverity} medium, ${analysisResult.lowSeverity} low severity.`,
        score:
          analysisResult.highSeverity > 0
            ? "high"
            : analysisResult.mediumSeverity > 2
              ? "medium"
              : "low",
        risks: analysisResult.issues.map((issue: any) => ({
          clause: issue.clause,
          explanation: issue.issue,
          severity: issue.severity,
        })),
      };

      localStorage.setItem(
        `scano-verdict:${verdict.id}`,
        JSON.stringify(verdict)
      );
      router.push(`/verdict/${verdict.id}`);
    } catch (error) {
      console.error(error);
      setError("Failed to analyze file. Please try again.");
    } finally {
      setPending(false);
    }
  }, [uploadedFile, router]);

  return (
    <section className="upload-panel">
      <h1 className="text-3xl font-bold text-slate-900">
        Scano Contract Verdict
      </h1>
      <p className="mt-3 text-slate-600">
        Upload a contract PDF to get started.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onSelectFile}
      />

      <div
        className={`upload-box ${status === "dragging" ? "upload-box-active" : "upload-box-idle"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setStatus("dragging");
        }}
        onDragLeave={() => setStatus("idle")}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
      >
        <p className="text-lg font-semibold text-slate-700">
          Click or drag PDF to upload
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Accepted: .pdf. Max size: 10MB.
        </p>
      </div>

      {uploadedFile && (
        <div className="upload-success">
          <p className="font-semibold text-green-700">
            File ready for processing
          </p>
          <p className="text-sm text-green-700">{uploadedFile.name}</p>
          <p className="text-xs text-green-600">
            {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
          </p>
        </div>
      )}

      {error && <div className="upload-error">{error}</div>}

      {uploadedFile && status === "done" && (
        <div className="mt-6 flex items-center gap-3">
          <button
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
            onClick={analyzeFile}
            disabled={pending}
          >
            {pending ? "Analyzing..." : "Analyze Document"}
          </button>
          <span className="text-sm text-slate-600">
            AI-powered contract risk analysis
          </span>
        </div>
      )}

      <div className="upload-note">
        <p>
          RAG-powered analysis using Gemini AI and DataStax vector search.
        </p>
      </div>
    </section>
  );
}
