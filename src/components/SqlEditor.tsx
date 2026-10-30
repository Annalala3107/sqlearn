import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  History,
  Code2,
  Copy,
  Check,
  Wand2,
  Table as TableIcon,
  Columns,
  KeyRound,
} from 'lucide-react';
import { TableSchema } from '../cases/types';

interface SqlEditorProps {
  query: string;
  onChangeQuery: (query: string) => void;
  onExecute: () => void;
  queryHistory: string[];
  isLoading?: boolean;
  schemas?: TableSchema[];
}

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
  'GROUP', 'ORDER', 'BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE',
  'DELETE', 'CREATE', 'TABLE', 'INTO', 'VALUES', 'SET', 'NOT', 'NULL',
  'AND', 'OR', 'IN', 'BETWEEN', 'LIKE', 'IS', 'AS', 'DISTINCT', 'ON',
  'ASC', 'DESC', 'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'WITH', 'OVER', 'PARTITION'
]);

const SQL_FUNCTIONS = new Set([
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND', 'SUBSTR', 'LENGTH',
  'LOWER', 'UPPER', 'COALESCE', 'DATE', 'DATETIME', 'STRFTIME',
  'RANK', 'DENSE_RANK', 'ROW_NUMBER', 'NTILE', 'LAG', 'LEAD'
]);

const AUTOCOMPLETE_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'INNER JOIN',
  'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'DISTINCT',
  'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
  'ON', 'ASC', 'DESC', 'UNION', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'WITH', 'OVER', 'PARTITION BY'
];

const AUTOCOMPLETE_FUNCTIONS = [
  'COUNT()', 'SUM()', 'AVG()', 'MIN()', 'MAX()', 'ROUND()',
  'COALESCE()', 'SUBSTR()', 'LENGTH()', 'LOWER()', 'UPPER()',
  'DATE()', 'STRFTIME()', 'RANK()', 'DENSE_RANK()', 'ROW_NUMBER()'
];

interface SuggestionItem {
  text: string;
  insertText: string;
  type: 'table' | 'column' | 'keyword' | 'function';
  detail?: string;
  cursorOffset?: number;
}

