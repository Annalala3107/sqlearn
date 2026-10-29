import React from 'react';
import {
  FolderKanban,
  Award,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  Shield,
  Sparkles,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { DetectiveCase, UserStats } from '../cases/types';

interface CaseListProps {
  cases: DetectiveCase[];
  stats: UserStats;
  onSelectCase: (c: DetectiveCase) => void;
  onNavigateToAcademy?: () => void;
  onOpenGuide?: () => void;
}

export const CaseList: React.FC<CaseListProps> = ({
  cases,
  stats,
  onSelectCase,
  onNavigateToAcademy,
  onOpenGuide,
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'dễ':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-800';
      case 'trung bình':
        return 'bg-amber-950/70 text-amber-400 border-amber-800';
      case 'nâng cao':
        return 'bg-rose-950/70 text-rose-400 border-rose-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
      {/* Hero Welcome Banner */}
      <div className="relative bg-gradient-to-br from-noir-900 via-noir-850 to-noir-950 border border-noir-700/80 rounded-2xl p-5 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-noir-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-3.5 sm:space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-noir-accent/15 border border-noir-accent/30 text-noir-gold text-[11px] sm:text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-noir-accent flex-shrink-0" />
            <span>NỀN TẢNG LUYỆN TẬP SQL QUA TRINH THÁM ĐẦU TIÊN TẠI VN</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            VẠCH MẶT KẺ THỦ ÁC <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-noir-gold via-noir-accent to-amber-500">
              BẰNG TRUY VẤN SQL
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-sans">
            Mỗi vụ án là một hiện trường bí ẩn với cơ sở dữ liệu chứng cứ chân thực.
            Hãy vận dụng các câu lệnh <code className="text-noir-gold bg-noir-900 px-1.5 py-0.5 rounded border border-noir-800">SELECT</code>, <code className="text-noir-gold bg-noir-900 px-1.5 py-0.5 rounded border border-noir-800">WHERE</code>, <code className="text-noir-gold bg-noir-900 px-1.5 py-0.5 rounded border border-noir-800">JOIN</code> và <code className="text-noir-gold bg-noir-900 px-1.5 py-0.5 rounded border border-noir-800">GROUP BY</code> để lần theo manh mối, lật tẩy chứng cứ ngoại phạm và đưa thủ phạm ra ánh sáng!
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-noir-accent flex-shrink-0" />
              <span>Chạy 100% trên trình duyệt (SQLite WebAssembly)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Tự động lưu tiến độ vào máy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Beginner Welcome / Roadmap Gateway Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-noir-900 to-amber-950/30 border border-sky-800/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0 mt-0.5">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-100">
                Bạn mới bắt đầu học SQL? Hãy khởi đầu vững chắc!
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold">
                Khuyên dùng
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Các vụ án yêu cầu bạn tự viết truy vấn để tìm manh mối. Nếu chưa quen với các câu lệnh <code className="text-sky-300 bg-noir-950 px-1 py-0.5 rounded">SELECT</code>, <code className="text-sky-300 bg-noir-950 px-1 py-0.5 rounded">WHERE</code> hoặc <code className="text-sky-300 bg-noir-950 px-1 py-0.5 rounded">JOIN</code>, hãy ghé thăm <strong>Học Viện SQL</strong> (20 bài học tương tác) hoặc mở <strong>Sổ Tay Tân Thủ</strong> để nắm bí kíp nhé!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 flex-shrink-0">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="px-3.5 py-2 rounded-xl bg-noir-850 hover:bg-noir-800 text-slate-200 border border-noir-700 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-noir-accent" />
              <span>Sổ Tay Hướng Dẫn</span>
            </button>
          )}

          {onNavigateToAcademy && (
            <button
              onClick={onNavigateToAcademy}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-noir-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-sky-950/50 transition-all cursor-pointer active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Đến Học Viện SQL</span>
            </button>
          )}
        </div>
      </div>

      {/* Cases Section Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FolderKanban className="w-6 h-6 text-noir-accent" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-wide">
              Hồ Sơ Các Vụ Án Trọng Điểm
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Tổng cộng: {cases.length} vụ án
          </span>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c) => {
            const isCompleted = !!stats.completedCases[c.id]?.completed;

            return (
              <div
                key={c.id}
                onClick={() => onSelectCase(c)}
                className={`group cursor-pointer rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden bg-noir-900/90 shadow-lg ${
                  isCompleted
                    ? 'border-emerald-800/80 hover:border-emerald-500 shadow-emerald-950/20'
                    : 'border-noir-800 hover:border-noir-accent/80 hover:shadow-noir-accent/10 hover:-translate-y-1'
                }`}
              >
                {/* Completed Stamp / Badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4 flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-600 text-emerald-300 font-bold font-mono">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>ĐÃ PHÁ ÁN</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Category & Difficulty */}
                  <div className="flex flex-wrap items-center gap-2 pr-20">
                    <span
                      className={`text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${getDifficultyColor(
                        c.difficulty
                      )}`}
                    >
                      {c.difficulty}
                    </span>
                    <div className="flex items-center text-xs text-noir-gold font-mono font-bold bg-noir-accent/10 px-2 py-0.5 rounded-full border border-noir-accent/20">
                      <Award className="w-3.5 h-3.5 mr-1 text-noir-accent" />
                      +{c.xpReward} XP
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-noir-gold transition-colors leading-snug">
                    {c.title}
                  </h3>

                  {/* Meta details */}
                  <div className="space-y-1.5 text-xs text-slate-400 border-y border-noir-800/80 py-2.5">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-noir-accent" />
                      <span>Thời gian: {c.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-noir-accent" />
                      <span className="truncate">Hiện trường: {c.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-noir-accent" />
                      <span>Thời lượng dự kiến: {c.timeEstimate}</span>
                    </div>
                  </div>

                  {/* Brief Preview */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-sans">
                    {c.brief}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-5 mt-4 border-t border-noir-800/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">
                    {c.schemas.length} bảng dữ liệu
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(c);
                    }}
                    className={`min-h-[44px] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all active:scale-95 cursor-pointer ${
                      isCompleted
                        ? 'bg-noir-800 text-slate-300 hover:bg-noir-750'
                        : 'bg-noir-accent/20 text-noir-gold border border-noir-accent/40 group-hover:bg-noir-accent group-hover:text-noir-950 group-hover:shadow-md'
                    }`}
                  >
                    <span>{isCompleted ? 'Xem Lại Hồ Sơ' : 'Bắt Đầu Điều Tra'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
