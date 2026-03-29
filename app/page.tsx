export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
      <section className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Scano Contract Verdict
        </h1>
        <p className="mt-3 text-slate-600">
          Upload a contract PDF to get started. This is a placeholder for the
          future PDF upload component and analysis workflow.
        </p>

        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-lg font-semibold text-slate-700">
            PDF Upload Component Placeholder
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Drop your contract PDF here or click to choose a file (coming soon)
          </p>
        </div>

        <div className="mt-8 text-sm text-slate-500">
          <p>
            Next steps: integrate file upload, PDF parsing, document metadata
            extraction, and verdict engine.
          </p>
        </div>
      </section>
    </main>
  );
}
