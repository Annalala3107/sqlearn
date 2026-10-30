import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Database,
  PenLine,
  Columns,
  ArrowLeft,
  Loader2,
  Crosshair,
  Code2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { DetectiveCase, CaseProgress } from '../cases/types';
import { databaseService, QueryExecutionResult } from '../services/databaseService';
import { CaseBrief } from './CaseBrief';
import { SchemaViewer } from './SchemaViewer';
import { SqlEditor } from './SqlEditor';
import { QueryResultTable } from './QueryResultTable';
import { DetectiveNotes } from './DetectiveNotes';
import { SolutionModal } from './SolutionModal';
import { startViewTransition } from '../utils/transition';

interface CaseSolverProps {
  caseData: DetectiveCase;
  progress?: CaseProgress;
  onBack: () => void;
  onCaseSolved: (caseId: string, xpReward: number) => void;
  onNextCase?: () => void;
  onNavigateToLesson?: (lessonId: string) => void;
}

export const CaseSolver: React.FC<CaseSolverProps> = ({
  caseData,
  progress,
  onBack,
  onCaseSolved,
  onNextCase,
  onNavigateToLesson,
}) => {
  const [isDbReady, setIsDbReady] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [query, setQuery] = useState(
    caseData.starterQuery || `SELECT * FROM ${caseData.schemas[0]?.name || 'hien_truong'};`
  );
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [queryResult, setQueryResult] = useState<QueryExecutionResult | null>(null);
  const [lastExecutedQuery, setLastExecutedQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'brief' | 'schema' | 'notes'>('brief');
  const [mobileTab, setMobileTab] = useState<'brief' | 'schema' | 'sql' | 'notes'>('brief');
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isSideBySide, setIsSideBySide] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Initialize and seed database whenever caseData changes
  useEffect(() => {
    let isMounted = true;
    setIsDbReady(false);
    setDbError(null);

    databaseService
      .loadCase(caseData)
      .then(() => {
        if (isMounted) {
          setIsDbReady(true);
          const starter = caseData.starterQuery || `SELECT * FROM ${caseData.schemas[0]?.name || 'hien_truong'};`;
          setQuery(starter);
          try {
            const initialRes = databaseService.runQuery(starter);
            setQueryResult(initialRes);
            setLastExecutedQuery(starter);
          } catch (e) {
            console.warn('Lỗi chạy query khởi đầu:', e);
          }
        }
      })
      .catch((err: any) => {
        console.error('Lỗi khi nạp cơ sở dữ liệu vụ án:', err);
        if (isMounted) {
          setDbError(err?.message || 'Không thể khởi tạo cơ sở dữ liệu SQLite WebAssembly.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [caseData, retryTrigger]);

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

    // On mobile screens, smoothly transition user directly to the SQL tab
    startViewTransition(() => {
      setMobileTab('sql');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleMobileTabSwitch = (tab: 'brief' | 'schema' | 'sql' | 'notes') => {
    startViewTransition(() => {
      setMobileTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const isCompleted = !!progress?.completed;

  if (dbError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="max-w-md">
          <h3 className="text-lg font-bold text-slate-100">
            Không Thể Thiết Lập Hiện Trường Vụ Án
          </h3>
          <p className="text-xs text-rose-400 font-mono mt-1.5 p-3 rounded-xl bg-noir-900 border border-noir-800 break-words">
            {dbError}
          </p>
        </div>
        <button
          onClick={() => {
            setDbError(null);
            setRetryTrigger((prev) => prev + 1);
          }}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-noir-accent hover:bg-amber-400 text-noir-950 font-bold text-sm shadow-lg shadow-noir-accent/20 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Thử Tải Lại Ngay</span>
        </button>
      </div>
    );
  }

  if (!isDbReady) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4">
        <Loader2 className="w-10 h-10 text-noir-accent animate-spin" />
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-200">
            Đang Thiết Lập Hiện Trường Vụ Án...
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1 max-w-sm mx-auto">
            Khởi tạo SQLite WebAssembly & giải mã hồ sơ vụ án: {caseData.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-4 sm:space-y-5 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-8">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-noir-800">
        <button
          onClick={onBack}
          className="min-h-[44px] flex items-center space-x-1.5 sm:space-x-2 text-xs font-semibold text-slate-300 hover:text-slate-100 px-3 sm:px-4 py-2 rounded-xl bg-noir-900 border border-noir-800 hover:border-noir-700 transition-all active:scale-[0.98] cursor-pointer"
          aria-label="Quay lại danh sách vụ án"
        >
          <ArrowLeft className="w-4 h-4 text-noir-accent flex-shrink-0" />
          <span className="truncate">Danh Sách Vụ Án</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Side by side toggle (desktop only) */}
          <button
            onClick={() => setIsSideBySide(!isSideBySide)}
            className="hidden lg:flex min-h-[44px] items-center space-x-2 text-xs text-slate-300 hover:text-slate-100 px-3.5 py-2 rounded-xl bg-noir-900 border border-noir-800 hover:border-noir-700 transition-colors cursor-pointer"
            title="Bật/Tắt chế độ xem chia đôi màn hình"
          >
            <Columns className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span>{isSideBySide ? 'Chế độ 1 cột' : 'Chia đôi màn hình'}</span>
          </button>

          {/* Accuse / Solution button */}
          <button
            onClick={() => setIsSolutionModalOpen(true)}
            className="min-h-[44px] flex items-center space-x-1.5 sm:space-x-2 text-xs font-bold text-noir-950 bg-gradient-to-r from-amber-400 via-noir-accent to-amber-500 hover:from-amber-300 hover:to-amber-400 px-3.5 sm:px-5 py-2 rounded-xl shadow-lg shadow-amber-950/50 transition-all active:scale-[0.98] cursor-pointer flex-shrink-0"
          >
            <Crosshair className="w-4 h-4 flex-shrink-0" />
            <span>{isCompleted ? 'Xem Lời Giải' : 'Buộc Tội / Phá Án'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE FOCUSED VIEW (< lg) */}
      {/* ============================================================ */}
      <div className="block lg:hidden">
        {mobileTab === 'brief' && (
          <div className="space-y-4">
            <CaseBrief
              caseData={caseData}
              isCompleted={isCompleted}
              onOpenSolutionModal={() => setIsSolutionModalOpen(true)}
              onNavigateToLesson={onNavigateToLesson}
            />
          </div>
        )}

        {mobileTab === 'schema' && (
          <div className="space-y-4">
            <SchemaViewer
              schemas={caseData.schemas}
              onQuickQuery={handleQuickQuery}
              getTableCount={(tbl) => databaseService.getTableCount(tbl)}
            />
          </div>
        )}

        {mobileTab === 'sql' && (
          <div className="space-y-4">
            <SqlEditor
              query={query}
              onChangeQuery={setQuery}
              onExecute={handleExecuteQuery}
              queryHistory={queryHistory}
              isLoading={isExecuting}
              schemas={caseData.schemas}
            />

            <QueryResultTable
              result={queryResult}
              lastExecutedQuery={lastExecutedQuery}
            />
          </div>
        )}

        {mobileTab === 'notes' && (
          <div className="space-y-4">
            <DetectiveNotes caseId={caseData.id} />
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* DESKTOP WORKSPACE LAYOUT (>= lg) */}
      {/* ============================================================ */}
      <div
        className={`hidden lg:grid gap-6 ${
          isSideBySide ? 'grid-cols-12' : 'grid-cols-1 max-w-4xl mx-auto'
        }`}
      >
        {/* Left Column (Brief / Schema & Diagram / Notes) */}
        <div className={isSideBySide ? 'lg:col-span-5 space-y-4' : 'space-y-4'}>
          {/* Tab selector */}
          <div className="flex items-center p-1 bg-noir-900 border border-noir-800 rounded-xl space-x-1 shadow-sm">
            <button
              onClick={() => setActiveTab('brief')}
              className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
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
              className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
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
              className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
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
                onNavigateToLesson={onNavigateToLesson}
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
            schemas={caseData.schemas}
          />

          <QueryResultTable
            result={queryResult}
            lastExecutedQuery={lastExecutedQuery}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE STICKY BOTTOM NAVIGATION DOCK (Thumb Zone) */}
      {/* ============================================================ */}
      <nav
        aria-label="Điều hướng hiện trường trên di động"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-noir-900/95 backdrop-blur-md border-t border-noir-800 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(0,0,0,0.5)]"
      >
        <div className="grid grid-cols-4 px-2 py-1 max-w-md mx-auto">
          {/* 1. Hồ sơ Tab */}
          <button
            onClick={() => handleMobileTabSwitch('brief')}
            className={`min-h-[50px] flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              mobileTab === 'brief'
                ? 'text-noir-gold font-bold bg-noir-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {mobileTab === 'brief' && (
              <span className="absolute top-0 w-8 h-0.5 bg-noir-accent rounded-full" />
            )}
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Hồ Sơ</span>
          </button>

          {/* 2. Lược đồ Tab */}
          <button
            onClick={() => handleMobileTabSwitch('schema')}
            className={`min-h-[50px] flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              mobileTab === 'schema'
                ? 'text-noir-gold font-bold bg-noir-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {mobileTab === 'schema' && (
              <span className="absolute top-0 w-8 h-0.5 bg-sky-400 rounded-full" />
            )}
            <Database className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Lược Đồ</span>
          </button>

          {/* 3. SQL & Kết quả Tab */}
          <button
            onClick={() => handleMobileTabSwitch('sql')}
            className={`min-h-[50px] flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              mobileTab === 'sql'
                ? 'text-noir-gold font-bold bg-noir-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {mobileTab === 'sql' && (
              <span className="absolute top-0 w-8 h-0.5 bg-amber-400 rounded-full" />
            )}
            <div className="relative">
              <Code2 className="w-4 h-4 mb-0.5" />
              {queryResult && queryResult.success && (
                <span
                  className="absolute -top-0.5 -right-1.5 w-2 h-2 rounded-full bg-emerald-400"
                  title="Có kết quả truy vấn mới"
                />
              )}
            </div>
            <span className="text-[10px] tracking-tight">SQL & Bảng</span>
          </button>

          {/* 4. Sổ tay Tab */}
          <button
            onClick={() => handleMobileTabSwitch('notes')}
            className={`min-h-[50px] flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              mobileTab === 'notes'
                ? 'text-noir-gold font-bold bg-noir-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {mobileTab === 'notes' && (
              <span className="absolute top-0 w-8 h-0.5 bg-purple-400 rounded-full" />
            )}
            <PenLine className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Sổ Tay</span>
          </button>
        </div>
      </nav>

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
