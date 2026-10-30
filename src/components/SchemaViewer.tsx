import React, { useState } from 'react';
import { Database, Table, Play, ChevronDown, ChevronRight, KeyRound, Network, ListFilter } from 'lucide-react';
import { TableSchema } from '../cases/types';
import { SchemaDiagram } from './SchemaDiagram';

interface SchemaViewerProps {
  schemas: TableSchema[];
  onQuickQuery: (sql: string) => void;
  getTableCount: (tableName: string) => number;
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({
  schemas,
  onQuickQuery,
  getTableCount,
}) => {
  // On mobile screens (< 768px), default to structured list view to prevent canvas swipe traps
  const [viewMode, setViewMode] = useState<'diagram' | 'list'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'list';
    }
    return 'diagram';
  });
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (schemas.length > 0) {
      initial[schemas[0].name] = true;
    }
    return initial;
  });

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Top Header with View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-noir-800">
        <div className="flex items-center space-x-2 text-noir-gold font-bold">
          <Database className="w-5 h-5 text-noir-accent" />
          <h2 className="text-base tracking-wide">Lược Đồ Cơ Sở Dữ Liệu</h2>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-noir-900 border border-noir-800 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('diagram')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'diagram'
                ? 'bg-noir-800 text-noir-gold shadow border border-noir-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-sky-400" />
            <span>Sơ Đồ ER</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-noir-800 text-noir-gold shadow border border-noir-700/60 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 text-noir-accent" />
            <span>Chi Tiết Bảng</span>
          </button>
        </div>
      </div>

      {/* Render based on viewMode */}
      {viewMode === 'diagram' ? (
        <SchemaDiagram
          schemas={schemas}
          onSelectTableQuery={(table) => onQuickQuery(`SELECT * FROM ${table} LIMIT 10;`)}
          getTableCount={getTableCount}
        />
      ) : (
        <div className="space-y-3">
          <div className="space-y-3">
            {schemas.map((table) => {
              const isExpanded = !!expandedTables[table.name];
              const rowCount = getTableCount(table.name);

              return (
                <div
                  key={table.name}
                  className="border border-noir-800 rounded-xl overflow-hidden bg-noir-900/90 shadow-sm"
                >
                  {/* Table Header Bar */}
                  <div className="p-3 bg-noir-850/80 flex items-center justify-between gap-2 border-b border-noir-800/60">
                    <button
                      onClick={() => toggleTable(table.name)}
                      className="flex items-center space-x-2 text-left flex-1 hover:text-noir-gold transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-noir-accent flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      )}
                      <Table className="w-4 h-4 text-noir-accent flex-shrink-0" />
                      <span className="font-mono font-bold text-sm text-slate-100">
                        {table.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({rowCount} dòng)
                      </span>
                    </button>

                    <button
                      onClick={() => onQuickQuery(`SELECT * FROM ${table.name} LIMIT 5;`)}
                      className="text-xs flex items-center space-x-1 px-2.5 py-1 rounded bg-noir-800 hover:bg-noir-accent/20 hover:text-noir-gold text-slate-300 border border-noir-700 hover:border-noir-accent/40 transition-all font-mono"
                      title={`Xem trước dữ liệu bảng ${table.name}`}
                    >
                      <Play className="w-3 h-3 text-noir-accent" />
                      <span>Xem mẫu</span>
                    </button>
                  </div>

                  {/* Table Description */}
                  <div className="px-3.5 py-2 text-xs text-slate-400 bg-noir-950/40 border-b border-noir-800/40">
                    {table.description}
                  </div>

                  {/* Columns List */}
                  {isExpanded && (
                    <div className="p-3 bg-noir-950/60 divide-y divide-noir-800/50">
                      <div className="grid grid-cols-12 text-[10px] uppercase font-bold text-slate-400 pb-1.5 px-1 font-mono">
                        <span className="col-span-4">Tên cột</span>
                        <span className="col-span-3">Kiểu dữ liệu</span>
                        <span className="col-span-5">Ý nghĩa</span>
                      </div>

                      {table.columns.map((col) => {
                        const isPk = col.type.toUpperCase().includes('PRIMARY KEY');

                        return (
                          <div
                            key={col.name}
                            className="grid grid-cols-12 py-2 px-1 text-xs items-center hover:bg-noir-850/40 rounded transition-colors"
                          >
                            <div className="col-span-4 font-mono font-medium text-slate-200 flex items-center space-x-1 truncate pr-1">
                              {isPk && <KeyRound className="w-3 h-3 text-noir-gold flex-shrink-0" />}
                              <span className={isPk ? 'text-noir-gold' : 'text-slate-200'}>
                                {col.name}
                              </span>
                            </div>
                            <div className="col-span-3 font-mono text-[11px] text-slate-400 truncate pr-1">
                              {col.type}
                            </div>
                            <div className="col-span-5 text-slate-400 text-xs">
                              {col.description}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
