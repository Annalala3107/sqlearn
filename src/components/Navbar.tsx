import React from 'react';
import {
  Shield,
  Award,
  FolderKanban,
  RotateCcw,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { UserStats } from '../cases/types';
import { getRankFromXp } from '../cases';

interface NavbarProps {
  stats: UserStats;
  currentMode: 'cases' | 'academy';
  onChangeMode: (mode: 'cases' | 'academy') => void;
  currentCaseTitle?: string;
  currentLessonTitle?: string;
  onBackToHome: () => void;
  onResetStats: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  currentMode,
  onChangeMode,
  currentCaseTitle,
  currentLessonTitle,
  onBackToHome,
  onResetStats,
}) => {
  const rank = getRankFromXp(stats.xp);
  const activeTitle = currentMode === 'cases' ? currentCaseTitle : currentLessonTitle;

  return (
    <header className="border-b border-noir-800 bg-noir-900/95 backdrop-blur-md sticky top-0 z-40 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Brand / Home Link */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 sm:space-x-3 group text-left focus:outline-none min-h-[44px] cursor-pointer"
            title="Quay về trang chủ"
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
                  VN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Học SQL qua điều tra vụ án & Học viện tương tác
              </p>
            </div>
          </button>

          {activeTitle && (
            <div className="hidden xl:flex items-center space-x-1.5 pl-3 border-l border-noir-800 text-xs text-slate-400 min-w-0">
              {currentMode === 'cases' ? (
                <FolderKanban className="w-3.5 h-3.5 text-noir-accent flex-shrink-0" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
              )}
              <span className="truncate max-w-xs text-slate-300 font-medium">
                {activeTitle}
              </span>
            </div>
          )}
        </div>

        {/* Center: Mode Switcher (Vụ Án vs Học Viện) */}
        <div className="flex items-center bg-noir-950 p-1 rounded-xl border border-noir-800 shadow-inner">
          <button
            onClick={() => onChangeMode('cases')}
            className={`min-h-[36px] px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              currentMode === 'cases'
                ? 'bg-noir-800 text-noir-gold shadow border border-noir-700/80 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-noir-accent flex-shrink-0" />
            <span className="hidden xs:inline">Phá Án</span>
            <span className="xs:hidden">Án</span>
          </button>

          <button
            onClick={() => onChangeMode('academy')}
            className={`min-h-[36px] px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              currentMode === 'academy'
                ? 'bg-noir-800 text-sky-300 shadow border border-noir-700/80 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span className="hidden xs:inline">Học Viện SQL</span>
            <span className="xs:hidden">Học</span>
          </button>
        </div>

        {/* Right: Detective Rank & Stats */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
          {/* XP & Rank pill */}
          <div className="flex items-center bg-noir-850 border border-noir-700/80 rounded-full px-2 sm:px-3 py-1 shadow-sm space-x-1.5">
            <div className="flex items-center space-x-1 text-noir-gold">
              <Award className="w-3.5 h-3.5 text-noir-accent" />
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

          {/* Reset progress button with full 44x44px touch area */}
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Bạn có chắc muốn đặt lại toàn bộ điểm kinh nghiệm và tiến trình học?'
                )
              ) {
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
