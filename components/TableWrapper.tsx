
import React from 'react';

interface TableWrapperProps {
  title: string;
  children: React.ReactNode;
  onCopy?: () => void;
}

const TableWrapper: React.FC<TableWrapperProps> = ({ title, children, onCopy }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden my-8">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        {onCopy && (
          <button 
            onClick={onCopy}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors"
          >
            <i className="fa-solid fa-copy"></i>
            Copy Excel-Ready
          </button>
        )}
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default TableWrapper;
