import React, { useState } from 'react';
import { X, Shield, Lock, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSandboxFallback, setShowSandboxFallback] = useState(!authService.isGoogleConfigured());
  const [sandboxEmail, setSandboxEmail] = useState('');

  if (!isOpen) return null;

  const isConfigured = authService.isGoogleConfigured();

  // 1. Xử lý khi đăng nhập thành công với Google Identity Services thật
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError('Không nhận được mã xác thực từ Google. Vui lòng thử lại.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.signInWithGoogleCredential(response.credential);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập Google thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Quá trình đăng nhập Google bị hủy hoặc gặp sự cố.');
  };

  // 2. Fallback Sandbox cho môi trường phát triển khi chưa dán Client ID
  const handleSandboxLogin = async (role: 'admin' | 'learner') => {
    setIsLoading(true);
    setError(null);
    try {
      const targetEmail = sandboxEmail.trim() || (role === 'admin' ? 'admin.nam@sqlearn.vn' : 'hocvien@gmail.com');
      const user = await authService.signInWithGoogle({
        role,
        email: targetEmail,
        name: role === 'admin' ? 'Trưởng Ban Điều Tra (Admin)' : 'Thám Tử Học Viên',
      });
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError('Đăng nhập thất bại.');
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

        {/* LEFT COLUMN: BRANDING & SECURITY */}
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
                  Bản Chính Thức (Production)
                </span>
              </div>
            </div>

            <h4 className="text-xl font-bold text-slate-100 leading-snug mb-3 text-balance">
              Xác Thực An Toàn Qua Google Identity
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 text-pretty">
              Đăng nhập trực tiếp bằng tài khoản Gmail của chính chủ để bảo vệ tiến trình học tập và bảng vàng thành tích.
            </p>

            <div className="space-y-3">
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Bảo mật 100% qua Google OAuth 2.0 (OIDC Standard)</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Tự động phân quyền Cổng Quản Trị qua Whitelist Gmail của bạn</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Tiến trình điểm XP và lời giải được lưu trữ an toàn</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-noir-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-noir-accent" aria-hidden="true" />
              <span>Google Identity Verified</span>
            </span>
            <span className="text-slate-400 font-mono">v2.0 Production</span>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-noir-900/90 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center space-x-2 md:hidden mb-2">
              <Shield className="w-4 h-4 text-noir-gold" aria-hidden="true" />
              <span className="font-cinzel font-bold text-sm text-slate-200">SQL THÁM TỬ VN</span>
            </div>
            <h3 id="auth-modal-title" className="text-2xl font-bold text-slate-100 tracking-tight">
              Đăng nhập tài khoản
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Sử dụng Gmail cá nhân của bạn để tiếp tục hành trình phá án.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-300 text-xs" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* GOOGLE OFFICIAL BUTTON CONTAINER */}
          {isConfigured ? (
            <div className="space-y-4 py-2">
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-noir-850/80 border border-noir-750 space-y-3">
                <span className="text-xs text-slate-300 font-medium">
                  Đăng nhập chính thức với Google:
                </span>
                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_black"
                    shape="pill"
                    size="large"
                    text="continue_with"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-noir-950 border border-noir-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center space-x-1.5 text-noir-gold font-semibold">
                  <KeyRound className="w-3.5 h-3.5 text-noir-accent" aria-hidden="true" />
                  <span>Quy chế Phân quyền Quản trị (Admin):</span>
                </div>
                <p>
                  Nếu Gmail của bạn trùng khớp với danh sách quản trị viên trong biến môi trường, hệ thống sẽ tự động kích hoạt Cổng Quản Trị (Admin Dashboard). Các Gmail khác sẽ là Học Viên.
                </p>
              </div>
            </div>
          ) : (
            /* Khi chưa có Client ID trong .env, hiển thị hướng dẫn trực quan */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-noir-gold font-bold">
                  <KeyRound className="w-4 h-4 text-noir-accent" aria-hidden="true" />
                  <span>Cần cấu hình Google Client ID để bật nút Gmail thật</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Hệ thống đã tích hợp sẵn thư viện Google Identity Services chính thức. Bạn chỉ cần dán <strong>Client ID</strong> vào file <code>.env</code> theo hướng dẫn là nút Google thật sẽ xuất hiện ngay!
                </p>
              </div>

              {/* Toggle Sandbox Mode */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSandboxFallback(!showSandboxFallback)}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1 cursor-pointer focus-ring"
                >
                  <span>{showSandboxFallback ? 'Ẩn chế độ thử nghiệm tạm thời' : 'Hiện chế độ thử nghiệm tạm thời (Sandbox)'}</span>
                </button>
              </div>

              {showSandboxFallback && (
                <div className="p-4 rounded-2xl bg-noir-850/80 border border-noir-750 space-y-3 animate-in fade-in duration-150">
                  <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
                    Chạy thử tạm thời với Email tùy chọn:
                  </span>
                  <input
                    type="email"
                    value={sandboxEmail}
                    onChange={(e) => setSandboxEmail(e.target.value)}
                    placeholder="Nhập email của bạn (VD: your_email@gmail.com)"
                    className="w-full px-3 py-2 bg-noir-950 border border-noir-800 rounded-xl text-xs text-slate-200 focus-ring"
                  />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleSandboxLogin('learner')}
                      disabled={isLoading}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer focus-ring shadow"
                    >
                      <span>Vào Cổng Học Viên</span>
                    </button>
                    <button
                      onClick={() => handleSandboxLogin('admin')}
                      disabled={isLoading}
                      className="py-2.5 px-3 rounded-xl bg-noir-800 hover:bg-noir-750 text-noir-gold border border-noir-accent/40 font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer focus-ring shadow"
                    >
                      <span>Vào Cổng Quản Trị</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security note */}
          <p className="text-[10px] text-center text-slate-500 pt-4">
            🔒 Bảo mật tiêu chuẩn Google OAuth 2.0 &amp; SQLite Sandbox. Bằng việc đăng nhập, bạn đồng ý với Điều khoản Dịch vụ và Quy chế Học viện SQL Thám Tử.
          </p>
        </div>
      </div>
    </div>
  );
};
