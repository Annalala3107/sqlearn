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
    <header className="border-b border-noir-800 bg-noir-900/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand / Home Link */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToCases}
            className="flex items-center space-x-3 group text-left focus:outline-none"
            title="Quay về danh sách vụ án"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-noir-800 to-noir-900 border border-noir-accent/40 flex items-center justify-center text-noir-accent shadow-inner group-hover:border-noir-accent transition-colors">
              <Shield className="w-5 h-5 text-noir-gold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-cinzel font-bold text-lg text-slate-100 tracking-wider group-hover:text-noir-gold transition-colors">
                  SQL THÁM TỬ
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider bg-noir-accent/20 text-noir-gold border border-noir-accent/30">
                  NOIR VN
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans hidden sm:block">
                Học SQL qua điều tra vụ án hình sự
              </p>
            </div>
          </button>

          {currentCaseTitle && (
            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-noir-800">
              <FolderKanban className="w-4 h-4 text-noir-accent" />
              <span className="text-xs text-slate-400">Hồ sơ đang mở:</span>
              <span className="text-sm font-medium text-slate-200 truncate max-w-xs">
                {currentCaseTitle}
              </span>
            </div>
          )}
        </div>

        {/* Right: Detective Rank & Stats */}
        <div className="flex items-center space-x-4">
          {/* XP & Rank pill */}
          <div className="flex items-center bg-noir-850 border border-noir-700/80 rounded-full px-3 py-1.5 shadow-sm space-x-2.5">
            <div className="flex items-center space-x-1 text-noir-gold">
              <Award className="w-4 h-4 text-noir-accent" />
              <span className="text-xs font-bold font-mono">{stats.xp} XP</span>
            </div>
            <div className="h-3 w-px bg-noir-700" />
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                {rank.title}
              </span>
              <span className="text-xs">{rank.badge}</span>
            </div>
          </div>

          {/* Cases solved count */}
          <div className="hidden lg:flex items-center text-xs text-slate-400 bg-noir-850/60 px-3 py-1.5 rounded-full border border-noir-800">
            <span>Đã phá:</span>
            <span className="font-bold text-noir-accent ml-1 font-mono">
              {completedCount} vụ
            </span>
          </div>

          {/* Reset progress button */}
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn đặt lại toàn bộ điểm kinh nghiệm và lịch sử phá án?')) {
                onResetStats();
              }
            }}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-noir-800 rounded-lg transition-colors"
            title="Đặt lại tiến độ"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
