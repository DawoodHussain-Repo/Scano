import { Zap, Shield, Brain, FileText, Lock, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get comprehensive contract analysis in under 10 seconds with Groq AI.",
  },
  {
    icon: Shield,
    title: "Risk Detection",
    description: "Identify dangerous clauses, missing protections, and vague language automatically.",
  },
  {
    icon: Brain,
    title: "Smart Analysis",
    description: "RAG-powered AI understands context and provides plain English explanations.",
  },
  {
    icon: FileText,
    title: "Table Support",
    description: "Handles complex PDFs with tables, lists, and structured content.",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description: "Your contracts are processed securely and never stored permanently.",
  },
  {
    icon: MessageSquare,
    title: "Plain English",
    description: "No legal jargon. Get clear explanations anyone can understand.",
  },
];

export default function FeaturesSection() {
  return (
    <div id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Why Choose Scano?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful AI technology made simple for everyone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity" />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Icon className="w-7 h-7" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
