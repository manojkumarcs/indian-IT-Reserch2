
import React, { useState, useCallback } from 'react';
import { performResearch } from './services/geminiService';
import { ResearchResult } from './types';
import CompanyTable from './components/CompanyTable';
import BenchmarkTable from './components/BenchmarkTable';
import SourceSection from './components/SourceSection';
import VerificationPanel from './components/VerificationPanel';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!input.trim()) return;
    
    const companies = input.split(',').map(c => c.trim()).filter(c => c.length > 0);
    if (companies.length === 0) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await performResearch(companies);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch research data. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  }, [input]);

  const downloadFullAuditPackage = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IT_Research_Audit_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openExternalAudit = (tool: 'perplexity' | 'google' | 'chatgpt') => {
    if (!input) return;
    const query = encodeURIComponent(`Verify revenue, employee count, and Glassdoor ratings as of 2024 for: ${input}`);
    const urls = {
      perplexity: `https://www.perplexity.ai/search?q=${query}`,
      google: `https://www.google.com/search?q=${query}`,
      chatgpt: `https://chatgpt.com/?q=${query}`
    };
    window.open(urls[tool], '_blank');
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white border-b border-slate-700 sticky top-0 z-50 py-4 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-inner">
              <i className="fa-solid fa-microchip text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none mb-1">India IT Research Hub</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Field-by-Field Audit Engine</p>
            </div>
          </div>
          
          <div className="flex flex-1 max-w-2xl w-full gap-2">
            <input 
              type="text" 
              placeholder="Search companies (e.g. TCS, Infosys, Wipro)"
              className="flex-1 bg-slate-800 border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-500 transition-all border"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={loading}
            />
            <button 
              onClick={handleSearch}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95"
            >
              {loading ? (
                <i className="fa-solid fa-sync animate-spin"></i>
              ) : (
                <i className="fa-solid fa-bolt"></i>
              )}
              {loading ? 'Researching...' : 'Research'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8">
        {!result && !loading && !error && (
          <div className="max-w-3xl mx-auto mt-20 text-center space-y-8">
            <div className="inline-block p-6 bg-blue-100/50 rounded-full mb-4 animate-bounce-slow">
              <i className="fa-solid fa-magnifying-glass-chart text-5xl text-blue-600"></i>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Audit-Grade IT Market Intelligence</h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Our specialized agents extract data from primary filings and cross-verify with real-time scrapers to provide a field-by-field source map for Indian IT giants.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { icon: "fa-link-slash", color: "text-rose-500", title: "Source Verification", desc: "Every field mapped to a direct URL" },
                { icon: "fa-ranking-star", color: "text-amber-500", title: "Live Ratings", desc: "Real-time Glassdoor/Naukri sentiment" },
                { icon: "fa-money-bill-transfer", color: "text-emerald-500", title: "CTC Benchmarks", desc: "Indian-IT specific compensation ranges" }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <i className={`fa-solid ${item.icon} ${item.color} text-2xl mb-4`}></i>
                  <h4 className="font-bold text-slate-800 text-base mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-20 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-robot text-blue-600 animate-pulse text-2xl"></i>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-slate-900 font-bold text-lg">Multi-Agent Verification Pipeline Active</p>
              <p className="text-slate-500 text-sm italic">Accessing Annual Reports & Real-time Salary Aggregators...</p>
            </div>
            <div className="max-w-md w-full bg-slate-200 h-2 rounded-full overflow-hidden">
               <div className="bg-blue-600 h-full animate-pulse" style={{width: '75%'}}></div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 p-8 bg-white border-2 border-rose-100 rounded-3xl text-rose-800 max-w-2xl mx-auto shadow-xl">
            <div className="flex gap-6 items-center">
              <div className="bg-rose-100 p-4 rounded-full">
                <i className="fa-solid fa-triangle-exclamation text-3xl text-rose-600"></i>
              </div>
              <div>
                <h3 className="font-black text-lg mb-1">Research Extraction Interrupted</h3>
                <p className="text-sm opacity-80 leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Action Bar & Disclaimer */}
            <div className="flex flex-col lg:flex-row gap-6 items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex-1 flex gap-4">
                <div className="bg-amber-100 p-3 rounded-2xl h-fit">
                  <i className="fa-solid fa-shield-halved text-amber-600 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-tighter">AI Verification Protocol v4.0</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    This data is cross-verified using multiple AI agents and real-time grounding. Financial figures represent the latest audited cycles. Ratings are extracted live via search tools.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                <p className="w-full text-[10px] text-slate-400 font-bold uppercase mb-1 ml-1">Research & Audit Actions</p>
                <button 
                  onClick={downloadFullAuditPackage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
                >
                  <i className="fa-solid fa-download"></i> Download Full Audit JSON
                </button>
                <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
                <button 
                  onClick={() => openExternalAudit('perplexity')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-200"
                >
                  <i className="fa-solid fa-search"></i> Perplexity
                </button>
                <button 
                  onClick={() => openExternalAudit('google')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-200"
                >
                  <i className="fa-brands fa-google"></i> Google
                </button>
              </div>
            </div>

            <VerificationPanel 
              logs={result.verificationLog} 
              score={result.overallConfidenceScore} 
              coverage={result.dataCoverage} 
            />
            <CompanyTable data={result.partA} />
            <BenchmarkTable data={result.partB} />
            <SourceSection sources={result.sources} groundingUrls={result.groundingUrls} companies={result.partA} />
          </div>
        )}
      </main>

      <footer className="mt-20 py-12 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center gap-8 text-slate-300 text-xl">
            <i className="fa-brands fa-react"></i>
            <i className="fa-solid fa-microchip"></i>
            <i className="fa-solid fa-database"></i>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Research Pipeline: Gemini 3 Pro • Real-Time Grounding • India IT Services Protocol</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
