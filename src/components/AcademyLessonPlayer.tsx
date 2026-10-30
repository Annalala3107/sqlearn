import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  BookOpen,
  Code2,
  Play,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Database,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Loader2,
  Table,
  Check,
  ChevronDown,
  ChevronUp,
  Briefcase,
  AlertTriangle,
  RotateCcw,
  Target,
  FileText,
} from 'lucide-react';
import { Lesson } from '../academy/types';
import { databaseService, QueryExecutionResult } from '../services/databaseService';
import { BridgeService } from '../services/bridgeService';
import { SqlEditor } from './SqlEditor';
import { QueryResultTable } from './QueryResultTable';
import { startViewTransition } from '../utils/transition';

// Utility to format inline markdown terms (bold, code, single quotes, italics)
const renderInlineMarkdown = (text: string) => {
  if (!text) return null;

  // Split tokens: **`code`**, **bold**, `code`, 'quoted', *italic*
  const regex = /(\*\*(?:`[^`]+`|[^*]+)\*\*|`[^`]+`|'[^']+'|\*[^*]+\*)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Bold + Code combo: **`CODE`**
    if (part.startsWith('**`') && part.endsWith('`**')) {
      const code = part.slice(3, -3);
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md bg-amber-950/80 border border-amber-700/70 font-mono text-amber-300 font-bold text-xs mx-0.5 shadow-sm"
        >
          {code}
        </code>
      );
    }

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return (
        <strong key={idx} className="text-noir-gold font-bold font-sans">
          {content}
        </strong>
      );
    }

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1);
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md bg-noir-950 border border-noir-750 font-mono text-sky-300 font-semibold text-xs mx-0.5"
        >
          {code}
        </code>
      );
    }

    // Single quoted identifier/query: 'text'
    if (part.startsWith("'") && part.endsWith("'") && part.length > 2) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md bg-noir-950 border border-emerald-800/60 font-mono text-emerald-300 font-medium text-xs mx-0.5"
        >
          '{inner}'
        </code>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={idx} className="text-slate-200 italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <span key={idx}>{part}</span>;
  });
};

// Utility to render the full structured concept with elegant cards and typography
const renderStructuredConcept = (concept: string) => {
  if (!concept) return null;
  const lines = concept.split('\n');

  const elements: React.ReactNode[] = [];
  let currentParagraphLines: string[] = [];

  const flushParagraph = (key: string) => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(' ').trim();
      if (text) {
        elements.push(
          <p key={key} className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans text-pretty">
            {renderInlineMarkdown(text)}
          </p>
        );
      }
      currentParagraphLines = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph(`p-${idx}`);
      return;
    }

    // 1. Heading: ### ...
    if (line.startsWith('###')) {
      flushParagraph(`p-before-h-${idx}`);
      const headingText = line.replace(/^###\s*/, '');
      elements.push(
        <div key={`h-${idx}`} className="pt-2 pb-1 border-b border-noir-800 flex items-center space-x-2">
          <span className="w-1.5 h-3.5 rounded-full bg-noir-accent flex-shrink-0" />
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-100 uppercase tracking-wide font-sans">
            {headingText}
          </h3>
        </div>
      );
      return;
    }

    // 2. Callout Tip: 💡 **Mẹo...** hoặc Mẹo nhỏ
    if (line.includes('💡') || line.toLowerCase().startsWith('mẹo:') || line.toLowerCase().startsWith('lưu ý:')) {
      flushParagraph(`p-before-tip-${idx}`);
      elements.push(
        <div
          key={`tip-${idx}`}
          className="p-3.5 rounded-xl bg-amber-950/25 border border-amber-800/40 text-amber-200 flex items-start space-x-3 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed flex-1 font-sans text-pretty">
            {renderInlineMarkdown(line.replace(/^[💡\s]+/, ''))}
          </div>
        </div>
      );
      return;
    }

    // 3. Definition item: - **Tên (Giải thích):** Mô tả...
    const defMatch = line.match(/^[-*•]\s+\*\*([^*]+)\*\*:\s*(.*)$/);
    if (defMatch) {
      flushParagraph(`p-before-def-${idx}`);
      const term = defMatch[1];
      const desc = defMatch[2];
      elements.push(
        <div
          key={`def-${idx}`}
          className="p-3.5 rounded-xl bg-noir-950/80 border border-noir-800/90 space-y-1.5 hover:border-noir-750 transition-colors shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-noir-accent flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-noir-gold font-sans tracking-wide">
              {term}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pl-4 text-pretty">
            {renderInlineMarkdown(desc)}
          </div>
        </div>
      );
      return;
    }

    // 4. Numbered step: 1. ... or 2. ...
    const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      flushParagraph(`p-before-num-${idx}`);
      const num = numMatch[1];
      const content = numMatch[2];
      elements.push(
        <div
          key={`num-${idx}`}
          className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-noir-950/60 border border-noir-800/80 shadow-sm"
        >
          <span className="w-5 h-5 rounded-md bg-noir-accent/20 text-noir-gold border border-noir-accent/30 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
            {num}
          </span>
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans flex-1 text-pretty">
            {renderInlineMarkdown(content)}
          </div>
        </div>
      );
      return;
    }

    // 5. Normal bullet point: - ...
    if (line.match(/^[-*•]\s+/)) {
      flushParagraph(`p-before-bullet-${idx}`);
      const bulletContent = line.replace(/^[-*•]\s+/, '');
      elements.push(
        <div key={`bullet-${idx}`} className="flex items-start space-x-2.5 pl-1.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans flex-1 text-pretty">
            {renderInlineMarkdown(bulletContent)}
          </div>
        </div>
      );
      return;
    }

    // Accumulate regular paragraph lines
    currentParagraphLines.push(line);
  });

  flushParagraph('p-final');
  return <div className="space-y-3">{elements}</div>;
};

