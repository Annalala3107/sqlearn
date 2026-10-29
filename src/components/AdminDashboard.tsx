import React, { useState } from 'react';
import {
  ShieldAlert,
  BarChart3,
  Briefcase,
  GraduationCap,
  Users,
  Activity,
  Search,
  ChevronRight,
  Database,
  ArrowLeft,
  CheckCircle,
  KeyRound,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { allCases } from '../cases';
import { allLessons } from '../academy';
import { authService, AuthUser } from '../services/authService';

interface AdminDashboardProps {
  currentUser: AuthUser | null;
  onBackToApp: () => void;
  onLogout: () => void;
  onSelectCase: (caseId: string) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onBackToApp,
  onLogout,
  onSelectCase,
  onSelectLesson,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'lessons' | 'users'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'dễ' | 'trung bình' | 'nâng cao'>('all');
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(() => authService.getRegisteredUsers());

  const filteredCases = allCases.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDiff = difficultyFilter === 'all' || c.difficulty === difficultyFilter;
    return matchSearch && matchDiff;
  });

  const filteredLessons = allLessons.filter((l) =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) || l.stageTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-noir-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navigation Header */}
      <header className="border-b border-noir-800 bg-noir-900/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToApp}
            className="p-2 rounded-xl bg-noir-800 hover:bg-noir-750 text-slate-300 hover:text-white border border-noir-700 transition-colors flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
            title="Quay lại giao diện người dùng"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quay Lại Học Viện / Phá Án</span>
          </button>

          <div className="h-5 w-px bg-noir-800 hidden sm:block" />

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-wider text-slate-100 font-cinzel">
                  CỔNG QUẢN TRỊ TRUNG TÂM (ADMIN DASHBOARD)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                  RBAC: Super Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Hệ thống giám sát vụ án, bài học tương tác và người dùng
              </p>
            </div>
          </div>
        </div>

        {/* Admin profile & logout */}
        <div className="flex items-center space-x-3">
          {currentUser && (
            <div className="flex items-center space-x-2.5 bg-noir-850 px-3 py-1.5 rounded-xl border border-noir-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full border border-noir-accent/60 object-cover"
              />
              <div className="hidden sm:block text-left text-xs">
                <div className="font-bold text-slate-200 truncate max-w-[140px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  {currentUser.email}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-noir-850 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-noir-800 transition-colors cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* KPI Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Vụ án */}
          <div className="bg-noir-900 border border-noir-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-noir-accent/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Hồ Sơ Vụ Án</span>
              <Briefcase className="w-4 h-4 text-noir-accent" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              30 <span className="text-xs font-normal text-slate-400">chuyên án</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>100% Sẵn sàng phá án</span>
            </div>
          </div>

          {/* Card 2: Bài học */}
          <div className="bg-noir-900 border border-noir-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-sky-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Học Viện SQL</span>
              <GraduationCap className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              20 <span className="text-xs font-normal text-slate-400">bài giảng</span>
            </div>
            <div className="text-[11px] text-sky-400 mt-2 flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5" />
              <span>4 Cấp độ từ Beginner đến Expert</span>
            </div>
          </div>

          {/* Card 3: SQLite WASM Engine Health */}
          <div className="bg-noir-900 border border-noir-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Engine WASM</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
              0ms <span className="text-xs font-normal text-slate-400">Server Latency</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Thực thi 100% Client-Side</span>
            </div>
          </div>

          {/* Card 4: Registered Users */}
          <div className="bg-noir-900 border border-noir-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Tài Khoản Quản Lý</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              {registeredUsers.length} <span className="text-xs font-normal text-slate-400">hồ sơ</span>
            </div>
            <div className="text-[11px] text-indigo-300 mt-2 flex items-center space-x-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Google Identity SSO Active</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center space-x-2 border-b border-noir-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-noir-800 text-noir-gold border border-noir-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Tổng Quan Hệ Thống</span>
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'cases'
                ? 'bg-noir-800 text-noir-gold border border-noir-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Quản Lý Vụ Án (30)</span>
          </button>

          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'lessons'
                ? 'bg-noir-800 text-sky-400 border border-noir-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Quản Lý Học Viện (20)</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-noir-800 text-indigo-400 border border-noir-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Người Dùng & Kiểm Toán</span>
          </button>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-noir-900 border border-noir-800 rounded-2xl p-5 shadow-lg">
              <h4 className="text-base font-bold text-slate-100 mb-1 flex items-center space-x-2">
                <span>Trạng Thái Vận Hành & Kiến Trúc Tách Biệt</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                  Operational 100%
                </span>
              </h4>
              <p className="text-xs text-slate-400 mb-5">
                Hệ thống áp dụng mô hình phân tách rõ ràng giữa 2 cổng truy cập: Cổng Học Viên Đại Chúng và Cổng Quản Trị Trung Tâm.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-noir-950 p-4 rounded-xl border border-noir-800/80">
                  <div className="font-semibold text-xs text-noir-gold mb-2 flex items-center space-x-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>CỔNG HỌC VIÊN (LEARNER PORTAL)</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li>• Đăng nhập 1 chạm với tài khoản Google cá nhân.</li>
                    <li>• Tự động đồng bộ chuỗi XP, hồ sơ vụ án đã phá vào Cloud.</li>
                    <li>• Chạy sandbox SQL an toàn, không có quyền can thiệp cấu hình.</li>
                  </ul>
                </div>

                <div className="bg-noir-950 p-4 rounded-xl border border-noir-800/80">
                  <div className="font-semibold text-xs text-sky-400 mb-2 flex items-center space-x-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>CỔNG QUẢN TRỊ (ADMIN DASHBOARD)</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li>• Bảo vệ bởi cơ chế RBAC (Chỉ email quản trị viên có quyền truy cập).</li>
                    <li>• Kiểm tra toàn bộ 30 vụ án, câu lệnh truy vấn mẫu và giải thuật phá án.</li>
                    <li>• Theo dõi nhật ký học viên đăng nhập qua Google Identity Services.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CASES MANAGEMENT */}
        {activeTab === 'cases' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm vụ án theo tiêu đề, địa điểm..."
                  className="w-full pl-10 pr-4 py-2 bg-noir-900 border border-noir-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-noir-accent"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Độ khó:</span>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as any)}
                  className="px-3 py-2 bg-noir-900 border border-noir-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-noir-accent"
                >
                  <option value="all">Tất cả ({allCases.length})</option>
                  <option value="dễ">Dễ (Level 1)</option>
                  <option value="trung bình">Trung bình (Level 2)</option>
                  <option value="nâng cao">Nâng cao (Level 3)</option>
                </select>
              </div>
            </div>

            {/* Cases Data Table */}
            <div className="bg-noir-900 border border-noir-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-noir-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-noir-800">
                      <th className="py-3 px-4">Mã Vụ Án</th>
                      <th className="py-3 px-4">Tiêu Đề</th>
                      <th className="py-3 px-4">Địa Điểm</th>
                      <th className="py-3 px-4">Độ Khó</th>
                      <th className="py-3 px-4">Phần Thưởng</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-noir-850">
                    {filteredCases.map((c) => (
                      <tr key={c.id} className="hover:bg-noir-850/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-noir-accent">
                          {c.id.toUpperCase()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-200 max-w-xs truncate">
                          {c.title}
                        </td>
                        <td className="py-3 px-4 text-slate-400">{c.location}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              c.difficulty === 'dễ'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : c.difficulty === 'trung bình'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {c.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-noir-gold">+{c.xpReward} XP</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onSelectCase(c.id)}
                            className="px-2.5 py-1 rounded-lg bg-noir-800 hover:bg-noir-750 text-slate-300 hover:text-white border border-noir-700 transition-colors text-xs font-medium cursor-pointer inline-flex items-center space-x-1"
                          >
                            <span>Xem Án</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: LESSONS MANAGEMENT */}
        {activeTab === 'lessons' && (
          <div className="space-y-4">
            <div className="bg-noir-900 border border-noir-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-noir-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-noir-800">
                      <th className="py-3 px-4">Bài Số</th>
                      <th className="py-3 px-4">Giai Đoạn</th>
                      <th className="py-3 px-4">Tên Bài Giảng</th>
                      <th className="py-3 px-4">Phân Loại</th>
                      <th className="py-3 px-4">XP</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-noir-850">
                    {filteredLessons.map((l) => (
                      <tr key={l.id} className="hover:bg-noir-850/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-sky-400">
                          {l.id.toUpperCase()}
                        </td>
                        <td className="py-3 px-4 text-slate-300">{l.stageTitle}</td>
                        <td className="py-3 px-4 font-semibold text-slate-200">{l.title}</td>
                        <td className="py-3 px-4 text-slate-400">{l.category}</td>
                        <td className="py-3 px-4 font-mono text-noir-gold">+{l.xpReward} XP</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onSelectLesson(l.id)}
                            className="px-2.5 py-1 rounded-lg bg-noir-800 hover:bg-noir-750 text-slate-300 hover:text-white border border-noir-700 transition-colors text-xs font-medium cursor-pointer inline-flex items-center space-x-1"
                          >
                            <span>Xem Bài</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: USERS & AUDIT LOGS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-noir-900 border border-noir-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-100">
                    Danh Sách Tài Khoản Xác Thực Qua Google Identity
                  </h4>
                  <p className="text-xs text-slate-400">
                    Ghi nhận các tài khoản đã đăng nhập vào hệ thống trong phiên thử nghiệm Staging.
                  </p>
                </div>
                <button
                  onClick={() => setRegisteredUsers(authService.getRegisteredUsers())}
                  className="px-3 py-1.5 rounded-xl bg-noir-800 hover:bg-noir-750 text-slate-300 border border-noir-700 text-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Làm mới</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-noir-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-noir-800">
                      <th className="py-3 px-4">Người Dùng</th>
                      <th className="py-3 px-4">Email Google</th>
                      <th className="py-3 px-4">Vai Trò (RBAC)</th>
                      <th className="py-3 px-4">Xác Thực Bằng</th>
                      <th className="py-3 px-4">Đăng Nhập Gần Nhất</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-noir-850">
                    {registeredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-noir-850/60 transition-colors">
                        <td className="py-3 px-4 flex items-center space-x-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover border border-noir-700"
                          />
                          <span className="font-semibold text-slate-200">{u.name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              u.role === 'admin'
                                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {u.role === 'admin' ? '🛡️ Quản Trị' : '🎓 Học Viên'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center space-x-1 text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span>Google SSO</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(u.lastLogin).toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
