import { notFound } from "next/navigation";

interface VerdictPageProps {
  params: {
    id: string;
  };
}

export default function VerdictPage({ params }: VerdictPageProps) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
      <section className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Verdict Details</h1>
        <p className="mt-3 text-slate-600">
          Dynamic document ID: <strong>{id}</strong>
        </p>

        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8">
          <p className="text-lg font-semibold text-slate-700">
            Analysis placeholder
          </p>
          <p className="mt-2 text-sm text-slate-500">
            This page will show the transcription/summary/verdict for contract{" "}
            {id} once the pipeline is implemented.
          </p>
        </div>
      </section>
    </main>
  );
}
