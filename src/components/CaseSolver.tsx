import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Database,
  PenLine,
  Columns,
  ArrowLeft,
  Loader2,
  Crosshair,
} from 'lucide-react';
import { DetectiveCase, CaseProgress } from '../cases/types';
import { databaseService, QueryExecutionResult } from '../services/databaseService';
import { CaseBrief } from './CaseBrief';
import { SchemaViewer } from './SchemaViewer';
import { SqlEditor } from './SqlEditor';
import { QueryResultTable } from './QueryResultTable';
import { DetectiveNotes } from './DetectiveNotes';
import { SolutionModal } from './SolutionModal';

interface CaseSolverProps {
  caseData: DetectiveCase;
  progress?: CaseProgress;
  onBack: () => void;
  onCaseSolved: (caseId: string, xpReward: number) => void;
  onNextCase?: () => void;
}

export const CaseSolver: React.FC<CaseSolverProps> = ({
  caseData,
  progress,
  onBack,
  onCaseSolved,
  onNextCase,
}) => {
  const [isDbReady, setIsDbReady] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [query, setQuery] = useState(caseData.starterQuery || `SELECT * FROM ${caseData.schemas[0]?.name || 'hien_truong'};`);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [queryResult, setQueryResult] = useState<QueryExecutionResult | null>(null);
  const [lastExecutedQuery, setLastExecutedQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'brief' | 'schema' | 'notes'>('brief');
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isSideBySide, setIsSideBySide] = useState(true);

  // Initialize and seed database whenever caseData changes
  useEffect(() => {
    let isMounted = true;
    setIsDbReady(false);

    databaseService
      .loadCase(caseData)
      .then(() => {
        if (isMounted) {
          setIsDbReady(true);
          const starter = caseData.starterQuery || `SELECT * FROM ${caseData.schemas[0]?.name};`;
          setQuery(starter);
          // Run neutral table survey without giving away answers
          const initialRes = databaseService.runQuery(starter);
          setQueryResult(initialRes);
          setLastExecutedQuery(starter);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi nạp cơ sở dữ liệu vụ án:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [caseData]);

  // Execute query handler
  const handleExecuteQuery = useCallback(() => {
    if (!isDbReady) return;
    setIsExecuting(true);

    try {
      const res = databaseService.runQuery(query);
      setQueryResult(res);
      setLastExecutedQuery(query.trim());

      if (query.trim()) {
        setQueryHistory((prev) => [query.trim(), ...prev.filter((q) => q !== query.trim())]);
      }
    } finally {
      setIsExecuting(false);
    }
  }, [isDbReady, query]);

  // Quick query from SchemaViewer / Diagram
  const handleQuickQuery = (quickSql: string) => {
    setQuery(quickSql);
    if (!isDbReady) return;
    const res = databaseService.runQuery(quickSql);
    setQueryResult(res);
    setLastExecutedQuery(quickSql);
    setQueryHistory((prev) => [quickSql, ...prev.filter((q) => q !== quickSql)]);
  };

  const isCompleted = !!progress?.completed;

  if (!isDbReady) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-noir-accent animate-spin" />
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-200">
            Đang Thiết Lập Hiện Trường Vụ Án...
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Khởi tạo SQLite WebAssembly & giải mã hồ sơ vụ án: {caseData.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-noir-800">
        <button
          onClick={onBack}
          className="min-h-[40px] flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-slate-100 px-4 py-2 rounded-xl bg-noir-900 border border-noir-800 hover:border-noir-700 transition-all active:scale-[0.98] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-noir-accent" />
          <span>Danh Sách Vụ Án</span>
        </button>

        <div className="flex items-center space-x-2.5">
          {/* Side by side toggle (desktop only) */}
          <button
            onClick={() => setIsSideBySide(!isSideBySide)}
            className="hidden lg:flex min-h-[40px] items-center space-x-2 text-xs text-slate-300 hover:text-slate-100 px-3.5 py-2 rounded-xl bg-noir-900 border border-noir-800 hover:border-noir-700 transition-colors cursor-pointer"
            title="Bật/Tắt chế độ xem chia đôi màn hình"
          >
            <Columns className="w-4 h-4 text-sky-400" />
            <span>{isSideBySide ? 'Chế độ 1 cột' : 'Chia đôi màn hình'}</span>
          </button>

          {/* Accuse / Solution button */}
          <button
            onClick={() => setIsSolutionModalOpen(true)}
            className="min-h-[40px] flex items-center space-x-2 text-xs font-bold text-noir-950 bg-gradient-to-r from-amber-400 via-noir-accent to-amber-500 hover:from-amber-300 hover:to-amber-400 px-5 py-2 rounded-xl shadow-lg shadow-amber-950/50 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Crosshair className="w-4 h-4" />
            <span>{isCompleted ? 'Xem Lời Giải' : 'Buộc Tội / Phá Án'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div
        className={`grid gap-6 ${
          isSideBySide ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1 max-w-4xl mx-auto'
        }`}
      >
        {/* Left Column (Brief / Schema & Diagram / Notes) */}
        <div className={isSideBySide ? 'lg:col-span-5 space-y-4' : 'space-y-4'}>
          {/* Tab selector */}
          <div className="flex items-center p-1 bg-noir-900 border border-noir-800 rounded-xl space-x-1 shadow-sm">
            <button
              onClick={() => setActiveTab('brief')}
              className={`flex-1 min-h-[38px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'brief'
                  ? 'bg-noir-800 text-noir-gold shadow border border-noir-700/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-noir-accent" />
              <span>Hồ Sơ</span>
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`flex-1 min-h-[38px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'schema'
                  ? 'bg-noir-800 text-noir-gold shadow border border-noir-700/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Lược Đồ & Sơ Đồ</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 min-h-[38px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-noir-800 text-noir-gold shadow border border-noir-700/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PenLine className="w-3.5 h-3.5 text-purple-400" />
              <span>Sổ Tay</span>
            </button>
          </div>

          {/* Active Tab Content */}
          <div>
            {activeTab === 'brief' && (
              <CaseBrief
                caseData={caseData}
                isCompleted={isCompleted}
                onOpenSolutionModal={() => setIsSolutionModalOpen(true)}
              />
            )}
            {activeTab === 'schema' && (
              <SchemaViewer
                schemas={caseData.schemas}
                onQuickQuery={handleQuickQuery}
                getTableCount={(tbl) => databaseService.getTableCount(tbl)}
              />
            )}
            {activeTab === 'notes' && <DetectiveNotes caseId={caseData.id} />}
          </div>
        </div>

        {/* Right Column (SQL Editor + Results) */}
        <div className={isSideBySide ? 'lg:col-span-7 space-y-5' : 'space-y-5'}>
          <SqlEditor
            query={query}
            onChangeQuery={setQuery}
            onExecute={handleExecuteQuery}
            queryHistory={queryHistory}
            isLoading={isExecuting}
          />

          <QueryResultTable
            result={queryResult}
            lastExecutedQuery={lastExecutedQuery}
          />
        </div>
      </div>

      {/* Solution Accusation Modal */}
      <SolutionModal
        isOpen={isSolutionModalOpen}
        onClose={() => setIsSolutionModalOpen(false)}
        caseData={caseData}
        isCompleted={isCompleted}
        onSuccess={onCaseSolved}
        onNextCase={onNextCase}
      />
    </div>
  );
};
