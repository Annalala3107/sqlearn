import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Award,
  FolderKanban,
  RotateCcw,
  GraduationCap,
  Briefcase,
  BookOpen,
  LogOut,
  Cloud,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';
import { UserStats } from '../cases/types';
import { getRankFromXp } from '../cases';
import { AuthUser } from '../services/authService';

interface NavbarProps {
  stats: UserStats;
  currentMode: 'cases' | 'academy' | 'admin';
  onChangeMode: (mode: 'cases' | 'academy' | 'admin') => void;
  currentCaseTitle?: string;
  currentLessonTitle?: string;
  onBackToHome: () => void;
  onResetStats: () => void;
  onOpenGuide: () => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSyncCloud: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  currentMode,
  onChangeMode,
  currentCaseTitle,
  currentLessonTitle,
  onBackToHome,
  onResetStats,
  onOpenGuide,
  currentUser,
  onOpenAuth,
  onLogout,
  onSyncCloud,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const rank = getRankFromXp(stats.xp);
  const activeTitle = currentMode === 'cases' ? currentCaseTitle : currentLessonTitle;

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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

        {/* Center: Mode Switcher (Phá Án vs Học Viện vs Quản Trị) */}
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

          {/* Admin shortcut if logged in as admin */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onChangeMode('admin')}
              className={`min-h-[36px] px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentMode === 'admin'
                  ? 'bg-noir-800 text-emerald-400 shadow border border-noir-700/80 font-bold'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="hidden sm:inline">Quản Trị</span>
            </button>
          )}
        </div>

        {/* Right: User Google Auth & Guide Button & XP Stats */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
          {/* Guide / Manual Button */}
          <button
            onClick={onOpenGuide}
            className="min-h-[36px] px-2 sm:px-3 py-1.5 rounded-xl bg-noir-850 hover:bg-noir-800 text-slate-300 hover:text-noir-gold border border-noir-750 transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer relative shadow-sm active:scale-95"
            title="Mở Sổ tay tân thủ & Hướng dẫn sử dụng"
            aria-label="Mở Sổ tay tân thủ & Hướng dẫn sử dụng"
          >
            <BookOpen className="w-3.5 h-3.5 text-noir-accent flex-shrink-0" />
            <span className="hidden sm:inline">Hướng Dẫn</span>
          </button>

          {/* XP & Rank pill */}
          <div className="hidden sm:flex items-center bg-noir-850 border border-noir-700/80 rounded-full px-2.5 sm:px-3 py-1 shadow-sm space-x-1.5">
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

          {/* GOOGLE AUTHENTICATION WIDGET (Bước 1 & Bước 2) */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1.5 bg-noir-850 hover:bg-noir-800 border border-noir-750 p-1 sm:px-2.5 sm:py-1 rounded-full transition-all cursor-pointer active:scale-95"
                title={`Tài khoản: ${currentUser.name}`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-noir-accent/80"
                />
                <span className="text-xs font-medium text-slate-200 hidden md:inline max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-noir-900 border border-noir-700 rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn space-y-2">
                  <div className="px-2 py-1.5 border-b border-noir-800">
                    <div className="font-bold text-xs text-slate-100 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate font-mono">
                      {currentUser.email}
                    </div>
                    <div className="mt-1.5 flex items-center space-x-1.5">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                          currentUser.role === 'admin'
                            ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {currentUser.role === 'admin' ? '🛡️ Quản Trị Viên' : '🎓 Học Viên'}
                      </span>
                      <span className="text-[10px] text-slate-500">• {stats.xp} XP</span>
                    </div>
                  </div>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onChangeMode('admin');
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl bg-noir-800/80 hover:bg-noir-750 text-sky-300 hover:text-sky-200 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Mở Cổng Quản Trị (Admin)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onSyncCloud();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-noir-800 text-slate-300 hover:text-white text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Cloud className="w-3.5 h-3.5 text-noir-accent" />
                    <span>Đồng bộ tiến trình Cloud</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-rose-950/30 text-rose-400 hover:text-rose-300 text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất an toàn</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Button: Đăng nhập Google 1 chạm (Bước 3: Tối ưu Mobile-First) */
            <button
              onClick={onOpenAuth}
              className="min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Đăng nhập tài khoản Google"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden xs:inline">Đăng Nhập</span>
            </button>
          )}

          {/* Reset progress button */}
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
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-noir-800 rounded-xl transition-colors active:scale-95 cursor-pointer"
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
