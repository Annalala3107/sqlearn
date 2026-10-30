import React, { useState } from 'react';
import {
  X,
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogIn,
  UserPlus,
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
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Mật khẩu bảo mật phải có ít nhất 6 ký tự.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không trùng khớp.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'signin') {
        const user = await authService.signInWithEmail(email, password);
        onLoginSuccess(user);
        onClose();
      } else {
        const user = await authService.signUpWithEmail(email, password, name);
        setSuccessMessage('Đăng ký tài khoản thám tử thành công!');
        setTimeout(() => {
          onLoginSuccess(user);
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra trong quá trình xác thực.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.signInWithGoogleOAuth();
      // On success, redirect or user listener will trigger
    } catch (err: any) {
      setError(err?.message || 'Không thể kết nối với tài khoản Google.');
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
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-4xl bg-noir-900 border border-noir-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 z-10 max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-noir-800/80 hover:bg-noir-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer focus-ring"
          title="Đóng cửa sổ"
          aria-label="Đóng cửa sổ đăng nhập"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* LEFT COLUMN: BRANDING & DETECTIVE BADGE */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-noir-950 via-noir-900 to-noir-850 p-8 flex-col justify-between border-r border-noir-800/80 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-noir-accent/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div>
            <div className="flex items-center space-x-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-noir-800 border border-noir-accent/40 flex items-center justify-center text-noir-gold shadow-inner" aria-hidden="true">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-slate-100 text-lg tracking-wider">
                  SQL THÁM TỬ
                </h3>
                <span className="text-[10px] text-noir-accent uppercase tracking-widest font-mono">
                  Hồ Sơ Danh Tính Thám Tử
                </span>
              </div>
            </div>

            <h4 className="text-xl font-bold text-slate-100 leading-snug mb-3 text-balance">
              {mode === 'signin' ? 'Tiếp Tục Hành Trình Phá Án' : 'Gia Nhập Lực Lượng Thám Tử Số'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 text-pretty">
              Đăng nhập tài khoản để bảo toàn số điểm kinh nghiệm XP, bảng vàng thành tích và quyền truy cập Cổng Quản Trị.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Lưu trữ tiến trình 30 chuyên án và 20 bài học vĩnh viễn</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Bảo mật dữ liệu đám mây chuẩn quốc tế Supabase & PostgreSQL</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Phân quyền Quản Trị Viên (Admin) an toàn và riêng biệt</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-noir-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-noir-accent" aria-hidden="true" />
              <span>Bảo mật Supabase Auth</span>
            </span>
            <span className="text-slate-400 font-mono">v2.0 Production</span>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN / REGISTER FORM */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-noir-900/90 overflow-y-auto">
          {/* Tabs Switcher: Đăng Nhập vs Đăng Ký */}
          <div className="flex items-center bg-noir-950 p-1 rounded-xl border border-noir-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 min-h-[38px] rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                mode === 'signin'
                  ? 'bg-noir-800 text-noir-gold shadow border border-noir-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Đăng Nhập</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 min-h-[38px] rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'bg-noir-800 text-sky-300 shadow border border-noir-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Đăng Ký Mới</span>
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-4">
            <h3 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              {mode === 'signin' ? 'Chào mừng bạn trở lại' : 'Tạo hồ sơ thám tử mới'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'signin'
                ? 'Nhập email và mật khẩu của bạn để truy cập hệ thống'
                : 'Đăng ký tài khoản để bắt đầu rèn luyện tư duy SQL qua các vụ án'}
            </p>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-300 text-xs" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-emerald-300 text-xs" role="status">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Main Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Tên Thám Tử / Biệt Danh:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Thám Tử Mori"
                    className="w-full bg-noir-950 border border-noir-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus-ring"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Địa chỉ Email:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="thamtusql@gmail.com"
                  className="w-full bg-noir-950 border border-noir-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Mật khẩu:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-noir-950 border border-noir-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer focus-ring rounded"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Xác nhận Mật khẩu:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-noir-950 border border-noir-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus-ring"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-noir-accent to-amber-600 hover:from-amber-400 hover:to-amber-500 text-noir-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/40 hover:shadow-noir-accent/30 transition-transform active:scale-95 cursor-pointer disabled:opacity-50 focus-ring"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-noir-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Đăng Nhập Ngay' : 'Đăng Ký Tài Khoản'}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-noir-800"></div>
            </div>
            <span className="relative px-3 bg-noir-900 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              HOẶC TIẾP TỤC VỚI
            </span>
          </div>

          {/* Google OAuth 1-Click Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs flex items-center justify-center space-x-2.5 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-50 focus-ring"
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
            <span>Tiếp tục với tài khoản Google</span>
          </button>

          {/* Security Footer Note */}
          <p className="text-[10px] text-center text-slate-500 pt-4">
            🔒 Hệ thống xác thực bởi Supabase Auth &amp; PostgreSQL. Bằng việc đăng nhập, bạn đồng ý với Điều khoản Dịch vụ của Học Viện SQL Thám Tử.
          </p>
        </div>
      </div>
    </div>
  );
};
