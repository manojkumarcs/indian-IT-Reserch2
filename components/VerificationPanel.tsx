
import React from 'react';
import { VerificationLog } from '../types';

interface VerificationPanelProps {
  logs: VerificationLog[];
  score: number;
  coverage?: number;
}

const VerificationPanel: React.FC<VerificationPanelProps> = ({ logs, score, coverage }) => {
  const safeLogs = logs || [];

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl my-8">
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
            <i className="fa-solid fa-shield-check text-emerald-400"></i>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">AI Multi-Agent Verification Log</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Data Coverage</p>
            <p className="text-xl font-black text-blue-400">{coverage || 0}%</p>
          </div>
          <div className="text-right border-l border-slate-700 pl-6">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Confidence Score</p>
            <p className="text-xl font-black text-emerald-400">{score || 0}%</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {safeLogs.length > 0 ? safeLogs.map((log, i) => (
            <div key={i} className="flex gap-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 group hover:border-slate-600 transition-colors">
              <div className="mt-1">
                {log.status === 'passed' ? (
                  <i className="fa-solid fa-circle-check text-emerald-500"></i>
                ) : (
                  <i className="fa-solid fa-circle-exclamation text-amber-500"></i>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{log.agent || 'Unknown Agent'}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${
                    log.status === 'passed' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
                  }`}>
                    {log.status || 'unknown'}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">{log.check || 'Verification Step'}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{log.details || 'No additional details provided.'}</p>
              </div>
            </div>
          )) : (
            <p className="text-slate-500 text-sm italic">No verification logs available for this session.</p>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-700/50 text-[10px] text-slate-500 italic flex items-center gap-2">
          <i className="fa-solid fa-info-circle"></i>
          Exhaustive Search Mode: Every column audited. Missing values represent data not found in primary or aggregator filings.
        </div>
      </div>
    </div>
  );
};

export default VerificationPanel;
