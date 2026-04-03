"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

const severityConfig = {
  high: {
    badge: "bg-red-100 text-red-800 border-red-300",
    card: "border-red-200 bg-red-50/30",
    icon: "🚨",
    label: "HIGH RISK",
    iconBg: "bg-red-500",
  },
  medium: {
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    card: "border-amber-200 bg-amber-50/30",
    icon: "⚠️",
    label: "MEDIUM RISK",
    iconBg: "bg-amber-500",
  },
  low: {
    badge: "bg-green-100 text-green-800 border-green-300",
    card: "border-green-200 bg-green-50/30",
    icon: "ℹ️",
    label: "LOW RISK",
    iconBg: "bg-green-500",
  },
};

const scoreConfig = {
  high: {
    bg: "bg-gradient-to-r from-red-500 to-red-600",
    text: "text-red-600",
    label: "HIGH RISK",
    icon: "🚨",
  },
  medium: {
    bg: "bg-gradient-to-r from-amber-500 to-amber-600",
    text: "text-amber-600",
    label: "MODERATE RISK",
    icon: "⚠️",
  },
  low: {
    bg: "bg-gradient-to-r from-green-500 to-green-600",
    text: "text-green-600",
    label: "LOW RISK",
    icon: "✅",
  },
};

export default function VerdictCard({ verdict }: { verdict: Verdict }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort risks by severity
  const sortedRisks = [...verdict.risks].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  const riskCounts = {
    high: verdict.risks.filter((r) => r.severity === "high").length,
    medium: verdict.risks.filter((r) => r.severity === "medium").length,
    low: verdict.risks.filter((r) => r.severity === "low").length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <div
        className={`mb-8 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Contract Analysis
              </h1>
              <p className="text-slate-600 mt-1">
                AI-powered risk assessment complete
              </p>
            </div>
          </div>

          {/* Overall Risk Badge */}
          <div
            className={`hidden sm:flex items-center gap-2 px-6 py-3 rounded-full ${scoreConfig[verdict.score].bg} text-white font-bold shadow-lg`}
          >
            <span className="text-xl">{scoreConfig[verdict.score].icon}</span>
            <span>{scoreConfig[verdict.score].label}</span>
          </div>
        </div>

        {/* Mobile Risk Badge */}
        <div
          className={`sm:hidden flex items-center justify-center gap-2 px-6 py-3 rounded-full ${scoreConfig[verdict.score].bg} text-white font-bold shadow-lg`}
        >
          <span className="text-xl">{scoreConfig[verdict.score].icon}</span>
          <span>{scoreConfig[verdict.score].label}</span>
        </div>
      </div>

      {/* Summary Card */}
      <div
        className={`mb-8 transition-all duration-700 delay-100 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-6">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
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
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Executive Summary
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {verdict.summary}
              </p>
            </div>
          </div>

          {/* Risk Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 font-semibold text-sm mb-1">
                    High Risk
                  </p>
                  <p className="text-3xl font-bold text-red-700">
                    {riskCounts.high}
                  </p>
                </div>
                <div className="text-4xl">🚨</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border-2 border-amber-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 font-semibold text-sm mb-1">
                    Medium Risk
                  </p>
                  <p className="text-3xl font-bold text-amber-700">
                    {riskCounts.medium}
                  </p>
                </div>
                <div className="text-4xl">⚠️</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-semibold text-sm mb-1">
                    Low Risk
                  </p>
                  <p className="text-3xl font-bold text-green-700">
                    {riskCounts.low}
                  </p>
                </div>
                <div className="text-4xl">ℹ️</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Identified Issues ({verdict.risks.length})
          </h2>
        </div>

        {sortedRisks.map((risk, index) => (
          <div
            key={index}
            className={`transition-all duration-700 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${(index + 2) * 100}ms` }}
          >
            <div
              className={`bg-white rounded-2xl shadow-lg border-2 ${severityConfig[risk.severity].card} p-6 sm:p-8 hover:shadow-xl transition-all duration-300`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border-2 ${severityConfig[risk.severity].badge}`}
                >
                  <span className="text-base">{severityConfig[risk.severity].icon}</span>
                  {severityConfig[risk.severity].label}
                </span>
                <span className="text-slate-400 text-sm font-medium">
                  Issue #{index + 1}
                </span>
              </div>

              {/* Clause */}
              <div className="mb-6">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-1 h-full ${severityConfig[risk.severity].iconBg} rounded-full min-h-[60px]`} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Contract Clause
                    </p>
                    <blockquote className="text-slate-700 leading-relaxed italic">
                      "{risk.clause}"
                    </blockquote>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Risk Explanation
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      {risk.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div
        className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Analyze Another Contract
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-300 hover:border-slate-400 transition-all duration-300"
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Report
        </button>
      </div>

      {/* Footer */}
      <div
        className={`mt-8 text-center transition-all duration-700 delay-600 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-slate-500 text-sm">
          Analysis powered by Groq AI (Llama 3.3 70B) & HuggingFace Embeddings
        </p>
      </div>
    </div>
  );
}