interface Token {
  type: 'keyword' | 'function' | 'string' | 'number' | 'comment' | 'punctuation' | 'text';
  value: string;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  query,
  onChangeQuery,
  onExecute,
  queryHistory,
  isLoading = false,
  schemas = [],
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popupCoords, setPopupCoords] = useState<{ top: number; left: number }>({ top: 30, left: 16 });

  // Sync scroll from textarea to highlighting backdrop
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Extract the word immediately preceding the cursor
  const getWordBeforeCursor = useCallback((text: string, pos: number) => {
    const textBefore = text.slice(0, pos);
    const match = textBefore.match(/([a-zA-Z0-9_À-ỹ]+)$/);
    if (!match) return { word: '', start: pos, end: pos };
    return {
      word: match[1],
      start: pos - match[1].length,
      end: pos,
    };
  }, []);

  // Update suggestions based on text and cursor position
  const updateSuggestions = useCallback(
    (currentText: string, cursorPosition: number) => {
      const { word } = getWordBeforeCursor(currentText, cursorPosition);
      if (!word || word.trim().length === 0) {
        setShowSuggestions(false);
        return;
      }

      const lower = word.toLowerCase();
      const candidates: SuggestionItem[] = [];
      const seen = new Set<string>();

      // 1. Database Tables from schemas
      schemas.forEach((s) => {
        if (s.name.toLowerCase().includes(lower)) {
          const key = `table:${s.name}`;
          if (!seen.has(key)) {
            seen.add(key);
            candidates.push({
              text: s.name,
              insertText: `${s.name} `,
              type: 'table',
              detail: s.description || 'Bảng CSDL',
            });
          }
        }
      });

      // 2. Database Columns from schemas
      schemas.forEach((s) => {
        s.columns.forEach((c) => {
          if (c.name.toLowerCase().includes(lower)) {
            const key = `col:${s.name}.${c.name}`;
            if (!seen.has(key)) {
              seen.add(key);
              candidates.push({
                text: c.name,
                insertText: `${c.name} `,
                type: 'column',
                detail: `${s.name}.${c.name} (${c.type})`,
              });
            }
          }
        });
      });

      // 3. SQL Keywords
      AUTOCOMPLETE_KEYWORDS.forEach((kw) => {
        if (kw.toLowerCase().includes(lower) && kw.toLowerCase() !== lower) {
          const key = `kw:${kw}`;
          if (!seen.has(key)) {
            seen.add(key);
            candidates.push({
              text: kw,
              insertText: `${kw} `,
              type: 'keyword',
              detail: 'Từ khóa SQL',
            });
          }
        }
      });

      // 4. SQL Functions
      AUTOCOMPLETE_FUNCTIONS.forEach((fn) => {
        if (fn.toLowerCase().includes(lower)) {
          const key = `fn:${fn}`;
          if (!seen.has(key)) {
            seen.add(key);
            candidates.push({
              text: fn,
              insertText: fn,
              type: 'function',
              detail: 'Hàm SQL',
              cursorOffset: -1, // Place cursor inside parenthesis
            });
          }
        }
      });

      if (candidates.length === 0) {
        setShowSuggestions(false);
        return;
      }

      // Sort: items starting with query prefix come first, then tables & columns prioritized
      candidates.sort((a, b) => {
        const aStarts = a.text.toLowerCase().startsWith(lower) ? 0 : 1;
        const bStarts = b.text.toLowerCase().startsWith(lower) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;

        const typeOrder: Record<string, number> = { table: 1, column: 2, keyword: 3, function: 4 };
        return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
      });

      // Calculate approximate position of cursor in monospace font
      const textarea = textareaRef.current;
      if (textarea) {
        const textBefore = currentText.slice(0, cursorPosition);
        const lines = textBefore.split('\n');
        const lineIndex = lines.length - 1;
        const colIndex = lines[lineIndex].length;
        const charWidth = 8.4;
        const lineHeight = 22;
        const scrollTop = textarea.scrollTop || 0;
        const scrollLeft = textarea.scrollLeft || 0;

        const padding = 16;
        let top = (lineIndex + 1) * lineHeight + padding - scrollTop + 6;
        let left = colIndex * charWidth + padding - scrollLeft;

        const maxLeft = (textarea.parentElement?.clientWidth || 500) - 300;
        left = Math.max(12, Math.min(left, Math.max(12, maxLeft)));

        const editorHeight = textarea.clientHeight || 200;
        if (top + 180 > editorHeight && top > 180) {
          top = lineIndex * lineHeight + padding - scrollTop - 190;
        }
        top = Math.max(8, top);

        setPopupCoords({ top, left });
      }

      setSuggestions(candidates.slice(0, 8));
      setSelectedSuggestionIndex(0);
      setShowSuggestions(true);
    },
    [schemas, getWordBeforeCursor]
  );

  // Apply a selected suggestion
  const applySuggestion = useCallback(
    (item: SuggestionItem) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const { start, end } = getWordBeforeCursor(query, cursorPos);

      const textBefore = query.slice(0, start);
      const textAfter = query.slice(end);

      const newQuery = (textBefore + item.insertText + textAfter).slice(0, 5000);
      onChangeQuery(newQuery);

      const targetCursor = Math.min(5000, start + item.insertText.length + (item.cursorOffset ?? 0));
      setShowSuggestions(false);

      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(targetCursor, targetCursor);
        }
      });
    },
    [query, onChangeQuery, getWordBeforeCursor]
  );

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter & Autocomplete navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Run Query: Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      setShowSuggestions(false);
      onExecute();
      return;
    }

    // 2. Suggestion Box Navigation
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        applySuggestion(suggestions[selectedSuggestionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }

    // 3. Tab Indentation when suggestions closed
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const next = query.substring(0, start) + '  ' + query.substring(end);
      onChangeQuery(next);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 5000);
    const cursorPos = Math.min(5000, e.target.selectionStart);
    onChangeQuery(val);
    updateSuggestions(val, cursorPos);
  };

  const handleCursorActivity = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      updateSuggestions(query, textarea.selectionStart);
    }
  };

  const insertSnippet = (snippet: string) => {
    setShowSuggestions(false);
    const textarea = textareaRef.current;
    if (!textarea) {
      onChangeQuery((query ? `${query}\n${snippet}` : snippet).slice(0, 5000));
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textBefore = query.substring(0, start);
    const textAfter = query.substring(end);
    const newQuery = `${textBefore}${snippet}${textAfter}`.slice(0, 5000);
    onChangeQuery(newQuery);

    setTimeout(() => {
      textarea.focus();
      const cursorPosition = Math.min(5000, start + snippet.length);
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 10);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  // Format SQL keywords to UPPERCASE
  const handleFormat = () => {
    setShowSuggestions(false);
    let formatted = query;
    SQL_KEYWORDS.forEach((kw) => {
      const reg = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(reg, kw);
    });
    SQL_FUNCTIONS.forEach((fn) => {
      const reg = new RegExp(`\\b${fn}\\b(?=\\s*\\()`, 'gi');
      formatted = formatted.replace(reg, fn);
    });
    onChangeQuery(formatted);
  };

  // Tokenize query for real-time syntax highlighting
  const tokens = useMemo<Token[]>(() => {
    const result: Token[] = [];
    let remaining = query;

    while (remaining.length > 0) {
      // 1. Comments (-- ...)
      const commentMatch = remaining.match(/^(--[^\n]*)/);
      if (commentMatch) {
        result.push({ type: 'comment', value: commentMatch[0] });
        remaining = remaining.slice(commentMatch[0].length);
        continue;
      }

      // 2. String literals ('...' or "...")
      const stringMatch = remaining.match(/^('([^'\\]|\\.)*'|"([^"\\]|\\.)*")/);
      if (stringMatch) {
        result.push({ type: 'string', value: stringMatch[0] });
        remaining = remaining.slice(stringMatch[0].length);
        continue;
      }

      // 3. Numbers
      const numberMatch = remaining.match(/^(\b\d+(\.\d+)?\b)/);
      if (numberMatch) {
        result.push({ type: 'number', value: numberMatch[0] });
        remaining = remaining.slice(numberMatch[0].length);
        continue;
      }

      // 4. Identifiers & Keywords
      const wordMatch = remaining.match(/^([a-zA-Z_À-ỹ][a-zA-Z0-9_À-ỹ]*)/);
      if (wordMatch) {
        const word = wordMatch[0];
        const upper = word.toUpperCase();

        if (SQL_KEYWORDS.has(upper)) {
          result.push({ type: 'keyword', value: word });
        } else if (SQL_FUNCTIONS.has(upper)) {
          result.push({ type: 'function', value: word });
        } else {
          result.push({ type: 'text', value: word });
        }
        remaining = remaining.slice(word.length);
        continue;
      }

      // 5. Punctuation
      const punctMatch = remaining.match(/^([(),;=<>!+*/-])/);
      if (punctMatch) {
        result.push({ type: 'punctuation', value: punctMatch[0] });
        remaining = remaining.slice(punctMatch[0].length);
        continue;
      }

      // 6. Whitespace and other characters
      result.push({ type: 'text', value: remaining[0] });
      remaining = remaining.slice(1);
    }

    return result;
  }, [query]);

  useEffect(() => {
    handleScroll();
  }, [query]);

  return (
    <div className="bg-noir-900 border border-noir-800 rounded-xl overflow-hidden shadow-xl flex flex-col transition-all">
      {/* Editor Top Toolbar */}
      <div className="px-4 py-2.5 bg-noir-850 border-b border-noir-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-noir-gold font-bold text-sm">
          <Code2 className="w-4 h-4 text-noir-accent" />
          <span>Trình Soạn Thảo SQL (Có Gợi Ý & Tô Màu Cú Pháp)</span>
        </div>

        {/* Utilities Bar */}
        <div className="flex items-center space-x-1.5">
          {/* Format button */}
          <button
            onClick={handleFormat}
            className="flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg bg-noir-800 hover:bg-noir-750 text-slate-300 border border-noir-700 hover:border-noir-accent/40 transition-colors"
            title="Chuẩn hóa chữ hoa các từ khóa SQL"
          >
            <Wand2 className="w-3.5 h-3.5 text-noir-accent" />
            <span className="hidden sm:inline">Định dạng</span>
          </button>

          {/* Copy query button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg bg-noir-800 hover:bg-noir-750 text-slate-300 border border-noir-700 hover:border-noir-accent/40 transition-colors"
            title="Sao chép toàn bộ câu lệnh"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 hidden sm:inline">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Sao chép</span>
              </>
            )}
          </button>

          {/* Query History dropdown */}
          {queryHistory.length > 0 && (
            <div className="relative group">
              <button
                type="button"
                className="flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg bg-noir-800 hover:bg-noir-750 text-slate-300 border border-noir-700 transition-colors"
                title="Lịch sử các câu lệnh vừa chạy"
              >
                <History className="w-3.5 h-3.5 text-noir-accent" />
                <span className="hidden sm:inline">Lịch sử ({queryHistory.length})</span>
              </button>
              <div className="absolute right-0 mt-1 w-80 max-h-64 overflow-y-auto bg-noir-900 border border-noir-700 rounded-xl shadow-2xl p-1 z-50 hidden group-hover:block divide-y divide-noir-800/80">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase font-mono">
                  Lịch sử truy vấn
                </div>
                {queryHistory.slice(0, 10).map((hist, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onChangeQuery(hist);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left p-2.5 hover:bg-noir-800 text-xs text-slate-300 font-mono truncate rounded-lg transition-colors"
                  >
                    {hist}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear button */}
          <button
            onClick={() => {
              onChangeQuery('');
              setShowSuggestions(false);
            }}
            className="flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg hover:bg-noir-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Xóa trắng nội dung soạn thảo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xóa</span>
          </button>
        </div>
      </div>

      {/* Snippet Quick Bar */}
      <div className="px-4 py-2 bg-noir-950/80 border-b border-noir-800/80 flex items-center space-x-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-slate-500 font-semibold flex items-center flex-shrink-0 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 mr-1 text-noir-accent" /> Chèn nhanh:
        </span>
        <button
          onClick={() => insertSnippet('SELECT * FROM ')}
          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-noir-850 hover:bg-noir-800 text-amber-300 font-mono font-medium border border-noir-750 flex-shrink-0 transition-colors active:scale-95"
        >
          SELECT *
        </button>
        <button
          onClick={() => insertSnippet("WHERE ... LIKE '%...%'")}
          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-noir-850 hover:bg-noir-800 text-emerald-300 font-mono font-medium border border-noir-750 flex-shrink-0 transition-colors active:scale-95"
        >
          WHERE LIKE
        </button>
        <button
          onClick={() => insertSnippet('JOIN ... ON ... = ...')}
          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-noir-850 hover:bg-noir-800 text-sky-300 font-mono font-medium border border-noir-750 flex-shrink-0 transition-colors active:scale-95"
        >
          JOIN ON
        </button>
        <button
          onClick={() => insertSnippet('GROUP BY ... HAVING ...')}
          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-noir-850 hover:bg-noir-800 text-purple-300 font-mono font-medium border border-noir-750 flex-shrink-0 transition-colors active:scale-95"
        >
          GROUP BY
        </button>
        <button
          onClick={() => insertSnippet('ORDER BY ... DESC')}
          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-noir-850 hover:bg-noir-800 text-rose-300 font-mono font-medium border border-noir-750 flex-shrink-0 transition-colors active:scale-95"
        >
          ORDER BY
        </button>
      </div>

      {/* Editor Container with Overlay Syntax Highlighting & Autocomplete */}
      <div className="relative bg-noir-950 min-h-[160px] sm:min-h-[180px] flex-1">
        {/* Layer 1: Colored Syntax Highlighted Backdrop */}
        <div
          ref={highlightRef}
          aria-hidden="true"
          className="absolute inset-0 p-3.5 sm:p-4 font-mono text-base sm:text-sm leading-[24px] sm:leading-[22px] whitespace-pre-wrap break-words overflow-auto pointer-events-none select-none"
        >
          {query ? (
            tokens.map((tok, idx) => {
              switch (tok.type) {
                case 'keyword':
                  return (
                    <span key={idx} className="text-amber-400 font-bold">
                      {tok.value}
                    </span>
                  );
                case 'function':
                  return (
                    <span key={idx} className="text-sky-400 font-semibold">
                      {tok.value}
                    </span>
                  );
                case 'string':
                  return (
                    <span key={idx} className="text-emerald-400">
                      {tok.value}
                    </span>
                  );
                case 'number':
                  return (
                    <span key={idx} className="text-purple-400 font-semibold">
                      {tok.value}
                    </span>
                  );
                case 'comment':
                  return (
                    <span key={idx} className="text-slate-400 italic">
                      {tok.value}
                    </span>
                  );
                case 'punctuation':
                  return (
                    <span key={idx} className="text-slate-400 font-bold">
                      {tok.value}
                    </span>
                  );
                default:
                  return (
                    <span key={idx} className="text-slate-100">
                      {tok.value}
                    </span>
                  );
              }
            })
          ) : (
            <span className="text-slate-600 font-mono">
              -- Nhập câu lệnh SQL tại đây... (Ví dụ: SELECT * FROM hien_truong;)
            </span>
          )}
        </div>

        {/* Layer 2: Transparent Interactive Textarea with Matching Typography */}
        <textarea
          ref={textareaRef}
          value={query}
          onChange={handleTextChange}
          onClick={handleCursorActivity}
          onKeyUp={handleCursorActivity}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          maxLength={5000}
          className="relative z-10 w-full h-full min-h-[160px] sm:min-h-[180px] p-3.5 sm:p-4 bg-transparent text-transparent caret-amber-400 font-mono text-base sm:text-sm leading-[24px] sm:leading-[22px] whitespace-pre-wrap break-words resize-y focus:outline-none placeholder-transparent"
          style={{ caretColor: '#f59e0b' }}
        />

        {/* Layer 3: Autocomplete Suggestions Dropdown Popup */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            style={{
              top: `${popupCoords.top}px`,
              left: `${popupCoords.left}px`,
            }}
            className="absolute z-30 w-72 sm:w-80 max-h-60 overflow-y-auto rounded-xl bg-noir-900/95 backdrop-blur-md border border-noir-700 shadow-2xl ring-1 ring-noir-accent/30 flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Header info */}
            <div className="px-3 py-1.5 border-b border-noir-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center space-x-1 text-noir-gold font-bold">
                <Sparkles className="w-3 h-3 text-noir-accent" />
                <span>GỢI Ý SQL & LƯỢC ĐỒ</span>
              </span>
              <span>↑↓ chọn, Tab/Enter</span>
            </div>

            {/* List */}
            <div className="py-1 divide-y divide-noir-800/40">
              {suggestions.map((item, idx) => {
                const isSelected = idx === selectedSuggestionIndex;
                return (
                  <button
                    key={`${item.type}-${item.text}-${idx}`}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      applySuggestion(item);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between space-x-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-noir-800/90 text-amber-300 border-l-2 border-noir-accent pl-2.5'
                        : 'text-slate-200 hover:bg-noir-850'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      {item.type === 'table' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-400 border border-sky-800/60 font-mono flex-shrink-0 flex items-center space-x-1">
                          <TableIcon className="w-2.5 h-2.5" />
                          <span>BẢNG</span>
                        </span>
                      )}
                      {item.type === 'column' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/60 font-mono flex-shrink-0 flex items-center space-x-1">
                          <Columns className="w-2.5 h-2.5" />
                          <span>CỘT</span>
                        </span>
                      )}
                      {item.type === 'keyword' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/60 font-mono flex-shrink-0 flex items-center space-x-1">
                          <KeyRound className="w-2.5 h-2.5" />
                          <span>SQL</span>
                        </span>
                      )}
                      {item.type === 'function' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono flex-shrink-0 flex items-center space-x-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>HÀM</span>
                        </span>
                      )}

                      <span className="font-mono text-xs font-semibold truncate text-slate-100">
                        {item.text}
                      </span>
                    </div>

                    {item.detail && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px] font-mono text-right flex-shrink-0">
                        {item.detail}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-noir-850 border-t border-noir-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-xs text-slate-400 font-mono flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5">
            <span>Phím tắt:</span>
            <kbd className="px-1.5 py-0.5 bg-noir-800 rounded border border-noir-700 text-noir-gold font-bold">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 bg-noir-800 rounded border border-noir-700 text-noir-gold font-bold">Enter</kbd>
            <span>để thực thi</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {query.length}/5000 ký tự
          </span>
        </div>

        <button
          onClick={onExecute}
          disabled={isLoading}
          className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-noir-accent to-amber-600 hover:from-amber-400 hover:to-amber-500 text-noir-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/40 hover:shadow-noir-accent/30 transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current flex-shrink-0" />
          <span>
            {isLoading
              ? 'Đang thực thi...'
              : 'Chạy Truy Vấn'}
            <span className="hidden sm:inline"> (Ctrl + Enter)</span>
          </span>
        </button>
      </div>
    </div>
  );
};
