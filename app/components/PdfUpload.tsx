"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import ProgressIndicator from "./ProgressIndicator";

type UploadState = "idle" | "dragging" | "done";
type ProcessingStep = "uploading" | "embedding" | "analyzing" | "complete";

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
  const [currentStep, setCurrentStep] = useState<ProcessingStep | null>(null);
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
    setCurrentStep("uploading");

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

      setCurrentStep("embedding");

      // Now analyze the contract
      setCurrentStep("analyzing");
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

      setCurrentStep("complete");

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

      // Small delay to show completion
      setTimeout(() => {
        router.push(`/verdict/${verdict.id}`);
      }, 500);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to analyze file. Please try again."
      );
      setCurrentStep(null);
    } finally {
      setPending(false);
    }
  }, [uploadedFile, router]);

  const progressSteps: Array<{
    label: string;
    status: "pending" | "active" | "complete";
  }> = [
    {
      label: "Upload",
      status:
        currentStep === "uploading"
          ? "active"
          : currentStep && ["embedding", "analyzing", "complete"].includes(currentStep)
            ? "complete"
            : "pending",
    },
    {
      label: "Process",
      status:
        currentStep === "embedding"
          ? "active"
          : currentStep && ["analyzing", "complete"].includes(currentStep)
            ? "complete"
            : "pending",
    },
    {
      label: "Analyze",
      status:
        currentStep === "analyzing"
          ? "active"
          : currentStep === "complete"
            ? "complete"
            : "pending",
    },
  ];

  return (
    <section className="upload-panel">
      <h1 className="text-3xl font-bold text-slate-900">
        Scano Contract Verdict
      </h1>
      <p className="mt-3 text-slate-600">
        Upload a contract PDF to get AI-powered risk analysis.
      </p>

      {pending && <ProgressIndicator steps={progressSteps} />}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onSelectFile}
        disabled={pending}
      />

      <div
        className={`upload-box ${
          status === "dragging"
            ? "upload-box-active"
            : pending
              ? "opacity-50 cursor-not-allowed"
              : "upload-box-idle"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!pending) setStatus("dragging");
        }}
        onDragLeave={() => !pending && setStatus("idle")}
        onDrop={onDrop}
        onClick={() => !pending && fileInputRef.current?.click()}
        role="button"
        tabIndex={pending ? -1 : 0}
        onKeyDown={(e) => {
          if (!pending && (e.key === "Enter" || e.key === " ")) {
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

      {uploadedFile && !pending && (
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

      {error && (
        <div className="upload-error">
          <svg
            className="w-5 h-5 inline-block mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {uploadedFile && status === "done" && !pending && (
        <div className="mt-6 flex items-center gap-3">
          <button
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={analyzeFile}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Analyze Document
          </button>
          <span className="text-sm text-slate-600">
            Powered by Groq AI & HuggingFace
          </span>
        </div>
      )}

      {pending && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-slate-600 font-medium">
            {currentStep === "uploading" && "Uploading and extracting text..."}
            {currentStep === "embedding" && "Generating embeddings..."}
            {currentStep === "analyzing" && "Analyzing contract with AI..."}
            {currentStep === "complete" && "Analysis complete!"}
          </p>
        </div>
      )}

      <div className="upload-note">
        <p>
          RAG-powered analysis using Groq (Llama 3.3) and DataStax vector search.
        </p>
      </div>
    </section>
  );
}
