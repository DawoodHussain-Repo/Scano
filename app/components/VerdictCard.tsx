"use client";

import { useEffect, useState } from "react";

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
    badge: "bg-red-100 text-red-800 border-red-200",
    card: "border-red-200 bg-red-50/50",
    icon: "🚨",
    label: "HIGH RISK",
  },
  medium: {
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    card: "border-amber-200 bg-amber-50/50",
    icon: "⚠️",
    label: "MEDIUM RISK",
  },
  low: {
    badge: "bg-green-100 text-green-800 border-green-200",
    card: "border-green-200 bg-green-50/50",
    icon: "ℹ️",
    label: "LOW RISK",
  },
};

const scoreConfig = {
  high: {
    bg: "bg-gradient-to-br from-red-500 to-red-600",
    text: "text-red-600",
    label: "HIGH RISK",
  },
  medium: {
    bg: "bg-gradient-to-br from-amber-500 to-amber-600",
    text: "text-amber-600",
    label: "MODERATE RISK",
  },
  low: {
    bg: "bg-gradient-to-br from-green-500 to-green-600",
    text: "text-green-600",
    label: "LOW RISK",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mb-8 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
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
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Contract Analysis
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                AI-powered risk assessment
              </p>
            </div>
          </div>

          {/* Overall Risk Badge */}
          <div
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${scoreConfig[verdict.score].bg} text-white font-bold text-sm shadow-lg`}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {scoreConfig[verdict.score].label}
          </div>
        </div>

        {/* Summary Card */}
        <div
          className={`mb-8 transition-all duration-700 delay-100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Risk Summary
            </h2>
            <p className="text-slate-700 mb-6 leading-relaxed">
              {verdict.summary}
            </p>

            {/* Risk Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-center justify-between">
                  <span className="text-red-600 font-semibold text-sm">
                    High Risk
                  </span>
                  <span className="text-3xl font-bold text-red-600">
                    {riskCounts.high}
                  </span>
                </div>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 font-semibold text-sm">
                    Medium Risk
                  </span>
                  <span className="text-3xl font-bold text-amber-600">
                    {riskCounts.medium}
                  </span>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold text-sm">
                    Low Risk
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    {riskCounts.low}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Identified Issues
          </h2>
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
                className={`bg-white rounded-2xl shadow-lg border-2 ${severityConfig[risk.severity].card} p-6 hover:shadow-xl transition-shadow duration-300`}
              >
                {/* Severity Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${severityConfig[risk.severity].badge}`}
                  >
                    <span>{severityConfig[risk.severity].icon}</span>
                    {severityConfig[risk.severity].label}
                  </span>
                </div>

                {/* Clause */}
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-1 h-full bg-slate-300 rounded-full" />
                    <blockquote className="text-slate-600 italic leading-relaxed">
                      "{risk.clause}"
                    </blockquote>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-slate-700 leading-relaxed">
                      {risk.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className={`mt-12 text-center transition-all duration-700 delay-500 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-slate-500 text-sm">
            Analysis powered by Groq AI & HuggingFace
          </p>
        </div>
      </div>
    </div>
  );
}
