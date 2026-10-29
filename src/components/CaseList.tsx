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
} from 'lucide-react';
import { DetectiveCase, UserStats } from '../cases/types';

interface CaseListProps {
  cases: DetectiveCase[];
  stats: UserStats;
  onSelectCase: (c: DetectiveCase) => void;
}

export const CaseList: React.FC<CaseListProps> = ({
  cases,
  stats,
  onSelectCase,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Welcome Banner */}
      <div className="relative bg-gradient-to-br from-noir-900 via-noir-850 to-noir-950 border border-noir-700/80 rounded-2xl p-8 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-noir-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-noir-accent/15 border border-noir-accent/30 text-noir-gold text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-noir-accent" />
            <span>NỀN TẢNG LUYỆN TẬP SQL QUA TRINH THÁM ĐẦU TIÊN TẠI VIỆT NAM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            VẠCH MẶT KẺ THỦ ÁC <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-noir-gold via-noir-accent to-amber-500">
              BẰNG TRUY VẤN SQL
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Mỗi vụ án là một hiện trường bí ẩn với cơ sở dữ liệu chứng cứ chân thực.
            Hãy vận dụng các câu lệnh <code className="text-noir-gold bg-noir-900 px-1.5 py-0.5 rounded border border-noir-800">SELECT</code>, <code className="text-noir-gold bg-noir-900 px-1.5 py-0.5 rounded border border-noir-800">WHERE</code>, <code className="text-noir-gold bg-noir-900 px-1.5 py-0.5 rounded border border-noir-800">JOIN</code> và <code className="text-noir-gold bg-noir-900 px-1.5 py-0.5 rounded border border-noir-800">GROUP BY</code> để lần theo manh mối, lật tẩy chứng cứ ngoại phạm và đưa thủ phạm ra ánh sáng!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-noir-accent" />
              <span>Chạy 100% trên trình duyệt (SQLite WebAssembly)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Tự động lưu tiến độ vào máy</span>
            </div>
          </div>
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
                    className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
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
