import React from 'react';
import { Table, AlertTriangle, Clock, Rows, CheckCircle, Info } from 'lucide-react';
import { QueryExecutionResult } from '../services/databaseService';

interface QueryResultTableProps {
  result: QueryExecutionResult | null;
  lastExecutedQuery?: string;
}

export const QueryResultTable: React.FC<QueryResultTableProps> = ({
  result,
  lastExecutedQuery,
}) => {
  if (!result) {
    return (
      <div className="bg-noir-900 border border-noir-800 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
        <div className="w-12 h-12 rounded-full bg-noir-850 border border-noir-700/60 flex items-center justify-center text-slate-500 mb-3">
          <Table className="w-6 h-6" />
        </div>
        <h3 className="font-cinzel text-base text-slate-300 font-semibold mb-1">
          Bảng Kết Quả Truy Vấn
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Nhập câu lệnh SQL vào trình soạn thảo ở trên và nhấn nút{' '}
          <span className="text-noir-gold font-bold">Chạy Truy Vấn</span> để hiển thị dữ liệu trích xuất.
        </p>
      </div>
    );
  }

  // Error State
  if (!result.success) {
    return (
      <div className="bg-rose-950/30 border border-rose-900/60 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center space-x-2 text-rose-400 font-cinzel font-semibold">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <h3>Phát Hiện Lỗi Truy Vấn SQL</h3>
        </div>

        <div className="bg-noir-950/80 p-3 rounded-lg border border-rose-900/40 text-xs font-mono text-rose-300">
          <span className="text-slate-500 block mb-1">Thông báo từ SQLite Engine:</span>
          {result.error}
        </div>

        {result.vietnameseHelp && (
          <div className="flex items-start space-x-2 text-xs text-amber-300 bg-amber-950/30 p-3 rounded-lg border border-amber-900/40">
            <Info className="w-4 h-4 text-noir-accent flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-noir-gold block mb-0.5">Lời khuyên cho Thám tử:</span>
              <span>{result.vietnameseHelp}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Zero rows returned
  if (result.rowCount === 0) {
    return (
      <div className="bg-noir-900 border border-noir-800 rounded-xl p-6 text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-mono">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Thực thi thành công ({result.executionTimeMs} ms)</span>
        </div>
        <p className="text-sm text-slate-300">
          Câu lệnh hợp lệ nhưng <span className="font-bold text-noir-gold">0 dòng dữ liệu</span> được tìm thấy.
        </p>
        <p className="text-xs text-slate-400">
          Hãy kiểm tra lại điều kiện lọc <code className="text-noir-gold">WHERE</code> hoặc thời gian để khớp với chứng cứ vụ án.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-noir-900 border border-noir-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Result Status Header */}
      <div className="px-4 py-2.5 bg-noir-850 border-b border-noir-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-xs text-slate-300 font-mono">
            <Rows className="w-4 h-4 text-noir-accent" />
            <span>Kết quả:</span>
            <span className="font-bold text-noir-gold">{result.rowCount}</span> dòng
          </div>
          <div className="h-3 w-px bg-noir-700" />
          <div className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{result.executionTimeMs} ms</span>
          </div>
        </div>

        {lastExecutedQuery && (
          <span className="text-[11px] text-slate-400 font-mono truncate max-w-xs sm:max-w-md hidden md:inline">
            {lastExecutedQuery}
          </span>
        )}
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto max-h-[380px] overflow-y-auto relative no-scrollbar sm:scroll-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-noir-950 sticky top-0 z-20 border-b border-noir-800">
            <tr>
              <th className="p-3 font-mono font-bold text-slate-400 w-12 text-center border-r border-noir-800/80 sticky left-0 bg-noir-950 z-30 shadow-[1px_0_0_rgba(255,255,255,0.06)]">
                #
              </th>
              {result.columns.map((col, idx) => (
                <th
                  key={idx}
                  className="p-3 font-mono font-bold text-noir-gold border-r border-noir-800/60 last:border-r-0 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-noir-800/60">
            {result.values.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-noir-800/50 transition-colors font-mono even:bg-noir-950/40"
              >
                <td className="p-3 text-slate-500 text-center border-r border-noir-800/80 select-none sticky left-0 bg-noir-900 even:bg-noir-950 z-10 shadow-[1px_0_0_rgba(255,255,255,0.06)]">
                  {rowIdx + 1}
                </td>
                {row.map((val, colIdx) => (
                  <td
                    key={colIdx}
                    className="p-3 text-slate-200 border-r border-noir-800/40 last:border-r-0 whitespace-nowrap max-w-sm truncate"
                    title={val === null ? 'NULL' : String(val)}
                  >
                    {val === null ? (
                      <span className="italic text-slate-500 font-serif">NULL</span>
                    ) : (
                      String(val)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Swipe Affordance */}
      <div className="px-3 py-1.5 bg-noir-950 border-t border-noir-800/60 flex items-center justify-between text-[11px] text-slate-500 sm:hidden">
        <span>{result.rowCount} kết quả</span>
        <span className="text-slate-400 italic">← Vuốt ngang xem đủ cột →</span>
      </div>
    </div>
  );
};
