import React from 'react';
import { Shield, Award, FolderKanban, RotateCcw } from 'lucide-react';
import { UserStats } from '../cases/types';
import { getRankFromXp } from '../cases';

interface NavbarProps {
  stats: UserStats;
  currentCaseTitle?: string;
  onBackToCases: () => void;
  onResetStats: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  currentCaseTitle,
  onBackToCases,
  onResetStats,
}) => {
  const rank = getRankFromXp(stats.xp);
  const completedCount = Object.values(stats.completedCases).filter((c) => c.completed).length;

  return (
    <header className="border-b border-noir-800 bg-noir-900/95 backdrop-blur-md sticky top-0 z-40 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Brand / Home Link */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            onClick={onBackToCases}
            className="flex items-center space-x-2 sm:space-x-3 group text-left focus:outline-none min-h-[44px] cursor-pointer"
            title="Quay về danh sách vụ án"
            aria-label="Quay về trang chủ SQL Thám Tử"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-noir-800 to-noir-900 border border-noir-accent/40 flex items-center justify-center text-noir-accent shadow-inner group-hover:border-noir-accent transition-colors flex-shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-noir-gold" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-cinzel font-bold text-base sm:text-lg text-slate-100 tracking-wider group-hover:text-noir-gold transition-colors truncate">
                  SQL THÁM TỬ
                </span>
                <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider bg-noir-accent/20 text-noir-gold border border-noir-accent/30 flex-shrink-0">
                  NOIR VN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Học SQL qua điều tra vụ án hình sự
              </p>
            </div>
          </button>

          {currentCaseTitle && (
            <div className="hidden lg:flex items-center space-x-2 pl-4 border-l border-noir-800 min-w-0">
              <FolderKanban className="w-4 h-4 text-noir-accent flex-shrink-0" />
              <span className="text-xs text-slate-400 flex-shrink-0">Hồ sơ:</span>
              <span className="text-sm font-medium text-slate-200 truncate max-w-xs">
                {currentCaseTitle}
              </span>
            </div>
          )}
        </div>

        {/* Right: Detective Rank & Stats */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* XP & Rank pill */}
          <div className="flex items-center bg-noir-850 border border-noir-700/80 rounded-full px-2.5 sm:px-3 py-1 shadow-sm space-x-1.5 sm:space-x-2.5">
            <div className="flex items-center space-x-1 text-noir-gold">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-noir-accent" />
              <span className="text-xs font-bold font-mono">{stats.xp} XP</span>
            </div>
            <div className="h-3 w-px bg-noir-700" />
            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-300 font-medium hidden md:inline">
                {rank.title}
              </span>
              <span className="text-xs">{rank.badge}</span>
            </div>
          </div>

          {/* Cases solved count (Desktop) */}
          <div className="hidden sm:flex items-center text-xs text-slate-400 bg-noir-850/60 px-2.5 py-1 rounded-full border border-noir-800">
            <span>Đã phá:</span>
            <span className="font-bold text-noir-accent ml-1 font-mono">
              {completedCount} vụ
            </span>
          </div>

          {/* Reset progress button with full 44x44px touch area */}
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn đặt lại toàn bộ điểm kinh nghiệm và lịch sử phá án?')) {
                onResetStats();
              }
            }}
            className="w-10 h-10 min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-noir-800 rounded-xl transition-colors active:scale-95 cursor-pointer"
            title="Đặt lại tiến độ"
            aria-label="Đặt lại tiến độ học tập"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
