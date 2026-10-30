import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  CheckCircle2,
  UserCheck,
  Sparkles,
  Mail,
  User,
  GraduationCap,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { authService, AuthUser } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialRole?: 'admin' | 'learner';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'learner',
}) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'learner'>(initialRole);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (preset?: {
    role?: 'admin' | 'learner';
    email?: string;
    name?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const targetRole = preset?.role || selectedRole;
      const targetEmail = preset?.email || (customEmail.trim() ? customEmail.trim() : undefined);
      const targetName = preset?.name || (customName.trim() ? customName.trim() : undefined);

      const user = await authService.signInWithGoogle({
        role: targetRole,
        email: targetEmail,
        name: targetName,
      });

      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Main Container - Split-screen on desktop, clean single card on mobile */}
      <div className="relative w-full max-w-4xl bg-noir-900 border border-noir-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 z-10 max-h-[94vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-noir-800/80 hover:bg-noir-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer focus-ring"
          title="Đóng cửa sổ"
          aria-label="Đóng cửa sổ đăng nhập"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* LEFT COLUMN: BRANDING & BENEFITS (Desktop Only) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-noir-950 via-noir-900 to-noir-850 p-8 flex-col justify-between border-r border-noir-800/80 relative overflow-hidden">
          {/* Subtle ambient lighting */}
          <div
            className="absolute -top-16 -left-16 w-48 h-48 bg-noir-accent/15 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-16 -right-16 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div>
            <div className="flex items-center space-x-2.5 mb-6">
              <div
                className="w-10 h-10 rounded-xl bg-noir-800 border border-noir-accent/40 flex items-center justify-center text-noir-gold shadow-inner"
                aria-hidden="true"
              >
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-slate-100 text-lg tracking-wider">
                  SQL THÁM TỬ
                </h3>
                <span className="text-[10px] text-noir-accent uppercase tracking-widest font-mono">
                  Học Viện &amp; Phá Án
                </span>
              </div>
            </div>

            <h4 className="text-xl font-bold text-slate-100 leading-snug mb-3">
              Đồng bộ Tiến độ &amp; Khám phá Quyền năng Quản trị
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Lưu trữ an toàn chuỗi XP, danh hiệu thám tử và hồ sơ các vụ án đã phá đảo trên đám mây.
            </p>

            {/* Feature bullets */}
            <div className="space-y-3.5">
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Không mất tiến trình khi đổi thiết bị hoặc xóa cache</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Hỗ trợ phân quyền Quản trị viên (Admin Dashboard) tức thì</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Được cấp chứng nhận thám tử và vinh danh trên Bảng vàng</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-noir-800/80 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Phiên bản v2.0 Production</span>
            <span className="text-noir-gold">SQLite WebAssembly</span>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION & LOGIN OPTIONS */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          <div className="mb-5">
            <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-slate-100 mb-1">
              Đăng nhập tài khoản
            </h2>
            <p className="text-xs text-slate-400">
              Chọn cổng truy cập tức thì hoặc nhập Gmail cá nhân của bạn để tiếp tục.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-200"
            >
              {error}
            </div>
          )}

          {/* PRIMARY 1-CLICK ACTION BUTTONS */}
          <div className="space-y-3 mb-5">
            {/* 1. Vào Cổng Học Viên */}
            <button
              onClick={() => handleLogin({ role: 'learner' })}
              disabled={isLoading}
              className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-semibold text-xs flex items-center justify-center space-x-2.5 shadow-sm transition-transform active:scale-[0.99] cursor-pointer disabled:opacity-50 focus-ring"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
              <span>Tiếp tục với Google (Cổng Học Viên)</span>
            </button>

            {/* 2. Vào Cổng Quản Trị (Admin) */}
            <button
              onClick={() => handleLogin({ role: 'admin' })}
              disabled={isLoading}
              className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-noir-800 hover:bg-noir-750 text-noir-gold border border-noir-accent/40 font-semibold text-xs flex items-center justify-center space-x-2.5 transition-transform hover:border-noir-accent active:scale-[0.99] cursor-pointer disabled:opacity-50 focus-ring shadow"
            >
              <UserCheck className="w-4 h-4 text-noir-accent flex-shrink-0" aria-hidden="true" />
              <span>Đăng nhập Cổng Quản Trị (Admin Dashboard)</span>
            </button>
          </div>

          {/* DIVIDER */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-noir-800"></div>
            </div>
            <span className="relative px-3 bg-noir-900 text-[11px] text-slate-400 uppercase tracking-wider font-mono">
              hoặc đăng nhập với gmail cá nhân
            </span>
          </div>

          {/* CUSTOM ACCOUNT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-3.5 mb-4"
          >
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Tên hiển thị:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="VD: Thám tử Conan hoặc tên của bạn"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-noir-950 border border-noir-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Địa chỉ Gmail:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="VD: your_email@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-noir-950 border border-noir-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Vai trò truy cập:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('learner')}
                  className={`min-h-[40px] py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center space-x-1.5 transition-colors cursor-pointer focus-ring ${
                    selectedRole === 'learner'
                      ? 'bg-noir-800 border-noir-gold text-noir-gold shadow'
                      : 'bg-noir-950 border-noir-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>🎓 Học Viên</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`min-h-[40px] py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center space-x-1.5 transition-colors cursor-pointer focus-ring ${
                    selectedRole === 'admin'
                      ? 'bg-noir-800 border-sky-400 text-sky-400 shadow'
                      : 'bg-noir-950 border-noir-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>🛡️ Quản Trị Viên</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-noir-accent to-amber-600 hover:from-amber-400 hover:to-amber-500 text-noir-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/40 hover:shadow-noir-accent/30 transition-transform active:scale-95 cursor-pointer disabled:opacity-50 focus-ring"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-noir-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Xác Nhận Đăng Nhập Tài Khoản Này</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Security note */}
          <p className="text-[10px] text-center text-slate-500 pt-2">
            🔒 Bảo mật tiêu chuẩn Google Identity &amp; Supabase Cloud. Bằng việc đăng nhập, bạn đồng ý với Điều khoản Dịch vụ và Quy chế Học viện SQL Thám Tử.
          </p>
        </div>
      </div>
    </div>
  );
};
