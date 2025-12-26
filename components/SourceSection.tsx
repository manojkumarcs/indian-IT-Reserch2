
import React from 'react';
import { ResearchResult, CompanyData } from '../types';

interface SourceSectionProps {
  sources: ResearchResult['sources'];
  groundingUrls: string[];
  companies?: CompanyData[];
}

const SourceSection: React.FC<SourceSectionProps> = ({ sources, groundingUrls, companies }) => {
  const safeSources = sources || [];
  const safeGroundingUrls = groundingUrls || [];
  const safeCompanies = companies || [];

  return (
    <div className="mt-12 space-y-12 pb-10">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <i className="fa-solid fa-file-shield text-blue-600"></i>
          FIELD-BY-FIELD AUDIT TRAIL
        </h2>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Verification Records
        </div>
      </div>
      
      {/* Granular Company Field Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {safeCompanies.map((company, cIdx) => (
          <div key={cIdx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-building text-slate-400"></i>
                {company.company}
              </h3>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">Source Map</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(company.fieldSources || []).map((fs, fsIdx) => (
                  <div key={fsIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{fs.field}</p>
                    <a 
                      href={fs.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-all truncate"
                    >
                      <i className="fa-solid fa-link text-[10px] opacity-50 group-hover:opacity-100"></i>
                      <span className="truncate">{fs.sourceName}</span>
                    </a>
                    <p className="text-[9px] text-slate-400 mt-1 italic">Verified as of {fs.asOf}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeSources.map((s, idx) => (
          <div key={idx} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-black text-slate-700 mb-4 border-b border-slate-100 pb-2 uppercase tracking-tight flex items-center gap-2">
              <i className="fa-solid fa-folder-open text-blue-400 text-xs"></i>
              {s.section || 'General Reference'}
            </h3>
            <ul className="space-y-3">
              {(s.links || []).map((link, lIdx) => (
                <li key={lIdx} className="group">
                  <a 
                    href={link.url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-medium text-slate-600 group-hover:text-blue-600 transition-colors block leading-tight"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate pr-4">{link.label || 'Direct Link'}</span>
                      <i className="fa-solid fa-external-link text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </div>
                  </a>
                  {link.asOf && <span className="text-slate-400 text-[9px] block mt-1 uppercase tracking-tighter">Report Date: {link.asOf}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {safeGroundingUrls.length > 0 && (
        <div className="p-8 bg-slate-950 rounded-3xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <i className="fa-brands fa-google text-8xl"></i>
          </div>
          <h3 className="text-sm font-bold mb-6 flex items-center gap-3 text-blue-400 uppercase tracking-widest">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Real-Time Search Grounding Nodes
          </h3>
          <div className="flex flex-wrap gap-3">
            {safeGroundingUrls.map((url, i) => {
              if (!url) return null;
              let hostname = 'Reference Link';
              try { hostname = new URL(url).hostname; } catch (e) { }

              return (
                <a 
                  key={i} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[11px] transition-all flex items-center gap-2 border border-white/10 backdrop-blur-sm group"
                >
                  <i className="fa-solid fa-fingerprint text-[10px] text-blue-400"></i>
                  <span className="group-hover:text-blue-300">{hostname}</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[8px] opacity-30"></i>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceSection;
