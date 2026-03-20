"use client";

import { useState } from "react";

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-7 mb-3">{trimmed.replace("## ","")}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-base font-bold text-orange-300 mt-4 mb-2">{trimmed.replace("### ","")}</h3>;
    if (trimmed.startsWith("- ")) return <li key={i} className="text-slate-300 text-sm ml-4 mb-1 list-disc">{trimmed.replace("- ","")}</li>;
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) return <p key={i} className="text-orange-200 font-bold text-sm mt-2 mb-1">{trimmed.replace(/\*\*/g,"")}</p>;
    if (trimmed.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-orange-400 pl-4 italic text-slate-300 text-sm my-3">{trimmed.replace("> ","")}</blockquote>;
    if (trimmed === "") return <div key={i} className="h-2" />;
    return <p key={i} className="text-slate-300 text-sm leading-relaxed mb-1">{trimmed}</p>;
  });
}

export default function Home() {
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [industry, setIndustry] = useState("");
  const [challenge, setChallenge] = useState("");
  const [result, setResult] = useState("");
  const [responseResult, setResponseResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const generate = async () => {
    if (!customer.trim()) { setError("Please enter a customer name."); return; }
    setLoading(true);
    setError("");
    setResponseResult("");
    setDone(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, product, industry, challenge, result }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Generation failed."); return; }
      setResponseResult(data.result);
      setDone(true);
    } catch { setError("Failed to connect."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950">
      <header className="border-b border-white/10 sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h1 className="text-xl font-bold text-white">AI Case Study Generator</h1>
            <p className="text-xs text-slate-400">B2B case studies · Customer stories · DeepSeek</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Tell Customer Stories that Convert 📊</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">Enter your customer details → get a compelling B2B case study with problem, solution, and results sections.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-white font-semibold text-sm block mb-2">🏢 Customer / Company Name *</label>
            <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="e.g. Acme Corp, TechFlow Inc."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🛍️ Product / Service Used</label>
              <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. NovaTask Pro"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">🏭 Industry</label>
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Fintech, Healthcare SaaS"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <div>
            <label className="text-white font-semibold text-sm block mb-2">⚡ The Challenge</label>
            <textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} rows={2}
              placeholder="e.g. Engineering teams were spending 40% of sprint time in status meetings and manual Jira updates..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>
          <div>
            <label className="text-white font-semibold text-sm block mb-2">📈 The Result</label>
            <textarea value={result} onChange={(e) => setResult(e.target.value)} rows={2}
              placeholder="e.g. Reduced meeting overhead by 60%, shipped 2x more features per sprint..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>
          <button onClick={generate} disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
            {loading ? <><span className="animate-spin text-xl">⚙️</span> Writing case study...</> : <><span>📊</span> Generate Case Study</>}
          </button>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm">{error}</div>}

        {done && responseResult && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-orange-500/10 border-b border-orange-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <p className="text-orange-300 font-bold text-sm">Case Study: {customer}</p>
              </div>
              <button onClick={() => navigator.clipboard?.writeText(responseResult)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs border border-white/10 transition-all">
                📋 Copy All
              </button>
            </div>
            <div className="px-6 py-5">
              {renderMarkdown(responseResult)}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-slate-600">AI Case Study Generator · {new Date().getFullYear()} · DeepSeek</p>
      </div>
    </main>
  );
}
