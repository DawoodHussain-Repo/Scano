import { Shield, Github, Zap, Brain, Database } from "lucide-react";
import { SiNextdotjs, SiTypescript, SiTailwindcss } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-slate-900">Scano</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              AI-powered contract risk analysis. Identify dangerous clauses before you sign.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-4 text-sm uppercase tracking-wide">
              Product
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/#features"
                  className="text-slate-600 hover:text-blue-600 text-sm transition-colors inline-flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/upload"
                  className="text-slate-600 hover:text-blue-600 text-sm transition-colors inline-flex items-center gap-2"
                >
                  <Brain className="w-3.5 h-3.5" />
                  Upload Contract
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-slate-600 hover:text-blue-600 text-sm transition-colors inline-flex items-center gap-2"
                >
                  <Database className="w-3.5 h-3.5" />
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-slate-900 font-semibold mb-4 text-sm uppercase tracking-wide">
              Built With
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <SiNextdotjs className="w-4 h-4" />
                <span>Next.js 16 & TypeScript</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Zap className="w-4 h-4" />
                <span>Groq AI (Llama 3.3 70B)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Brain className="w-4 h-4" />
                <span>HuggingFace Embeddings</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <SiTailwindcss className="w-4 h-4" />
                <span>Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Scano. Built for portfolio demonstration.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-900 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
