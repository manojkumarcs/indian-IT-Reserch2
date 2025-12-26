
import React from 'react';
import { BenchmarkData } from '../types';
import TableWrapper from './TableWrapper';

interface BenchmarkTableProps {
  data: BenchmarkData[];
}

const BenchmarkTable: React.FC<BenchmarkTableProps> = ({ data }) => {
  const safeData = data || [];
  const headers = ["Role", "Experience Band", "Median CTC (INR LPA)", "Typical Range (25th–75th)", "Sources Used"];

  const handleCopy = () => {
    if (safeData.length === 0) {
      alert("No data available to copy.");
      return;
    }

    try {
      const rows = safeData.map(row => {
        const values = [
          row.role,
          row.expBand,
          row.medianCtc,
          row.typicalRange,
          row.sources
        ];
        return values.map(v => (v === undefined || v === null) ? "No data" : String(v).replace(/\t|\n/g, " ")).join("\t");
      });

      const tsvContent = [headers.join("\t"), ...rows].join("\n");
      
      navigator.clipboard.writeText(tsvContent).then(() => {
        alert("Copied benchmarks to clipboard!");
      }).catch(err => {
        console.error("Clipboard error:", err);
        alert("Failed to copy to clipboard.");
      });
    } catch (err) {
      console.error("TSV Generation error:", err);
      alert("Error generating export data.");
    }
  };

  return (
    <TableWrapper title="Part B — Market Compensation Benchmarking" onCopy={handleCopy}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-100/50">
            {headers.map(h => (
              <th key={h} className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {safeData.length > 0 ? safeData.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-semibold text-slate-800">{row.role || 'Unknown Role'}</td>
              <td className="px-6 py-4 text-sm text-slate-600 italic">{row.expBand || '-'}</td>
              <td className="px-6 py-4 text-sm font-bold text-indigo-600">{row.medianCtc || '-'}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{row.typicalRange || '-'}</td>
              <td className="px-6 py-4 text-xs text-slate-500">{row.sources || 'Public aggregator data'}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-8 text-center text-slate-400 text-sm italic">
                No benchmarking data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </TableWrapper>
  );
};

export default BenchmarkTable;
