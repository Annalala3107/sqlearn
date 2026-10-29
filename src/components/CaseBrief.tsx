import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  Crosshair,
  HelpCircle,
} from 'lucide-react';
import { DetectiveCase } from '../cases/types';

interface CaseBriefProps {
  caseData: DetectiveCase;
  isCompleted: boolean;
  onOpenSolutionModal: () => void;
}

export const CaseBrief: React.FC<CaseBriefProps> = ({
  caseData,
  isCompleted,
  onOpenSolutionModal,
}) => {
  const [openHintId, setOpenHintId] = useState<number | null>(null);

  const toggleHint = (id: number) => {
    setOpenHintId(openHintId === id ? null : id);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'dễ':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700';
      case 'trung bình':
        return 'bg-amber-950/80 text-amber-300 border-amber-700';
      case 'nâng cao':
        return 'bg-rose-950/80 text-rose-300 border-rose-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-br from-noir-900 via-noir-850 to-noir-950 border border-noir-700/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-noir-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full border ${getDifficultyColor(
              caseData.difficulty
            )}`}
          >
            Độ khó: {caseData.difficulty}
          </span>
          <span className="text-xs bg-noir-800 text-slate-300 px-3 py-1 rounded-full border border-noir-700 font-medium">
            {caseData.category}
          </span>
          <div className="flex items-center text-xs text-noir-gold font-mono font-bold bg-noir-accent/15 border border-noir-accent/30 px-3 py-1 rounded-full ml-auto">
            <Award className="w-3.5 h-3.5 mr-1 text-noir-accent" />
            +{caseData.xpReward} XP
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 tracking-wide leading-snug">
          {caseData.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 border-t border-noir-800 pt-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-noir-accent flex-shrink-0" />
            <span>Ngày: {caseData.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-noir-accent flex-shrink-0" />
            <span className="truncate">Hiện trường: {caseData.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-noir-accent flex-shrink-0" />
            <span>Thời lượng: {caseData.timeEstimate}</span>
          </div>
        </div>
      </div>

      {/* Brief Story Narrative */}
      <div className="bg-noir-900 border border-noir-800 rounded-xl p-5 shadow-md">
        <div className="flex items-center space-x-2 mb-3 text-noir-gold font-bold text-sm">
          <FileText className="w-4 h-4 text-noir-accent" />
          <h2>Hồ Sơ & Lời Khai Sơ Bộ</h2>
        </div>
        <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line bg-noir-950/70 p-4 rounded-xl border border-noir-800/90 font-sans">
          {caseData.brief}
        </div>
      </div>

      {/* Initial Clues */}
      <div className="bg-noir-900 border border-noir-800 rounded-xl p-5 shadow-md">
        <div className="flex items-center space-x-2 mb-3 text-noir-gold font-bold text-sm">
          <Lightbulb className="w-4 h-4 text-noir-accent" />
          <h2>Manh Mối Ban Đầu Từ Hiện Trường</h2>
        </div>
        <ul className="space-y-2.5">
          {caseData.clues.map((clue, idx) => (
            <li
              key={idx}
              className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300 bg-noir-850/80 p-3 rounded-xl border border-noir-800"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-noir-accent/20 text-noir-gold border border-noir-accent/40 flex items-center justify-center text-xs font-mono font-bold">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{clue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Detective Objectives & Thinking Hints */}
      <div className="bg-noir-900 border border-noir-800 rounded-xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-noir-gold font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h2>Mục Tiêu Điều Tra Cần Hoàn Thành</h2>
          </div>
          <span className="text-[11px] text-slate-400">Bấm để xem gợi ý tư duy</span>
        </div>

        <div className="space-y-2.5">
          {caseData.objectives.map((obj) => (
            <div
              key={obj.id}
              className="border border-noir-800 rounded-xl overflow-hidden bg-noir-850/50 transition-colors"
            >
              <div
                onClick={() => toggleHint(obj.id)}
                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-noir-800/70 transition-colors select-none"
              >
                <div className="flex items-start space-x-3 pr-2">
                  <div className="mt-0.5 w-5 h-5 rounded-md border border-noir-accent/40 bg-noir-900 flex items-center justify-center flex-shrink-0 text-noir-accent font-mono text-xs font-bold">
                    {obj.id}
                  </div>
                  <span className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                    {obj.text}
                  </span>
                </div>
                <div className="flex items-center text-xs text-slate-400 flex-shrink-0">
                  <span className="mr-1 hidden sm:inline text-[11px]">Gợi ý</span>
                  {openHintId === obj.id ? (
                    <ChevronUp className="w-4 h-4 text-noir-accent" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>

              {openHintId === obj.id && obj.hint && (
                <div className="px-4 py-3 bg-noir-950 border-t border-noir-800 text-xs text-amber-300 flex items-start space-x-2.5">
                  <HelpCircle className="w-4 h-4 text-noir-accent flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-semibold text-noir-gold block mb-1">
                      💡 Hướng dẫn tư duy suy luận:
                    </span>
                    <span className="text-slate-300 font-sans text-xs">
                      {obj.hint}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action to accuse/submit */}
      <div className="pt-2">
        <button
          onClick={onOpenSolutionModal}
          className={`w-full min-h-[48px] py-3 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all shadow-xl active:scale-[0.98] cursor-pointer ${
            isCompleted
              ? 'bg-emerald-950/60 text-emerald-300 border-2 border-emerald-600/80 hover:bg-emerald-900/60'
              : 'bg-gradient-to-r from-noir-accent via-amber-500 to-amber-600 text-noir-950 hover:from-amber-400 hover:to-amber-500 shadow-amber-950/40 hover:shadow-noir-accent/30'
          }`}
        >
          <Crosshair className="w-5 h-5 flex-shrink-0" />
          <span>{isCompleted ? 'Vụ Án Đã Phá (Xem Lại Báo Cáo Phá Án)' : 'Vạch Mặt Thủ Phạm (Nộp Đáp Án)'}</span>
        </button>
      </div>
    </div>
  );
};
