"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

type UploadState = "idle" | "dragging" | "done";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadState>("idle");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  return (
    <main className="app-shell">
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="portfolio-title">Scano</div>
          <div className="flex gap-4">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/verdict/example" className="nav-link">
              Example Verdict
            </Link>
          </div>
        </div>
      </nav>

      <div className="main-panel">
        <section className="upload-panel">
          <h1 className="text-3xl font-bold text-slate-900">
            Scano Contract Verdict
          </h1>
          <p className="mt-3 text-slate-600">
            Upload a contract PDF to get started. Click the upload box or drag
            your file in.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onSelectFile}
          />

          <div
            className={`upload-box ${
              status === "dragging" ? "upload-box-active" : "upload-box-idle"
            }`}
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
            <div className="mt-6 flex gap-3">
              <button
                className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                onClick={async () => {
                  if (!uploadedFile) return;
                  setError(null);
                  setStatus("idle");

                  // mock upload and server processing with delay
                  try {
                    const mockResponse = await new Promise<{
                      id: string;
                      summary: string;
                      score: "high" | "medium" | "low";
                      risks: Array<{
                        clause: string;
                        explanation: string;
                        severity: "high" | "medium" | "low";
                      }>;
                    }>((resolve) => {
                      setTimeout(() => {
                        resolve({
                          id: `verdict-${Date.now()}`,
                          summary:
                            "This contract shows moderate risk in key indemnity sections.",
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
                          ],
                        });
                      }, 800);
                    });

                    localStorage.setItem(
                      `scano-verdict:${mockResponse.id}`,
                      JSON.stringify(mockResponse),
                    );

                    window.location.href = `/verdict/${mockResponse.id}`;
                  } catch {
                    setError("Failed to analyze file. Please try again.");
                  }
                }}
              >
                Analyze Document
              </button>
              <span className="self-center text-sm text-slate-600">
                (Mock flow; real API integration later)
              </span>
            </div>
          )}

          <div className="upload-note">
            <p>
              Next steps: integrate file upload, PDF parsing, document metadata
              extraction, and verdict engine.
            </p>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} Scano. All rights reserved.</p>
          <p>Built for future PDF contract intelligence pipeline.</p>
        </div>
      </footer>
    </main>
  );
}