// Utility to render syntax code snippet with syntax coloring
const renderSyntaxCode = (code: string) => {
  if (!code) return null;
  const lines = code.trim().split('\n');

  return (
    <pre className="p-3.5 bg-noir-950 rounded-xl border border-noir-800 text-xs font-mono overflow-x-auto leading-relaxed">
      {lines.map((line, idx) => {
        const isComment = line.trim().startsWith('--');
        if (isComment) {
          return (
            <div key={idx} className="text-slate-400 italic">
              {line}
            </div>
          );
        }
        const parts = line.split(/\b(SELECT|FROM|WHERE|CREATE|VIEW|TRIGGER|BEFORE|AFTER|FOR|EACH|ROW|BEGIN|END|AS|INSERT|INTO|VALUES|JOIN|LEFT|RIGHT|INNER|ON|ORDER|BY|GROUP|HAVING|LIMIT|DESC|ASC|AND|OR|NOT|IN|LIKE|BETWEEN|IS|NULL|COUNT|SUM|AVG|MIN|MAX|ROUND)\b/gi);
        return (
          <div key={idx}>
            {parts.map((p, pIdx) => {
              const upper = p.toUpperCase();
              if (['SELECT', 'FROM', 'WHERE', 'CREATE', 'VIEW', 'TRIGGER', 'BEFORE', 'AFTER', 'FOR', 'EACH', 'ROW', 'BEGIN', 'END', 'AS', 'INSERT', 'INTO', 'VALUES', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'DESC', 'ASC', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL'].includes(upper)) {
                return (
                  <span key={pIdx} className="text-amber-400 font-bold">
                    {p}
                  </span>
                );
              }
              if (['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND'].includes(upper)) {
                return (
                  <span key={pIdx} className="text-sky-400 font-semibold">
                    {p}
                  </span>
                );
              }
              return <span key={pIdx} className="text-slate-200">{p}</span>;
            })}
          </div>
        );
      })}
    </pre>
  );
};

interface AcademyLessonPlayerProps {
  lesson: Lesson;
  isCompleted: boolean;
  onBack: () => void;
  onLessonCompleted: (lessonId: string, xpReward: number) => void;
  onNextLesson?: () => void;
  onNavigateToCase?: (caseId: string) => void;
}

export const AcademyLessonPlayer: React.FC<AcademyLessonPlayerProps> = ({
  lesson,
  isCompleted: initialCompleted,
  onBack,
  onLessonCompleted,
  onNextLesson,
  onNavigateToCase,
}) => {
  const [isDbReady, setIsDbReady] = useState(false);
  const relatedCase = BridgeService.getRelatedCaseForLesson(lesson.id);
  const [query, setQuery] = useState(lesson.exercise.starterQuery);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [queryResult, setQueryResult] = useState<QueryExecutionResult | null>(null);
  const [lastExecutedQuery, setLastExecutedQuery] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  const [activeDesktopTab, setActiveDesktopTab] = useState<'theory' | 'task' | 'schema' | 'quiz'>('theory');
  const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'task' | 'sql' | 'quiz'>('task');
  const [showHintIndex, setShowHintIndex] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [dbError, setDbError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Initialize SQLite database for this lesson
  useEffect(() => {
    let isMounted = true;
    setIsDbReady(false);
    setDbError(null);
    setVerificationFeedback({ status: 'idle', message: '' });
    setShowHintIndex(null);
    setQuizAnswers({});
    setIsCompleted(initialCompleted);
    setQuery(lesson.exercise.starterQuery);

    databaseService
      .loadDatabase(`lesson-${lesson.id}`, lesson.seedSql)
      .then(() => {
        if (isMounted) {
          setIsDbReady(true);
          // Run preview query on the primary table
          const primaryTable = lesson.schemas[0]?.name;
          if (primaryTable) {
            try {
              const previewSql = `SELECT * FROM ${primaryTable} LIMIT 5;`;
              const res = databaseService.runQuery(previewSql);
              setQueryResult(res);
              setLastExecutedQuery(previewSql);
            } catch (e) {
              console.warn('Lỗi chạy truy vấn xem trước bài học:', e);
            }
          }
        }
      })
      .catch((err: any) => {
        console.error('Lỗi nạp database bài học:', err);
        if (isMounted) {
          setDbError(err?.message || 'Không thể khởi tạo sandbox SQLite cho bài học này.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [lesson.id, retryTrigger]);

  // Execute current query in sandbox
  const handleExecute = useCallback(() => {
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

  // Verify solution against expected query
  const handleVerify = () => {
    if (!isDbReady) return;
    setIsExecuting(true);

    try {
      const check = databaseService.verifyQuery(query, lesson.exercise.expectedQuery);
      setQueryResult(check.userResult);
      setLastExecutedQuery(query.trim());

      if (check.isCorrect) {
        setVerificationFeedback({
          status: 'success',
          message: check.feedback,
        });
        setIsCompleted(true);

        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#38bdf8', '#e5a93c', '#22c55e', '#ffffff'],
          });
        } catch (e) {
          console.warn('Confetti error:', e);
        }

        onLessonCompleted(lesson.id, lesson.xpReward);
      } else {
        setVerificationFeedback({
          status: 'error',
          message: check.feedback,
        });
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const handleMobileTabSwitch = (tab: 'theory' | 'task' | 'sql' | 'quiz') => {
    startViewTransition(() => {
      setActiveMobileTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  if (dbError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="max-w-md">
          <h3 className="text-lg font-bold text-slate-100">
            Không Thể Thiết Lập Môi Trường Thực Hành
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
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-noir-950 font-bold text-sm shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
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
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-200">
            Đang Thiết Lập Môi Trường Thực Hành...
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1 max-w-sm mx-auto">
            Khởi tạo Sandbox SQLite WebAssembly: {lesson.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-4 sm:space-y-5 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-8">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-noir-800">
        <button
          onClick={onBack}
          className="min-h-[44px] flex items-center space-x-1.5 sm:space-x-2 text-xs font-semibold text-slate-300 hover:text-slate-100 px-3 sm:px-4 py-2 rounded-xl bg-noir-900 border border-noir-800 hover:border-noir-700 transition-all active:scale-[0.98] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>Danh Sách Bài Học</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Completed badge */}
          {isCompleted && (
            <div className="hidden sm:flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-400 text-xs font-mono font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>ĐÃ HOÀN THÀNH</span>
            </div>
          )}

          {/* Next Lesson Button */}
          {onNextLesson && (
            <button
              onClick={onNextLesson}
              className="min-h-[44px] flex items-center space-x-1.5 sm:space-x-2 text-xs font-bold text-noir-950 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 px-4 py-2 rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Bài Tiếp Theo</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Grid (Desktop: 2 columns, Mobile: Tabbed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ============================================================ */}
        {/* LEFT COLUMN: THEORY, TASK, SCHEMA & QUIZZES */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 space-y-4">
          {/* Desktop Tab Selector */}
          <div className="hidden lg:flex items-center p-1 bg-noir-900 border border-noir-800 rounded-xl space-x-1">
            <button
              onClick={() => setActiveDesktopTab('theory')}
              className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                activeDesktopTab === 'theory'
                  ? 'bg-noir-800 text-sky-300 shadow border border-noir-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Lý Thuyết</span>
            </button>
            <button
              onClick={() => setActiveDesktopTab('task')}
              className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                activeDesktopTab === 'task'
                  ? 'bg-noir-800 text-noir-gold shadow border border-noir-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-noir-accent" />
              <span>Nhiệm Vụ</span>
            </button>
            <button
              onClick={() => setActiveDesktopTab('schema')}
              className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                activeDesktopTab === 'schema'
                  ? 'bg-noir-800 text-purple-300 shadow border border-noir-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>Bảng CSDL</span>
            </button>
            {lesson.quizzes && lesson.quizzes.length > 0 && (
              <button
                onClick={() => setActiveDesktopTab('quiz')}
                className={`flex-1 min-h-[40px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  activeDesktopTab === 'quiz'
                    ? 'bg-noir-800 text-emerald-300 shadow border border-noir-700 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Trắc Nghiệm</span>
              </button>
            )}
          </div>

          {/* Desktop Content Views OR Mobile Tab View */}
          <div className="space-y-4">
            {/* View 1: Theory */}
            {((typeof window !== 'undefined' && window.innerWidth >= 1024 && activeDesktopTab === 'theory') ||
              (activeMobileTab === 'theory')) && (
              <div className="bg-noir-900 border border-noir-800 rounded-2xl p-5 shadow-md space-y-4">
                <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm border-b border-noir-800 pb-2.5">
                  <BookOpen className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <h2 className="font-extrabold text-slate-100 font-sans tracking-normal">
                    Lý Thuyết Cốt Lõi: <span className="text-sky-300">{lesson.title}</span>
                  </h2>
                </div>

                {/* Structured Rich Concept Cards */}
                <div className="space-y-3 font-sans">
                  {renderStructuredConcept(lesson.concept)}
                </div>

                {/* Syntax Example Box */}
                <div className="space-y-2 pt-3 border-t border-noir-800">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center space-x-1.5 text-noir-gold font-bold">
                      <Code2 className="w-3.5 h-3.5 text-noir-accent" />
                      <span>Ví dụ cú pháp mẫu:</span>
                    </span>
                    <button
                      onClick={() => setQuery(lesson.syntaxExample)}
                      className="px-2.5 py-1 rounded-lg bg-sky-950/80 hover:bg-sky-900/80 text-sky-400 hover:text-sky-300 text-[11px] font-semibold border border-sky-800/60 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Nạp vào Editor</span>
                    </button>
                  </div>
                  {renderSyntaxCode(lesson.syntaxExample)}
                </div>
              </div>
            )}

            {/* View 2: Task / Exercise */}
            {((typeof window !== 'undefined' && window.innerWidth >= 1024 && activeDesktopTab === 'task') ||
              (activeMobileTab === 'task')) && (
              <div className="bg-noir-900 border border-noir-800 rounded-2xl p-5 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-noir-800 pb-2.5">
                  <div className="flex items-center space-x-2 text-noir-gold font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-noir-accent flex-shrink-0" />
                    <h2 className="font-extrabold text-slate-100 font-sans tracking-normal">
                      Thử Thách Bài Tập (Hands-on Challenge)
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-noir-gold font-bold bg-noir-accent/15 px-2.5 py-0.5 rounded-full border border-noir-accent/30 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-noir-accent" />
                    <span>+{lesson.xpReward} XP</span>
                  </span>
                </div>

                {/* Goal Focus Card */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/50 space-y-1.5 shadow-sm">
                  <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs font-mono uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Mục Tiêu Trọng Tâm</span>
                  </div>
                  <div className="text-sm font-bold text-slate-100 leading-snug font-sans">
                    {renderInlineMarkdown(lesson.exercise.goal)}
                  </div>
                </div>

                {/* Task Description Detail Card */}
                <div className="p-4 bg-noir-950/80 rounded-xl border border-noir-800/90 space-y-2 shadow-sm">
                  <div className="flex items-center space-x-1.5 text-sky-400 font-bold text-xs font-mono uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <span>Mô Tả & Yêu Cầu Thực Hiện</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans text-pretty">
                    {renderInlineMarkdown(lesson.exercise.taskDescription)}
                  </div>
                </div>

                {/* Hints section */}
                {lesson.exercise.hints && lesson.exercise.hints.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-noir-800">
                    <span className="text-xs font-bold text-slate-400 font-mono">Gợi ý hỗ trợ:</span>
                    <div className="space-y-1.5">
                      {lesson.exercise.hints.map((hint, idx) => (
                        <div key={idx} className="border border-noir-800 rounded-xl overflow-hidden bg-noir-950/60">
                          <button
                            onClick={() => setShowHintIndex(showHintIndex === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-2.5 text-xs text-slate-300 hover:text-noir-gold transition-colors text-left cursor-pointer"
                          >
                            <span className="font-semibold">Gợi ý #{idx + 1}</span>
                            {showHintIndex === idx ? (
                              <ChevronUp className="w-3.5 h-3.5 text-noir-accent" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                            )}
                          </button>
                          {showHintIndex === idx && (
                            <div className="p-3 bg-noir-900 border-t border-noir-800/60 text-xs text-amber-300 font-mono leading-relaxed whitespace-pre-wrap">
                              {hint}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View 3: Schema Details */}
            {((typeof window !== 'undefined' && window.innerWidth >= 1024 && activeDesktopTab === 'schema') ||
              (false)) && (
              <div className="bg-noir-900 border border-noir-800 rounded-2xl p-5 shadow-md space-y-4">
                <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm border-b border-noir-800 pb-2">
                  <Database className="w-4 h-4" />
                  <h2>Cấu Trúc Các Bảng Trong Bài</h2>
                </div>

                <div className="space-y-3">
                  {lesson.schemas.map((table) => (
                    <div key={table.name} className="border border-noir-800 rounded-xl overflow-hidden bg-noir-950/80">
                      <div className="p-3 bg-noir-850 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Table className="w-4 h-4 text-noir-accent" />
                          <span className="font-mono font-bold text-slate-100 text-xs">{table.name}</span>
                        </div>
                        <button
                          onClick={() => {
                            const sampleSql = `SELECT * FROM ${table.name} LIMIT 5;`;
                            setQuery(sampleSql);
                            databaseService.runQuery(sampleSql);
                          }}
                          className="text-[11px] text-sky-400 hover:text-sky-300 font-mono underline"
                        >
                          Xem mẫu dữ liệu
                        </button>
                      </div>
                      <div className="p-3 divide-y divide-noir-800/60 text-xs font-mono">
                        {table.columns.map((col) => (
                          <div key={col.name} className="py-1.5 flex items-center justify-between">
                            <span className="text-slate-200">{col.name}</span>
                            <span className="text-slate-500 text-[11px]">{col.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 4: Quizzes */}
            {lesson.quizzes &&
              lesson.quizzes.length > 0 &&
              ((typeof window !== 'undefined' && window.innerWidth >= 1024 && activeDesktopTab === 'quiz') ||
                (activeMobileTab === 'quiz')) && (
                <div className="bg-noir-900 border border-noir-800 rounded-2xl p-5 shadow-md space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm border-b border-noir-800 pb-2">
                    <HelpCircle className="w-4 h-4" />
                    <h2>Trắc Nghiệm Củng Cố Kiến Thức</h2>
                  </div>

                  <div className="space-y-4">
                    {lesson.quizzes.map((quiz, qIdx) => {
                      const selectedOpt = quizAnswers[qIdx];
                      const isAnswered = selectedOpt !== undefined;
                      const isCorrect = selectedOpt === quiz.answerIndex;

                      return (
                        <div key={qIdx} className="p-4 bg-noir-950/80 rounded-xl border border-noir-800 space-y-3">
                          <p className="text-xs sm:text-sm font-semibold text-slate-200">
                            Câu {qIdx + 1}: {quiz.question}
                          </p>
                          <div className="space-y-2">
                            {quiz.options.map((opt, optIdx) => (
                              <button
                                key={optIdx}
                                onClick={() =>
                                  setQuizAnswers((prev) => ({
                                    ...prev,
                                    [qIdx]: optIdx,
                                  }))
                                }
                                className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                                  selectedOpt === optIdx
                                    ? optIdx === quiz.answerIndex
                                      ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300 font-bold'
                                      : 'bg-rose-950/70 border-rose-600 text-rose-300 font-bold'
                                    : 'bg-noir-900 border-noir-800 text-slate-300 hover:border-noir-700'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                          {isAnswered && (
                            <div
                              className={`p-3 rounded-lg text-xs leading-relaxed ${
                                isCorrect
                                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                                  : 'bg-rose-950/40 text-rose-300 border border-rose-800/60'
                              }`}
                            >
                              <span className="font-bold block mb-1">
                                {isCorrect ? '✅ Chính xác!' : '❌ Chưa chính xác!'}
                              </span>
                              {quiz.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: SQL EDITOR + RESULTS & VERIFICATION (Desktop & Mobile) */}
        {/* ============================================================ */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            activeMobileTab === 'sql' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-noir-900 border border-noir-800 rounded-xl">
            <span className="text-xs text-slate-400 font-mono">
              CSDL Sandbox: <strong className="text-slate-200">{lesson.schemas[0]?.name}</strong>
            </span>

            <div className="flex items-center space-x-2">
              {/* Test Run button */}
              <button
                onClick={handleExecute}
                disabled={isExecuting || !isDbReady}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-noir-800 hover:bg-noir-750 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 font-semibold text-xs flex items-center space-x-1.5 border border-noir-700 transition-all cursor-pointer active:scale-95"
                title="Chạy thử câu lệnh SQL để xem dữ liệu"
              >
                <Play className="w-3.5 h-3.5 text-sky-400 fill-current" />
                <span>{isDbReady ? 'Chạy Thử' : 'Đang nạp...'}</span>
              </button>

              {/* Submit & Verify button */}
              <button
                onClick={handleVerify}
                disabled={isExecuting || !isDbReady}
                className="min-h-[40px] px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-noir-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer active:scale-95"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Nộp Bài Kiểm Tra</span>
              </button>
            </div>
          </div>

          {/* Verification Feedback Banner */}
          {verificationFeedback.status !== 'idle' && (
            <div
              className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
                verificationFeedback.status === 'success'
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                  : 'bg-rose-950/80 border-rose-600 text-rose-200'
              }`}
            >
              {verificationFeedback.status === 'success' ? (
                <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-sm font-bold">
                  {verificationFeedback.status === 'success'
                    ? '🎉 Chúc Mừng! Đáp Án Chính Xác (+ ' + lesson.xpReward + ' XP)'
                    : 'Chưa Trùng Khớp Với Đáp Án'}
                </h4>
                <p className="text-xs leading-relaxed">{verificationFeedback.message}</p>
                {verificationFeedback.status === 'success' && lesson.exercise.explanation && (
                  <p className="text-xs text-slate-300 font-sans pt-1 border-t border-emerald-800/60 mt-2">
                    💡 {lesson.exercise.explanation}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* NHÓM 3: CẦU NỐI PHÁ ÁN THỰC CHIẾN (DUAL-TRACK CASE BRIDGE) */}
          {relatedCase && onNavigateToCase && (
            <div className="bg-gradient-to-r from-noir-900 via-amber-950/30 to-noir-900 border border-noir-accent/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-noir-accent/15 border border-noir-accent/40 flex items-center justify-center text-noir-gold flex-shrink-0 mt-0.5">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-noir-accent/20 text-noir-gold border border-noir-accent/40 font-mono">
                      Cầu Nối Phá Án • {relatedCase.skillName}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 mt-1">
                    {relatedCase.casePitch}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-cinzel mt-0.5">
                    🎯 {relatedCase.caseTitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateToCase(relatedCase.caseId)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-noir-accent to-amber-500 hover:opacity-90 text-noir-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95 flex-shrink-0 cursor-pointer"
              >
                <span>Vào Phá Án Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* SQL Code Editor */}
          <SqlEditor
            query={query}
            onChangeQuery={setQuery}
            onExecute={handleExecute}
            queryHistory={queryHistory}
            isLoading={isExecuting}
            schemas={lesson.schemas}
          />

          {/* Result Table */}
          <QueryResultTable
            result={queryResult}
            lastExecutedQuery={lastExecutedQuery}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE BOTTOM NAVIGATION DOCK (Thumb Zone) */}
      {/* ============================================================ */}
      <nav
        aria-label="Điều hướng bài học trên di động"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-noir-900/95 backdrop-blur-md border-t border-noir-800 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(0,0,0,0.5)]"
      >
        <div className="grid grid-cols-4 px-2 py-1 max-w-md mx-auto">
          <button
            onClick={() => handleMobileTabSwitch('task')}
            className={`min-h-[50px] flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeMobileTab === 'task'
                ? 'text-noir-gold font-bold bg-noir-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeMobileTab === 'task' && (
              <span className="absolute top-0 w-8 h-0.5 bg-noir-accent rounded-full" />
            )}
            <Lightbulb className="w-4 h-4 mb-0.5 text-noir-accent" />
            <span className="text-[10px] tracking-tight">Đề Bài</span>
          </button>

          <button
            onClick={() => handleMobileTabSwitch('theory')}
            className={`min-h-[50px] flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeMobileTab === 'theory'
                ? 'text-sky-300 font-bold bg-noir-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeMobileTab === 'theory' && (
              <span className="absolute top-0 w-8 h-0.5 bg-sky-400 rounded-full" />
            )}
            <BookOpen className="w-4 h-4 mb-0.5 text-sky-400" />
            <span className="text-[10px] tracking-tight">Lý Thuyết</span>
          </button>

          <button
            onClick={() => handleMobileTabSwitch('sql')}
            className={`min-h-[50px] flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeMobileTab === 'sql'
                ? 'text-amber-300 font-bold bg-noir-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeMobileTab === 'sql' && (
              <span className="absolute top-0 w-8 h-0.5 bg-amber-400 rounded-full" />
            )}
            <Code2 className="w-4 h-4 mb-0.5 text-amber-400" />
            <span className="text-[10px] tracking-tight">SQL & Bảng</span>
          </button>

          <button
            onClick={() => handleMobileTabSwitch('quiz')}
            className={`min-h-[50px] flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
              activeMobileTab === 'quiz'
                ? 'text-emerald-300 font-bold bg-noir-800/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeMobileTab === 'quiz' && (
              <span className="absolute top-0 w-8 h-0.5 bg-emerald-400 rounded-full" />
            )}
            <HelpCircle className="w-4 h-4 mb-0.5 text-emerald-400" />
            <span className="text-[10px] tracking-tight">Trắc Nghiệm</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
