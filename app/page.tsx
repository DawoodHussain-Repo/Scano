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

    setError(null);
    setUploadedFile(file);
    setStatus("done");
    // TODO: send file object to server or parser integration (future)
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
