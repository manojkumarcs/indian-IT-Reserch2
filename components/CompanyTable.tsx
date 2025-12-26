
import React from 'react';
import { CompanyData } from '../types';
import TableWrapper from './TableWrapper';

interface CompanyTableProps {
  data: CompanyData[];
}

const CompanyTable: React.FC<CompanyTableProps> = ({ data }) => {
  const safeData = data || [];
  const headers = [
    "Company", 
    "Status",
    "Segment", 
    "Business Operations", 
    "Revenue (USD Bn)", 
    "Revenue (INR Cr)", 
    "Employees", 
    "Parent Group",
    "Glassdoor ★", "Naukri ★", "LinkedIn Proxy",
    "Tester 0-2 (Median LPA)", "Tester 2-5 (Median LPA)", "Tester 5-10 (Median LPA)", 
    "Cyber 0-2 (Median LPA)", "Cyber 2-5 (Median LPA)", "Cyber 5-10 (Median LPA)",
    "DevOps 0-2 (Median LPA)", "DevOps 2-5 (Median LPA)", "DevOps 5-10 (Median LPA)",
    "Software 0-2 (Median LPA)", "Software 2-5 (Median LPA)", "Software 5-10 (Median LPA)",
    "Audit Trail"
  ];

  const getSourceForField = (company: CompanyData, fieldName: string) => {
    return company.fieldSources?.find(s => s.field.toLowerCase().includes(fieldName.toLowerCase()));
  };

  const renderValueWithSource = (row: CompanyData, value: string, fieldKey: string, className: string = "") => {
    const source = getSourceForField(row, fieldKey);
    const isMissing = !value || value.toLowerCase().includes("no data") || value.toLowerCase().includes("n/a") || value === "-";
    
    return (
      <td className={`px-4 py-3 text-sm group relative whitespace-nowrap ${className}`}>
        <div className="flex items-center gap-1.5">
          {isMissing ? (
            <span className="text-slate-300 italic text-[11px]">Pending...</span>
          ) : (
            <span>{value}</span>
          )}
          
          {source && !isMissing && (
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              title={`Source: ${source.sourceName} (${source.asOf})`}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 bg-slate-50 border border-slate-200 rounded px-1"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
            </a>
          )}
        </div>
      </td>
    );
  };

  const handleCopy = () => {
    if (safeData.length === 0) return;
    const rows = safeData.map(row => {
      const auditTrail = (row.fieldSources || []).map(s => `[${s.field}: ${s.url}]`).join(" | ");
      return [
        row.company, row.verificationStatus, row.segment, row.ops, row.revenueUsdBn, row.revenueInrCr, row.employeesApprox, row.parentCompany,
        row.glassdoorRating, row.naukriRating, row.linkedinRating,
        row.tester_0_2, row.tester_2_5, row.tester_5_10,
        row.cyber_0_2, row.cyber_2_5, row.cyber_5_10,
        row.devops_0_2, row.devops_2_5, row.devops_5_10,
        row.software_0_2, row.software_2_5, row.software_5_10,
        auditTrail
      ].map(v => String(v || "N/A").replace(/\t|\n/g, " ")).join("\t");
    });
    navigator.clipboard.writeText([headers.join("\t"), ...rows].join("\n"));
    alert("Copied Median CTC Table to Clipboard (Excel-ready)");
  };

  return (
    <TableWrapper title="Part A — Median CTC Benchmarking & Workforce Data" onCopy={handleCopy}>
      <table className="w-full text-left border-collapse min-w-[3400px]">
        <thead>
          <tr className="bg-slate-50">
            {headers.map((h, i) => (
              <th key={h} className={`px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter border-b border-slate-200 ${i === 0 ? 'sticky left-0 bg-slate-50 z-20 shadow-md' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {safeData.map((row, i) => (
            <tr key={i} className="hover:bg-blue-50/30 transition-colors">
              <td className="px-4 py-4 text-sm font-black text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-sm">{row.company}</td>
              <td className="px-4 py-4">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${row.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {row.verificationStatus}
                </span>
              </td>
              {renderValueWithSource(row, row.segment, 'segment', 'text-slate-600')}
              {renderValueWithSource(row, row.ops, 'ops', 'text-slate-600 italic')}
              {renderValueWithSource(row, row.revenueUsdBn, 'revenue', 'font-bold text-slate-800')}
              {renderValueWithSource(row, row.revenueInrCr, 'revenue', 'font-bold text-slate-800')}
              {renderValueWithSource(row, row.employeesApprox, 'employees', 'text-slate-600')}
              {renderValueWithSource(row, row.parentCompany, 'parent', 'text-slate-500')}
              {renderValueWithSource(row, row.glassdoorRating, 'glassdoor', 'font-black text-orange-600')}
              {renderValueWithSource(row, row.naukriRating, 'naukri', 'font-black text-blue-600')}
              {renderValueWithSource(row, row.linkedinRating, 'linkedin', 'text-slate-400')}
              {renderValueWithSource(row, row.tester_0_2, 'tester', 'font-bold text-emerald-600 bg-emerald-50/20')}
              {renderValueWithSource(row, row.tester_2_5, 'tester', 'font-bold text-emerald-600 bg-emerald-50/20')}
              {renderValueWithSource(row, row.tester_5_10, 'tester', 'font-bold text-emerald-600 bg-emerald-50/20')}
              {renderValueWithSource(row, row.cyber_0_2, 'cyber', 'font-bold text-indigo-600 bg-indigo-50/20')}
              {renderValueWithSource(row, row.cyber_2_5, 'cyber', 'font-bold text-indigo-600 bg-indigo-50/20')}
              {renderValueWithSource(row, row.cyber_5_10, 'cyber', 'font-bold text-indigo-600 bg-indigo-50/20')}
              {renderValueWithSource(row, row.devops_0_2, 'devops', 'font-bold text-amber-600 bg-amber-50/20')}
              {renderValueWithSource(row, row.devops_2_5, 'devops', 'font-bold text-amber-600 bg-amber-50/20')}
              {renderValueWithSource(row, row.devops_5_10, 'devops', 'font-bold text-amber-600 bg-amber-50/20')}
              {renderValueWithSource(row, row.software_0_2, 'software', 'font-bold text-rose-600 bg-rose-50/20')}
              {renderValueWithSource(row, row.software_2_5, 'software', 'font-bold text-rose-600 bg-rose-50/20')}
              {renderValueWithSource(row, row.software_5_10, 'software', 'font-bold text-rose-600 bg-rose-50/20')}
              <td className="px-4 py-4 text-[9px] text-slate-400">
                {(row.fieldSources || []).length} Verification Points
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
};

export default CompanyTable;
