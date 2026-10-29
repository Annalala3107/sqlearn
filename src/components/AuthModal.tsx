import React, { useState } from 'react';
import { X, Shield, Lock, CheckCircle2, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleGoogleLogin = async (preset?: { role: 'admin' | 'learner'; email?: string; name?: string }) => {
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
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container - Split-screen on desktop, Clean single card on mobile */}
      <div className="relative w-full max-w-4xl bg-noir-900 border border-noir-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 z-10 max-h-[92vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-noir-800/80 hover:bg-noir-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          title="Đóng cửa sổ"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: BRANDING & METRICS (Ẩn trên Mobile < 768px để chống che khuất form theo Bước 3) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-noir-950 via-noir-900 to-noir-850 p-8 flex-col justify-between border-r border-noir-800/80 relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-noir-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center space-x-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-noir-800 border border-noir-accent/40 flex items-center justify-center text-noir-gold shadow-inner">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-slate-100 text-lg tracking-wider">
                  SQL THÁM TỬ
                </h3>
                <span className="text-[10px] text-noir-accent uppercase tracking-widest font-mono">
                  Học Viện & Phá Án
                </span>
              </div>
            </div>

            <h4 className="text-xl font-bold text-slate-100 leading-snug mb-3">
              Đồng bộ Tiến độ & Khám phá Quyền năng Quản trị
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Lưu trữ vĩnh viễn chuỗi XP, danh hiệu thám tử và hồ sơ các vụ án đã phá đảo trên đám mây.
            </p>

            {/* Feature bullets */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Không mất tiến trình khi đổi điện thoại hoặc xóa cache</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Hỗ trợ phân quyền Quản trị viên (Admin Dashboard)</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Thực thi trực tiếp với SQLite WebAssembly an toàn 100%</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-noir-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-noir-accent" />
              <span>OAuth 2.0 & OIDC Standard</span>
            </span>
            <span className="text-slate-400">v2.0 Staging</span>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTHENTICATION FORM (Mobile-First, Nút Google to bản trên đỉnh) */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-noir-900/90 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 md:hidden mb-2">
              <Shield className="w-4 h-4 text-noir-gold" />
              <span className="font-cinzel font-bold text-sm text-slate-200">SQL THÁM TỬ VN</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 tracking-tight">
              Đăng nhập tài khoản
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Chọn phương thức đăng nhập bằng Google để vào hệ thống nhanh chóng trong 1 giây.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Preset Buttons: 1-Tap Google SSO Login */}
          <div className="space-y-3 mb-5">
            {/* 1-Tap Learner Google Account */}
            <button
              onClick={() => handleGoogleLogin({ role: 'learner', email: 'thamtuhocvien@gmail.com', name: 'Thám Tử Học Viên' })}
              disabled={isLoading}
              className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-3 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {/* Google 4-color SVG Icon */}
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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

            {/* 1-Tap Administrator Google Workspace Account */}
            <button
              onClick={() => handleGoogleLogin({ role: 'admin', email: 'admin.nam@sqlearn.vn', name: 'Nguyễn Hải Nam (Admin)' })}
              disabled={isLoading}
              className="w-full min-h-[44px] py-2 px-4 rounded-xl bg-noir-800 hover:bg-noir-750 text-noir-gold border border-noir-accent/40 font-semibold text-xs flex items-center justify-center space-x-2.5 transition-all hover:border-noir-accent active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4 text-noir-accent" />
              <span>Đăng nhập Cổng Quản Trị (Admin Google Workspace)</span>
            </button>
          </div>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-noir-800"></div>
            </div>
            <span className="relative px-3 bg-noir-900 text-[11px] text-slate-400 uppercase tracking-wider font-mono">
              hoặc tùy chỉnh thông tin thử nghiệm
            </span>
          </div>

          {/* Custom Account Inputs for Staging Testing */}
          <div className="space-y-3 mb-5">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Tên hiển thị:
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="VD: Thám tử Conan"
                className="w-full px-3 py-2 bg-noir-950 border border-noir-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-noir-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Địa chỉ Email:
              </label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="VD: detective@gmail.com"
                className="w-full px-3 py-2 bg-noir-950 border border-noir-800 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-noir-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Vai trò truy cập:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('learner')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedRole === 'learner'
                      ? 'bg-noir-800 border-noir-gold text-noir-gold'
                      : 'bg-noir-950 border-noir-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🎓 Học Viên
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-noir-800 border-sky-400 text-sky-400'
                      : 'bg-noir-950 border-noir-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🛡️ Quản Trị Viên (Admin)
                </button>
              </div>
            </div>

            <button
              onClick={() => handleGoogleLogin()}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-noir-accent to-noir-gold hover:opacity-95 text-noir-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 border-2 border-noir-950 border-t-transparent rounded-full animate-spin" />
                  <span>Đang kết nối Google Identity...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Xác Nhận Đăng Nhập Tài Khoản Này</span>
                </span>
              )}
            </button>
          </div>

          {/* Security note */}
          <p className="text-[10px] text-center text-slate-400">
            🔒 Bảo mật tiêu chuẩn Google OAuth 2.0 & SQLite Sandbox. Bằng việc đăng nhập, bạn đồng ý với Điều khoản Dịch vụ và Quy chế Học viện.
          </p>
        </div>
      </div>
    </div>
  );
};
