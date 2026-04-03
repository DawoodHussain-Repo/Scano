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
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Upload Your Contract
        </h1>
        <p className="text-lg text-slate-600">
          Get instant AI-powered risk analysis in seconds
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12">
        {pending && (
          <div className="mb-8">
            <ProgressIndicator steps={progressSteps} />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={onSelectFile}
          disabled={pending}
        />

        {/* Upload Box */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            status === "dragging"
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : pending
                ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer"
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
          {/* Upload Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {status === "dragging" ? "Drop your PDF here" : "Click to upload or drag and drop"}
          </h3>
          <p className="text-slate-500 mb-4">
            PDF files only • Maximum 10MB
          </p>

          {!uploadedFile && !pending && (
            <button
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Select PDF File
            </button>
          )}
        </div>

        {/* File Info */}
        {uploadedFile && !pending && (
          <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-900 mb-1">
                  File ready for analysis
                </p>
                <p className="text-sm text-green-700 mb-1">{uploadedFile.name}</p>
                <p className="text-xs text-green-600">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-red-900 mb-1">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        {uploadedFile && status === "done" && !pending && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={analyzeFile}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Analyze Contract
            </button>
            <button
              onClick={() => {
                setUploadedFile(null);
                setStatus("idle");
                setError(null);
              }}
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Choose different file
            </button>
          </div>
        )}

        {/* Processing State */}
        {pending && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900 mb-1">
                {currentStep === "uploading" && "Uploading PDF..."}
                {currentStep === "embedding" && "Processing document..."}
                {currentStep === "analyzing" && "Analyzing with AI..."}
                {currentStep === "complete" && "Complete!"}
              </p>
              <p className="text-sm text-slate-600">
                {currentStep === "uploading" && "Extracting text from your contract"}
                {currentStep === "embedding" && "Generating embeddings for semantic search"}
                {currentStep === "analyzing" && "Groq AI is reviewing your contract"}
                {currentStep === "complete" && "Redirecting to results..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Powered by Groq AI (Llama 3.3 70B) & HuggingFace Embeddings
        </p>
      </div>
    </div>
  );
}
