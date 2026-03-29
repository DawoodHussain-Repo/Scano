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

interface VerdictCardProps {
  verdict: Verdict;
}

export default function VerdictCard({ verdict }: VerdictCardProps) {
  return (
    <section className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Contract Verdict</h1>
      <p className="mt-3 text-slate-600">
        Document ID: <strong>{verdict.id}</strong>
      </p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
        <p className="text-lg font-semibold text-slate-800">Summary</p>
        <p className="mt-2 text-slate-700">{verdict.summary}</p>
        <p className="mt-3 font-semibold">Risk score: {verdict.score}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-slate-900">Risks</h2>
        <ul className="mt-3 space-y-4">
          {verdict.risks.map((risk, idx) => (
            <li
              key={idx}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="font-semibold text-black">Clause</p>
              <p className="mt-1 text-slate-700">{risk.clause}</p>
              <p className="mt-2 font-semibold text-black">Explanation</p>
              <p className="text-slate-600">{risk.explanation}</p>
              <p className="mt-2 text-sm font-medium">
                Severity: {risk.severity}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
